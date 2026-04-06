import { notFound } from 'next/navigation';
import { getSong, getDomingoIds, isAuthenticated } from '@/app/actions';
import SongView from '@/components/SongView';

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

    const isDomingo = domingoIds.includes(id);

    return (
        <SongView
            song={song}
            isDomingo={isDomingo}
            isAuth={isAuth}
        />
    );
}
