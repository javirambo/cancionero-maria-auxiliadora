import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSong, getDomingoIds, isAuthenticated } from '@/app/actions';
import { decodeEntities } from '@/lib/utils';
import DomingoToggle from '@/components/DomingoToggle';
import DeleteSongButton from '@/components/DeleteSongButton';
import TransposableLyrics from '@/components/TransposableLyrics';

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

            <div className="bg-card p-4 md:p-6 rounded-2xl border border-white/5 shadow-xl glass">
                <TransposableLyrics lyricsJson={song.letra} />

                {song.extras && (() => {
                    try {
                        const parsed = JSON.parse(song.extras);
                        return (
                            <>
                                {parsed.autor && (
                                    <div className="mt-6 text-right">
                                        <p className="text-xs md:text-sm text-muted italic">
                                            Autor: {parsed.autor}
                                        </p>
                                    </div>
                                )}

                                {parsed.youtube_url && (
                                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                                        <a
                                            href={parsed.youtube_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn bg-white hover:bg-gray-50 border border-gray-200 flex items-center gap-3 px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md"
                                            style={{ color: '#FF0000' }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FF0000"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                            <span className="font-bold">Ver en YouTube</span>
                                        </a>
                                    </div>
                                )}
                            </>
                        );
                    } catch (e) {
                        return null;
                    }
                })()}
            </div>
        </div>
    );
}
