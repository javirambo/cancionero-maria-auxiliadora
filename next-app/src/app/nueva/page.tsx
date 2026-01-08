import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getMaxSongId, createSong } from '../actions';

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
        const data = {
            id: Number(formData.get('id')),
            titulo: formData.get('titulo') as string,
            grupo: formData.get('grupo') as string,
            letra: formData.get('letra') as string,
        };
        await createSong(data);
    }

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-6 p-4">
            <div className="flex flex-col gap-4 text-center">
                <Link href="/" className="text-muted hover:text-foreground flex items-center justify-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Volver al &iacute;ndice
                </Link>
                <h1 className="text-3xl font-extrabold text-foreground">Nueva canci&oacute;n</h1>
            </div>

            <form action={handleSubmit} className="flex flex-col gap-4 bg-card p-6 rounded-2xl shadow-xl border border-border">
                <div className="flex flex-col gap-1">
                    <label htmlFor="id" className="text-sm font-bold text-muted">N&uacute;mero</label>
                    <input
                        type="number"
                        id="id"
                        name="id"
                        defaultValue={nextId}
                        className="input"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="titulo" className="text-sm font-bold text-muted">T&iacute;tulo de la canci&oacute;n</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        placeholder="Ingrese el nombre"
                        className="input"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="grupo" className="text-sm font-bold text-muted">Tipo de canci&oacute;n</label>
                    <select id="grupo" name="grupo" className="input">
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="letra" className="text-sm font-bold text-muted">Letra</label>
                    <textarea
                        id="letra"
                        name="letra"
                        rows={15}
                        placeholder="Letra de la canción / Puede colocar *para el estribillo* / Separe cada línea con ENTER y cada estrofa con dos ENTERS"
                        className="input min-h-[300px]"
                        required
                    ></textarea>
                </div>

                <div className="flex gap-4 mt-4">
                    <button type="submit" className="btn btn-primary flex-1">
                        Guardar
                    </button>
                    <Link href="/" className="btn btn-gray flex-1 text-center">
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
