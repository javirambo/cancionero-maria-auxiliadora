import Link from 'next/link';
import Image from 'next/image';
import HamburgerMenu from './HamburgerMenu';
import { isAuthenticated } from '@/app/actions';

export default async function Navbar() {
    const isAuth = await isAuthenticated();

    return (
        <header className="w-full border-b bg-white relative">
            <div className="container flex flex-col items-center py-6">
                <Link href="/" className="w-full block">
                    <Image
                        src="/logo.png"
                        alt="Cancionero Logo"
                        width={640}
                        height={160}
                        className="w-full h-auto"
                        priority
                    />
                </Link>
            </div>
            <HamburgerMenu isAuth={isAuth} />
        </header>
    );
}
