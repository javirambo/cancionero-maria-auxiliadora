import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getSong, updateSong } from '@/app/actions';
import SongForm from '@/components/SongForm';

const CATEGORIES = [
    'OTROS', 'ENTRADA', 'PERDON', 'GLORIA', 'ALELUYA', 'OFRENDAS', 'SANTO', 'COMUNION',
    'ACCION DE GRACIAS / ADORACION', 'DESPEDIDA', 'MARIA', 'SALMOS Y CANTICOS',
    'ADVIENTO', 'NAVIDAD', 'CUARESMA', 'PASCUA', 'ESPIRITU SANTO', 'ALABANZA / ANIMACION'
];

export default async function EditarCancionPage(props: { params: Promise<{ id: string }> }) {
    if (!await isAuthenticated()) {
        redirect('/login');
    }

    const params = await props.params;
    const id = Number(params.id);
    if (isNaN(id)) notFound();

    const song = await getSong(id);
    if (!song) notFound();

    async function handleSubmit(formData: FormData) {
        'use server';
        const youtubeUrl = formData.get('youtube_url') as string;
        const autor = formData.get('autor') as string;
        const data = {
            titulo: formData.get('titulo') as string,
            grupo: formData.get('grupo') as string,
            letra: formData.get('letra') as string,
            extras: JSON.stringify({ youtube_url: youtubeUrl, autor: autor }),
        };
        await updateSong(id, data);
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <SongForm
                id={id}
                song={song}
                categories={CATEGORIES}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
