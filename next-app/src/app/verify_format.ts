import { formatLyrics } from '@/lib/utils';
import { getSongs } from '@/app/actions';

async function main() {
    const songs = await getSongs('');
    const withBold = songs.find(s => s.letra.includes('*'));

    if (withBold) {
        console.log('--- RAW ---');
        console.log(withBold.letra);
        console.log('--- FORMATTED ---');
        console.log(formatLyrics(withBold.letra));
    }
}

main();
