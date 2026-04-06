'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ChordsContextType {
    showChords: boolean;
    toggleChords: () => void;
}

const ChordsContext = createContext<ChordsContextType | undefined>(undefined);

export function ChordsProvider({ children }: { children: ReactNode }) {
    const [showChords, setShowChords] = useState(false);

    const toggleChords = () => setShowChords(prev => !prev);

    return (
        <ChordsContext.Provider value={{ showChords, toggleChords }}>
            {children}
        </ChordsContext.Provider>
    );
}

export function useChords() {
    const context = useContext(ChordsContext);
    if (!context) {
        throw new Error('useChords must be used within a ChordsProvider');
    }
    return context;
}
