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

// XのポストIDから画像URLを動的に解決するヘルパー関数
async function getTwitterImage(tweetId: string): Promise<string | null> {
    try {
        // vxtwitterのAPIを利用してログイン不要で高速にメタデータを取得
        const res = await fetch(`https://api.vxtwitter.com/status/${tweetId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            next: { revalidate: 3600 } // 1時間キャッシュする（Next.jsの機能）
        });
        if (res.ok) {
            const data = await res.json();
            if (data.mediaURLs && data.mediaURLs.length > 0) {
                // 最初の画像URLを返す
                return data.mediaURLs[0];
            }
        }
    } catch (err) {
        console.error(`Failed to fetch twitter image for tweet ${tweetId}:`, err);
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
                // twitter.com または x.com のリンクパターンを検出
                const twitterRegex = /(https?:\/\/(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/(\d+))/;
                // youtube.com または youtu.be のリンクパターンを検出
                const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_\-]+))/;

                const twitterMatch = event.title.match(twitterRegex);
                const youtubeMatch = event.title.match(youtubeRegex);
                
                let linkUrl: string | null = null;
                let thumbnailUrl: string | null = null;
                let cleanTitle = event.title;

                if (twitterMatch) {
                    linkUrl = twitterMatch[1];
                    const tweetId = twitterMatch[2];
                    
                    // タイトルからURL部分を削除
                    cleanTitle = event.title.replace(twitterMatch[0], '').trim();
                    
                    // 画像の動的取得
                    thumbnailUrl = await getTwitterImage(tweetId);
                } else if (youtubeMatch) {
                    linkUrl = youtubeMatch[1];
                    const videoId = youtubeMatch[2];

                    // タイトルからURL部分を削除
                    cleanTitle = event.title.replace(youtubeMatch[0], '').trim();

                    // YouTubeのサムネイルを直接割り当て
                    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
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
