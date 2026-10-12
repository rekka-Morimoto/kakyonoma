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
    const [templateDataUrl, setTemplateDataUrl] = useState<string>('/images/setlist_template.png?v=' + Date.now());
    const cardRef = useRef<HTMLDivElement>(null);

    // テンプレート画像をBase64 DataURLとしてプリロード（CORS/Taintエラー完全防止）
    useEffect(() => {
        const loadImg = async () => {
            try {
                const res = await fetch('/images/setlist_template.png?t=' + Date.now());
                if (res.ok) {
                    const blob = await res.blob();
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                            setTemplateDataUrl(reader.result);
                        }
                    };
                    reader.readAsDataURL(blob);
                }
            } catch (err) {
                console.warn('Failed to load template as DataURL:', err);
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

    // 画面キャプチャPNG保存（dom-to-image-more & html2canvas対応）
    const handleDownloadPng = async () => {
        if (!cardRef.current || downloading) return;
        setDownloading(true);

        try {
            const node = cardRef.current;
            const domtoimage = (await import('dom-to-image-more')).default;

            const dataUrl = await domtoimage.toPng(node, {
                bgcolor: '#04030a',
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
            console.error('dom-to-image error, fallback to html2canvas:', err);
            try {
                const html2canvas = (await import('html2canvas')).default;
                const canvas = await html2canvas(cardRef.current, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#04030a',
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
        <div className="max-w-3xl w-full space-y-6 relative z-10 flex flex-col items-center">
            {/* 上部アクションバー */}
            <div className="w-full max-w-[720px] flex flex-wrap items-center justify-between gap-4">
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

            {/* 🌟 テンプレート画像（月＋佳鏡院＋SET LISTリボン＋星空）をベースにしたセトリカード 🌟 */}
            <div
                ref={cardRef}
                style={{
                    width: '100%',
                    maxWidth: '720px',
                    aspectRatio: '717 / 1024',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '1.25rem',
                    boxShadow: '0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 226, 154, 0.25)',
                    backgroundColor: '#04030a'
                }}
                className="select-none"
            >
                {/* ベース背景イラスト（月＋佳鏡院＋SET LISTリボン＋星空） */}
                <img
                    src={templateDataUrl}
                    alt="Maison de Kyo Setlist Base Template"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                        zIndex: 0
                    }}
                />

                {/* 🌟 右側の星空余白スペース（タイトル・制作者名・12曲を重ねて整然と表示） 🌟 */}
                <div
                    style={{
                        position: 'absolute',
                        left: '48%',
                        right: '4.5%',
                        top: '18.5%',
                        bottom: '5.5%',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start'
                    }}
                >
                    {/* タイトル＆制作者名ヘッダー */}
                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: '0.45rem',
                            paddingBottom: '0.4rem',
                            borderBottom: '1px solid rgba(255, 226, 154, 0.35)'
                        }}
                    >
                        {/* セトリタイトル */}
                        <h2
                            style={{
                                fontSize: 'clamp(1rem, 2.3vw, 1.55rem)',
                                fontWeight: 900,
                                color: '#ffffff',
                                letterSpacing: '0.04em',
                                lineHeight: 1.2,
                                textShadow: '0 0 12px rgba(255, 226, 154, 0.7), 0 2px 4px #000000',
                                marginBottom: '0.2rem'
                            }}
                            className="font-serif truncate"
                            title={setlist.title}
                        >
                            {setlist.title}
                        </h2>

                        {/* 制作者名 */}
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                background: 'rgba(0, 0, 0, 0.55)',
                                padding: '0.15rem 0.65rem',
                                borderRadius: '9999px',
                                border: '1px solid rgba(255, 226, 154, 0.45)'
                            }}
                        >
                            <span style={{ fontSize: '0.7rem', color: '#ffe29a' }}>Selected by</span>
                            <span
                                style={{
                                    fontSize: 'clamp(0.72rem, 1.4vw, 0.92rem)',
                                    fontWeight: 800,
                                    color: '#ffffff'
                                }}
                                className="font-serif"
                            >
                                {setlist.creator || 'きょーめいと'}
                            </span>
                        </div>
                    </div>

                    {/* 12曲のトラックリスト（星空スペースの高さに合わせて均等に12行美しく配置） */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            flex: 1,
                            minHeight: 0,
                            gap: '0.25rem'
                        }}
                    >
                        {setlist.songs.map((song, idx) => {
                            const trackNum = (idx + 1).toString().padStart(2, '0');
                            const hasUrl = !!song.url;

                            const content = (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        width: '100%',
                                        padding: '0.18rem 0.45rem',
                                        borderRadius: '0.45rem',
                                        background: 'rgba(5, 5, 18, 0.52)',
                                        border: '1px solid rgba(255, 226, 154, 0.22)',
                                        backdropFilter: 'blur(2px)',
                                        transition: 'all 0.15s ease'
                                    }}
                                    className="group-hover:bg-[#ffe29a]/20 group-hover:border-[#ffe29a]/60"
                                >
                                    {/* トラック番号 */}
                                    <span
                                        style={{
                                            fontFamily: 'monospace',
                                            fontWeight: 900,
                                            fontSize: 'clamp(0.68rem, 1.25vw, 0.85rem)',
                                            color: '#ffe29a',
                                            width: '1.4rem',
                                            flexShrink: 0,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {trackNum}
                                    </span>

                                    {/* カテゴリタグ */}
                                    <span
                                        style={{
                                            fontSize: 'clamp(0.55rem, 0.95vw, 0.65rem)',
                                            fontWeight: 700,
                                            padding: '0.06rem 0.3rem',
                                            borderRadius: '0.25rem',
                                            flexShrink: 0,
                                            fontFamily: 'sans-serif',
                                            background:
                                                song.category === 'original'
                                                    ? 'rgba(251, 191, 36, 0.3)'
                                                    : song.category === 'cover'
                                                    ? 'rgba(56, 189, 248, 0.3)'
                                                    : 'rgba(244, 114, 182, 0.3)',
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
                                            fontSize: 'clamp(0.68rem, 1.3vw, 0.88rem)',
                                            fontWeight: 700,
                                            color: '#ffffff',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            textShadow: '0 1px 4px rgba(0, 0, 0, 0.95)'
                                        }}
                                        className="font-serif group-hover:text-[#ffe29a]"
                                        title={song.title}
                                    >
                                        {translateDynamicText(song.title)}
                                    </span>

                                    {/* リンク再生アイコン */}
                                    {hasUrl && (
                                        <span
                                            style={{
                                                fontSize: '0.65rem',
                                                color: '#ffe29a',
                                                flexShrink: 0,
                                                opacity: 0.85
                                            }}
                                            className="group-hover:opacity-100 group-hover:scale-110"
                                        >
                                            ▶
                                        </span>
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
                                    {content}
                                </a>
                            ) : (
                                <div key={idx} className="block">
                                    {content}
                                </div>
                            );
                        })}
                    </div>

                    {/* 下部案内テキスト */}
                    <div
                        style={{
                            textAlign: 'right',
                            fontSize: 'clamp(0.55rem, 0.9vw, 0.65rem)',
                            color: 'rgba(255, 226, 154, 0.7)',
                            marginTop: '0.3rem',
                            fontFamily: 'sans-serif'
                        }}
                    >
                        ※ 曲をタップすると試聴先へ移動します
                    </div>
                </div>
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
