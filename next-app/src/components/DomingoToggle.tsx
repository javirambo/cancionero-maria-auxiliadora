'use client';

import { useState } from 'react';
import { toggleDomingo } from '@/app/actions';

export default function DomingoToggle({ id, initialOn, isAuth }: { id: number, initialOn: boolean, isAuth: boolean }) {
    const [isOn, setIsOn] = useState(initialOn);
    const [isLoading, setIsLoading] = useState(false);

    if (!isAuth) return null;

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            const newState = await toggleDomingo(id);
            setIsOn(newState);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`btn btn-sm text-sm ${isOn ? 'btn-primary' : 'btn-ghost border border-white/10'}`}
        >
            {isLoading ? '...' : isOn ? 'En Domingo' : 'Agregar a Domingo'}
        </button>
    );
}
