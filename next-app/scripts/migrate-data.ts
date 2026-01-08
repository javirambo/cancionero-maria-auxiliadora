import { createClient as createTursoClient } from '@libsql/client';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // 1. Fetch from local
    const localPrisma = new PrismaClient({
        datasources: {
            db: {
                url: 'file:./dev.db'
            }
        }
    });

    console.log("Fetching songs from local SQLite...");
    const songs = await localPrisma.cancion.findMany();
    const config = await localPrisma.configuracion.findMany();
    console.log(`Found ${songs.length} songs and ${config.length} config entries.`);

    // 2. Push to Turso
    const tursoUrl = process.env.DATABASE_URL!;
    const authToken = process.env.TURSO_AUTH_TOKEN!;

    const tursoClient = createTursoClient({ url: tursoUrl, authToken });

    console.log("Pushing data to Turso...");

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Process songs in batches
    const batchSize = 25; // Smaller batch size
    for (let i = 0; i < songs.length; i += batchSize) {
        const batch = songs.slice(i, i + batchSize);
        console.log(`Pushing songs batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(songs.length / batchSize)}...`);

        for (const song of batch) {
            let retries = 3;
            while (retries > 0) {
                try {
                    await tursoClient.execute({
                        sql: 'INSERT OR REPLACE INTO Canciones (id, titulo, letra, grupo, extras) VALUES (?, ?, ?, ?, ?)',
                        args: [song.id, song.titulo, song.letra, song.grupo, song.extras]
                    });
                    break;
                } catch (e: any) {
                    console.error(`Error pushing song ${song.id}: ${e.message}. Retrying...`);
                    retries--;
                    await sleep(1000);
                    if (retries === 0) throw e;
                }
            }
        }
        await sleep(500); // Small delay between batches
    }

    console.log("Pushing config entries...");
    for (const entry of config) {
        await tursoClient.execute({
            sql: 'INSERT OR REPLACE INTO Configuraciones (clave, valor) VALUES (?, ?)',
            args: [entry.clave, entry.valor]
        });
    }

    console.log("Migration complete!");
    await localPrisma.$disconnect();
}

main().catch(console.error);
