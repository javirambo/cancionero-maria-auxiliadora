import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const song = await prisma.cancion.findUnique({
        where: { id: 404 }
    });

    if (song) {
        console.log('ID:', song.id);
        console.log('Title:', song.titulo);
        console.log('Raw Lyrics:', JSON.stringify(song.letra));
        console.log('Group:', song.grupo);
    } else {
        console.log('Song not found');
    }
}

main();
