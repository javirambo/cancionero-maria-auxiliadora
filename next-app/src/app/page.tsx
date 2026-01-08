import { Suspense } from 'react';
import Link from 'next/link';
import { getSongs, isAuthenticated, logout } from './actions';
import SearchInput from '@/components/SearchInput';
import SongList from '@/components/SongList';
import CategoryButtons from '@/components/CategoryButtons';

export default async function Home(props: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || '';
  const category = searchParams.category || '';
  const [songs, isAuth] = await Promise.all([
    getSongs(query, category),
    isAuthenticated()
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center justify-center w-full mb-6 flex-wrap">
        {isAuth && (
          <Link href="/nueva" className="nav-btn btn-green">
            + NUEVA
          </Link>
        )}
        <Link href="/domingo" className="nav-btn btn-blue">
          Domingo
        </Link>
        {isAuth ? (
          <form action={async () => {
            'use server';
            await logout();
          }}>
            <button type="submit" className="nav-btn btn-red">
              Salir
            </button>
          </form>
        ) : (
          <Link href="/login" className="nav-btn btn-gray">
            Login
          </Link>
        )}
      </div>

      <Suspense fallback={<div className="h-12 w-full bg-muted/20 rounded-xl animate-pulse" />}>
        <SearchInput />
      </Suspense>

      <div className="min-h-[50vh]">
        {/* Songs list */}
        <SongList songs={songs} />
      </div>

      <Suspense>
        <CategoryButtons />
      </Suspense>
    </div>
  );
}
