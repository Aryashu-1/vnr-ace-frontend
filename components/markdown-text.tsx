import React from 'react';

interface MarkdownTextProps {
    text: string;
}

export function MarkdownText({ text }: MarkdownTextProps) {
    if (!text) return null;

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentTable: string[][] = [];

    const renderLine = (content: string) => {
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    const flushTable = (key: number) => {
        if (currentTable.length === 0) return null;
        // Filter out separator lines (---)
        const filteredRows = currentTable.filter(row => !row.some(cell => cell.includes('---')));
        if (filteredRows.length === 0) return null;

        const [headers, ...rows] = filteredRows;

        return (
            <div key={`table-${key}`} className="my-4 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-xs font-inter">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map((h, i) => (
                                <th key={i} className="px-4 py-2.5 text-left font-black text-gray-500 uppercase tracking-wider border-b bg-slate-50">
                                    {h.trim()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {rows.map((row, ri) => (
                            <tr key={ri} className="hover:bg-slate-50 transition-colors">
                                {row.map((cell, ci) => (
                                    <td key={ci} className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                                        {cell.trim()}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        const isTableRow = trimmed.startsWith('|') && trimmed.endsWith('|');

        if (isTableRow) {
            const cells = trimmed.split('|').slice(1, -1);
            currentTable.push(cells);
        } else {
            if (currentTable.length > 0) {
                elements.push(flushTable(idx));
                currentTable = [];
            }

            if (trimmed === "") {
                elements.push(<div key={idx} className="h-3" />);
                return;
            }

            const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
            const content = isBullet ? trimmed.replace(/^[•\-*]\s*/, '') : line;

            if (isBullet) {
                elements.push(
                    <div key={idx} className="flex gap-2 items-start pl-1 mb-1">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                        <div className="flex-1 text-gray-700">{renderLine(content)}</div>
                    </div>
                );
            } else if (trimmed.startsWith('### ')) {
                elements.push(<h3 key={idx} className="text-sm font-black text-gray-900 mt-4 mb-2 uppercase tracking-tight">{renderLine(trimmed.slice(4))}</h3>);
            } else if (trimmed.startsWith('#### ')) {
                elements.push(<h4 key={idx} className="text-[11px] font-black text-gray-500 mt-3 mb-1 uppercase tracking-widest">{renderLine(trimmed.slice(5))}</h4>);
            } else {
                elements.push(<div key={idx} className="text-gray-700 leading-relaxed">{renderLine(line)}</div>);
            }
        }
    });

    if (currentTable.length > 0) {
        elements.push(flushTable(lines.length));
    }

    return <div className="space-y-0.5">{elements}</div>;
}
