'use client';

import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Line {
    id: string; // Unique ID for dnd-kit
    c: string; // Chords
    l: string; // Lyrics
}

interface ChordLyricEditorProps {
    initialValue?: string;
    name: string;
}

function SortableItem({
    id,
    line,
    index,
    updateLine,
    removeLine,
    moveLine,
    isFirst,
    isLast
}: {
    id: string;
    line: Line;
    index: number;
    updateLine: (index: number, field: keyof Line, value: string) => void;
    removeLine: (index: number) => void;
    moveLine: (index: number, direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex gap-3 items-start border-b border-slate-100 pb-4 last:border-0 group bg-card transition-shadow ${isDragging ? 'shadow-2xl rounded-xl border-transparent' : ''}`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="mt-2 p-2 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 rounded-lg hover:bg-slate-50 transition-colors"
                title="Arrastrar para reordenar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg>
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <input
                    type="text"
                    value={line.c}
                    placeholder="Acordes (usa espacios para alinear)"
                    onChange={(e) => updateLine(index, 'c', e.target.value)}
                    className="input monospace-input text-blue-600 font-bold !py-1 !px-2 !h-auto border-dashed border-blue-200 w-full"
                />
                <input
                    type="text"
                    value={line.l}
                    placeholder="Letra"
                    onChange={(e) => updateLine(index, 'l', e.target.value)}
                    className="input monospace-input !py-1 !px-2 !h-auto w-full"
                />
            </div>

            <div className="line-controls">
                <button
                    type="button"
                    onClick={() => moveLine(index, 'up')}
                    className={`hover:bg-slate-100 rounded ${isFirst ? 'opacity-30 cursor-not-allowed' : ''}`}
                    disabled={isFirst}
                    title="Subir"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                </button>
                <button
                    type="button"
                    onClick={() => moveLine(index, 'down')}
                    className={`hover:bg-slate-100 rounded ${isLast ? 'opacity-30 cursor-not-allowed' : ''}`}
                    disabled={isLast}
                    title="Bajar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </button>
                <button
                    type="button"
                    onClick={() => removeLine(index)}
                    className="hover:bg-red-50 text-red-500 rounded"
                    title="Eliminar línea"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                </button>
            </div>
        </div>
    );
}

export default function ChordLyricEditor({ initialValue, name }: ChordLyricEditorProps) {
    const [lines, setLines] = useState<Line[]>(() => {
        if (initialValue) {
            try {
                const parsed = JSON.parse(initialValue);
                if (Array.isArray(parsed)) {
                    // Ensure each line has a unique ID
                    return parsed.map((l: any, i: number) => ({
                        ...l,
                        id: l.id || `line-${i}-${Date.now()}`
                    }));
                }
            } catch (e) {
                return [{ id: 'line-0', c: '', l: initialValue }];
            }
        }
        return [{ id: 'line-0', c: '', l: '' }];
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Allow some movement before drag starts (useful for touch)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = lines.findIndex((l) => l.id === active.id);
            const newIndex = lines.findIndex((l) => l.id === over.id);
            setLines(arrayMove(lines, oldIndex, newIndex));
        }
    };

    const addLine = () => setLines([...lines, { id: `line-${lines.length}-${Date.now()}`, c: '', l: '' }]);

    const removeLine = (index: number) => {
        if (lines.length === 1) {
            setLines([{ id: `line-0-${Date.now()}`, c: '', l: '' }]);
            return;
        }
        setLines(lines.filter((_, i) => i !== index));
    };

    const updateLine = (index: number, field: keyof Line, value: string) => {
        const newLines = [...lines];
        newLines[index] = { ...newLines[index], [field]: value };
        setLines(newLines);
    };

    const moveLine = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === lines.length - 1) return;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        setLines(arrayMove(lines, index, targetIndex));
    };

    return (
        <div className="flex flex-col gap-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={lines.map(l => l.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-6">
                        {lines.map((line, index) => (
                            <SortableItem
                                key={line.id}
                                id={line.id}
                                line={line}
                                index={index}
                                updateLine={updateLine}
                                removeLine={removeLine}
                                moveLine={moveLine}
                                isFirst={index === 0}
                                isLast={index === lines.length - 1}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <button
                type="button"
                onClick={addLine}
                className="btn btn-gray w-full flex items-center justify-center gap-2 mt-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                Agregar línea
            </button>

            {/* Hidden input to store JSON for form submission without ID to keep DB clean if needed */}
            {/* But actually keeping ID is fine for frontend stability */}
            <input type="hidden" name={name} value={JSON.stringify(lines.map(({ id, ...rest }) => rest))} />
        </div>
    );
}
