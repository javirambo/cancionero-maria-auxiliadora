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
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex flex-col gap-4 text-center">
                <Link href="/" className="text-muted hover:text-foreground flex items-center justify-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Volver al &iacute;ndice
                </Link>

                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-3xl font-extrabold text-accent-red">{song.id}. {decodedTitle}</h1>
                    <div className="mt-2 flex items-center gap-6">
                        <DomingoToggle id={song.id} initialOn={isDomingo} isAuth={isAuth} />
                        {isAuth && <DeleteSongButton id={song.id} />}
                    </div>
                </div>
            </div>

            <div
                className="text-lg leading-relaxed whitespace-pre-wrap bg-card p-6 rounded-2xl border border-white/5 shadow-xl glass"
                dangerouslySetInnerHTML={{ __html: formattedLyrics }}
            />
        </div>
    );
}
