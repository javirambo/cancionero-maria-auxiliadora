import { getDomingoSongs } from '@/app/actions';
import SongList from '@/components/SongList';

export const dynamic = 'force-dynamic';

export default async function DomingoPage() {
    const songs = await getDomingoSongs();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-purple-500">
                    Domingo
                </h1>
                <p className="text-muted text-sm">
                    Lista de canciones seleccionadas para la misa.
                </p>
            </div>

            <SongList songs={songs} />
        </div>
    );
}
