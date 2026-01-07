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
        <div className="flex flex-wrap gap-2 mt-8 justify-center">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={`px-3 py-2 text-sm font-bold rounded uppercase transition-colors
            ${(currentCategory === cat || (cat === 'Todas' && !currentCategory))
                            ? 'bg-yellow-400 text-black'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
