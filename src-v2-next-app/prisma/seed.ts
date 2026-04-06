import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    const sqlPath = path.join(__dirname, '../../backup/cancionero-completo.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('Seeding Canciones...');
    await seedCanciones(sqlContent);

    console.log('Seeding Configuraciones...');
    await seedConfiguraciones(sqlContent);
}

// Robust manual parser to extract values, handling semicolons inside quotes
function extractInsertValues(sql: string, tableName: string) {
    const allValues: any[] = [];
    let searchPos = 0;
    const insertMarker = `INSERT INTO \`${tableName}\``;

    while (true) {
        const startIdx = sql.indexOf(insertMarker, searchPos);
        if (startIdx === -1) break;

        const valuesStart = sql.indexOf('VALUES', startIdx);
        if (valuesStart === -1) break;

        // Scan for the semicolon ending this statement
        let i = valuesStart + 6;
        let inQuote = false;

        while (i < sql.length) {
            const c = sql[i];
            const next = sql[i + 1];

            if (c === "'" && !inQuote) {
                inQuote = true;
            } else if (c === "'" && inQuote) {
                if (next === "'") {
                    i++; // Skip escaped quote
                } else {
                    inQuote = false;
                }
            } else if (c === ';' && !inQuote) {
                // Found statement terminator
                break;
            }
            i++;
        }

        const valuesBlock = sql.substring(valuesStart + 6, i);

        // Process the found block using the same tokenizing logic
        const entries = parseBlock(valuesBlock);
        allValues.push(...entries);

        searchPos = i + 1;
    }
    return allValues;
}

function parseBlock(valuesStr: string) {
    const entries: any[] = [];
    let currentStr = '';
    let inQuote = false;
    let pDepth = 0;

    for (let i = 0; i < valuesStr.length; i++) {
        const c = valuesStr[i];
        const next = valuesStr[i + 1];

        if (c === "'" && !inQuote) {
            inQuote = true;
            currentStr += c;
        } else if (c === "'" && inQuote) {
            if (next === "'") {
                currentStr += "''"; // Keep escaped
                i++;
            } else {
                inQuote = false;
                currentStr += c;
            }
        } else if (c === '(' && !inQuote) {
            pDepth++;
            if (pDepth === 1) currentStr = ''; // Start entry
        } else if (c === ')' && !inQuote) {
            pDepth--;
            if (pDepth === 0) {
                entries.push(processEntry(currentStr));
                currentStr = '';
            }
        } else if (pDepth > 0) {
            currentStr += c;
        }
    }
    console.log(`Block processed. Extracted ${entries.length} entries.`);
    return entries;
}

function processEntry(entryStr: string) {
    const tokens: any[] = [];
    let currentToken = '';
    let inQuote = false;

    for (let i = 0; i < entryStr.length; i++) {
        const c = entryStr[i];
        const next = entryStr[i + 1];

        if (c === "'" && !inQuote) {
            inQuote = true;
        } else if (c === "'" && inQuote) {
            if (next === "'") {
                currentToken += "'";
                i++;
            } else {
                inQuote = false;
            }
        } else if (c === ',' && !inQuote) {
            tokens.push(parseToken(currentToken));
            currentToken = '';
        } else {
            currentToken += c;
        }
    }
    if (currentToken) tokens.push(parseToken(currentToken));
    return tokens;
}

function parseToken(token: string) {
    token = token.trim();
    if (token === 'NULL') return null;
    if (!isNaN(Number(token)) && token !== '') return Number(token);
    // String content (quotes were stripped by logic in processEntry? No, wait)
    // processEntry loop:
    // c=' -> inQuote=true. I DO NOT add c to currentToken.
    // So currentToken contains raw content. Correct.
    return token;
}


async function seedCanciones(sql: string) {
    const entries = extractInsertValues(sql, 'Canciones');

    for (const entry of entries) {
        if (entry.length < 3) continue;

        const [numero, titulo, letra, grupo, extras] = entry;

        await prisma.cancion.upsert({
            where: { id: Number(numero) },
            update: {
                titulo: String(titulo),
                letra: String(letra),
                grupo: grupo ? String(grupo) : null,
                extras: extras ? String(extras) : null
            },
            create: {
                id: Number(numero),
                titulo: String(titulo),
                letra: String(letra),
                grupo: grupo ? String(grupo) : null,
                extras: extras ? String(extras) : null
            }
        });
    }
    console.log(`Seeded ${entries.length} Canciones.`);
}

async function seedConfiguraciones(sql: string) {
    const entries = extractInsertValues(sql, 'Configuraciones');

    for (const entry of entries) {
        if (entry.length < 2) continue;
        const [clave, valor] = entry;

        await prisma.configuracion.upsert({
            where: { clave: String(clave) },
            update: { valor: String(valor) },
            create: { clave: String(clave), valor: String(valor) }
        });
    }
    console.log(`Seeded ${entries.length} Configuraciones.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
