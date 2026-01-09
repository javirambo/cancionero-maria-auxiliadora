'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import ChordLyricEditor from './ChordLyricEditor';

interface SongFormProps {
    id: number;
    song?: {
        titulo: string;
        grupo: string | null;
        letra: string;
        extras?: string | null;
    };
    categories: string[];
    onSubmit: (formData: FormData) => Promise<void>;
    isNew?: boolean;
}

export default function SongForm({ id, song, categories, onSubmit, isNew = false }: SongFormProps) {
    const [isDirty, setIsDirty] = useState(false);

    // Parse extras
    let initialYoutubeUrl = '';
    let initialAutor = '';
    if (song?.extras) {
        try {
            const parsedExtras = JSON.parse(song.extras);
            initialYoutubeUrl = parsedExtras.youtube_url || '';
            initialAutor = parsedExtras.autor || '';
        } catch (e) {
            // Not JSON
        }
    }

    const handleDirtyChange = useCallback((dirty: boolean) => {
        setIsDirty(dirty);
    }, []);

    const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isDirty) {
            if (!window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?')) {
                e.preventDefault();
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 text-center">
                <Link
                    href={isNew ? '/' : `/cancion/${id}`}
                    className="text-muted hover:text-foreground flex items-center justify-center gap-2 text-sm"
                    onClick={handleBackClick}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Volver {isNew ? 'al índice' : 'a la canción'}
                </Link>
                <h1 className="text-3xl font-extrabold text-foreground">
                    {isNew ? 'Nueva canción' : `Editar canción #${id}`}
                </h1>
            </div>

            <form action={onSubmit} className="flex flex-col gap-4 bg-card p-6 rounded-2xl shadow-xl border border-border">
                {isNew && (
                    <div className="flex flex-col gap-1">
                        <label htmlFor="id" className="text-sm font-bold text-muted">N&uacute;mero</label>
                        <input
                            type="number"
                            id="id"
                            name="id"
                            defaultValue={id}
                            className="input"
                            required
                        />
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <label htmlFor="titulo" className="text-sm font-bold text-muted">T&iacute;tulo de la canci&oacute;n</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        defaultValue={song?.titulo}
                        placeholder="Ingrese el nombre"
                        className="input"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="grupo" className="text-sm font-bold text-muted">Tipo de canci&oacute;n</label>
                    <select id="grupo" name="grupo" className="input" defaultValue={song?.grupo || 'OTROS'}>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="autor" className="text-sm font-bold text-muted">Autor / Int&eacute;rprete</label>
                        <input
                            type="text"
                            id="autor"
                            name="autor"
                            defaultValue={initialAutor}
                            placeholder="Ej: Daniel Poli"
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="youtube_url" className="text-sm font-bold text-muted">Link de YouTube</label>
                        <input
                            type="url"
                            id="youtube_url"
                            name="youtube_url"
                            defaultValue={initialYoutubeUrl}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="input"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-muted mb-2">Letra y Acordes</label>
                    <ChordLyricEditor
                        name="letra"
                        initialValue={song?.letra}
                        onDirtyChange={handleDirtyChange}
                    />
                    <p className="text-xs text-muted mt-2">
                        Edita la letra línea por línea. Usa el campo superior de cada línea para poner los acordes sobre las letras correspondientes usando espacios.
                    </p>
                </div>

                <div className="flex gap-4 mt-4">
                    <button type="submit" className="btn btn-primary flex-1">
                        {isNew ? 'Guardar' : 'Guardar Cambios'}
                    </button>
                    <Link
                        href={isNew ? '/' : `/cancion/${id}`}
                        className="btn btn-gray flex-1 text-center"
                        onClick={handleBackClick}
                    >
                        {isNew ? 'Cancelar' : 'Cancelar'}
                    </Link>
                </div>
            </form>
        </div>
    );
}
