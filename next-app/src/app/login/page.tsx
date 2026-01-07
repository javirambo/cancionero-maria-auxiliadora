'use client';

import { login } from '@/app/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(password);
        if (success) {
            router.push('/');
            router.refresh();
        } else {
            setError(true);
        }
    };

    return (
        <div className="max-w-xs mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-6 text-center">Acceso Coral</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="password"
                    placeholder="Contrase&ntilde;a"
                    className="input text-center"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                />
                {error && <p className="text-red-500 text-sm text-center">Incorrecto</p>}
                <button type="submit" className="btn btn-primary w-full">
                    Entrar
                </button>
            </form>
        </div>
    );
}
