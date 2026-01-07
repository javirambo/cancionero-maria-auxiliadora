import { getSongs } from '@/app/actions';

async function main() {
    // Fetch a few songs to see formatting
    const songs = await getSongs('');
    // Find one with asterisks if possible
    const withBold = songs.find(s => s.letra.includes('*'));

    if (withBold) {
        console.log('--- SONG WITH ASTERISKS ---');
        console.log('ID:', withBold.id);
        console.log('Raw Letra:', JSON.stringify(withBold.letra));
    } else {
        console.log('No songs with * found in first 50.');
    }

    // Check the first song for newlines
    if (songs.length > 0) {
        console.log('--- FIRST SONG ---');
        console.log('Raw Letra:', JSON.stringify(songs[0].letra));
    }
}

main();
