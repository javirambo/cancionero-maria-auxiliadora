'use server';

import prisma from '@/lib/prisma';
import { type Cancion } from '@prisma/client';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const PASSWORD = process.env.ADMIN_PASSWORD || 'Coro2021';

export async function getSongs(query: string = '', category: string = '') {
    const orConditions: any[] = [
        { titulo: { contains: query } },
        { letra: { contains: query } },
    ];

    const numericQuery = Number(query);
    if (!isNaN(numericQuery) && numericQuery > 0 && query.trim() !== '') {
        // Match IDs that start with the given digits
        // e.g. "12" matches 12, 120-129, 1200-1299
        orConditions.push({ id: numericQuery });

        // Ranges for 10s, 100s, 1000s
        let multiplier = 10;
        while (multiplier <= 1000) {
            const start = numericQuery * multiplier;
            const end = start + (multiplier - 1);
            orConditions.push({
                id: {
                    gte: start,
                    lte: end
                }
            });
            multiplier *= 10;
        }
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

export async function getMaxSongId() {
    const result = await prisma.cancion.aggregate({
        _max: {
            id: true
        }
    });
    return (result._max.id || 0) + 1;
}

export async function createSong(data: { id: number, titulo: string, letra: string, grupo: string, extras?: string }) {
    if (!await isAuthenticated()) throw new Error('Unauthorized');

    await prisma.cancion.create({
        data: {
            id: data.id,
            titulo: data.titulo,
            letra: data.letra,
            grupo: data.grupo,
            extras: data.extras || null
        }
    });

    revalidatePath('/');
    redirect(`/cancion/${data.id}`);
}

export async function updateSong(id: number, data: { titulo: string, grupo: string, letra: string, extras?: string }) {
    if (!await isAuthenticated()) throw new Error('Unauthorized');

    await prisma.cancion.update({
        where: { id },
        data: {
            titulo: data.titulo,
            grupo: data.grupo,
            letra: data.letra,
            extras: data.extras || null
        }
    });

    redirect(`/cancion/${id}`);
}

export async function deleteSong(id: number) {
    if (!await isAuthenticated()) throw new Error('Unauthorized');

    await prisma.cancion.delete({
        where: { id }
    });

    // Also remove from domingo list if present
    const ids = await getDomingoIds();
    if (ids.includes(id)) {
        const newIds = ids.filter(i => i !== id);
        await prisma.configuracion.update({
            where: { clave: 'domingo' },
            data: { valor: newIds.join(' ') }
        });
    }

    redirect('/');
}
