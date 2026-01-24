import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const ADMIN_PASSWORD = 'admin';

export async function GET() {
    try {
        // Find all keys that match stats:*
        const keys = await kv.keys('stats:*');

        const stats: any = {};

        for (const key of keys) {
            const date = key.replace('stats:', '');
            const questions = await kv.hgetall(key);

            // Reconstruct the nested structure { [questionId]: { A: n, B: n } }
            const dailyData: any = {};
            if (questions) {
                Object.entries(questions).forEach(([field, count]) => {
                    const [qId, choice] = field.split(':');
                    if (!dailyData[qId]) dailyData[qId] = { A: 0, B: 0 };
                    dailyData[qId][choice] = count;
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


