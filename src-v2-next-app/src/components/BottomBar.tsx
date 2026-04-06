'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useChords } from '@/components/ChordsContext';
import { useTranspose } from '@/components/TransposeContext';
import { useSong } from '@/components/SongContext';

export default function BottomBar() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showChords, toggleChords } = useChords();
    const { increment, decrement } = useTranspose();
    const { youtubeUrl, hasChords } = useSong();
    const [showSearch, setShowSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const isSongPage = pathname.startsWith('/cancion/') && !pathname.endsWith('/edit');
    const isHome = pathname === '/';
    const isDomingo = pathname === '/domingo';

    // Focus input when search opens
    useEffect(() => {
        if (showSearch && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showSearch]);

    // Close search when navigating to a song page
    useEffect(() => {
        if (isSongPage) {
            setShowSearch(false);
        }
    }, [isSongPage]);

    // Initialize search value from URL params
    useEffect(() => {
        setSearchValue(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearch = (term: string) => {
        setSearchValue(term);
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        startTransition(() => {
            router.replace(`/?${params.toString()}`);
        });
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    const iconSize = 24;
    const iconBtn = "flex items-center justify-center w-11 h-11 rounded-xl transition-all border-none cursor-pointer no-underline text-slate-600";
    const iconBtnActive = "bg-slate-200";
    const iconBtnInactive = "bg-transparent hover:bg-slate-100";
    const floatingBtn = "w-11 h-11 bg-transparent border border-slate-300 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-slate-100 text-slate-600";

    return (
        <>
            {/* Floating transpose buttons - right side (only if song has chords) */}
            {isSongPage && hasChords && showChords && (
                <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
                    <button
                        onClick={increment}
                        className={floatingBtn}
                        title="Subir tono"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                    <button
                        onClick={decrement}
                        className={floatingBtn}
                        title="Bajar tono"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Bottom bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-bottom">
                <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
                    {/* Home */}
                    <Link
                        href="/"
                        className={`${iconBtn} ${isHome ? iconBtnActive : iconBtnInactive}`}
                        title="Índice"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </Link>

                    {/* YouTube - only show when song has youtube_url */}
                    {youtubeUrl && (
                        <a
                            href={youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${iconBtn} ${iconBtnInactive}`}
                            title="YouTube"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                                <path d="m10 15 5-3-5-3z" />
                            </svg>
                        </a>
                    )}

                    {/* Domingo */}
                    <Link
                        href="/domingo"
                        className={`${iconBtn} ${isDomingo ? iconBtnActive : iconBtnInactive}`}
                        title="Domingo"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" />
                            <path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" />
                            <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                    </Link>

                    {/* Chords toggle - only show if song has chords */}
                    {hasChords && (
                        <button
                            onClick={toggleChords}
                            className={`${iconBtn} ${showChords ? iconBtnActive : iconBtnInactive}`}
                            title={showChords ? 'Ocultar acordes' : 'Mostrar acordes'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18V5l12-2v13" />
                                <circle cx="6" cy="18" r="3" />
                                <circle cx="18" cy="16" r="3" />
                            </svg>
                        </button>
                    )}

                    {/* Search */}
                    <button
                        onClick={toggleSearch}
                        className={`${iconBtn} ${showSearch ? iconBtnActive : iconBtnInactive}`}
                        title="Buscar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Search overlay - closes when tapping outside */}
            {showSearch && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowSearch(false)}
                    />
                    <div className="fixed bottom-20 left-0 right-0 px-4 z-50 safe-area-bottom">
                        <div className="max-w-md mx-auto relative">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Buscar por número, nombre o letra..."
                                className="w-full h-12 pl-10 pr-10 rounded-xl bg-white border border-slate-200 text-slate-900 text-base outline-none shadow-lg"
                                value={searchValue}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </div>
                            {isPending && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                            {!isPending && searchValue && (
                                <button
                                    onClick={() => handleSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
