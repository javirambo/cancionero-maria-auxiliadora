import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

async function backup() {
    const client = createClient({
        url: process.env.DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    let sql = `-- Backup de Cancionero María Auxiliadora\n`;
    sql += `-- Fecha: ${new Date().toISOString()}\n\n`;

    // Schema
    sql += `CREATE TABLE IF NOT EXISTS Canciones (\n`;
    sql += `  id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    sql += `  titulo TEXT NOT NULL,\n`;
    sql += `  letra TEXT NOT NULL,\n`;
    sql += `  grupo TEXT,\n`;
    sql += `  extras TEXT\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS Configuraciones (\n`;
    sql += `  clave TEXT PRIMARY KEY,\n`;
    sql += `  valor TEXT NOT NULL\n`;
    sql += `);\n\n`;

    // Canciones
    const canciones = await client.execute('SELECT * FROM Canciones ORDER BY id');
    console.log(`Exportando ${canciones.rows.length} canciones...`);

    for (const row of canciones.rows) {
        const id = row.id;
        const titulo = String(row.titulo).replace(/'/g, "''");
        const letra = String(row.letra).replace(/'/g, "''");
        const grupo = row.grupo ? `'${String(row.grupo).replace(/'/g, "''")}'` : 'NULL';
        const extras = row.extras ? `'${String(row.extras).replace(/'/g, "''")}'` : 'NULL';
        sql += `INSERT INTO Canciones (id, titulo, letra, grupo, extras) VALUES (${id}, '${titulo}', '${letra}', ${grupo}, ${extras});\n`;
    }

    sql += '\n';

    // Configuraciones
    const configs = await client.execute('SELECT * FROM Configuraciones');
    console.log(`Exportando ${configs.rows.length} configuraciones...`);

    for (const row of configs.rows) {
        const clave = String(row.clave).replace(/'/g, "''");
        const valor = String(row.valor).replace(/'/g, "''");
        sql += `INSERT INTO Configuraciones (clave, valor) VALUES ('${clave}', '${valor}');\n`;
    }

    // Guardar
    const backupDir = path.join(__dirname, '..', '..', 'backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const filename = `backup-turso-${new Date().toISOString().slice(0, 10)}.sql`;
    const filepath = path.join(backupDir, filename);
    fs.writeFileSync(filepath, sql, 'utf-8');

    console.log(`Backup guardado en: ${filepath}`);
    console.log(`Total: ${canciones.rows.length} canciones, ${configs.rows.length} configuraciones`);

    client.close();
}

backup().catch(console.error);
