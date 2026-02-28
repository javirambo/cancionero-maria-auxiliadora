'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import ChordLyricEditor from './ChordLyricEditor';
import { processSongImage } from '@/app/actions';

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
    const [isProcessing, setIsProcessing] = useState(false);

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

    const [titulo, setTitulo] = useState(song?.titulo || '');
    const [autor, setAutor] = useState(initialAutor);
    const [letra, setLetra] = useState(song?.letra || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        try {
            // Is it a text file?
            if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
                const text = await file.text();
                setLetra(text);
                setIsDirty(true);
                setIsProcessing(false);
                return;
            }

            // Otherwise, process as image
            const reader = new FileReader();
            reader.onloadend = async () => {
                const img = new Image();
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1600;
                    const MAX_HEIGHT = 1600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Re-compress as JPEG to keep size down
                    const base64 = canvas.toDataURL('image/jpeg', 0.8);

                    try {
                        const result = await processSongImage(base64);
                        if (result.titulo) setTitulo(result.titulo);
                        if (result.autor) setAutor(result.autor);
                        if (result.letra) setLetra(JSON.stringify(result.letra));
                        setIsDirty(true);
                    } catch (err: any) {
                        alert(err.message || 'Error al procesar la imagen');
                    } finally {
                        setIsProcessing(false);
                    }
                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error(err);
            alert('Error al leer el archivo');
            setIsProcessing(false);
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
                    <div className="flex flex-col mb-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*,text/plain,.txt,.md"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={handleImportClick}
                            disabled={isProcessing}
                            className="btn btn-blue flex items-center justify-center gap-2 py-4 border-dashed border-2 hover:border-blue-400 transition-all text-lg"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Procesando archivo...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><line x1="16" y1="5" x2="22" y2="5" /><line x1="19" y1="2" x2="19" y2="8" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                    Importar partitura
                                </>
                            )}
                        </button>
                    </div>
                )}

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
                        value={titulo}
                        onChange={(e) => {
                            setTitulo(e.target.value);
                            setIsDirty(true);
                        }}
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
                        <label htmlFor="autor" className="text-sm font-bold text-muted">Autor</label>
                        <input
                            type="text"
                            id="autor"
                            name="autor"
                            value={autor}
                            onChange={(e) => {
                                setAutor(e.target.value);
                                setIsDirty(true);
                            }}
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
                        value={letra}
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
