import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';

const ADMIN_PASSWORD = '5226ms';

export async function GET() {
    try {
        const keys = await kv.keys('stats:*');
        const stats: any = {};

        for (const key of keys) {
            const date = key.replace('stats:', '');
            const questions = await kv.hgetall(key);

            const dailyData: any = {};
            if (questions) {
                Object.entries(questions).forEach(([field, count]) => {
                    const [qId, choice] = field.split(':');
                    if (!dailyData[qId]) dailyData[qId] = { A: 0, B: 0 };
                    dailyData[qId][choice] = parseInt(String(count), 10);
                });
            }
            stats[date] = dailyData;
        }

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

        await kv.del(`stats:${date}`);
        return NextResponse.json({ message: `Stats for ${date} cleared` });

    } catch (error) {
        console.error('Stats DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to clear stats' }, { status: 500 });
    }
}
