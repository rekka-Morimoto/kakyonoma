import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    const filePath = path.join(process.cwd(), 'data', 'kakyovoice.txt');

    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        const voices = [];
        for (let i = 0; i < lines.length; i += 2) {
            if (lines[i] && lines[i+1]) {
                voices.push({
                    title: lines[i],
                    url: lines[i+1]
                });
            }
        }

        return NextResponse.json({ voices });
    } catch (error) {
        console.error('Error reading kakyovoice file:', error);
        return NextResponse.json({ error: 'Failed to read voice list.' }, { status: 500 });
    }
}
