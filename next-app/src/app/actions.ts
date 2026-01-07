'use server';

import { PrismaClient, Cancion } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

const PASSWORD = process.env.ADMIN_PASSWORD || 'Coro2021';

export async function getSongs(query: string = '', category: string = '') {
    const orConditions: any[] = [
        { titulo: { contains: query } },
        { letra: { contains: query } },
    ];

    const numericQuery = Number(query);
    if (!isNaN(numericQuery) && numericQuery > 0) {
        orConditions.unshift({ id: numericQuery });
    }

    const where: any = {
        OR: orConditions,
    };

    if (category && category !== 'Todas') {
        where.grupo = category;
    }

    const songs = await prisma.cancion.findMany({
        where: where,
        orderBy: { id: 'asc' },
    });
    return songs;
}

export async function getSong(id: number) {
    const song = await prisma.cancion.findUnique({
        where: { id },
    });
    return song;
}

export async function getDomingoIds(): Promise<number[]> {
    const config = await prisma.configuracion.findUnique({
        where: { clave: 'domingo' },
    });
    if (!config || !config.valor) return [];
    return config.valor.split(' ').map((n: string) => Number(n)).filter((n: number) => !isNaN(n));
}

export async function getDomingoSongs() {
    const ids = await getDomingoIds();
    if (ids.length === 0) return [];

    const songs = await prisma.cancion.findMany({
        where: { id: { in: ids } },
    });

    // Maintain order
    const songMap = new Map<number, Cancion>(songs.map((s: Cancion) => [s.id, s]));
    return ids.map((id) => songMap.get(id)).filter((s): s is Cancion => s !== undefined);
}

export async function toggleDomingo(id: number) {
    const ids = await getDomingoIds();
    const exists = ids.includes(id);

    let newIds: number[];
    if (exists) {
        newIds = ids.filter(i => i !== id);
    } else {
        newIds = [...ids, id];
    }

    await prisma.configuracion.upsert({
        where: { clave: 'domingo' },
        update: { valor: newIds.join(' ') },
        create: { clave: 'domingo', valor: newIds.join(' ') },
    });
    return !exists;
}

export async function login(password: string) {
    if (password === PASSWORD) {
        (await cookies()).set('auth', 'true', { httpOnly: true, path: '/' });
        return true;
    }
    return false;
}

export async function logout() {
    (await cookies()).delete('auth');
    redirect('/');
}

export async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.get('auth')?.value === 'true';
}
