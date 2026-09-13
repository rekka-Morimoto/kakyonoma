import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export interface SongSubItem {
    title: string;
    url?: string;
}

export interface VoiceItem {
    title: string;
    date?: string;
    subtitle?: string;
    url: string;
    thumbnailUrl?: string;
    songs?: SongSubItem[];
}

export interface VoiceSection {
    category: string;
    items: VoiceItem[];
}

export async function GET() {
    const kakyovoicePath = path.join(process.cwd(), 'data', 'kakyovoice.txt');
    const kyoStoryPath = path.join(process.cwd(), 'data', '#きょーのお話.txt');
    const songListPath = path.join(process.cwd(), 'data', 'song_list.txt');
    const originalSongPath = path.join(process.cwd(), 'data', 'songs_original.txt');
    const coverSongPath = path.join(process.cwd(), 'data', 'songs_cover.txt');
    const vlogPath = path.join(process.cwd(), 'data', 'vlog.txt');

    const parseItemTitle = (rawTitle: string): { title: string; date?: string; subtitle?: string } => {
        const bracketMatch = rawTitle.match(/(【[^】]+】)/);
        if (bracketMatch) {
            const subtitle = bracketMatch[1];
            const datePart = rawTitle.replace(subtitle, '').trim().replace(/^☆\s*/, '');
            return {
                title: rawTitle,
                date: datePart || rawTitle,
                subtitle: subtitle
            };
        }
        return { 
            title: rawTitle, 
            date: rawTitle.replace(/^☆\s*/, ''), 
            subtitle: rawTitle 
        };
    };

    const getYouTubeThumbnail = (url: string): string | undefined => {
        const match = url.match(/(?:v=|\/embed\/|\/watch\?v=|\/v\/|https?:\/\/youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (match && match[1]) {
            return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
        }
        return undefined;
    };

    const parseSongFile = async (filePath: string): Promise<VoiceItem[]> => {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const lines = content.split('\n').map(l => l.trim());
            const items: VoiceItem[] = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!line) continue;

                const isTitleLine = /^\d+\./.test(line) || (!line.startsWith('http://') && !line.startsWith('https://'));
                if (isTitleLine) {
                    const title = line.replace(/^\d+\.\s*/, '');
                    let url = '';
                    if (lines[i + 1] && (lines[i + 1].startsWith('http://') || lines[i + 1].startsWith('https://'))) {
                        url = lines[i + 1];
                        i++;
                    }

                    const thumbnailUrl = url ? getYouTubeThumbnail(url) : undefined;
                    const parsed = parseItemTitle(title);
                    items.push({
                        title: title,
                        date: parsed.date,
                        subtitle: parsed.subtitle,
                        url: url,
                        thumbnailUrl: thumbnailUrl
                    });
                }
            }
            return items;
        } catch (e) {
            console.error(`Error reading ${filePath}:`, e);
            return [];
        }
    };

    try {
        const sections: VoiceSection[] = [];

        // 1. kakyovoice.txt の読み込み
        try {
            const content = await fs.readFile(kakyovoicePath, 'utf-8');
            const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

            let currentCategory = "まいにちかきょボイス";
            let currentItems: VoiceItem[] = [];

            const hasUrl = (str: string) => /https?:\/\//.test(str);
            const isUrlOnly = (str: string) => str.startsWith('http://') || str.startsWith('https://');

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                const isHeader = line.startsWith('#') || 
                    (!hasUrl(line) && lines[i + 1] && !hasUrl(lines[i + 1]));

                if (isHeader) {
                    if (currentItems.length > 0) {
                        sections.push({
                            category: currentCategory,
                            items: currentItems
                        });
                        currentItems = [];
                    }
                    currentCategory = line.replace(/^#\s*/, '');
                } else {
                    const urlMatch = line.match(/(https?:\/\/\S+)/);
                    if (urlMatch) {
                        const url = urlMatch[0];
                        const rawTitle = line.replace(url, '').trim();
                        const parsed = parseItemTitle(rawTitle || "無題");
                        currentItems.push({
                            title: parsed.title,
                            date: parsed.date,
                            subtitle: parsed.subtitle,
                            url: url,
                            thumbnailUrl: getYouTubeThumbnail(url)
                        });
                    } else if (!isUrlOnly(line) && lines[i + 1] && isUrlOnly(lines[i + 1])) {
                        const parsed = parseItemTitle(line);
                        const url = lines[i + 1];
                        currentItems.push({
                            title: parsed.title,
                            date: parsed.date,
                            subtitle: parsed.subtitle,
                            url: url,
                            thumbnailUrl: getYouTubeThumbnail(url)
                        });
                        i++;
                    }
                }
            }

            if (currentItems.length > 0) {
                sections.push({
                    category: currentCategory,
                    items: currentItems
                });
            }
        } catch (e) {
            console.error('Error reading kakyovoice.txt:', e);
        }

        // 2. #きょーのお話.txt の読み込み
        try {
            const storyContent = await fs.readFile(kyoStoryPath, 'utf-8');
            const storyLines = storyContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const storyItems: VoiceItem[] = [];

            for (const line of storyLines) {
                const urlMatch = line.match(/(https?:\/\/\S+)/);
                if (urlMatch) {
                    const url = urlMatch[0];
                    const rawTitle = line.replace(url, '').trim();
                    const parsed = parseItemTitle(rawTitle || "#きょーのお話");
                    storyItems.push({
                        title: parsed.title,
                        date: parsed.date,
                        subtitle: parsed.subtitle,
                        url: url,
                        thumbnailUrl: getYouTubeThumbnail(url)
                    });
                }
            }

            if (storyItems.length > 0) {
                sections.push({
                    category: "#きょーのお話",
                    items: storyItems
                });
            }
        } catch (e) {
            console.error('Error reading #きょーのお話.txt:', e);
        }

        // 3. オリジナル曲 & カバー曲 の読み込み
        const originalItems = await parseSongFile(originalSongPath);
        if (originalItems.length > 0) {
            sections.push({
                category: "オリジナル曲",
                items: originalItems
            });
        }

        const coverItems = await parseSongFile(coverSongPath);
        if (coverItems.length > 0) {
            sections.push({
                category: "カバー曲",
                items: coverItems
            });
        }

        // 4. Vlog の読み込み
        const vlogItems = await parseSongFile(vlogPath);
        if (vlogItems.length > 0) {
            sections.push({
                category: "Vlog",
                items: vlogItems
            });
        }

        // 5. song_list.txt の読み込み（歌枠セトリ）
        try {
            const songContent = await fs.readFile(songListPath, 'utf-8');
            const songLines = songContent.split('\n');

            const setlistItems: VoiceItem[] = [];
            let currentStream: { title: string; url: string; songs: SongSubItem[] } | null = null;
            let currentSong: SongSubItem | null = null;

            for (let rawLine of songLines) {
                const line = rawLine.trim();
                if (!line) continue;

                const sectionMatch = line.match(/^■\s*(.*)$/);
                const streamLinkMatch = line.match(/^-\s*配信リンク\s*:\s*(.*)$/);
                const urlMatch = line.match(/^-\s*(?:URL|-URL)\s*:\s*(.*)$/i);

                if (sectionMatch) {
                    if (currentStream) {
                        const mainUrl = currentStream.url || (currentStream.songs.find(s => !!s.url)?.url || '');
                        setlistItems.push({
                            title: currentStream.title,
                            date: parseItemTitle(currentStream.title).date,
                            subtitle: parseItemTitle(currentStream.title).subtitle || currentStream.title,
                            url: mainUrl,
                            thumbnailUrl: mainUrl ? getYouTubeThumbnail(mainUrl) : undefined,
                            songs: currentStream.songs
                        });
                    }
                    const title = sectionMatch[1].trim();
                    currentStream = { title, url: '', songs: [] };
                    currentSong = null;
                } else if (streamLinkMatch) {
                    if (currentStream) {
                        currentStream.url = streamLinkMatch[1].trim();
                    }
                } else if (urlMatch) {
                    const songUrl = urlMatch[1].trim();
                    if (currentSong) {
                        currentSong.url = songUrl;
                    }
                    if (currentStream && !currentStream.url) {
                        currentStream.url = songUrl;
                    }
                } else {
                    currentSong = { title: line };
                    if (currentStream) {
                        currentStream.songs.push(currentSong);
                    }
                }
            }

            if (currentStream) {
                const mainUrl = currentStream.url || (currentStream.songs.find(s => !!s.url)?.url || '');
                setlistItems.push({
                    title: currentStream.title,
                    date: parseItemTitle(currentStream.title).date,
                    subtitle: parseItemTitle(currentStream.title).subtitle || currentStream.title,
                    url: mainUrl,
                    thumbnailUrl: mainUrl ? getYouTubeThumbnail(mainUrl) : undefined,
                    songs: currentStream.songs
                });
            }

            if (setlistItems.length > 0) {
                sections.push({
                    category: "歌枠セトリ",
                    items: setlistItems
                });
            }
        } catch (e) {
            console.error('Error reading song_list.txt:', e);
        }

        // 6. 要求順序の指定
        // 1段目: カバー曲 -> オリジナル曲 -> 歌枠セトリ -> Vlog
        // 2段目: おやすみかきょボイス -> かきょみこ、ふたりのーと。 -> #きょーのお話 -> まいにちかきょボイス
        const desiredOrder = [
            "カバー曲",
            "オリジナル曲",
            "歌枠セトリ",
            "Vlog",
            "おやすみかきょボイス",
            "かきょみこ、ふたりのーと。",
            "#きょーのお話",
            "まいにちかきょボイス"
        ];

        const sortedSections: VoiceSection[] = [];
        for (const catName of desiredOrder) {
            const found = sections.find(s => s.category === catName);
            if (found && found.items.length > 0) {
                sortedSections.push(found);
            }
        }

        for (const s of sections) {
            if (!desiredOrder.includes(s.category) && s.items.length > 0) {
                sortedSections.push(s);
            }
        }

        return NextResponse.json({ sections: sortedSections });
    } catch (error) {
        console.error('Error reading voice files:', error);
        return NextResponse.json({ error: 'Failed to read archive list.' }, { status: 500 });
    }
}
