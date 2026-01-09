import { getSongs } from './actions';
import SongList from '@/components/SongList';

export default async function Home(props: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || '';
  const category = searchParams.category || '';
  const songs = await getSongs(query, category);

  return (
    <div className="flex flex-col gap-4">
      <div className="min-h-[50vh]">
        <SongList songs={songs} />
      </div>
    </div>
  );
}
