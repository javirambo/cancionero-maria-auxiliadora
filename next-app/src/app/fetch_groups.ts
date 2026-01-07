import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const groups = await prisma.cancion.findMany({
        select: {
            grupo: true
        },
        distinct: ['grupo']
    });

    const uniqueGroups = groups
        .map(g => g.grupo)
        .filter(g => g !== null && g !== '')
        .sort();

    console.log('Unique Groups:', uniqueGroups);
}

main();
