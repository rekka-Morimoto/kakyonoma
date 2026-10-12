import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

// 曲名からアーティスト名（/ または ／ 以降）を除去
function cleanSongTitle(rawTitle: string): string {
    if (!rawTitle) return '';
    const slashIdx = rawTitle.search(/[/／]/);
    if (slashIdx !== -1) {
        return rawTitle.substring(0, slashIdx).trim();
    }
    return rawTitle.trim();
}

// 全曲リストを読み込んでIDマップを作成
async function getSongMap() {
    const songMap = new Map<string, { title: string; category: string; alias?: string }>();
    let songCounter = 1;

    try {
        const origPath = path.join(process.cwd(), 'data', 'songs_original.txt');
        const origContent = await fs.readFile(origPath, 'utf-8');
        let currentAlias = '佳鏡院';
        const lines = origContent.split('\n').map((l) => l.trim());
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;
            const aliasMatch = line.match(/^<([^>]+)>$/);
            if (aliasMatch) {
                currentAlias = aliasMatch[1].trim();
                continue;
            }
            if (/^\d+\./.test(line) || (!line.startsWith('http://') && !line.startsWith('https://'))) {
                const title = line.replace(/^\d+\.\s*/, '');
                songMap.set(`orig-${songCounter++}`, { title, category: 'original', alias: currentAlias });
            }
        }
    } catch (e) {
        console.error('OGP: Error reading original songs', e);
    }

    try {
        const coverPath = path.join(process.cwd(), 'data', 'songs_cover.txt');
        const coverContent = await fs.readFile(coverPath, 'utf-8');
        const lines = coverContent.split('\n').map((l) => l.trim());
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;
            if (/^\d+\./.test(line) || (!line.startsWith('http://') && !line.startsWith('https://'))) {
                const title = line.replace(/^\d+\.\s*/, '');
                songMap.set(`cover-${songCounter++}`, { title, category: 'cover' });
            }
        }
    } catch (e) {
        console.error('OGP: Error reading cover songs', e);
    }

    try {
        const streamPath = path.join(process.cwd(), 'data', 'song_list.txt');
        const streamContent = await fs.readFile(streamPath, 'utf-8');
        const lines = streamContent.split('\n').map((l) => l.trim());
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line || line.startsWith('■') || line.startsWith('-')) continue;
            const songMatch = line.match(/^\d+[\.\/]\s*(.+)/);
            if (songMatch) {
                songMap.set(`stream-${songCounter++}`, { title: songMatch[1].trim(), category: 'stream' });
            }
        }
    } catch (e) {
        console.error('OGP: Error reading stream songs', e);
    }

    return songMap;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const shortParam = searchParams.get('s');
        const legacyParam = searchParams.get('data');

        let title = '個人的最強セトリ';
        let creator = 'きょーめいと';
        let songs: { track: number; title: string; category: string; alias?: string }[] = [];

        // フォントの読み込み
        let fontData: ArrayBuffer;
        try {
            const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansJP-Bold.ttf');
            fontData = (await fs.readFile(fontPath)).buffer;
        } catch {
            const fontRes = await fetch('https://fonts.gstatic.com/s/notosansjp/v57/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf');
            fontData = await fontRes.arrayBuffer();
        }

        // テンプレート画像の読み込み（ArrayBuffer）
        let templateImgBuffer: ArrayBuffer | null = null;
        try {
            const imgPath = path.join(process.cwd(), 'public', 'images', 'setlist_template.png');
            const fileBuf = await fs.readFile(imgPath);
            templateImgBuffer = fileBuf.buffer;
        } catch (e) {
            console.error('OGP: Error reading template image', e);
        }

        // Base64URL デコード
        const decodeBase64Utf8 = (str: string) => {
            let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
            while (b64.length % 4 !== 0) b64 += '=';
            return Buffer.from(b64, 'base64').toString('utf-8');
        };

        if (shortParam) {
            try {
                const jsonStr = decodeBase64Utf8(shortParam);
                const parsed = JSON.parse(jsonStr);
                title = parsed.t || '個人的最強セトリ';
                creator = parsed.c || 'きょーめいと';
                const songIds: string[] = (parsed.s || '').split(',');

                const songMap = await getSongMap();
                songs = Array.from({ length: 12 }, (_, i) => {
                    const id = songIds[i];
                    const found = id ? songMap.get(id) : null;
                    return {
                        track: i + 1,
                        title: cleanSongTitle(found ? found.title : (id ? '選曲' : '（未設定）')),
                        category: found?.category || 'original',
                        alias: found?.alias
                    };
                });
            } catch (e) {
                console.error('OGP: shortParam parse error', e);
            }
        } else if (legacyParam) {
            try {
                const jsonStr = decodeBase64Utf8(legacyParam);
                const parsed = JSON.parse(jsonStr);
                title = parsed.t || '個人的最強セトリ';
                creator = parsed.c || 'きょーめいと';
                if (Array.isArray(parsed.s)) {
                    songs = parsed.s.slice(0, 12).map((arr: any, i: number) => ({
                        track: i + 1,
                        title: cleanSongTitle(arr[1] || '（未設定）'),
                        category: arr[2] || 'original',
                        alias: arr[3]
                    }));
                }
            } catch (e) {
                console.error('OGP: legacyParam parse error', e);
            }
        }

        // デフォルト12曲補完
        while (songs.length < 12) {
            songs.push({
                track: songs.length + 1,
                title: '（未設定）',
                category: 'original'
            });
        }

        // 前半6曲（左列）と後半6曲（右列）に分割
        const col1 = songs.slice(0, 6);
        const col2 = songs.slice(6, 12);

        // 🌟 横長（1200 × 630）でスペースを無駄なく使い、曲目を極大・高密度で配置 🌟
        return new ImageResponse(
            (
                <div
                    style={{
                        width: '1200px',
                        height: '630px',
                        display: 'flex',
                        position: 'relative',
                        backgroundColor: '#05030b',
                        backgroundImage: 'radial-gradient(circle at 75% 50%, rgba(26, 16, 52, 0.9) 0%, rgba(5, 3, 11, 1) 100%)',
                        fontFamily: '"Noto Sans JP", sans-serif',
                        overflow: 'hidden',
                        padding: '16px 20px'
                    }}
                >
                    {/* 左側：佳鏡院・月・リボンのイラストカード */}
                    <div
                        style={{
                            width: '400px',
                            height: '598px',
                            display: 'flex',
                            position: 'relative',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 226, 154, 0.25)',
                            border: '1px solid rgba(255, 226, 154, 0.4)',
                            backgroundColor: '#030208',
                            flexShrink: 0
                        }}
                    >
                        {templateImgBuffer ? (
                            <img
                                src={templateImgBuffer as any}
                                alt="Template"
                                width="420"
                                height="600"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '-5px',
                                    width: '420px',
                                    height: '600px'
                                }}
                            />
                        ) : null}
                    </div>

                    {/* 右側：高密度セトリ情報エリア（幅 約 750px、高さ 598px） */}
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            paddingLeft: '20px',
                            height: '598px'
                        }}
                    >
                        {/* ヘッダー：タイトル＆制作者名 */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid rgba(255, 226, 154, 0.35)',
                                paddingBottom: '10px'
                            }}
                        >
                            {/* タイトル */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 900,
                                        color: '#080514',
                                        background: 'linear-gradient(135deg, #ffe29a 0%, #eab308 100%)',
                                        padding: '4px 10px',
                                        borderRadius: '999px',
                                        letterSpacing: '0.06em'
                                    }}
                                >
                                    SETLIST
                                </span>
                                <span
                                    style={{
                                        fontSize: '28px',
                                        fontWeight: 900,
                                        color: '#ffffff',
                                        letterSpacing: '0.02em',
                                        textShadow: '0 0 16px rgba(255, 226, 154, 0.7)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '450px'
                                    }}
                                >
                                    {title}
                                </span>
                            </div>

                            {/* 制作者名 */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: 'rgba(0, 0, 0, 0.8)',
                                    padding: '5px 14px',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(255, 226, 154, 0.45)'
                                }}
                            >
                                <span style={{ fontSize: '12px', color: '#ffe29a' }}>Selected by</span>
                                <span
                                    style={{
                                        fontSize: '15px',
                                        fontWeight: 800,
                                        color: '#ffffff'
                                    }}
                                >
                                    {creator || 'きょーめいと'}
                                </span>
                            </div>
                        </div>

                        {/* 12曲のトラックリスト：6曲 × 2列（高密度・大文字表示） */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                flex: 1,
                                marginTop: '10px',
                                marginBottom: '8px'
                            }}
                        >
                            {/* 左列（01〜06） */}
                            <div
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    gap: '6px'
                                }}
                            >
                                {col1.map((song) => renderSongRow(song))}
                            </div>

                            {/* 右列（07〜12） */}
                            <div
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    gap: '6px'
                                }}
                            >
                                {col2.map((song) => renderSongRow(song))}
                            </div>
                        </div>

                        {/* フッター */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingTop: '4px',
                                borderTop: '1px solid rgba(255, 226, 154, 0.2)'
                            }}
                        >
                            <span style={{ fontSize: '12px', color: '#ffe29a', fontWeight: 700 }}>
                                🎵 タップしてこのセトリを聴く
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgba(255, 226, 154, 0.75)' }}>
                                佳鏡院 公式ファンサイト「メゾンドきょー」
                            </span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'Noto Sans JP',
                        data: fontData,
                        style: 'normal',
                        weight: 700
                    }
                ]
            }
        );
    } catch (err: any) {
        console.error('Failed to generate setlist OGP:', err);
        return new Response('Failed to generate image', { status: 500 });
    }
}

