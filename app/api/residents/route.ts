import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

interface Resident {
  id: number;
  name: string; // Full name (Sei + Mei)
  firstName?: string; // Mei
  lastName?: string; // Sei
  nickname?: string; // Yobikata
  xAccount: string;
  youtubeAccount: string;
  baseLocation: string;
  roomNumber: number; // New: Automatically assigned room
  building?: 'あこがれびと' | 'みまもりびと' | 'となりびと' | 'あゆみびと'; // New: Building assignment
  image: string; // Generated document image
  icon: string;  // Original user icon
  password?: string; // Secret password for deletion
  createdAt: string;
}

const ADMIN_PASSWORD = 'admin'; // Master password for developer cleanup

export async function GET() {
  try {
    // Ensure db.json exists, if not create it
    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(DB_PATH, '[]');
    }

    const data = await fs.readFile(DB_PATH, 'utf-8');
    const residents: Resident[] = JSON.parse(data || '[]');
    // Secure passwords by not sending them to the client
    const sanitizedResidents = residents.map(({ password, ...rest }) => rest);
    return NextResponse.json(sanitizedResidents);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, firstName, lastName, nickname,
      xAccount, youtubeAccount, baseLocation, image, icon, password, building
    } = body;

    // Validate input: Require either name, or both firstName and lastName
    const hasName = name || (firstName && lastName);

    if (!hasName || !image) {
      return NextResponse.json({ error: 'Name (or First/Last Name) and Image are required' }, { status: 400 });
    }

    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(DB_PATH, '[]');
    }

    const data = await fs.readFile(DB_PATH, 'utf-8');
    const residents: Resident[] = JSON.parse(data || '[]');

    const newId = residents.length > 0 ? residents[residents.length - 1].id + 1 : 1;

    // Room calculation Logic: 4 people per room PER BUILDING
    // Filter residents by the same building (handle undefined for legacy)
    const buildingResidents = residents.filter(r => r.building === building);

    // 1-4: Room 1, 5-8: Room 2, ...
    const roomNumber = Math.ceil((buildingResidents.length + 1) / 4);

    const newResident: Resident = {
      id: newId,
      name: name || `${lastName} ${firstName}`,
      firstName: firstName || '',
      lastName: lastName || '',
      nickname: nickname || '',
      xAccount: xAccount || '',
      youtubeAccount: youtubeAccount || '',
      baseLocation: baseLocation || '',
      roomNumber,
      building, // Save the assigned building
      image, // Base64 string (Document)
      icon: icon || '', // Base64 string (Original icon)
      password: password || '', // Store password
      createdAt: new Date().toISOString(),
    };

    // ... (previous logic)

    residents.push(newResident);
    await fs.writeFile(DB_PATH, JSON.stringify(residents, null, 2));

    // --- Update Statistics ---
    const { answers } = body;
    if (answers) {
      try {
        const STATS_PATH = path.join(process.cwd(), 'stats.json');

        try {
          await fs.access(STATS_PATH);
        } catch {
          await fs.writeFile(STATS_PATH, '{}');
        }

        const statsData = await fs.readFile(STATS_PATH, 'utf-8');
        const stats = JSON.parse(statsData || '{}');

        // Get safe YYYY-MM-DD for local time
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayKey = `${year}-${month}-${day}`;

        if (!stats[todayKey]) stats[todayKey] = {};

        // Update counts
        // answers is expected to be { "1": "A", "2": "B", ... }
        Object.entries(answers).forEach(([qId, choice]) => {
          const key = String(qId);
          if (!stats[todayKey][key]) {
            stats[todayKey][key] = { A: 0, B: 0 };
          }
          if (choice === 'A' || choice === 'B') {
            stats[todayKey][key][choice as 'A' | 'B']++;
          }
        });

        await fs.writeFile(STATS_PATH, JSON.stringify(stats, null, 2));

      } catch (statsErr) {
        console.error('Failed to update stats:', statsErr);
        // Do not fail the registration request even if stats fail
      }
    }

    return NextResponse.json(newResident);
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id, password, deleteAll } = body;

    // --- Bulk Deletion (Admin Only) ---
    if (deleteAll) {
      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Invalid admin password' }, { status: 403 });
      }

      await fs.writeFile(DB_PATH, '[]');
      return NextResponse.json({ message: 'All residents deleted' });
    }

    // --- Individual Deletion ---
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
      await fs.access(DB_PATH);
    } catch {
      return NextResponse.json({ error: 'Database not found' }, { status: 404 });
    }

    const data = await fs.readFile(DB_PATH, 'utf-8');
    let residents: Resident[] = JSON.parse(data || '[]');

    const residentIndex = residents.findIndex(r => r.id === id);
    if (residentIndex === -1) {
      return NextResponse.json({ error: 'Resident not found' }, { status: 404 });
    }

    const resident = residents[residentIndex];

    // Check password ONLY if the resident HAS a password set.
    // Legacy users (empty password) can be deleted by anyone (or just by clicking delete).
    // This fixes the issue where legacy users couldn't be deleted because they had no password to match.
    if (resident.password && resident.password !== password && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
    }

    // Delete resident
    residents = residents.filter(r => r.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(residents, null, 2));

    return NextResponse.json({ message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete resident' }, { status: 500 });
  }
}
