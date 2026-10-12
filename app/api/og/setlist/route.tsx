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

        // 🌟 Xの横長枠（1200 × 630）の中に縦長セトリ全体（427 × 610）をすっぽり収める 🌟
        // カードの縮小比率: 610 / 1024 ≒ 0.5957
        const cardW = 427;
        const cardH = 610;
        const starLeft = Math.round(cardW * 0.46); // ~196px
        const starWidth = Math.round(cardW * 0.505); // ~215px
        const starTop = Math.round(cardH * 0.175); // ~107px
        const starHeight = Math.round(cardH * 0.78); // ~476px

        return new ImageResponse(
            (
                <div
                    style={{
                        width: '1200px',
                        height: '630px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        backgroundColor: '#05030c',
                        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(28, 18, 54, 0.95) 0%, rgba(5, 3, 12, 1) 100%)',
                        fontFamily: '"Noto Sans JP", sans-serif',
                        overflow: 'hidden'
                    }}
                >
                    {/* 背景：両サイドの星空テクスチャとテキスト演出 */}
                    <div
                        style={{
                            position: 'absolute',
                            left: '50px',
                            top: '45px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}
                    >
                        <span
                            style={{
                                fontSize: '13px',
                                fontWeight: 900,
                                color: '#ffe29a',
                                letterSpacing: '0.12em'
                            }}
                        >
                            MAISON DE KYO
                        </span>
                        <span
                            style={{
                                fontSize: '22px',
                                fontWeight: 900,
                                color: '#ffffff',
                                letterSpacing: '0.04em',
                                textShadow: '0 0 12px rgba(255, 226, 154, 0.4)'
                            }}
                        >
                            個人的最強セトリ
                        </span>
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            right: '50px',
                            bottom: '45px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '999px',
                            background: 'rgba(255, 226, 154, 0.1)',
                            border: '1px solid rgba(255, 226, 154, 0.3)'
                        }}
                    >
                        <span style={{ fontSize: '14px' }}>🎵</span>
                        <span style={{ fontSize: '13px', color: '#ffe29a', fontWeight: 800 }}>
                            タップしてセトリをチェック
                        </span>
                    </div>

                    {/* 中央：縮小された実物セトリカード（427 × 610） */}
                    <div
                        style={{
                            width: `${cardW}px`,
                            height: `${cardH}px`,
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 226, 154, 0.25)',
                            border: '1px solid rgba(255, 226, 154, 0.45)',
                            display: 'flex',
                            position: 'relative',
                            backgroundColor: '#04030a'
                        }}
                    >
                        {/* テンプレートイラスト（月＋佳鏡院＋SET LISTリボン＋星空） */}
                        {templateImgBuffer ? (
                            <img
                                src={templateImgBuffer as any}
                                alt="Template"
                                width={cardW}
                                height={cardH}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: `${cardW}px`,
                                    height: `${cardH}px`
                                }}
                            />
                        ) : null}

                        {/* 右側星空スペース（縮小スケール配置） */}
                        <div
                            style={{
                                position: 'absolute',
                                left: `${starLeft}px`,
                                width: `${starWidth}px`,
                                top: `${starTop}px`,
                                height: `${starHeight}px`,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            {/* タイトル＆制作者ヘッダー */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    paddingBottom: '4px',
                                    borderBottom: '1px solid rgba(255, 226, 154, 0.35)'
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 900,
                                        color: '#ffffff',
                                        letterSpacing: '0.02em',
                                        lineHeight: 1.2,
                                        textShadow: '0 0 10px rgba(255, 226, 154, 0.8)',
                                        marginBottom: '3px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '205px'
                                    }}
                                >
                                    {title}
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        background: 'rgba(0, 0, 0, 0.75)',
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        border: '1px solid rgba(255, 226, 154, 0.4)'
                                    }}
                                >
                                    <span style={{ fontSize: '9px', color: '#ffe29a' }}>Selected by</span>
                                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#ffffff' }}>
                                        {creator || 'きょーめいと'}
                                    </span>
                                </div>
                            </div>

                            {/* 12曲のトラックリスト */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    flex: 1,
                                    gap: '2px',
                                    marginTop: '3px',
                                    marginBottom: '3px'
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
                                                gap: '4px',
                                                width: '100%',
                                                height: '26px',
                                                padding: '0 5px',
                                                borderRadius: '4px',
                                                background: 'linear-gradient(90deg, rgba(8, 6, 20, 0.78) 0%, rgba(12, 10, 26, 0.65) 100%)',
                                                border: '1px solid rgba(255, 226, 154, 0.25)'
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: '10px',
                                                    fontWeight: 900,
                                                    color: '#ffe29a',
                                                    width: '14px',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {trackNum}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '8px',
                                                    fontWeight: 800,
                                                    padding: '1px 3px',
                                                    borderRadius: '3px',
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
                                            <span
                                                style={{
                                                    flex: 1,
                                                    fontSize: '10px',
                                                    fontWeight: 800,
                                                    color: '#ffffff',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.95)'
                                                }}
                                            >
                                                {song.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 下部クレジット */}
                            <div
                                style={{
                                    textAlign: 'right',
                                    fontSize: '8px',
                                    color: 'rgba(255, 226, 154, 0.85)',
                                    paddingBottom: '2px'
                                }}
                            >
                                佳鏡院 公式ファンサイト「メゾンドきょー」
                            </div>
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
