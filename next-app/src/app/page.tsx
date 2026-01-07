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
      <div className="flex gap-8 items-center justify-center w-full mb-4">
        <Link href="/domingo" className="text-sm hover:text-primary transition-colors  tracking-widest text-foreground">
          Misa hoy
        </Link>
        {isAuth ? (
          <div className="flex gap-4 items-center">
            <span className="text-xs px-3 py-1 rounded bg-green-100 text-green-700 border border-green-200 font-extra-bold">ADMIN</span>
            <form action={async () => {
              'use server';
              await logout();
            }}>
              <button type="submit" className="text-sm text-red-600 hover:text-red-800 transition-colors  tracking-widest cursor-pointer border-none bg-transparent">
                Salir
              </button>
            </form>
          </div>
        ) : (
          <Link href="/login" className="text-sm text-muted hover:text-foreground transition-colors  tracking-widest">
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
