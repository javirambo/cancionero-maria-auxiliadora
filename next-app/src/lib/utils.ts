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

    // First decode entities so we work with real characters
    let decoded = decodeEntities(text);

    // Unescape literal \r\n (if present due to DB migration issues)
    // Also handle standard newlines.
    // Normalize all to \n
    let normalized = decoded.replace(/\\r\\n/g, '\n').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Split into paragraphs by double newlines
    const blocks = normalized.split(/\n\s*\n/);

    const formattedBlocks = blocks.map(block => {
        if (!block.trim()) return '';

        // Replace *text* with styled span
        // Allow multiple lines inside bold block
        let content = block.replace(/\*([^*]+)\*/g, '<span class="font-bold text-primary">$1</span>');

        // Replace remaining single newlines with <br/>
        content = content.replace(/\n/g, '<br/>');

        // Wrap in paragraph
        return `<p class="mb-4 last:mb-0 leading-relaxed">${content}</p>`;
    });

    return formattedBlocks.join('');
}
