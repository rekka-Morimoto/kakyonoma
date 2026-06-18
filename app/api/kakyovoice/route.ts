import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface VoiceItem {
    title: string;
    url: string;
}

interface VoiceSection {
    category: string;
    items: VoiceItem[];
}

export async function GET() {
    const filePath = path.join(process.cwd(), 'data', 'kakyovoice.txt');

    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        const sections: VoiceSection[] = [];
        let currentCategory = "まいにちかきょボイス";
        let currentItems: VoiceItem[] = [];

        const isUrl = (str: string) => str.startsWith('http://') || str.startsWith('https://');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // セクションヘッダー判定:
            // 行が '#' で始まる、または
            // URLではなく、かつ次の行もURLではない場合（ただし次の行が存在する場合）
            const isHeader = line.startsWith('#') || 
                (!isUrl(line) && lines[i + 1] && !isUrl(lines[i + 1]));

            if (isHeader) {
                if (currentItems.length > 0) {
                    sections.push({
                        category: currentCategory,
                        items: currentItems
                    });
                    currentItems = [];
                }
                currentCategory = line.replace(/^#\s*/, '');
            } else if (!isUrl(line) && lines[i + 1] && isUrl(lines[i + 1])) {
                currentItems.push({
                    title: line,
                    url: lines[i + 1]
                });
                i++; // URLの行を消費
            }
        }

        if (currentItems.length > 0) {
            sections.push({
                category: currentCategory,
                items: currentItems
            });
        }

        // 念のため、空のセクションは除外
        const filteredSections = sections.filter(s => s.items.length > 0);

        return NextResponse.json({ sections: filteredSections });
    } catch (error) {
        console.error('Error reading kakyovoice file:', error);
        return NextResponse.json({ error: 'Failed to read voice list.' }, { status: 500 });
    }
}

