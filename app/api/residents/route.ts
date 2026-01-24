import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';

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

const ADMIN_PASSWORD = '5226ms'; // Master password updated as requested

export async function GET() {
  try {
    // Get all resident IDs
    const residentIds = await kv.zrange('resident_ids', 0, -1);

    if (!residentIds || residentIds.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch all residents at once using pipeline for performance
    const pipeline = kv.pipeline();
    residentIds.forEach((id) => {
      pipeline.get(`resident:${id}`);
    });

    const residents: (Resident | null)[] = await pipeline.exec();

    // Filter out nulls and sanitize
    const sanitizedResidents = residents
      .filter((r): r is Resident => r !== null)
      .map(({ password, ...rest }) => rest);

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
      return NextResponse.json({ error: 'Name and Image are required' }, { status: 400 });
    }

    // Generate new ID using an incrementing counter in KV
    const newId = await kv.incr('resident_counter');

    // Room calculation: Count residents in this building
    const buildingResidentsCountKey = `building_count:${building}`;
    const buildingCount = await kv.incr(buildingResidentsCountKey);
    const roomNumber = Math.ceil(buildingCount / 4);

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
      building,
      image,
      icon: icon || '',
      password: password || '',
      createdAt: new Date().toISOString(),
    };

    // Store resident data and add ID to the sorted set
    const pipeline = kv.pipeline();
    pipeline.set(`resident:${newId}`, newResident);
    pipeline.zadd('resident_ids', { score: newId, member: String(newId) });
    await pipeline.exec();

    // --- Update Statistics ---
    const { answers } = body;
    if (answers) {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayKey = `stats:${year}-${month}-${day}`;

        const statsPipeline = kv.pipeline();
        Object.entries(answers).forEach(([qId, choice]) => {
          if (choice === 'A' || choice === 'B') {
            // Redis HINCRBY equivalent in KV
            statsPipeline.hincrby(todayKey, `${qId}:${choice}`, 1);
          }
        });
        await statsPipeline.exec();
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

    // --- Bulk Deletion ---
    if (deleteAll) {
      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Invalid admin password' }, { status: 403 });
      }

      const residentIds = await kv.zrange('resident_ids', 0, -1);
      const pipeline = kv.pipeline();
      residentIds.forEach((rid) => {
        pipeline.del(`resident:${rid}`);
      });
      pipeline.del('resident_ids');
      pipeline.del('resident_counter');
      // Also clear building counts
      ['あこがれびと', 'みまもりびと', 'となりびと', 'あゆみびと'].forEach(b => {
        pipeline.del(`building_count:${b}`);
      });

      await pipeline.exec();
      return NextResponse.json({ message: 'All residents deleted' });
    }

    // --- Individual Deletion ---
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const resident: Resident | null = await kv.get(`resident:${id}`);
    if (!resident) {
      return NextResponse.json({ error: 'Resident not found' }, { status: 404 });
    }

    // Check password ONLY if the resident HAS a password set.
    if (resident.password && resident.password !== password && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
    }

    // Delete resident data, remove from set, and decrement building count
    const pipeline = kv.pipeline();
    pipeline.del(`resident:${id}`);
    pipeline.zrem('resident_ids', String(id));
    if (resident.building) {
      pipeline.decr(`building_count:${resident.building}`);
    }
    await pipeline.exec();

    return NextResponse.json({ message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete resident' }, { status: 500 });
  }
}
