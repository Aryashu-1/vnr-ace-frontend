import React from 'react';

interface MarkdownTextProps {
    text: string;
}

export function MarkdownText({ text }: MarkdownTextProps) {
    if (!text) return null;

    // Handle bold: **text**
    // Handle bullet points: • or - or * at start of line
    // Handle newlines: \n
    
    const lines = text.split('\n');
    
    return (
        <div className="space-y-1">
            {lines.map((line, lineIdx) => {
                // Check if line is a bullet point
                const isBullet = line.trim().startsWith('•') || line.trim().startsWith('- ') || line.trim().startsWith('* ');
                const cleanLine = isBullet ? line.trim().substring(1).trim() : line;

                const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
                
                const renderedLine = (
                    <span key={lineIdx}>
                        {parts.map((part, partIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                    <strong key={partIdx} className="font-bold text-gray-900 dark:text-gray-100">
                                        {part.slice(2, -2)}
                                    </strong>
                                );
                            }
                            return <span key={partIdx}>{part}</span>;
                        })}
                    </span>
                );

                if (isBullet) {
                    return (
                        <div key={lineIdx} className="flex gap-2 items-start pl-1">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                            <div className="flex-1">{renderedLine}</div>
                        </div>
                    );
                }

                return (
                    <div key={lineIdx} className={line.trim() === "" ? "h-2" : ""}>
                        {renderedLine}
                    </div>
                );
            })}
        </div>
    );
}
