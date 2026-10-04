import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface TimelineEvent {
    importance: number;
    date: string;
    title: string;
    linkUrl?: string | null;
    thumbnailUrl?: string | null;
}

// XのポストIDから画像URLを動的に解決するヘルパー関数（フォールバック機能付き）
async function getTwitterImage(tweetId: string): Promise<string | null> {
    const apis = [
        `https://api.vxtwitter.com/status/${tweetId}`,
        `https://api.fxtwitter.com/status/${tweetId}`
    ];

    for (const apiEndpoint of apis) {
        try {
            const res = await fetch(apiEndpoint, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                next: { revalidate: 3600 }
            });
            if (res.ok) {
                const data = await res.json();
                // vxtwitter: data.mediaURLs
                if (data.mediaURLs && Array.isArray(data.mediaURLs) && data.mediaURLs.length > 0) {
                    return data.mediaURLs[0];
                }
                // fxtwitter: data.tweet.media.photos
                if (data.tweet && data.tweet.media && data.tweet.media.photos && data.tweet.media.photos.length > 0) {
                    return data.tweet.media.photos[0].url;
                }
            }
        } catch (err) {
            console.error(`Failed to fetch twitter image from ${apiEndpoint} for tweet ${tweetId}:`, err);
        }
    }
    return null;
}

// Bilibili動画のBV IDからサムネイル画像URLを動的に解決するヘルパー関数
async function getBilibiliImage(bvId: string): Promise<string | null> {
    try {
        const res = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvId}`, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': 'https://www.bilibili.com/'
            },
            next: { revalidate: 86400 }
        });
        if (res.ok) {
            const data = await res.json();
            if (data.code === 0 && data.data && data.data.pic) {
                let picUrl: string = data.data.pic;
                if (picUrl.startsWith('http://')) {
                    picUrl = picUrl.replace('http://', 'https://');
                } else if (picUrl.startsWith('//')) {
                    picUrl = 'https:' + picUrl;
                }
                return picUrl;
            }
        }
    } catch (err) {
        console.error(`Failed to fetch bilibili image for ${bvId}:`, err);
    }
    return null;
}

export async function GET() {
    const filePath = path.join(process.cwd(), 'data', 'timeline.txt');

    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n').map(line => line.trim());

        const rawEvents = [];
        
        for (const line of lines) {
            if (!line) continue;

            // 星（☆ or ★）の数を取得して重要度とする
            const starMatch = line.match(/^[☆★]+/);
            const importance = starMatch ? starMatch[0].length : 1;

            // 星マークと直後のスペースを削除
            const cleanLine = line.replace(/^[☆★]+\s*/, '').trim();

            // 日付 (YYYY.MM.DD) を抽出
            const dateMatch = cleanLine.match(/^(\d{4}\.\d{2}\.\d{2})/);
            const date = dateMatch ? dateMatch[1] : '';

            // 残りをタイトルとする
            const title = dateMatch ? cleanLine.substring(dateMatch[0].length).trim() : cleanLine;

            rawEvents.push({
                importance,
                date,
                title
            });
        }

        // 各イベントのリンクと画像を並列で動的解決する
        const events: TimelineEvent[] = await Promise.all(
            rawEvents.map(async (event) => {
                // スキームあり、または主要ドメインで始まるURLを検出
                const urlRegex = /(https?:\/\/\S+|(?:www\.)?(?:youtube\.com|youtu\.be|x\.com|twitter\.com|bilibili\.com)\/\S+)/i;
                const urlMatch = event.title.match(urlRegex);
                
                let linkUrl: string | null = null;
                let thumbnailUrl: string | null = null;
                let cleanTitle = event.title;

                if (urlMatch) {
                    let matchedStr = urlMatch[1];
                    // タイトルからURL部分を削除
                    cleanTitle = event.title.replace(matchedStr, '').trim();

                    // スキーム省略補正
                    if (!matchedStr.startsWith('http://') && !matchedStr.startsWith('https://')) {
                        linkUrl = 'https://' + matchedStr;
                    } else {
                        linkUrl = matchedStr;
                    }

                    // X (Twitter) ポストの判定と画像取得
                    const twitterMatch = linkUrl.match(/https?:\/\/(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/(\d+)/);
                    if (twitterMatch) {
                        const tweetId = twitterMatch[1];
                        thumbnailUrl = await getTwitterImage(tweetId);
                    } else {
                        // YouTube 動画（watch, shorts, embed, live, youtu.be）の判定
                        const youtubeMatch = linkUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_\-]+)/);
                        if (youtubeMatch) {
                            const videoId = youtubeMatch[1];
                            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                        } else {
                            // Bilibili 動画の判定
                            const bilibiliMatch = linkUrl.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/i);
                            if (bilibiliMatch) {
                                const bvId = bilibiliMatch[1];
                                thumbnailUrl = await getBilibiliImage(bvId);
                            }
                        }
                    }
                }

                return {
                    importance: event.importance,
                    date: event.date,
                    title: cleanTitle,
                    linkUrl,
                    thumbnailUrl
                };
            })
        );

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Error reading timeline file:', error);
        return NextResponse.json({ error: 'Failed to read timeline data.' }, { status: 500 });
    }
}
