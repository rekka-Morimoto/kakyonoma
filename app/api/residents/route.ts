import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { put, del as blobDel } from '@vercel/blob';

interface Resident {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  xAccount: string;
  youtubeAccount: string;
  baseLocation: string;
  roomNumber: number;
  building?: 'あこがれびと' | 'みまもりびと' | 'となりびと' | 'あゆみびと';
  image: string; // URL または Base64
  icon: string;  // URL または Base64
  password?: string;
  createdAt: string;
}

const ADMIN_PASSWORD = '5226ms';

// Helper to convert base64 to Buffer
function base64ToBuffer(base64: string) {
  const base64Data = base64.split(',')[1] || base64;
  return Buffer.from(base64Data, 'base64');
}

export async function GET() {
  try {
    const residentIds = await kv.zrange('resident_ids', 0, -1);

    if (!residentIds || residentIds.length === 0) {
      return NextResponse.json([]);
    }

    const pipeline = kv.pipeline();
    residentIds.forEach((id) => {
      pipeline.get(`resident:${id}`);
    });

    const results = await pipeline.exec();
    if (!results) return NextResponse.json([]);

    const residents: Resident[] = results
      .map(([err, res]) => {
        if (err || !res) return null;
        try {
          return typeof res === 'string' ? JSON.parse(res) : res;
        } catch {
          return null;
        }
      })
      .filter((r): r is Resident => r !== null);

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

    const hasName = name || (firstName && lastName);
    if (!hasName || !image) {
      return NextResponse.json({ error: 'Name and Image are required' }, { status: 400 });
    }

    // --- Upload images to Vercel Blob ---
    let imageUrl = image;
    let iconUrl = icon;

    try {
      if (image.startsWith('data:')) {
        const imageBuffer = base64ToBuffer(image);
        const fileName = `todoke_${Date.now()}.png`;
        const blob = await put(`residents/${fileName}`, imageBuffer, {
          access: 'public',
          contentType: 'image/png',
        });
        imageUrl = blob.url;
      }

      if (icon?.startsWith('data:')) {
        const iconBuffer = base64ToBuffer(icon);
        const fileName = `icon_${Date.now()}.png`;
        const blob = await put(`residents/${fileName}`, iconBuffer, {
          access: 'public',
          contentType: 'image/png',
        });
        iconUrl = blob.url;
      }
    } catch (blobErr) {
      console.error('Vercel Blob Upload Error:', blobErr);
      // Fallback to Redis if Blob fails (though we want to avoid this ideally)
      // return NextResponse.json({ error: 'Storage Error' }, { status: 500 });
    }

    const newId = await kv.incr('resident_counter');
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
      image: imageUrl,
      icon: iconUrl,
      password: password || '',
      createdAt: new Date().toISOString(),
    };

    const pipeline = kv.pipeline();
    pipeline.set(`resident:${newId}`, JSON.stringify(newResident));
    pipeline.zadd('resident_ids', newId, String(newId));
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
            statsPipeline.hincrby(todayKey, `${qId}:${choice}`, 1);
          }
        });
        await statsPipeline.exec();
      } catch (statsErr) {
        console.error('Failed to update stats:', statsErr);
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

    if (deleteAll) {
      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Invalid admin password' }, { status: 403 });
      }

      const residentIds = await kv.zrange('resident_ids', 0, -1);
      const pipeline = kv.pipeline();

      for (const rid of residentIds) {
        const resData = await kv.get(`resident:${rid}`);
        if (resData) {
          const res: Resident = typeof resData === 'string' ? JSON.parse(resData) : resData;
          // Blob削除
          if (res.image?.includes('public.blob.vercel-storage.com')) {
            try { await blobDel(res.image); } catch (e) { }
          }
          if (res.icon?.includes('public.blob.vercel-storage.com')) {
            try { await blobDel(res.icon); } catch (e) { }
          }
        }
        pipeline.del(`resident:${rid}`);
      }

      pipeline.del('resident_ids');
      pipeline.del('resident_counter');
      ['あこがれびと', 'みまもりびと', 'となりびと', 'あゆみびと'].forEach(b => {
        pipeline.del(`building_count:${b}`);
      });

      await pipeline.exec();
      return NextResponse.json({ message: 'All residents deleted' });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const resData = await kv.get(`resident:${id}`);
    if (!resData) {
      return NextResponse.json({ error: 'Resident not found' }, { status: 404 });
    }
    const resident: Resident = typeof resData === 'string' ? JSON.parse(resData) : resData;

    if (resident.password && resident.password !== password && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
    }

    // Blob削除
    if (resident.image?.includes('public.blob.vercel-storage.com')) {
      try { await blobDel(resident.image); } catch (e) { }
    }
    if (resident.icon?.includes('public.blob.vercel-storage.com')) {
      try { await blobDel(resident.icon); } catch (e) { }
    }

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

