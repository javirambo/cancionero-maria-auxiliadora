import Link from 'next/link';
import type { Cancion } from '@prisma/client';
import { decodeEntities } from '@/lib/utils';

function getAutor(extras: string | null): string | null {
    if (!extras) return null;
    try {
        const parsed = JSON.parse(extras);
        return parsed.autor || null;
    } catch {
        return null;
    }
}

function hasChords(letra: string): boolean {
    try {
        const parsed = JSON.parse(letra);
        if (Array.isArray(parsed)) {
            return parsed.some((line: { c?: string }) => line.c && line.c.trim() !== '');
        }
    } catch {
        // Not JSON, old format without chords
    }
    return false;
}

function hasYoutube(extras: string | null): string | null {
    if (!extras) return null;
    try {
        const parsed = JSON.parse(extras);
        return parsed.youtube_url || null;
    } catch {
        return null;
    }
}

export default function SongList({ songs }: { songs: Cancion[] }) {
    if (songs.length === 0) {
        return (
            <div className="text-center py-10 text-muted">
                <p>No se encontraron canciones.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 px-4">
            {songs.map((song) => {
                const autor = getAutor(song.extras);
                const tieneAcordes = hasChords(song.letra);
                const youtube = hasYoutube(song.extras);
                return (
                    <Link
                        key={song.id}
                        href={`/cancion/${song.id}`}
                        className="block py-2 text-lg hover:text-blue-700 transition-colors"
                    >
                        <span className="font-bold text-accent-blue mr-1">{song.id}&nbsp;</span>
                        <span className="font-medium text-foreground">{decodeEntities(song.titulo)} </span>
                        {youtube && (
                            <span className="ml-2" title="YouTube">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#b73737ff" style={{ display: 'inline', verticalAlign: 'middle' }}><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                            </span>
                        )}
                        {tieneAcordes && (
                            <span className="ml-2" style={{ color: '#df35d1ff' }} title="Tiene acordes"> ♫</span>
                        )}
                        {autor && (
                            <span className="text-sm text-muted ml-3"> · {decodeEntities(autor)}</span>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
