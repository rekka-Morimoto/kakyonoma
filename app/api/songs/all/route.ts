import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export interface SelectableSong {
    id: string;
    title: string;
    category: 'original' | 'cover' | 'stream';
    categoryLabel: string;
    alias?: string;
    streamTitle?: string;
    url?: string;
}

export async function GET() {
    try {
        const originalSongPath = path.join(process.cwd(), 'data', 'songs_original.txt');
        const coverSongPath = path.join(process.cwd(), 'data', 'songs_cover.txt');
        const songListPath = path.join(process.cwd(), 'data', 'song_list.txt');

        const allSongs: SelectableSong[] = [];
        let songCounter = 1;

        // 1. オリジナル曲の読み込み
        try {
            const originalContent = await fs.readFile(originalSongPath, 'utf-8');
            const lines = originalContent.split('\n').map(l => l.trim());
            let currentAlias = '佳鏡院';

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!line) continue;

                const aliasMatch = line.match(/^<([^>]+)>$/);
                if (aliasMatch) {
                    currentAlias = aliasMatch[1].trim();
                    continue;
                }

                const isTitle = /^\d+\./.test(line) || (!line.startsWith('http://') && !line.startsWith('https://'));
                if (isTitle) {
                    const title = line.replace(/^\d+\.\s*/, '');
                    let url = '';

                    let nextIdx = i + 1;
                    while (nextIdx < lines.length && !lines[nextIdx]) {
                        nextIdx++;
                    }

                    if (nextIdx < lines.length && (lines[nextIdx].startsWith('http://') || lines[nextIdx].startsWith('https://'))) {
                        url = lines[nextIdx];
                        i = nextIdx;
                    }

                    allSongs.push({
                        id: `orig-${songCounter++}`,
                        title,
                        category: 'original',
                        categoryLabel: 'オリジナル曲',
                        alias: currentAlias,
                        url: url || undefined
                    });
                }
            }
        } catch (e) {
            console.error('Error reading songs_original.txt:', e);
        }

        // 2. カバー曲の読み込み
        try {
            const coverContent = await fs.readFile(coverSongPath, 'utf-8');
            const lines = coverContent.split('\n').map(l => l.trim());

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!line) continue;

                const isTitle = /^\d+\./.test(line) || (!line.startsWith('http://') && !line.startsWith('https://'));
                if (isTitle) {
                    const title = line.replace(/^\d+\.\s*/, '');
                    let url = '';

                    let nextIdx = i + 1;
                    while (nextIdx < lines.length && !lines[nextIdx]) {
                        nextIdx++;
                    }

                    if (nextIdx < lines.length && (lines[nextIdx].startsWith('http://') || lines[nextIdx].startsWith('https://'))) {
                        url = lines[nextIdx];
                        i = nextIdx;
                    }

                    allSongs.push({
                        id: `cover-${songCounter++}`,
                        title,
                        category: 'cover',
                        categoryLabel: 'カバー曲',
                        url: url || undefined
                    });
                }
            }
        } catch (e) {
            console.error('Error reading songs_cover.txt:', e);
        }

        // 3. 歌枠セトリの読み込み
        try {
            const songListContent = await fs.readFile(songListPath, 'utf-8');
            const lines = songListContent.split('\n').map(l => l.trim());
            let currentStreamTitle = '';
            let currentStreamLink = '';

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!line) continue;

                if (line.startsWith('■')) {
                    currentStreamTitle = line.replace(/^■\s*/, '').trim();
                    currentStreamLink = '';
                    continue;
                }

                if (line.startsWith('- 配信リンク:')) {
                    currentStreamLink = line.replace(/-\s*配信リンク:\s*/, '').trim();
                    continue;
                }

                const songMatch = line.match(/^\d+[\.\/]\s*(.+)/);
                if (songMatch) {
                    const title = songMatch[1].trim();
                    let songUrl = currentStreamLink;

                    // 次の行に - URL: があるか確認
                    if (lines[i + 1] && lines[i + 1].includes('URL:')) {
                        const urlMatch = lines[i + 1].match(/URL:\s*(https?:\/\/[^\s]+)/i);
                        if (urlMatch) {
                            songUrl = urlMatch[1];
                            i++;
                        }
                    }

                    allSongs.push({
                        id: `stream-${songCounter++}`,
                        title,
                        category: 'stream',
                        categoryLabel: '歌枠セトリ',
                        streamTitle: currentStreamTitle,
                        url: songUrl || undefined
                    });
                }
            }
        } catch (e) {
            console.error('Error reading song_list.txt:', e);
        }

        return NextResponse.json({
            songs: allSongs,
            total: allSongs.length
        });
    } catch (err: any) {
        console.error('API Error /api/songs/all:', err);
        return NextResponse.json({ error: 'Failed to load songs' }, { status: 500 });
    }
}
