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

        // 🌟 実際のセトリと全く同じ縦長レイアウト（717 × 1024）を生成 🌟
        return new ImageResponse(
            (
                <div
                    style={{
                        width: '717px',
                        height: '1024px',
                        display: 'flex',
                        position: 'relative',
                        backgroundColor: '#04030a',
                        overflow: 'hidden',
                        fontFamily: '"Noto Sans JP", sans-serif'
                    }}
                >
                    {/* ベース背景イラスト（月＋佳鏡院＋SET LISTリボン＋星空） */}
                    {templateImgBuffer ? (
                        <img
                            src={templateImgBuffer as any}
                            alt="Template"
                            width="717"
                            height="1024"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '717px',
                                height: '1024px'
                            }}
                        />
                    ) : null}

                    {/* 右側の星空余白スペース（実際のセトリと同じ座標配置） */}
                    <div
                        style={{
                            position: 'absolute',
                            left: '330px', // 46% of 717px
                            width: '362px', // 50.5% of 717px
                            top: '179px',  // 17.5% of 1024px
                            height: '799px', // 78% of 1024px
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                    >
                        {/* タイトル＆制作者名ヘッダー */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                paddingBottom: '8px',
                                borderBottom: '1px solid rgba(255, 226, 154, 0.4)'
                            }}
                        >
                            {/* セトリタイトル */}
                            <div
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 900,
                                    color: '#ffffff',
                                    letterSpacing: '0.04em',
                                    lineHeight: 1.2,
                                    textShadow: '0 0 14px rgba(255, 226, 154, 0.8), 0 2px 4px #000000',
                                    marginBottom: '6px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '350px'
                                }}
                            >
                                {title}
                            </div>

                            {/* 制作者名 */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: 'rgba(0, 0, 0, 0.75)',
                                    padding: '3px 14px',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(255, 226, 154, 0.5)'
                                }}
                            >
                                <span style={{ fontSize: '12px', color: '#ffe29a' }}>Selected by</span>
                                <span
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 800,
                                        color: '#ffffff'
                                    }}
                                >
                                    {creator || 'きょーめいと'}
                                </span>
                            </div>
                        </div>

                        {/* 12曲のトラックリスト（縦1列で12曲） */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                flex: 1,
                                gap: '2px',
                                marginTop: '4px',
                                marginBottom: '4px'
                            }}
                        >
                            {songs.map((song) => {
                                const trackNum = song.track.toString().padStart(2, '0');
                                return (
                                    <div
                                        key={song.track}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            width: '100%',
                                            height: '44px',
                                            padding: '0 8px',
                                            borderRadius: '6px',
                                            background: 'linear-gradient(90deg, rgba(8, 6, 20, 0.78) 0%, rgba(12, 10, 26, 0.65) 100%)',
                                            border: '1px solid rgba(255, 226, 154, 0.28)'
                                        }}
                                    >
                                        {/* トラック番号 */}
                                        <span
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: 900,
                                                color: '#ffe29a',
                                                width: '24px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {trackNum}
                                        </span>

                                        {/* カテゴリタグ */}
                                        <span
                                            style={{
                                                fontSize: '11px',
                                                fontWeight: 800,
                                                padding: '2px 5px',
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

                                        {/* 曲名 */}
                                        <span
                                            style={{
                                                flex: 1,
                                                fontSize: '15px',
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
                            })}
                        </div>

                        {/* 下部案内テキスト */}
                        <div
                            style={{
                                textAlign: 'right',
                                fontSize: '11px',
                                color: 'rgba(255, 226, 154, 0.85)',
                                paddingBottom: '2px'
                            }}
                        >
                            佳鏡院 公式ファンサイト「メゾンドきょー」
                        </div>
                    </div>
                </div>
            ),
            {
                width: 717,
                height: 1024,
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
