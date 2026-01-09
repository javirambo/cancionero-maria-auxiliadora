import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSong, getDomingoIds, isAuthenticated } from '@/app/actions';
import { formatLyrics, decodeEntities } from '@/lib/utils';
import DomingoToggle from '@/components/DomingoToggle';
import DeleteSongButton from '@/components/DeleteSongButton';

export default async function SongPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = Number(params.id);
    if (isNaN(id)) notFound();

    const [song, domingoIds, isAuth] = await Promise.all([
        getSong(id),
        getDomingoIds(),
        isAuthenticated()
    ]);

    if (!song) notFound();

    const formattedLyrics = formatLyrics(song.letra);
    const decodedTitle = decodeEntities(song.titulo);
    const isDomingo = domingoIds.includes(id);

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6 p-4">
            <div className="mb-6 flex flex-col gap-4 text-center">
                <Link href="/" className="text-muted hover:text-foreground flex items-center justify-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Volver al &iacute;ndice
                </Link>

                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-accent-red leading-tight px-2">{song.id}. {decodedTitle}</h1>
                    <div className="mt-2 flex flex-wrap justify-center items-center gap-3 md:gap-6">
                        <DomingoToggle id={song.id} initialOn={isDomingo} isAuth={isAuth} />
                        {isAuth && (
                            <div className="flex gap-2">
                                <Link href={`/cancion/${song.id}/edit`} className="btn btn-gray !h-10 !px-4 text-sm flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                    Editar
                                </Link>
                                <DeleteSongButton id={song.id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div
                className="text-lg leading-relaxed bg-card p-4 md:p-6 rounded-2xl border border-white/5 shadow-xl glass overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: formattedLyrics }}
            />
        </div>
    );
}
