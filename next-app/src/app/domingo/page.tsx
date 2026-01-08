import Link from 'next/link';
import { getDomingoSongs } from '@/app/actions';
import SongList from '@/components/SongList';

export const dynamic = 'force-dynamic';

export default async function DomingoPage() {
    const songs = await getDomingoSongs();

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col gap-4 text-center">
                <Link href="/" className="text-muted hover:text-foreground flex items-center justify-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Volver al &iacute;ndice
                </Link>

                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-extrabold text-foreground">
                        Domingo (Misa Hoy)
                    </h1>
                </div>
            </div>

            <SongList songs={songs} />
        </div>
    );
}
