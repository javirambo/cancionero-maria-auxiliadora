const NOTES_EN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_LATIN = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

const NOTE_MAP: { [key: string]: number } = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
    'DO': 0, 'DO#': 1, 'RE': 2, 'RE#': 3, 'MI': 4, 'FA': 5, 'FA#': 6, 'SOL': 7, 'SOL#': 8, 'LA': 9, 'LA#': 10, 'SI': 11,
    'REB': 1, 'MIB': 3, 'GAB': 6, 'SOLB': 6, 'LAB': 8, 'SIB': 10
};

// Also support lowercase and TitleCase for mapping
Object.keys(NOTE_MAP).forEach(key => {
    NOTE_MAP[key.toLowerCase()] = NOTE_MAP[key];
    // Special case for 'Do', 'Re' etc as they are usually TitleCase
    // Only apply if the key is longer than 1 char (i.e., not 'C', 'D', etc.)
    if (key.length > 1) {
        const titleCase = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
        NOTE_MAP[titleCase] = NOTE_MAP[key];
    }
});

export function transposeChord(chord: string, semitones: number): string {
    if (!chord || semitones === 0) return chord;

    // This regex looks for:
    // 1. Latin notes: Do, Re, Mi, Fa, Sol, La, Si (case insensitive, optional # or b)
    // 2. English notes: A, B, C, D, E, F, G (case insensitive, optional # or b)
    const regex = /(Do|Re|Mi|Fa|Sol|La|Si|[A-G])([#b]?)/gi;

    return chord.replace(regex, (match, note, accidental) => {
        const fullNote = (note + accidental); // Keep original casing for now to check against NOTE_MAP
        const currentPos = NOTE_MAP[fullNote.toUpperCase()]; // Lookup in uppercase NOTE_MAP

        if (currentPos === undefined) return match;

        // Calculate new position
        let newPos = (currentPos + semitones) % 12;
        if (newPos < 0) newPos += 12;

        // Determine which notation system to return
        // If the original was English notation (1 char for the base note), return English
        // If the original was Latin notation (2+ chars for the base note), return Latin
        const isEnglish = /^[A-G]$/i.test(note);

        if (isEnglish) {
            const newNote = NOTES_EN[newPos];
            // Preserve casing for English: 'C' -> 'D', 'c' -> 'd'
            return note === note.toUpperCase() ? newNote : newNote.toLowerCase();
        } else {
            const newNote = NOTES_LATIN[newPos];
            // Preserve casing for Latin: 'Do' -> 'Re', 'do' -> 're', 'DO' -> 'RE'
            if (note === note.toLowerCase()) return newNote.toLowerCase();
            if (note === note.toUpperCase()) return newNote.toUpperCase();
            // Default to TitleCase (Do, Re, Mi)
            return newNote;
        }
    });
}

export function decodeEntities(text: string) {
    if (!text) return text;
    const entities: { [key: string]: string } = {
        '&aacute;': 'á', '&eacute;': 'é', '&iacute;': 'í', '&oacute;': 'ó', '&uacute;': 'ú',
        '&Aacute;': 'Á', '&Eacute;': 'É', '&Iacute;': 'Í', '&Oacute;': 'Ó', '&Uacute;': 'Ú',
        '&ntilde;': 'ñ', '&Ntilde;': 'Ñ',
        '&iquest;': '¿', '&iexcl;': '¡',
        '&quot;': '"', '&apos;': "'", '&amp;': '&', '&lt;': '<', '&gt;': '>',
        '&deg;': '°', '&nbsp;': ' '
    };
    return text.replace(/&[a-z]+;/g, (match) => entities[match] || match);
}

export function formatLyrics(text: string) {
    if (!text) return text;

    // Helper to apply bold formatting (*bold* or **bold**)
    const applyBold = (t: string) => {
        // Handle double asterisks first **bold**
        let formatted = t.replace(/\*\*([^*]+)\*\*/g, '<span class="font-bold">$1</span>');
        // Then handle single asterisks *bold*
        formatted = formatted.replace(/\*([^*]+)\*/g, '<span class="font-bold text-primary">$1</span>');
        return formatted;
    };

    // Detect if it's JSON (starts with [ and ends with ])
    if (text.trim().startsWith('[') && text.trim().endsWith(']')) {
        try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
                return parsed.map((line: { c: string, l: string }) => {
                    const decodedChords = decodeEntities(line.c || '');
                    const decodedLyrics = decodeEntities(line.l || '');

                    if (!decodedChords.trim() && !decodedLyrics.trim()) {
                        return '<div class="interlinear-block">&nbsp;</div>'; // Empty line for vertical spacing
                    }

                    // Apply bolding to lyrics in interlinear mode
                    const formattedLyrics = applyBold(decodedLyrics);

                    return `<div class="interlinear-block">${decodedChords ? `<span class="chord-line">${decodedChords}</span>` : ''}<span class="lyric-line">${formattedLyrics || '&nbsp;'}</span></div>`;
                }).join('');
            }
        } catch (e) {
            // Not valid JSON, continue with normal formatting
        }
    }

    // First decode entities so we work with real characters
    const decoded = decodeEntities(text);

    // Unescape literal \r\n (if present due to DB migration issues)
    // Also handle standard newlines.
    // Normalize all to \n
    const normalized = decoded.replace(/\\r\\n/g, '\n').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Split into paragraphs by double newlines
    const blocks = normalized.split(/\n\s*\n/);

    const formattedBlocks = blocks.map(block => {
        if (!block.trim()) return '';

        // Apply bolding to prose blocks
        let content = applyBold(block);

        // Replace remaining single newlines with <br/>
        content = content.replace(/\n/g, '<br/>');

        // Wrap in paragraph
        return `<p class="mb-4 last:mb-0 leading-relaxed">${content}</p>`;
    });

    return formattedBlocks.join('');
}
