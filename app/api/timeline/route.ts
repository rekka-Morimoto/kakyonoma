import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface TimelineEvent {
    importance: number;
    date: string;
    title: string;
}

export async function GET() {
    const filePath = path.join(process.cwd(), 'data', 'timeline.txt');

    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n').map(line => line.trim());

        const events: TimelineEvent[] = [];
        
        for (const line of lines) {
            if (!line) continue;

            // 星（☆ or ★）の数を取得して重要度とする
            const starMatch = line.match(/^[☆★]+/);
            const importance = starMatch ? starMatch[0].length : 1;

            // 星マークと直後のスペースを削除
            const cleanLine = line.replace(/^[☆★]+\s*/, '').trim();

            // 日付 (YYYY.MM.DD) を抽出
            const dateMatch = cleanLine.match(/^(\d{4}\.\d{2}\.\d{2})/);
            const date = dateMatch ? dateMatch[1] : '';

            // 残りをタイトルとする
            const title = dateMatch ? cleanLine.substring(dateMatch[0].length).trim() : cleanLine;

            events.push({
                importance,
                date,
                title
            });
        }

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Error reading timeline file:', error);
        return NextResponse.json({ error: 'Failed to read timeline data.' }, { status: 500 });
    }
}
