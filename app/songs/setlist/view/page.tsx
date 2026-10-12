'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../../lib/i18nContext';
import { SetlistPayload } from '../page';

function SetlistViewContent() {
    const searchParams = useSearchParams();
    const { locale, translateDynamicText } = useLanguage();

    const [setlist, setSetlist] = useState<SetlistPayload | null>(null);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [characterDataUrl, setCharacterDataUrl] = useState<string>('/images/kakyo_singer.png');
    const cardRef = useRef<HTMLDivElement>(null);

    // キャラ画像をBase64 DataURLとしてプリロード（CORS制限を完全回避）
    useEffect(() => {
        const loadImg = async () => {
            try {
                const res = await fetch('/images/kakyo_singer.png');
                if (res.ok) {
                    const blob = await res.blob();
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                            setCharacterDataUrl(reader.result);
                        }
                    };
                    reader.readAsDataURL(blob);
                }
            } catch (err) {
                console.warn('Failed to load image as DataURL:', err);
            }
        };
        loadImg();
    }, []);

    // セトリデータのデコード
    useEffect(() => {
        const rawData = searchParams.get('data');
        if (rawData) {
            try {
                const binaryStr = atob(rawData);
                const bytes = new Uint8Array(binaryStr.length);
                for (let i = 0; i < binaryStr.length; i++) {
                    bytes[i] = binaryStr.charCodeAt(i);
                }
                const jsonStr = new TextDecoder().decode(bytes);
                const rawParsed = JSON.parse(jsonStr);

                if (rawParsed.s && Array.isArray(rawParsed.s)) {
                    setSetlist({
                        title: rawParsed.t || '個人的最強セトリ',
                        creator: rawParsed.c || '',
                        createdAt: rawParsed.d || '',
                        songs: rawParsed.s.map((arr: any) => ({
                            track: arr[0],
                            title: arr[1],
                            category: arr[2] || 'original',
                            alias: arr[3] || undefined,
                            url: arr[4] || undefined
                        }))
                    });
                } else {
                    setSetlist(rawParsed as SetlistPayload);
                }
            } catch (e) {
                console.error('Failed to parse with TextDecoder:', e);
                try {
                    const legacyStr = decodeURIComponent(
                        Array.prototype.map
                            .call(atob(rawData), (c: string) => {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                            })
                            .join('')
                    );
                    setSetlist(JSON.parse(legacyStr));
                } catch (err2) {
                    console.error('Legacy decode failed:', err2);
                }
            }
        }
    }, [searchParams]);

    // リンクをクリップボードにコピー
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            const input = document.createElement('input');
            input.value = window.location.href;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    // 画面キャプチャPNG保存（dom-to-image-more を主軸に、html2canvas不要で不要な枠線バグゼロ）
    const handleDownloadPng = async () => {
        if (!cardRef.current || downloading) return;
        setDownloading(true);

        try {
            const node = cardRef.current;
            const domtoimage = (await import('dom-to-image-more')).default;

            // dom-to-image-more でクローン生成（SVG foreignObjectベースなので余計な枠線バグが一切出ない）
            const dataUrl = await domtoimage.toPng(node, {
                bgcolor: '#140e1b',
                quality: 1.0,
                scale: 2,
                style: {
                    transform: 'none',
                    margin: '0'
                }
            });

            const link = document.createElement('a');
            link.download = `${setlist?.title || '最強セトリ'}_MaisonDeKyo.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('dom-to-image error:', err);
            // 万が一のフォールバック
            try {
                const html2canvas = (await import('html2canvas')).default;
                const canvas = await html2canvas(cardRef.current, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#140e1b',
                    logging: false
                });
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `${setlist?.title || '最強セトリ'}_MaisonDeKyo.png`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (fallbackErr) {
                console.error('All capture methods failed:', fallbackErr);
                alert(locale === 'zh' ? '保存图片失败，请截图保存' : '画像の保存に失敗しました。画面のスクリーンショットでも保存いただけます。');
            }
        } finally {
            setDownloading(false);
        }
    };

    // X(Twitter)でシェア
    const handleShareTwitter = () => {
        if (!setlist) return;
        const text = encodeURIComponent(
            `【${setlist.title}】\n🌸 制作者: ${setlist.creator || 'きょーめいと'}\n私の個人的最強セトリを作りました！🎧✨\n\n#佳鏡院 #個人的最強セトリ #メゾンドきょー\n`
        );
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    if (!setlist) {
        return (
            <div className="glass-panel p-12 rounded-3xl border border-pink-500/20 text-center space-y-4 max-w-xl mx-auto my-20">
                <div className="text-4xl animate-bounce">🌸</div>
                <h2 className="text-xl font-serif font-bold text-white">
                    {locale === 'zh' ? '歌单数据不存在或链接无效' : 'セトリデータが見つかりません'}
                </h2>
                <p className="text-sm text-pink-200/70 font-sans">
                    {locale === 'zh' ? '请确认链接是否完整。' : 'URLが正しいかご確認ください。'}
                </p>
                <div className="pt-4">
                    <Link
                        href="/songs/setlist"
                        className="inline-block py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-400 text-white font-serif font-bold text-sm shadow-lg shadow-pink-500/25"
                    >
                        {locale === 'zh' ? '制作新歌单' : 'セトリを作成する'}
                    </Link>
                </div>
            </div>
        );
    }

    // 12曲を前半(0〜5)と後半(6〜11)に分割して2列配置
    const firstColSongs = setlist.songs.slice(0, 6);
    const secondColSongs = setlist.songs.slice(6, 12);

    const renderSongItem = (song: typeof setlist.songs[0], idx: number) => {
        const trackNum = (idx + 1).toString().padStart(2, '0');
        const hasUrl = !!song.url;

        const content = (
            <div className="flex items-center gap-3 w-full">
                {/* 可愛いトラック番号 */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500/30 to-amber-500/20 border border-pink-400/40 flex items-center justify-center font-mono font-black text-xs text-pink-200 flex-shrink-0 shadow-sm group-hover:scale-105 group-hover:border-pink-300 transition-all">
                    {trackNum}
                </div>

                {/* 曲情報 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-sans px-2 py-0.2 rounded-full font-bold shadow-sm ${
                            song.category === 'original'
                                ? 'bg-amber-400/25 text-amber-200 border border-amber-300/40'
                                : song.category === 'cover'
                                ? 'bg-sky-400/25 text-sky-200 border border-sky-300/40'
                                : 'bg-pink-400/25 text-pink-200 border border-pink-300/40'
                        }`}>
                            {song.alias ? song.alias : song.category === 'original' ? 'オリジナル' : song.category === 'cover' ? 'カバー' : '歌枠'}
                        </span>
                    </div>
                    <div className="text-white font-serif font-bold text-sm truncate group-hover:text-pink-200 transition-colors">
                        {translateDynamicText(song.title)}
                    </div>
                </div>

                {/* リンク誘導アイコン */}
                {hasUrl ? (
                    <div className="w-7 h-7 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-xs text-pink-200 group-hover:bg-pink-500 group-hover:text-white group-hover:scale-110 transition-all flex-shrink-0 shadow-sm">
                        ▶
                    </div>
                ) : (
                    <div className="text-[10px] text-pink-300/30 font-mono flex-shrink-0">
                        —
                    </div>
                )}
            </div>
        );

        return hasUrl ? (
            <a
                key={idx}
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-black/45 hover:bg-pink-950/30 border border-pink-500/20 hover:border-pink-400/60 transition-all duration-200 flex items-center group shadow-sm hover:shadow-md hover:translate-x-0.5 cursor-pointer backdrop-blur-sm"
                title={`${song.title} を再生する`}
            >
                {content}
            </a>
        ) : (
            <div
                key={idx}
                className="p-2.5 rounded-2xl bg-black/35 border border-pink-500/10 flex items-center opacity-85"
            >
                {content}
            </div>
        );
    };

    return (
        <div className="max-w-4xl w-full space-y-6 relative z-10">
            {/* 上部アクションバー */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                    href="/songs/setlist"
                    className="inline-flex items-center text-pink-300 hover:text-white transition-colors group font-bold tracking-widest text-sm"
                >
                    <span className="mr-1.5 transform group-hover:-translate-x-1 transition-transform">←</span>
                    {locale === 'zh' ? '重新制作歌单' : '新しくセトリを作る'}
                </Link>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* クリップボードコピーボタン */}
                    <button
                        onClick={handleCopyLink}
                        className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                            copied
                                ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                                : 'bg-pink-950/60 border border-pink-500/40 text-pink-200 hover:bg-pink-900/60 hover:scale-105'
                        }`}
                        title="閲覧リンクをコピー"
                    >
                        <span>{copied ? '✓' : '📋'}</span>
                        <span>
                            {copied
                                ? (locale === 'zh' ? '已复制分享链接！' : 'リンクをコピーしました！')
                                : (locale === 'zh' ? '复制分享链接' : '閲覧用リンクをコピー')}
                        </span>
                    </button>

                    {/* PNG画像ダウンロードボタン */}
                    <button
                        onClick={handleDownloadPng}
                        disabled={downloading}
                        className="px-5 py-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 text-white text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 active:scale-95 disabled:opacity-50"
                        title="このセトリを可愛いPNG画像として保存"
                    >
                        <span>{downloading ? '⏳' : '🌸'}</span>
                        <span>
                            {downloading
                                ? (locale === 'zh' ? '保存中...' : 'PNG保存中...')
                                : (locale === 'zh' ? '保存为PNG图片' : 'セトリをPNG保存')}
                        </span>
                    </button>

                    {/* X シェアボタン */}
                    <button
                        onClick={handleShareTwitter}
                        className="px-4 py-2 rounded-2xl bg-black/80 hover:bg-black border border-white/20 hover:border-sky-400 text-white text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Xでポスト"
                    >
                        <span className="text-sky-400 font-sans">𝕏</span>
                        <span className="hidden sm:inline">{locale === 'zh' ? 'シェア' : 'シェア'}</span>
                    </button>
                </div>
            </div>

            {/* コピー完了トースト通知 */}
            {copied && (
                <div className="fixed bottom-6 right-6 z-50 bg-pink-700/95 border-2 border-pink-300 text-white px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 font-serif text-sm animate-bounce">
                    <span className="text-lg">🌸</span>
                    <span>{locale === 'zh' ? '閲覧用链接已成功复制到剪贴板！' : '閲覧用リンクをクリップボードにコピーしました！'}</span>
                </div>
            )}

            {/* 🌸 可愛いセトリ表示カード本体（画面表示 ＆ PNGキャプチャ対象） 🌸 */}
            <div
                ref={cardRef}
                style={{
                    backgroundColor: '#140e1b',
                    backgroundImage: 'linear-gradient(135deg, #140e1b 0%, #201322 50%, #170f1a 100%)',
                    borderRadius: '2rem',
                    border: '2px solid rgba(244, 114, 182, 0.4)',
                    boxShadow: '0 0 40px rgba(244, 114, 182, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '2rem'
                }}
                className="text-left select-none"
            >
                {/* 🌸 背景透過キャラ素材（右〜中央背面に大きくふんわり配置） 🌸 */}
                <div
                    style={{
                        position: 'absolute',
                        right: '-2%',
                        bottom: '-5%',
                        width: '56%',
                        maxHeight: '95%',
                        opacity: 0.28,
                        pointerEvents: 'none',
                        zIndex: 0,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }}
                >
                    <img
                        src={characterDataUrl}
                        alt="佳鏡院"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '750px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 0 20px rgba(244,114,182,0.4))'
                        }}
                    />
                </div>

                {/* 背景のやわらかい光輪 */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-10%',
                        right: '10%',
                        width: '350px',
                        height: '350px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(244,114,182,0.18) 0%, rgba(251,191,36,0.08) 50%, transparent 70%)',
                        pointerEvents: 'none',
                        zIndex: 0
                    }}
                />

                {/* 🌸 ヘッダーエリア（タイトル＆制作者名を大きく可愛く表示） 🌸 */}
                <header
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        borderBottom: '1px solid rgba(244, 114, 182, 0.25)',
                        paddingBottom: '1.5rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}
                >
                    {/* かわいいリボンバッジ */}
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-200 text-xs font-serif font-bold tracking-widest uppercase mb-3 shadow-sm">
                        <span>🌸</span>
                        <span>MAISON DE KYO SPECIAL SETLIST</span>
                        <span>🌸</span>
                    </div>

                    {/* 超大型タイトル */}
                    <h1
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                            fontWeight: 900,
                            lineHeight: 1.2,
                            letterSpacing: '0.04em',
                            margin: '0.2rem 0 0.8rem 0',
                            background: 'linear-gradient(to right, #ffffff, #fed7aa, #fbcfe8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 2px 8px rgba(244,114,182,0.3))'
                        }}
                        className="font-serif font-black"
                    >
                        {setlist.title}
                    </h1>

                    {/* 超目立つ制作者名表示 */}
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-serif">
                        <div
                            style={{
                                background: 'linear-gradient(135deg, rgba(244,114,182,0.2) 0%, rgba(251,191,36,0.15) 100%)',
                                border: '1.5px solid rgba(244, 114, 182, 0.5)',
                                padding: '0.5rem 1.4rem',
                                borderRadius: '9999px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 15px rgba(244,114,182,0.15)'
                            }}
                        >
                            <span className="text-base">🎀</span>
                            <span className="text-pink-200 text-xs sm:text-sm font-medium">Selected by:</span>
                            <span
                                style={{
                                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                                    fontWeight: 900,
                                    color: '#ffffff',
                                    letterSpacing: '0.02em'
                                }}
                            >
                                {setlist.creator || 'きょーめいと'}
                            </span>
                            <span className="text-base">✨</span>
                        </div>

                        <div className="px-3.5 py-1.5 rounded-full bg-black/40 border border-pink-400/20 text-pink-200/80 font-mono text-xs">
                            12 SPECIAL TRACKS
                        </div>
                    </div>
                </header>

                {/* 🌸 12曲トラックリスト（2列レイアウトでバランス良く可愛く配置） 🌸 */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 1
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3"
                >
                    {/* 左列 (Track 01〜06) */}
                    <div className="space-y-2.5">
                        {firstColSongs.map((song, i) => renderSongItem(song, i))}
                    </div>

                    {/* 右列 (Track 07〜12) */}
                    <div className="space-y-2.5">
                        {secondColSongs.map((song, i) => renderSongItem(song, i + 6))}
                    </div>
                </div>

                {/* 🌸 フッターエリア 🌸 */}
                <footer
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        borderTop: '1px solid rgba(244, 114, 182, 0.25)',
                        paddingTop: '1.2rem',
                        marginTop: '1.5rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        color: 'rgba(251, 207, 232, 0.7)'
                    }}
                    className="font-serif"
                >
                    <div className="flex items-center gap-1.5">
                        <span className="text-pink-400">🌸</span>
                        <span className="font-bold text-pink-200">佳鏡院 (Kakyo-in)</span>
                        <span>— Maison de Kyo Fan Setlist</span>
                    </div>
                    <div className="text-[11px] text-pink-300/80">
                        ※ 曲をタップすると動画・試聴先へジャンプします 🎵
                    </div>
                </footer>
            </div>

            {/* 下部リンク */}
            <div className="text-center pt-2">
                <Link
                    href="/songs"
                    className="inline-block text-xs font-serif text-pink-300/70 hover:text-white transition-colors"
                >
                    ← きょーの一曲 トップへ
                </Link>
            </div>
        </div>
    );
}

export default function SetlistViewPage() {
    return (
        <main className="min-h-screen bg-transparent p-4 sm:p-8 md:p-12 relative overflow-hidden flex flex-col items-center">
            <Suspense fallback={<div className="text-pink-200 font-serif py-20">Loading setlist...</div>}>
                <SetlistViewContent />
            </Suspense>
        </main>
    );
}
