'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../../lib/i18nContext';
import { SetlistPayload } from '../page';
import html2canvas from 'html2canvas';

function SetlistViewContent() {
    const searchParams = useSearchParams();
    const { t, locale, translateDynamicText } = useLanguage();

    const [setlist, setSetlist] = useState<SetlistPayload | null>(null);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

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

                // 新形式（短縮形）の場合の正規化
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
                    // 旧形式
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
            // フォールバック
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

    // PNG画像として保存
    const handleDownloadPng = async () => {
        if (!cardRef.current || downloading) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0d0905',
                logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${setlist?.title || 'setlist'}_MaisonDeKyo.png`;
            link.href = imgData;
            link.click();
        } catch (err) {
            console.error('Failed to generate PNG:', err);
            alert(locale === 'zh' ? '图片生成失败' : '画像の生成に失敗しました');
        } finally {
            setDownloading(false);
        }
    };

    // X(Twitter)でシェア
    const handleShareTwitter = () => {
        if (!setlist) return;
        const text = encodeURIComponent(
            `【${setlist.title}】\n私の個人的最強セトリを作りました！🎧✨\n\n#佳鏡院 #個人的最強セトリ #メゾンドきょー\n`
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
        <div className="max-w-4xl w-full space-y-8 relative z-10">
            {/* 上部ナビゲーション */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                    href="/songs/setlist"
                    className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors group font-bold tracking-widest text-sm sm:text-base"
                >
                    <span className="mr-2 transform group-hover:-translate-x-1 transition-transform text-lg">←</span>
                    {locale === 'zh' ? '制作属于自己的歌单' : '新しくセトリを作る'}
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopyLink}
                        className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer border shadow-md ${
                            copied
                                ? 'bg-emerald-600 border-emerald-400 text-white'
                                : 'bg-[#c9a64e]/20 border-[#c9a64e]/60 text-[#ffe29a] hover:bg-[#c9a64e]/30'
                        }`}
                        title="閲覧リンクをコピー"
                    >
                        <span>{copied ? '✓' : '📋'}</span>
                        <span>
                            {copied
                                ? (locale === 'zh' ? '已复制链接！' : 'リンクをコピーしました！')
                                : (locale === 'zh' ? '复制分享链接' : '閲覧用リンクをコピー')}
                        </span>
                    </button>

                    <button
                        onClick={handleDownloadPng}
                        disabled={downloading}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:border-[#c9a64e]/60"
                        title="PNG画像として保存"
                    >
                        <span>{downloading ? '⏳' : '🖼️'}</span>
                        <span>
                            {downloading
                                ? (locale === 'zh' ? '生成中...' : '画像生成中...')
                                : (locale === 'zh' ? '保存为PNG图片' : 'セトリをPNG保存')}
                        </span>
                    </button>

                    <button
                        onClick={handleShareTwitter}
                        className="px-3 py-2 rounded-xl bg-black/60 hover:bg-black border border-white/20 hover:border-sky-400 text-white text-xs font-serif font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Xでポスト"
                    >
                        <span className="text-sky-400">𝕏</span>
                        <span className="hidden sm:inline">{locale === 'zh' ? '分享' : 'シェア'}</span>
                    </button>
                </div>
            </div>

            {/* コピー完了トーストメッセージ（フロート通知） */}
            {copied && (
                <div className="fixed bottom-6 right-6 z-50 bg-emerald-700/90 border border-emerald-400 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 font-serif text-sm animate-bounce">
                    <span>✓</span>
                    <span>{locale === 'zh' ? '閲覧用链接已成功复制到剪贴板！' : '閲覧用リンクをクリップボードにコピーしました！'}</span>
                </div>
            )}

            {/* PNG画像化対象カード（デザイン本体） */}
            <div
                ref={cardRef}
                className="bg-gradient-to-b from-[#18120c] via-[#0f0c08] to-[#1a140d] border-2 border-[#c9a64e]/50 rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-[0_0_50px_rgba(201,166,78,0.25)] relative overflow-hidden"
            >
                {/* 装飾の背景グラデーション＆フレーム */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#c9a64e]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#b38f38]/10 rounded-full blur-3xl pointer-events-none" />

                {/* ヘッダーエリア */}
                <header className="border-b border-[#c9a64e]/30 pb-6 mb-8 text-center relative z-10">
                    <div className="flex items-center justify-center gap-2 text-xs font-sans font-bold tracking-[0.3em] uppercase text-[#c9a64e] mb-2">
                        <span>✦ Maison de Kyo ✦</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-white text-outline mb-3 tracking-wide">
                        {setlist.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-serif text-[#d4c5b0]/80">
                        {setlist.creator && (
                            <span className="px-3 py-1 rounded-full bg-black/40 border border-[#c9a64e]/30 text-[#ffe29a]">
                                Selected by: <strong className="text-white">{setlist.creator}</strong>
                            </span>
                        )}
                        <span className="px-3 py-1 rounded-full bg-black/40 border border-white/10">
                            12 Special Tracks
                        </span>
                    </div>
                </header>

                {/* 12曲のトラックリスト一覧 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 relative z-10 mb-8">
                    {setlist.songs.map((song, idx) => {
                        const trackNum = (idx + 1).toString().padStart(2, '0');
                        const hasUrl = !!song.url;

                        const content = (
                            <div className="flex items-center gap-3.5 w-full">
                                {/* トラック番号 */}
                                <div className="w-9 h-9 rounded-xl bg-black/60 border border-[#c9a64e]/40 flex items-center justify-center font-mono font-black text-xs sm:text-sm text-[#ffe29a] flex-shrink-0 group-hover:border-[#c9a64e] group-hover:bg-[#c9a64e] group-hover:text-black transition-colors shadow">
                                    {trackNum}
                                </div>

                                {/* 曲名 & カテゴリ */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`text-[9px] font-sans px-1.5 py-0.2 rounded font-bold ${
                                            song.category === 'original'
                                                ? 'bg-[#c9a64e]/20 text-[#ffe29a]'
                                                : song.category === 'cover'
                                                ? 'bg-blue-500/20 text-blue-200'
                                                : 'bg-purple-500/20 text-purple-200'
                                        }`}>
                                            {song.alias ? song.alias : song.category === 'original' ? 'オリジナル' : song.category === 'cover' ? 'カバー' : '歌枠'}
                                        </span>
                                    </div>
                                    <div className="text-white font-serif font-bold text-sm truncate group-hover:text-[#ffe29a] transition-colors">
                                        {translateDynamicText(song.title)}
                                    </div>
                                </div>

                                {/* リンク先誘導アイコン */}
                                {hasUrl ? (
                                    <div className="w-7 h-7 rounded-full bg-[#c9a64e]/10 border border-[#c9a64e]/30 flex items-center justify-center text-[10px] text-[#ffe29a] group-hover:bg-[#c9a64e] group-hover:text-black transition-all flex-shrink-0">
                                        ↗
                                    </div>
                                ) : (
                                    <div className="text-[10px] text-[#d4c5b0]/40 font-mono flex-shrink-0">
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
                                className="p-3.5 rounded-2xl bg-black/40 hover:bg-[#c9a64e]/15 border border-white/10 hover:border-[#c9a64e]/70 transition-all duration-300 flex items-center justify-between group shadow-sm hover:shadow-[0_0_15px_rgba(201,166,78,0.2)] hover:translate-x-1 cursor-pointer"
                                title={`${song.title} を再生する (新しいタブで開く)`}
                            >
                                {content}
                            </a>
                        ) : (
                            <div
                                key={idx}
                                className="p-3.5 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between opacity-80"
                            >
                                {content}
                            </div>
                        );
                    })}
                </div>

                {/* フッター */}
                <footer className="pt-6 border-t border-[#c9a64e]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#d4c5b0]/60 font-serif gap-2 relative z-10">
                    <div>
                        Maison de Kyo - Kakyo-no-ma
                    </div>
                    <div className="text-[10px] font-sans text-center sm:text-right text-[#c9a64e]/80">
                        ※ 曲をタップすると試聴・動画リンクへジャンプします
                    </div>
                </footer>
            </div>

            {/* 下部アクション */}
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
