'use client';

import { useEffect } from 'react';
import TransposableLyrics from '@/components/TransposableLyrics';
import { useChords } from '@/components/ChordsContext';
import { useSong } from '@/components/SongContext';
import { decodeEntities } from '@/lib/utils';

interface SongViewProps {
    song: {
        id: number;
        titulo: string;
        letra: string;
        grupo: string | null;
        extras: string | null;
    };
    isDomingo: boolean;
    isAuth: boolean;
}

function parseExtras(extras: string | null): { autor: string | null; youtube_url: string | null } {
    if (!extras) return { autor: null, youtube_url: null };
    try {
        const parsed = JSON.parse(extras);
        return {
            autor: parsed.autor || null,
            youtube_url: parsed.youtube_url || null
        };
    } catch {
        return { autor: null, youtube_url: null };
    }
}

function checkHasChords(letra: string): boolean {
    try {
        const parsed = JSON.parse(letra);
        if (Array.isArray(parsed)) {
            return parsed.some((line: { c?: string }) => line.c && line.c.trim() !== '');
        }
    } catch {
        // Not JSON format
    }
    return false;
}

export default function SongView({ song, isDomingo }: SongViewProps) {
    const { showChords } = useChords();
    const { setSongInfo } = useSong();
    const { autor, youtube_url } = parseExtras(song.extras);
    const decodedTitle = decodeEntities(song.titulo);
    const hasChords = checkHasChords(song.letra);

    // Set song info in context for HamburgerMenu and BottomBar
    useEffect(() => {
        setSongInfo(song.id, isDomingo, youtube_url, hasChords);
        return () => setSongInfo(null, false, null, false);
    }, [song.id, isDomingo, youtube_url, hasChords, setSongInfo]);

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-4 p-4">
            {/* Title */}
            <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-extrabold text-accent-red leading-tight px-2">
                    {song.id}. {decodedTitle}
                </h1>
            </div>

            {/* Lyrics */}
            <div className="bg-card p-4 md:p-6 rounded-2xl border border-white/5 shadow-xl glass">
                <TransposableLyrics lyricsJson={song.letra} showChords={showChords} />

                {autor && (
                    <div className="mt-6 text-right">
                        <p className="text-xs md:text-sm text-muted italic">
                            Autor: {autor}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