// 1曲あたりの大文字・高密度レンダリング関数
function renderSongRow(song: { track: number; title: string; category: string; alias?: string }) {
    const trackNum = song.track.toString().padStart(2, '0');
    return (
        <div
            key={song.track}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                flex: 1,
                minHeight: '66px',
                padding: '0 10px',
                borderRadius: '8px',
                background: 'linear-gradient(90deg, rgba(14, 10, 32, 0.88) 0%, rgba(18, 14, 40, 0.75) 100%)',
                border: '1px solid rgba(255, 226, 154, 0.35)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
            }}
        >
            {/* トラック番号 */}
            <span
                style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    color: '#ffe29a',
                    width: '28px',
                    textAlign: 'center'
                }}
            >
                {trackNum}
            </span>

            {/* カテゴリタグ */}
            <span
                style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '3px 6px',
                    borderRadius: '4px',
                    background:
                        song.category === 'original'
                            ? 'rgba(251, 191, 36, 0.35)'
                            : song.category === 'cover'
                            ? 'rgba(56, 189, 248, 0.35)'
                            : 'rgba(244, 114, 182, 0.35)',
                    color:
                        song.category === 'original'
                            ? '#fef08a'
                            : song.category === 'cover'
                            ? '#bae6fd'
                            : '#fbcfe8',
                    border: `1px solid ${
                        song.category === 'original'
                            ? 'rgba(251, 191, 36, 0.6)'
                            : song.category === 'cover'
                            ? 'rgba(56, 189, 248, 0.6)'
                            : 'rgba(244, 114, 182, 0.6)'
                    }`
                }}
            >
                {song.alias ? song.alias : song.category === 'original' ? 'オリ' : song.category === 'cover' ? 'カバ' : '歌枠'}
            </span>

            {/* 曲名（大文字・高密度・視認性抜群） */}
            <span
                style={{
                    flex: 1,
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    letterSpacing: '0.01em',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.95)'
                }}
            >
                {song.title}
            </span>
        </div>
    );
}
