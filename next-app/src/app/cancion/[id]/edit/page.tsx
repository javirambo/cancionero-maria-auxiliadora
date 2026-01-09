import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getSong, updateSong } from '@/app/actions';
import ChordLyricEditor from '@/components/ChordLyricEditor';

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
        const data = {
            titulo: formData.get('titulo') as string,
            grupo: formData.get('grupo') as string,
            letra: formData.get('letra') as string,
        };
        await updateSong(id, data);
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6 p-4">
            <div className="flex flex-col gap-4 text-center">
                <Link href={`/cancion/${id}`} className="text-muted hover:text-foreground flex items-center justify-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Volver a la canci&oacute;n
                </Link>
                <h1 className="text-3xl font-extrabold text-foreground">Editar canci&oacute;n #{id}</h1>
            </div>

            <form action={handleSubmit} className="flex flex-col gap-4 bg-card p-6 rounded-2xl shadow-xl border border-border">
                <div className="flex flex-col gap-1">
                    <label htmlFor="titulo" className="text-sm font-bold text-muted">T&iacute;tulo de la canci&oacute;n</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        defaultValue={song.titulo}
                        placeholder="Ingrese el nombre"
                        className="input"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="grupo" className="text-sm font-bold text-muted">Tipo de canci&oacute;n</label>
                    <select id="grupo" name="grupo" className="input" defaultValue={song.grupo || 'OTROS'}>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-muted mb-2">Letra y Acordes</label>
                    <ChordLyricEditor name="letra" initialValue={song.letra} />
                    <p className="text-xs text-muted mt-2">
                        Edita la letra línea por línea. Usa el campo superior de cada línea para poner los acordes sobre las letras correspondientes usando espacios.
                    </p>
                </div>

                <div className="flex gap-4 mt-4">
                    <button type="submit" className="btn btn-primary flex-1">
                        Guardar Cambios
                    </button>
                    <Link href={`/cancion/${id}`} className="btn btn-gray flex-1 text-center">
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
