'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
    'ENTRADA', 'PERDON', 'GLORIA', 'ALELUYA', 'OFRENDAS', 'SANTO', 'COMUNION',
    'ACCION DE GRACIAS / ADORACION', 'DESPEDIDA', 'MARIA', 'SALMOS Y CANTICOS',
    'ADVIENTO', 'NAVIDAD', 'CUARESMA', 'PASCUA', 'ESPIRITU SANTO',
    'ALABANZA / ANIMACION', 'OTROS', 'Todas'
];

export default function CategoryButtons() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    const handleCategory = (cat: string) => {
        const params = new URLSearchParams(searchParams);
        if (cat === 'Todas') {
            params.delete('category');
        } else {
            params.set('category', cat);
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-2 mb-8 justify-center px-4">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={`nav-btn
            ${(currentCategory === cat || (cat === 'Todas' && !currentCategory))
                            ? 'btn-blue'
                            : 'btn-gray'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
