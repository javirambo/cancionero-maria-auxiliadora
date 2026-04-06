import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.cancion.count();
    console.log(`Total Canciones in DB: ${count}`);

    const songs = await prisma.cancion.findMany({
        select: { id: true, titulo: true }
    });
    console.log('IDs present:', songs.map(s => s.id).join(', '));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
