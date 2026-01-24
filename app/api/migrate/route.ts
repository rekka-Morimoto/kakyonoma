import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { put } from '@vercel/blob';

const ADMIN_PASSWORD = '5226ms';

function base64ToBuffer(base64: string) {
    const base64Data = base64.split(',')[1] || base64;
    return Buffer.from(base64Data, 'base64');
}

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const residentIds = await kv.zrange('resident_ids', 0, -1);
        let migratedCount = 0;

        for (const id of residentIds) {
            const resData = await kv.get(`resident:${id}`);
            if (!resData) continue;

            const res: any = typeof resData === 'string' ? JSON.parse(resData) : resData;
            let updated = false;

            // Image migration
            if (res.image?.startsWith('data:')) {
                const blob = await put(`residents/migrated_todoke_${res.id}.png`, base64ToBuffer(res.image), {
                    access: 'public',
                    contentType: 'image/png'
                });
                res.image = blob.url;
                updated = true;
            }

            // Icon migration
            if (res.icon?.startsWith('data:')) {
                const blob = await put(`residents/migrated_icon_${res.id}.png`, base64ToBuffer(res.icon), {
                    access: 'public',
                    contentType: 'image/png'
                });
                res.icon = blob.url;
                updated = true;
            }

            if (updated) {
                await kv.set(`resident:${id}`, JSON.stringify(res));
                migratedCount++;
            }
        }

        return NextResponse.json({
            message: `Successfully migrated ${migratedCount} residents to Blob storage.`,
            status: 'success'
        });
    } catch (error) {
        console.error('Migration Error:', error);
        return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
    }
}
