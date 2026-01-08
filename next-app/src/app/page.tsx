import { Suspense } from 'react';
import { getSongs } from './actions';
import SearchInput from '@/components/SearchInput';
import SongList from '@/components/SongList';

export default async function Home(props: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || '';
  const category = searchParams.category || '';
  const songs = await getSongs(query, category);

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<div className="h-12 w-full bg-muted/20 rounded-xl animate-pulse" />}>
        <SearchInput />
      </Suspense>
      <div className="min-h-[50vh]">
        <SongList songs={songs} />
      </div>
    </div>
  );
}
