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

        const hasUrl = (str: string) => /https?:\/\//.test(str);
        const isUrlOnly = (str: string) => str.startsWith('http://') || str.startsWith('https://');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // セクションヘッダー判定:
            // 行が '#' で始まる、または
            // URLを含まず、かつ次の行もURLを含まない場合
            const isHeader = line.startsWith('#') || 
                (!hasUrl(line) && lines[i + 1] && !hasUrl(lines[i + 1]));

            if (isHeader) {
                if (currentItems.length > 0) {
                    sections.push({
                        category: currentCategory,
                        items: currentItems
                    });
                    currentItems = [];
                }
                currentCategory = line.replace(/^#\s*/, '');
            } else {
                // 1行にタイトルとURLがまとまっている場合（例：おやすみかきょボイス）
                const urlMatch = line.match(/(https?:\/\/\S+)/);
                if (urlMatch) {
                    const url = urlMatch[0];
                    const title = line.replace(url, '').trim();
                    currentItems.push({
                        title: title || "無題",
                        url: url
                    });
                }
                // 2行構成の場合（例：まいにちかきょボイス）
                else if (!isUrlOnly(line) && lines[i + 1] && isUrlOnly(lines[i + 1])) {
                    currentItems.push({
                        title: line,
                        url: lines[i + 1]
                    });
                    i++; // URLの行を消費
                }
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

