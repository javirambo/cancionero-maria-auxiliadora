'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/app/actions';
import { useTranspose } from './TransposeContext';

const CATEGORIES = [
    'ENTRADA', 'PERDON', 'GLORIA', 'ALELUYA', 'OFRENDAS', 'SANTO', 'COMUNION',
    'ACCION DE GRACIAS / ADORACION', 'DESPEDIDA', 'MARIA', 'SALMOS Y CANTICOS',
    'ADVIENTO', 'NAVIDAD', 'CUARESMA', 'PASCUA', 'ESPIRITU SANTO',
    'ALABANZA / ANIMACION', 'OTROS', 'Todas'
];

export default function HamburgerMenu({ isAuth }: { isAuth: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { semitones, increment, decrement, reset, isSongPage } = useTranspose();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Close menu on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleCategory = (cat: string) => {
        setIsOpen(false);
        const params = new URLSearchParams();
        if (cat !== 'Todas') {
            params.set('category', cat);
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <>
            <button
                className={`hamburger-btn ${isOpen ? 'open' : ''}`}
                onClick={toggleMenu}
                aria-label="Men&uacute;"
            >
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
            </button>

            <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <div className="menu-content" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col gap-1 mb-4">
                        <span className="menu-category-title">Panel</span>
                        <Link
                            href="/"
                            className="menu-item"
                        >
                            Inicio (Índice)
                        </Link>
                        <Link
                            href="/domingo"
                            className="menu-item font-bold"
                        >
                            Domingo (Misa Hoy)
                        </Link>

                        {isSongPage && (
                            <div className="flex flex-col gap-2 p-3 bg-accent-red/5 rounded-xl border border-accent-red/10 mt-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-red/60 ml-1">
                                    Transportar Tono
                                </span>
                                <div className="flex items-center justify-between gap-2">
                                    <button
                                        onClick={decrement}
                                        className="btn btn-gray flex-1 h-10 text-xl font-bold"
                                    >
                                        -
                                    </button>
                                    <div className="flex flex-col items-center min-w-[60px]">
                                        <span className="text-xs text-muted leading-none">Actual</span>
                                        <span className={`text-lg font-bold ${semitones === 0 ? 'text-muted' : 'text-accent-red'}`}>
                                            {semitones > 0 ? `+${semitones}` : semitones}
                                        </span>
                                    </div>
                                    <button
                                        onClick={increment}
                                        className="btn btn-gray flex-1 h-10 text-xl font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                                {semitones !== 0 && (
                                    <button
                                        onClick={reset}
                                        className="text-xs text-accent-red hover:underline font-bold py-1"
                                    >
                                        Restablecer Tono Original
                                    </button>
                                )}
                            </div>
                        )}

                        {isAuth ? (
                            <>
                                <Link
                                    href="/nueva"
                                    className="menu-item menu-item-green font-bold"
                                >
                                    + Nueva Canci&oacute;n
                                </Link>
                                <form action={logout}>
                                    <button
                                        type="submit"
                                        className="menu-item menu-item-red font-bold text-left w-full cursor-pointer"
                                    >
                                        Cerrar Sesi&oacute;n
                                    </button>
                                </form>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="menu-item font-bold"
                            >
                                Iniciar Sesi&oacute;n
                            </Link>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="menu-category-title">Categor&iacute;as</span>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategory(cat)}
                                className="menu-item text-left w-full bg-transparent border-none cursor-pointer"
                            >
                                {cat === 'Todas' ? 'TODAS LAS CANCIONES' : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
