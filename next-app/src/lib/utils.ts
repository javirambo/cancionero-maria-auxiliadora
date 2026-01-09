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
                        return '<div class="mb-4"></div>'; // Empty line
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
