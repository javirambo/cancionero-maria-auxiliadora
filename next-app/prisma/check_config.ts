import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    const configs = await prisma.configuracion.findMany();
    console.log(configs);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
