import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'any';

    try {
        let links: string[] = [];

        if (type === 'stream') {
            const filePath = path.join(process.cwd(), 'data', 'song_list.txt');
            const content = await fs.readFile(filePath, 'utf-8');
            const lines = content.split('\n');

            for (let line of lines) {
                line = line.trim();
                if (line.startsWith('- URL:')) {
                    const url = line.replace(/^- URL:\s*/, '').trim();
                    if (url) links.push(url);
                } else if (line.startsWith('- 配信リンク:')) {
                    const url = line.replace(/^- 配信リンク:\s*/, '').trim();
                    if (url) links.push(url);
                }
            }
        } else {
            const fileName = `songs_${type}.txt`;
            const filePath = path.join(process.cwd(), 'data', fileName);
            const content = await fs.readFile(filePath, 'utf-8');
            links = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        }

        if (links.length === 0) {
            return NextResponse.json({ error: 'No songs found in the list.' }, { status: 404 });
        }

        const randomLink = links[Math.floor(Math.random() * links.length)];
        return NextResponse.json({ url: randomLink });
    } catch (error) {
        console.error('Error reading song file:', error);
        return NextResponse.json({ error: 'Failed to read song list.' }, { status: 500 });
    }
}
