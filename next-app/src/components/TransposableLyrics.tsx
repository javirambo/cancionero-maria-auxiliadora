'use client';

import React from 'react';
import { useTranspose } from '@/components/TransposeContext';
import { transposeChord, decodeEntities } from '@/lib/utils';

interface Line {
    c: string;
    l: string;
}

interface TransposableLyricsProps {
    lyricsJson: string;
}

export default function TransposableLyrics({ lyricsJson }: TransposableLyricsProps) {
    const { semitones } = useTranspose();
    let lines: Line[] = [];
    try {
        lines = JSON.parse(lyricsJson);
    } catch (e) {
        // Fallback for non-json lyrics (plain text)
        const rawLines = (lyricsJson || '').split('\n');
        return (
            <div className="flex flex-col gap-0 text-lg leading-relaxed whitespace-pre-wrap">
                {semitones !== 0 && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-accent-red/10 border border-accent-red/20 rounded-lg self-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-red">
                            Transportado: {semitones > 0 ? `+${semitones}` : semitones} semitonos (Modo Texto)
                        </span>
                    </div>
                )}
                {rawLines.map((line: string, idx: number) => {
                    const transposeLine = (txt: string) =>
                        txt.replace(/(?:Do|Re|Mi|Fa|Sol|La|Si|[A-G][#b]?)/gi, (match) => transposeChord(match, semitones));
                    const transposedLine = transposeLine(decodeEntities(line));
                    return <div key={idx} dangerouslySetInnerHTML={{ __html: transposedLine || '&nbsp;' }} />;
                })}
            </div>
        );
    }

    if (!Array.isArray(lines)) return null;

    return (
        <div className="flex flex-col gap-0">
            {semitones !== 0 && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-accent-red/10 border border-accent-red/20 rounded-lg self-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent-red">
                        Transportado: {semitones > 0 ? `+${semitones}` : semitones} semitonos
                    </span>
                </div>
            )}

            <div className="text-lg leading-relaxed overflow-x-auto">
                {lines.map((line: Line, idx: number) => {
                    const transposedChords = transposeChord(decodeEntities(line.c || ''), semitones);
                    const hasChords = !!transposedChords.trim();
                    const hasLyrics = !!(line.l || '').trim();

                    if (!hasChords && !hasLyrics) {
                        return <div key={idx} className="interlinear-block">&nbsp;</div>;
                    }

                    // Apply basic bold formatting support (*text*)
                    const formatLineText = (text: string) => {
                        const decodedText = decodeEntities(text || '');
                        if (!decodedText) return '';
                        return decodedText
                            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*([^*]+)\*/g, '<span class="text-primary font-bold">$1</span>');
                    };

                    return (
                        <div key={idx} className="interlinear-block">
                            {hasChords && (
                                <span className="chord-line">{transposedChords}</span>
                            )}
                            <span
                                className="lyric-line"
                                dangerouslySetInnerHTML={{ __html: formatLineText(line.l) || '&nbsp;' }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
