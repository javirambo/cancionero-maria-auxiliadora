'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface SongContextType {
    songId: number | null;
    isDomingo: boolean;
    youtubeUrl: string | null;
    hasChords: boolean;
    setSongInfo: (id: number | null, isDomingo: boolean, youtubeUrl?: string | null, hasChords?: boolean) => void;
}

const SongContext = createContext<SongContextType>({
    songId: null,
    isDomingo: false,
    youtubeUrl: null,
    hasChords: false,
    setSongInfo: () => {},
});

export function SongProvider({ children }: { children: ReactNode }) {
    const [songId, setSongId] = useState<number | null>(null);
    const [isDomingo, setIsDomingo] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
    const [hasChords, setHasChords] = useState(false);
    const pathname = usePathname();

    // Reset song info when navigating away from song pages
    useEffect(() => {
        if (!pathname.startsWith('/cancion/') || pathname.endsWith('/edit')) {
            setSongId(null);
            setIsDomingo(false);
            setYoutubeUrl(null);
            setHasChords(false);
        }
    }, [pathname]);

    const setSongInfo = (id: number | null, domingo: boolean, youtube?: string | null, chords?: boolean) => {
        setSongId(id);
        setIsDomingo(domingo);
        setYoutubeUrl(youtube ?? null);
        setHasChords(chords ?? false);
    };

    return (
        <SongContext.Provider value={{ songId, isDomingo, youtubeUrl, hasChords, setSongInfo }}>
            {children}
        </SongContext.Provider>
    );
}

export function useSong() {
    return useContext(SongContext);
}
