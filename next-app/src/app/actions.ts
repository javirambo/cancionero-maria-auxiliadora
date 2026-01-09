'use server';

import prisma from '@/lib/prisma';
import { type Cancion } from '@prisma/client';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const PASSWORD = process.env.ADMIN_PASSWORD || 'Coro2021';

// Normalize text by removing accents for search comparison
function normalizeText(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

export async function getSongs(query: string = '', category: string = '') {
    // Build base query
    const where: any = {};

    if (category && category !== 'Todas') {
        where.grupo = category;
    }

    // Fetch songs (filtered by category if specified)
    let songs = await prisma.cancion.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
        orderBy: { id: 'asc' },
    });

    // If no search query, return all songs
    if (!query.trim()) {
        return songs;
    }

    const normalizedQuery = normalizeText(query);
    const numericQuery = Number(query);
    const isNumeric = !isNaN(numericQuery) && numericQuery > 0 && query.trim() !== '';

    // Filter songs by normalized text search or ID match
    songs = songs.filter(song => {
        // Check ID match (exact or prefix)
        if (isNumeric) {
            const idStr = song.id.toString();
            if (idStr === query || idStr.startsWith(query)) {
                return true;
            }
        }

        // Check title match (accent-insensitive)
        if (normalizeText(song.titulo).includes(normalizedQuery)) {
            return true;
        }

        // Check lyrics match (accent-insensitive)
        if (normalizeText(song.letra).includes(normalizedQuery)) {
            return true;
        }

        return false;
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
