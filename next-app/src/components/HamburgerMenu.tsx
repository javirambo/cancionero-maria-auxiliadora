'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/app/actions';

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

                        {isAuth ? (
                            <>
                                <Link
                                    href="/nueva"
                                    className="menu-item text-green-700 font-bold"
                                >
                                    + Nueva Canci&oacute;n
                                </Link>
                                <form action={logout}>
                                    <button
                                        type="submit"
                                        className="menu-item text-red-600 text-left w-full bg-transparent border-none cursor-pointer"
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
