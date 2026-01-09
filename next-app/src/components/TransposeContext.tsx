'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface TransposeContextType {
    semitones: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    isSongPage: boolean;
}

const TransposeContext = createContext<TransposeContextType | undefined>(undefined);

export function TransposeProvider({ children }: { children: React.ReactNode }) {
    const [semitones, setSemitones] = useState(0);
    const pathname = usePathname();
    const isSongPage = pathname.startsWith('/cancion/') && !pathname.endsWith('/edit');

    // Reset transposition when changing pages
    useEffect(() => {
        setSemitones(0);
    }, [pathname]);

    const increment = () => setSemitones(prev => Math.min(prev + 1, 12));
    const decrement = () => setSemitones(prev => Math.max(prev - 1, -12));
    const reset = () => setSemitones(0);

    return (
        <TransposeContext.Provider value={{ semitones, increment, decrement, reset, isSongPage }}>
            {children}
        </TransposeContext.Provider>
    );
}

export function useTranspose() {
    const context = useContext(TransposeContext);
    if (!context) {
        throw new Error('useTranspose must be used within a TransposeProvider');
    }
    return context;
}
