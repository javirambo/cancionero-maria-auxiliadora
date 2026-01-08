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
            className={`nav-btn ${isOn ? 'btn-blue' : 'btn-gray'}`}
        >
            {isLoading ? '...' : isOn ? 'Quitar de Hoy' : 'Agregar a Hoy'}
        </button>
    );
}
