import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getMaxSongId, createSong } from '../actions';
import SongForm from '@/components/SongForm';

const CATEGORIES = [
    'OTROS', 'ENTRADA', 'PERDON', 'GLORIA', 'ALELUYA', 'OFRENDAS', 'SANTO', 'COMUNION',
    'ACCION DE GRACIAS / ADORACION', 'DESPEDIDA', 'MARIA', 'SALMOS Y CANTICOS',
    'ADVIENTO', 'NAVIDAD', 'CUARESMA', 'PASCUA', 'ESPIRITU SANTO', 'ALABANZA / ANIMACION'
];

export default async function NuevaCancionPage() {
    if (!await isAuthenticated()) {
        redirect('/login');
    }

    const nextId = await getMaxSongId();

    async function handleSubmit(formData: FormData) {
        'use server';
        const youtubeUrl = formData.get('youtube_url') as string;
        const autor = formData.get('autor') as string;
        const data = {
            id: Number(formData.get('id')),
            titulo: formData.get('titulo') as string,
            grupo: formData.get('grupo') as string,
            letra: formData.get('letra') as string,
            extras: JSON.stringify({ youtube_url: youtubeUrl, autor: autor }),
        };
        await createSong(data);
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <SongForm
                id={nextId}
                categories={CATEGORIES}
                onSubmit={handleSubmit}
                isNew={true}
            />
        </div>
    );
}
