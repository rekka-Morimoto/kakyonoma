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
                const urlMatch = line.match(/^-\s*URL\s*:\s*(.*)$/i);
                const streamLinkMatch = line.match(/^-\s*配信リンク\s*:\s*(.*)$/);

                if (urlMatch) {
                    const url = urlMatch[1].trim();
                    if (url && (url.startsWith('http://') || url.startsWith('https://'))) links.push(url);
                } else if (streamLinkMatch) {
                    const url = streamLinkMatch[1].trim();
                    if (url && (url.startsWith('http://') || url.startsWith('https://'))) links.push(url);
                }
            }
        } else if (type === 'any') {
            // 'any' の場合は original, cover, any, stream の全リストからURLを収集
            const files = ['songs_original.txt', 'songs_cover.txt', 'songs_any.txt'];
            for (const file of files) {
                try {
                    const filePath = path.join(process.cwd(), 'data', file);
                    const content = await fs.readFile(filePath, 'utf-8');
                    const fileUrls = content
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.startsWith('http://') || line.startsWith('https://'));
                    links.push(...fileUrls);
                } catch (e) {
                    // ファイルが存在しない場合は無視
                }
            }
        } else {
            const fileName = `songs_${type}.txt`;
            const filePath = path.join(process.cwd(), 'data', fileName);
            const content = await fs.readFile(filePath, 'utf-8');
            links = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.startsWith('http://') || line.startsWith('https://'));
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
