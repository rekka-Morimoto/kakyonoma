import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');
const ADMIN_PASSWORD = 'admin';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const body = await request.json();
        const { password, adminPassword } = body;
        const id = parseInt(idParam);

        const data = await fs.readFile(DB_PATH, 'utf-8');
        const residents = JSON.parse(data || '[]');

        const index = residents.findIndex((r: any) => r.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Resident not found' }, { status: 404 });
        }

        const resident = residents[index];

        // Check password (individual or admin)
        if (adminPassword === ADMIN_PASSWORD || (password && resident.password === password)) {
            residents.splice(index, 1);
            await fs.writeFile(DB_PATH, JSON.stringify(residents, null, 2));
            return NextResponse.json({ message: 'Deleted successfully' });
        } else {
            return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
        }
    } catch (error) {
        console.error('Delete Error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
