import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'any';

    const fileName = `songs_${type}.txt`;
    const filePath = path.join(process.cwd(), 'data', fileName);

    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const links = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

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
