import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error("Missing DATABASE_URL or TURSO_AUTH_TOKEN");
    process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'scripts/schema.sql'), 'utf8');

    // Split by semicollon, but be careful with complex SQL. 
    // Here it's simple.
    const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    console.log(`Executing ${statements.length} statements on Turso...`);

    for (const statement of statements) {
        try {
            await client.execute(statement);
            console.log("Executed successfully.");
        } catch (e: any) {
            if (e.message.includes("already exists")) {
                console.log("Table/Index already exists, skipping...");
            } else {
                console.error("Error executing statement:", e.message);
            }
        }
    }

    console.log("Schema sync complete.");
}

main().catch(console.error);
