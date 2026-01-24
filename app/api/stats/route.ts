import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const STATS_PATH = path.join(process.cwd(), 'stats.json');
const ADMIN_PASSWORD = 'admin'; // Same as residents API for simplicity

// Data interfaces
interface DailyStats {
    [questionId: string]: {
        A: number;
        B: number;
    };
}

interface StatsData {
    [date: string]: DailyStats;
}

export async function GET() {
    try {
        try {
            await fs.access(STATS_PATH);
        } catch {
            await fs.writeFile(STATS_PATH, '{}');
        }

        const data = await fs.readFile(STATS_PATH, 'utf-8');
        const stats: StatsData = JSON.parse(data || '{}');
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Stats GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { date, password } = await request.json();

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
        }

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        try {
            await fs.access(STATS_PATH);
        } catch {
            return NextResponse.json({ message: 'No stats to clear' });
        }

        const data = await fs.readFile(STATS_PATH, 'utf-8');
        const stats: StatsData = JSON.parse(data || '{}');

        if (stats[date]) {
            delete stats[date];
            await fs.writeFile(STATS_PATH, JSON.stringify(stats, null, 2));
            return NextResponse.json({ message: `Stats for ${date} cleared` });
        } else {
            return NextResponse.json({ error: 'Date not found' }, { status: 404 });
        }

    } catch (error) {
        console.error('Stats DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to clear stats' }, { status: 500 });
    }
}
