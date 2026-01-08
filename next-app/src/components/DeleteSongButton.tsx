'use client';

import { deleteSong } from '@/app/actions';

export default function DeleteSongButton({ id }: { id: number }) {
    const handleDelete = async () => {
        if (confirm('¿Estás seguro de que deseas eliminar esta canción?')) {
            await deleteSong(id);
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="nav-btn btn-red"
        >
            Eliminar
        </button>
    );
}
