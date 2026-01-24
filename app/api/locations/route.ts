import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const LOCATIONS_PATH = path.join(process.cwd(), 'locations.json');

export async function GET() {
    try {
        try {
            await fs.access(LOCATIONS_PATH);
        } catch {
            // Create with default if missing
            await fs.writeFile(LOCATIONS_PATH, JSON.stringify(["東京", "神奈川", "大阪", "その他"], null, 2));
        }

        const data = await fs.readFile(LOCATIONS_PATH, 'utf-8');
        const locations = JSON.parse(data || '[]');
        return NextResponse.json(locations);
    } catch (error) {
        console.error('Locations Error:', error);
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }
}
