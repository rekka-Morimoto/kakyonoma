'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../../lib/i18nContext';
import { SetlistPayload } from '../page';
import html2canvas from 'html2canvas';

function SetlistViewContent() {
    const searchParams = useSearchParams();
    const { locale, translateDynamicText } = useLanguage();

    const [setlist, setSetlist] = useState<SetlistPayload | null>(null);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [characterDataUrl, setCharacterDataUrl] = useState<string>('/images/kakyo_singer.png');
    const cardRef = useRef<HTMLDivElement>(null);

    // キャラ画像をBase64 DataURLとしてプリロード（CORS/Taintエラーを完全に防止）
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
                console.warn('Failed to convert image to DataURL, using default src:', err);
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
                console.error('Failed to parse setlist data with TextDecoder, trying legacy:', e);
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
                    console.error('All decode methods failed:', err2);
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

    // 画面のカード要素をそのまま高解像度キャプチャしてPNG保存
    const handleDownloadPng = async () => {
        if (!cardRef.current || downloading) return;
        setDownloading(true);

        try {
            const element = cardRef.current;

            // キャプチャオプション
            const canvas = await html2canvas(element, {
                scale: 2, // 2倍高解像度
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#0c0910',
                logging: false,
                scrollX: 0,
                scrollY: 0,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            });

            // Blob経由で確実にダウンロード
            canvas.toBlob((blob) => {
                if (!blob) {
                    // フォールバック: toDataURL
                    const dataUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = `${setlist?.title || '最強セトリ'}_MaisonDeKyo.png`;
                    link.href = dataUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setDownloading(false);
                    return;
                }

                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `${setlist?.title || '最強セトリ'}_MaisonDeKyo.png`;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                setDownloading(false);
            }, 'image/png');
        } catch (err) {
            console.error('Capture error:', err);
            // フォールバック（dom-to-image）
            try {
                const domtoimage = await import('dom-to-image-more');
                const dataUrl = await domtoimage.default.toPng(cardRef.current, {
                    quality: 0.95,
                    bgcolor: '#0c0910'
                });
                const link = document.createElement('a');
                link.download = `${setlist?.title || '最強セトリ'}_MaisonDeKyo.png`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (fallbackErr) {
                console.error('Fallback capture error:', fallbackErr);
                alert(locale === 'zh' ? '保存图片失败，请截图保存' : '画像の保存に失敗しました。画面のスクリーンショットでも保存いただけます。');
            } finally {
                setDownloading(false);
            }
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
            <div className="glass-panel p-12 rounded-3xl border-white/10 text-center space-y-4 max-w-xl mx-auto my-20">
                <div className="text-4xl">⚠️</div>
                <h2 className="text-xl font-serif font-bold text-white">
                    {locale === 'zh' ? '歌单数据不存在或链接无效' : 'セトリデータが見つかりません'}
                </h2>
                <p className="text-sm text-[#d4c5b0]/70 font-sans">
                    {locale === 'zh' ? '请确认链接是否完整。' : 'URLが正しいかご確認ください。'}
                </p>
                <div className="pt-4">
                    <Link
                        href="/songs/setlist"
                        className="inline-block py-3 px-6 rounded-xl bg-[#c9a64e] text-black font-serif font-bold text-sm"
                    >
                        {locale === 'zh' ? '制作新歌单' : 'セトリを作成する'}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl w-full space-y-8 relative z-10">
            {/* 上部アクションバー */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                    href="/songs/setlist"
                    className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors group font-bold tracking-widest text-sm sm:text-base"
                >
                    <span className="mr-2 transform group-hover:-translate-x-1 transition-transform text-lg">←</span>
                    {locale === 'zh' ? '重新制作歌单' : '新しくセトリを作る'}
                </Link>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* クリップボードコピーボタン */}
                    <button
                        onClick={handleCopyLink}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 cursor-pointer border shadow-lg ${
                            copied
                                ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-900/50'
                                : 'bg-gradient-to-r from-[#c9a64e]/30 to-[#c9a64e]/15 border-[#c9a64e]/70 text-[#ffe29a] hover:bg-[#c9a64e]/40 hover:scale-105'
                        }`}
                        title="閲覧リンクをコピー"
                    >
                        <span className="text-base">{copied ? '✓' : '📋'}</span>
                        <span>
                            {copied
                                ? (locale === 'zh' ? '已复制分享链接！' : 'リンクをコピーしました！')
                                : (locale === 'zh' ? '复制分享链接' : '閲覧用リンクをコピー')}
                        </span>
                    </button>

                    {/* PNG画像ダウンロードボタン（画面キャプチャ） */}
                    <button
                        onClick={handleDownloadPng}
                        disabled={downloading}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#e5c97b] to-amber-500 text-black text-xs sm:text-sm font-serif font-black transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(201,166,78,0.4)] hover:shadow-[0_0_30px_rgba(201,166,78,0.7)] hover:scale-105 active:scale-95 disabled:opacity-50"
                        title="この画面をそのままPNG画像として保存"
                    >
                        <span className="text-base">{downloading ? '⏳' : '🖼️'}</span>
                        <span>
                            {downloading
                                ? (locale === 'zh' ? 'キャプチャ中...' : '画面キャプチャ中...')
                                : (locale === 'zh' ? '保存为PNG图片' : 'セトリをPNG保存')}
                        </span>
                    </button>

                    {/* X シェアボタン */}
                    <button
                        onClick={handleShareTwitter}
                        className="px-4 py-2.5 rounded-xl bg-black/80 hover:bg-black border border-white/20 hover:border-sky-400 text-white text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        title="Xでポスト"
                    >
                        <span className="text-sky-400 font-sans">𝕏</span>
                        <span className="hidden sm:inline">{locale === 'zh' ? '分享' : 'シェア'}</span>
                    </button>
                </div>
            </div>

            {/* コピー完了トースト通知 */}
            {copied && (
                <div className="fixed bottom-6 right-6 z-50 bg-emerald-700/95 border-2 border-emerald-400 text-white px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 font-serif text-sm animate-bounce">
                    <span className="text-lg">✓</span>
                    <span>{locale === 'zh' ? '閲覧用链接已成功复制到剪贴板！' : '閲覧用リンクをクリップボードにコピーしました！'}</span>
                </div>
            )}

            {/* 閲覧用ポスターカード本体（画面表示 ＆ キャプチャ対象） */}
            <div
                ref={cardRef}
                style={{
                    backgroundColor: '#0c0910',
                    backgroundImage: 'linear-gradient(135deg, #0c0910 0%, #130f1a 50%, #1a120b 100%)'
                }}
                className="border-2 border-[#c9a64e]/70 rounded-[2.5rem] p-5 sm:p-9 md:p-12 shadow-[0_0_60px_rgba(201,166,78,0.3)] relative overflow-hidden text-left"
            >
                {/* 装飾の和モダン四隅コーナーアクセント */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#ffe29a] pointer-events-none" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#ffe29a] pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#ffe29a] pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#ffe29a] pointer-events-none" />

                {/* ヘッダーエリア */}
                <header className="border-b border-[#c9a64e]/30 pb-5 mb-6 relative z-10">
                    <div className="flex items-center gap-2 text-xs font-sans font-black tracking-[0.4em] uppercase text-[#c9a64e] mb-2 drop-shadow">
                        <span>✦ MAISON DE KYO ✦</span>
                        <span className="text-[#ffe29a]/60">SPECIAL SETLIST</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-white text-outline mb-3 tracking-wide drop-shadow-md">
                        {setlist.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-serif">
                        <div className="px-4 py-1.5 rounded-full bg-black/70 border border-[#c9a64e]/60 text-[#ffe29a] shadow-inner flex items-center gap-2">
                            <span>👤</span>
                            <span>Selected by:</span>
                            <strong className="text-white font-bold text-sm sm:text-base">{setlist.creator || 'きょーめいと'}</strong>
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-black/50 border border-white/15 text-[#d4c5b0]/80 font-mono text-xs">
                            12 SPECIAL TRACKS
                        </div>
                    </div>
                </header>

                {/* メインレイアウト: トラックリスト と 透過キャラ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
                    {/* 左側: 12曲のトラックリスト (幅7〜8列) */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-2 sm:space-y-2.5">
                        {setlist.songs.map((song, idx) => {
                            const trackNum = (idx + 1).toString().padStart(2, '0');
                            const hasUrl = !!song.url;

                            const itemInner = (
                                <>
                                    {/* ナンバリングバッジ */}
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/80 border border-[#c9a64e]/60 flex items-center justify-center font-mono font-black text-xs sm:text-sm text-[#ffe29a] flex-shrink-0 group-hover:border-[#c9a64e] group-hover:bg-[#c9a64e] group-hover:text-black transition-all shadow-md">
                                        {trackNum}
                                    </div>

                                    {/* 曲名 & カテゴリ */}
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`text-[9px] font-sans px-2 py-0.2 rounded font-bold ${
                                                song.category === 'original'
                                                    ? 'bg-[#c9a64e]/20 text-[#ffe29a] border border-[#c9a64e]/40'
                                                    : song.category === 'cover'
                                                    ? 'bg-blue-500/20 text-blue-200 border border-blue-500/40'
                                                    : 'bg-purple-500/20 text-purple-200 border border-purple-500/40'
                                            }`}>
                                                {song.alias ? song.alias : song.category === 'original' ? 'オリジナル' : song.category === 'cover' ? 'カバー' : '歌枠'}
                                            </span>
                                        </div>
                                        <div className="text-white font-serif font-bold text-sm sm:text-base truncate group-hover:text-[#ffe29a] transition-colors">
                                            {translateDynamicText(song.title)}
                                        </div>
                                    </div>

                                    {/* リンク誘導アイコン */}
                                    {hasUrl ? (
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#c9a64e]/15 border border-[#c9a64e]/40 flex items-center justify-center text-xs text-[#ffe29a] group-hover:bg-[#c9a64e] group-hover:text-black group-hover:scale-110 transition-all flex-shrink-0 shadow">
                                            ↗
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-[#d4c5b0]/40 font-mono flex-shrink-0">
                                            —
                                        </div>
                                    )}
                                </>
                            );

                            return hasUrl ? (
                                <a
                                    key={idx}
                                    href={song.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-[#c9a64e]/15 border border-[#c9a64e]/25 hover:border-[#c9a64e] transition-all duration-300 flex items-center gap-3 sm:gap-3.5 group shadow-md hover:shadow-[0_0_15px_rgba(201,166,78,0.25)] hover:translate-x-1 cursor-pointer"
                                    title={`${song.title} を再生する (新しいタブで開く)`}
                                >
                                    {itemInner}
                                </a>
                            ) : (
                                <div
                                    key={idx}
                                    className="p-2.5 sm:p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3 sm:gap-3.5 opacity-80"
                                >
                                    {itemInner}
                                </div>
                            );
                        })}
                    </div>

                    {/* 右側: 佳鏡院の歌唱立ち絵キャラクター (幅4〜5列、カッコよく前面配置) */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center justify-center relative pt-4 lg:pt-0">
                        <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none flex justify-center">
                            {/* キャラの背景オーラ・後光 */}
                            <div className="absolute inset-0 bg-radial from-[#c9a64e]/25 via-purple-600/10 to-transparent blur-2xl rounded-full pointer-events-none" />

                            {/* 透過キャラ画像 */}
                            <img
                                src={characterDataUrl}
                                alt="佳鏡院"
                                className="relative z-10 w-full h-auto object-contain max-h-[640px] drop-shadow-[0_0_25px_rgba(201,166,78,0.55)] select-none"
                            />

                            {/* 足元フェード */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1a120b] via-[#1a120b]/60 to-transparent z-20 pointer-events-none" />
                        </div>

                        {/* キャラクタースタンプ・クレジットバッジ */}
                        <div className="mt-2 px-4 py-1.5 rounded-full bg-black/70 border border-[#c9a64e]/40 text-[#c9a64e] text-xs font-serif font-black tracking-widest text-center shadow-lg">
                            佳鏡院 - Maison de Kyo
                        </div>
                    </div>
                </div>

                {/* カードフッター */}
                <footer className="pt-5 mt-6 border-t border-[#c9a64e]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#d4c5b0]/70 font-serif gap-2 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-[#c9a64e]">❖</span>
                        <span>Maison de Kyo Official Fan Setlist</span>
                    </div>
                    <div className="text-[11px] font-sans text-center sm:text-right text-[#ffe29a]/90">
                        ※ 曲をタップすると試聴・動画リンクへジャンプします
                    </div>
                </footer>
            </div>

            {/* 下部リンク */}
            <div className="text-center pt-4">
                <Link
                    href="/songs"
                    className="inline-block text-xs font-serif text-[#d4c5b0]/70 hover:text-white transition-colors"
                >
                    ← きょーの一曲 トップへ
                </Link>
            </div>
        </div>
    );
}

export default function SetlistViewPage() {
    return (
        <main className="min-h-screen bg-transparent p-4 sm:p-8 md:p-16 relative overflow-hidden flex flex-col items-center">
            <Suspense fallback={<div className="text-white font-serif py-20">Loading setlist...</div>}>
                <SetlistViewContent />
            </Suspense>
        </main>
    );
}
