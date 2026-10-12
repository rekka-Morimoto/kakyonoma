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

    // 立ち絵イラストをBase64 DataURLとしてプリロード（画像保存時のCORS・Taintエラー防止）
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
                console.warn('Failed to load singer image as DataURL:', err);
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

    // 画面キャプチャPNG保存
    const handleDownloadPng = async () => {
        if (!cardRef.current || downloading) return;
        setDownloading(true);

        try {
            const node = cardRef.current;
            const domtoimage = (await import('dom-to-image-more')).default;

            const dataUrl = await domtoimage.toPng(node, {
                bgcolor: '#0a0910',
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
            console.error('dom-to-image error, trying html2canvas:', err);
            try {
                const html2canvas = (await import('html2canvas')).default;
                const canvas = await html2canvas(cardRef.current, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#0a0910',
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
            `【${setlist.title}】\n制作者: ${setlist.creator || 'きょーめいと'}\n私の個人的最強セトリを作りました！🎧✨\n\n#佳鏡院 #個人的最強セトリ #メゾンドきょー\n`
        );
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    if (!setlist) {
        return (
            <div className="glass-panel p-12 rounded-3xl border border-amber-500/20 text-center space-y-4 max-w-xl mx-auto my-20">
                <div className="text-4xl animate-bounce">🌕</div>
                <h2 className="text-xl font-serif font-bold text-white">
                    {locale === 'zh' ? '歌单数据不存在或链接无效' : 'セトリデータが見つかりません'}
                </h2>
                <p className="text-sm text-[#ffe29a]/70 font-sans">
                    {locale === 'zh' ? '请确认链接是否完整。' : 'URLが正しいかご確認ください。'}
                </p>
                <div className="pt-4">
                    <Link
                        href="/songs/setlist"
                        className="inline-block py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-serif font-bold text-sm shadow-lg shadow-amber-500/25"
                    >
                        {locale === 'zh' ? '制作新歌单' : 'セトリを作成する'}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl w-full space-y-6 relative z-10 flex flex-col items-center">
            {/* 上部アクションバー */}
            <div className="w-full max-w-[860px] flex flex-wrap items-center justify-between gap-4">
                <Link
                    href="/songs/setlist"
                    className="inline-flex items-center text-[#ffe29a] hover:text-white transition-colors group font-bold tracking-widest text-sm"
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
                                : 'bg-black/60 border border-[#ffe29a]/40 text-[#ffe29a] hover:bg-[#ffe29a]/20 hover:scale-105'
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
                        className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 text-black text-xs sm:text-sm font-serif font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 disabled:opacity-50"
                        title="このセトリ画像をそのままPNGで保存"
                    >
                        <span>{downloading ? '⏳' : '🖼️'}</span>
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
                <div className="fixed bottom-6 right-6 z-50 bg-emerald-700/95 border-2 border-emerald-300 text-white px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 font-serif text-sm animate-bounce">
                    <span className="text-lg">✓</span>
                    <span>{locale === 'zh' ? '閲覧用链接已成功复制到剪贴板！' : '閲覧用リンクをクリップボードにコピーしました！'}</span>
                </div>
            )}

            {/* 🌟 和モダン高品位デザインカード（PNG画像化対象） 🌟 */}
            <div
                ref={cardRef}
                style={{
                    width: '100%',
                    maxWidth: '860px',
                    background: 'linear-gradient(155deg, #130d17 0%, #09080e 45%, #150f1a 100%)',
                    border: '2px solid rgba(201, 166, 78, 0.65)',
                    borderRadius: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 0 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(201, 166, 78, 0.25)'
                }}
                className="p-5 sm:p-8 md:p-10 select-none text-white font-serif"
            >
                {/* 飾り枠（和風コーナーアクセント） */}
                <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-[#ffe29a]/60 pointer-events-none rounded-tl-sm" />
                <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-[#ffe29a]/60 pointer-events-none rounded-tr-sm" />
                <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-[#ffe29a]/60 pointer-events-none rounded-bl-sm" />
                <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-[#ffe29a]/60 pointer-events-none rounded-br-sm" />

                {/* 背景の淡い和柄グロー光 */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 -right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* 🌸 ヘッダーエリア 🌸 */}
                <header className="relative z-10 border-b border-[#c9a64e]/35 pb-5 mb-6">
                    <div className="flex items-center justify-between text-xs font-sans tracking-[0.3em] uppercase text-[#ffe29a] mb-2 font-bold">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[#c9a64e]">✦</span>
                            <span>MAISON DE KYO</span>
                            <span className="text-white/40">|</span>
                            <span className="text-[#ffd67a]/80">SPECIAL SETLIST</span>
                        </div>
                        <div className="hidden sm:inline-block text-[10px] text-white/50 tracking-widest font-mono">
                            12 SPECIAL TRACKS
                        </div>
                    </div>

                    <h1
                        style={{
                            fontSize: 'clamp(1.7rem, 4vw, 2.7rem)',
                            fontWeight: 900,
                            letterSpacing: '0.04em',
                            lineHeight: 1.25,
                            background: 'linear-gradient(135deg, #ffffff 0%, #fff0c7 50%, #fcd299 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                        }}
                        className="mb-3 font-serif"
                    >
                        {setlist.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
                        <div className="px-3.5 py-1 rounded-full bg-black/60 border border-[#c9a64e]/50 text-[#ffe29a] flex items-center gap-2 shadow-inner">
                            <span className="text-xs">👤</span>
                            <span className="text-white/70">Selected by:</span>
                            <strong className="text-white font-bold">{setlist.creator || 'きょーめいと'}</strong>
                        </div>
                        <div className="sm:hidden px-3 py-1 rounded-full bg-black/40 border border-white/10 text-white/60 font-mono text-[10px]">
                            12 TRACKS
                        </div>
                    </div>
                </header>

                {/* 🌸 メインエリア（左側: 12曲リスト / 右側: 立ち絵イラスト） 🌸 */}
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-8">
                    {/* 左側：01〜12曲のトラックリスト */}
                    <div className="flex-1 w-full space-y-2">
                        {setlist.songs.map((song, idx) => {
                            const trackNum = (idx + 1).toString().padStart(2, '0');
                            const hasUrl = !!song.url;

                            const itemContent = (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.6rem',
                                        width: '100%',
                                        padding: '0.35rem 0.6rem',
                                        borderRadius: '0.75rem',
                                        background: 'rgba(10, 8, 16, 0.65)',
                                        border: '1px solid rgba(201, 166, 78, 0.25)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="group-hover:bg-[#c9a64e]/15 group-hover:border-[#ffe29a]/70 group-hover:shadow-[0_0_12px_rgba(201,166,78,0.25)]"
                                >
                                    {/* トラック番号バッジ */}
                                    <div
                                        style={{
                                            width: '1.85rem',
                                            height: '1.85rem',
                                            borderRadius: '0.5rem',
                                            background: 'rgba(0, 0, 0, 0.8)',
                                            border: '1px solid rgba(201, 166, 78, 0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontFamily: 'monospace',
                                            fontWeight: 900,
                                            fontSize: '0.82rem',
                                            color: '#ffe29a',
                                            flexShrink: 0
                                        }}
                                        className="group-hover:bg-[#c9a64e] group-hover:text-black transition-colors"
                                    >
                                        {trackNum}
                                    </div>

                                    {/* カテゴリバッジ */}
                                    <span
                                        style={{
                                            fontSize: '0.62rem',
                                            fontWeight: 700,
                                            padding: '0.12rem 0.35rem',
                                            borderRadius: '0.3rem',
                                            flexShrink: 0,
                                            fontFamily: 'sans-serif',
                                            background:
                                                song.category === 'original'
                                                    ? 'rgba(251, 191, 36, 0.25)'
                                                    : song.category === 'cover'
                                                    ? 'rgba(56, 189, 248, 0.25)'
                                                    : 'rgba(244, 114, 182, 0.25)',
                                            color:
                                                song.category === 'original'
                                                    ? '#fef08a'
                                                    : song.category === 'cover'
                                                    ? '#bae6fd'
                                                    : '#fbcfe8',
                                            border: `1px solid ${
                                                song.category === 'original'
                                                    ? 'rgba(251, 191, 36, 0.45)'
                                                    : song.category === 'cover'
                                                    ? 'rgba(56, 189, 248, 0.45)'
                                                    : 'rgba(244, 114, 182, 0.45)'
                                            }`
                                        }}
                                    >
                                        {song.alias ? song.alias : song.category === 'original' ? 'オリ' : song.category === 'cover' ? 'カバ' : '歌枠'}
                                    </span>

                                    {/* 曲名 */}
                                    <span
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            fontSize: 'clamp(0.78rem, 1.4vw, 0.92rem)',
                                            fontWeight: 700,
                                            color: '#ffffff',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.9)'
                                        }}
                                        className="group-hover:text-[#ffe29a] transition-colors"
                                        title={song.title}
                                    >
                                        {translateDynamicText(song.title)}
                                    </span>

                                    {/* リンク誘導アイコン */}
                                    {hasUrl ? (
                                        <div
                                            style={{
                                                width: '1.4rem',
                                                height: '1.4rem',
                                                borderRadius: '50%',
                                                background: 'rgba(201, 166, 78, 0.15)',
                                                border: '1px solid rgba(201, 166, 78, 0.4)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.65rem',
                                                color: '#ffe29a',
                                                flexShrink: 0
                                            }}
                                            className="group-hover:bg-[#c9a64e] group-hover:text-black group-hover:scale-110 transition-all"
                                        >
                                            ↗
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-white/30 font-mono flex-shrink-0 px-1">
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
                                    className="block group cursor-pointer"
                                    title={`${song.title} を開く`}
                                >
                                    {itemContent}
                                </a>
                            ) : (
                                <div key={idx} className="block">
                                    {itemContent}
                                </div>
                            );
                        })}
                    </div>

                    {/* 右側：立ち絵キャラクター＆プレート */}
                    <div className="w-full md:w-[280px] lg:w-[310px] flex-shrink-0 flex flex-col items-center justify-between relative pt-2">
                        {/* 立ち絵枠（丸窓風のバックライト） */}
                        <div className="relative w-full flex flex-col items-center justify-center">
                            <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-amber-500/15 via-rose-500/15 to-transparent border border-[#c9a64e]/30 absolute top-10 pointer-events-none blur-sm" />

                            <img
                                src={characterDataUrl}
                                alt="佳鏡院"
                                style={{
                                    width: 'auto',
                                    maxHeight: '440px',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 0 25px rgba(201, 166, 78, 0.4))'
                                }}
                                className="relative z-10 select-none pointer-events-none"
                            />
                        </div>

                        {/* ネームプレート */}
                        <div
                            style={{
                                width: '90%',
                                marginTop: '0.5rem',
                                padding: '0.45rem 0.8rem',
                                borderRadius: '9999px',
                                background: 'linear-gradient(135deg, rgba(20, 15, 25, 0.9) 0%, rgba(10, 8, 14, 0.95) 100%)',
                                border: '1.5px solid rgba(201, 166, 78, 0.6)',
                                textAlign: 'center',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6), 0 0 10px rgba(201, 166, 78, 0.2)'
                            }}
                            className="relative z-10"
                        >
                            <div className="text-[11px] font-sans tracking-widest text-[#ffe29a] font-bold">
                                佳鏡院 - Maison de Kyo
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🌸 カードフッター 🌸 */}
                <footer className="relative z-10 mt-6 pt-4 border-t border-[#c9a64e]/25 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 font-serif gap-2">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[#c9a64e]">❖</span>
                        <span>Maison de Kyo Official Fan Setlist</span>
                    </div>
                    <div className="text-[10px] font-sans text-center sm:text-right text-[#ffe29a]/80">
                        ※ 曲をタップすると試聴・動画リンクへジャンプします
                    </div>
                </footer>
            </div>

            {/* 下部リンク */}
            <div className="text-center pt-2">
                <Link
                    href="/songs"
                    className="inline-block text-xs font-serif text-[#ffe29a]/70 hover:text-white transition-colors"
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
            <Suspense fallback={<div className="text-[#ffe29a] font-serif py-20">Loading setlist...</div>}>
                <SetlistViewContent />
            </Suspense>
        </main>
    );
}
