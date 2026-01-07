import Link from 'next/link';
import type { Cancion } from '@prisma/client';
import { decodeEntities } from '@/lib/utils';

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
            {songs.map((song) => (
                <Link
                    key={song.id}
                    href={`/cancion/${song.id}`}
                    className="block hover:text-blue-800"
                >
                    {song.id}. {decodeEntities(song.titulo)}
                </Link>
            ))}
        </div>
    );
}
