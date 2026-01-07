import { getSongs, getSong, getDomingoIds } from '@/app/actions';

async function main() {
    console.log('--- Testing getSongs("") ---');
    const all = await getSongs('');
    console.log(`Returned ${all.length} songs. First:`, all[0]);

    console.log('\n--- Testing getSongs("11") ---');
    const idSearch = await getSongs('11');
    console.log(`Found ${idSearch.length} songs matching "11".`);
    if (idSearch.length > 0) console.log('First match ID:', idSearch[0].id);

    console.log('\n--- Testing getSong(1) ---');
    const song1 = await getSong(1);
    console.log('Song 1:', song1 ? song1.titulo : 'Not found');

    console.log('\n--- Testing getDomingoIds() ---');
    const ids = await getDomingoIds();
    console.log('Domingo IDs:', ids);
}

main().catch(console.error);
