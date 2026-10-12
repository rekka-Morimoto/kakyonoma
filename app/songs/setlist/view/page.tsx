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

    // 高解像度Canvas APIによる直接PNG画像生成・保存（html2canvas非依存で100%確実に動作）
    const handleDownloadPng = async () => {
        if (!setlist || downloading) return;
        setDownloading(true);

        try {
            // 1. キャラクター画像の読み込み
            const characterImg = new Image();
            characterImg.crossOrigin = 'anonymous';
            await new Promise<void>((resolve) => {
                characterImg.onload = () => resolve();
                characterImg.onerror = () => resolve(); // エラー時も描画を継続
                characterImg.src = '/images/kakyo_singer.png';
            });

            // 2. 高解像度キャンバスの作成 (1200 x 1600)
            const W = 1200;
            const H = 1600;
            const canvas = document.createElement('canvas');
            canvas.width = W;
            canvas.height = H;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context not available');

            // --- 背景描画 (漆黒×深紺×和モダン金) ---
            const bgGradient = ctx.createLinearGradient(0, 0, W, H);
            bgGradient.addColorStop(0, '#0a080d');
            bgGradient.addColorStop(0.5, '#120f18');
            bgGradient.addColorStop(1, '#1b120c');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, W, H);

            // 背景の光輪・オーラ
            const aura = ctx.createRadialGradient(W - 250, H / 2, 50, W - 250, H / 2, 500);
            aura.addColorStop(0, 'rgba(201, 166, 78, 0.25)');
            aura.addColorStop(0.5, 'rgba(100, 60, 160, 0.15)');
            aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = aura;
            ctx.fillRect(0, 0, W, H);

            // --- ゴールドの外枠フレーム ---
            ctx.strokeStyle = 'rgba(201, 166, 78, 0.6)';
            ctx.lineWidth = 4;
            ctx.strokeRect(30, 30, W - 60, H - 60);

            ctx.strokeStyle = 'rgba(201, 166, 78, 0.2)';
            ctx.lineWidth = 1;
            ctx.strokeRect(40, 40, W - 80, H - 80);

            // 四隅の和モダン装飾（L字ライン）
            const cornerSize = 25;
            ctx.strokeStyle = '#ffe29a';
            ctx.lineWidth = 5;
            // 左上
            ctx.beginPath();
            ctx.moveTo(30, 30 + cornerSize);
            ctx.lineTo(30, 30);
            ctx.lineTo(30 + cornerSize, 30);
            ctx.stroke();
            // 右上
            ctx.beginPath();
            ctx.moveTo(W - 30 - cornerSize, 30);
            ctx.lineTo(W - 30, 30);
            ctx.lineTo(W - 30, 30 + cornerSize);
            ctx.stroke();
            // 左下
            ctx.beginPath();
            ctx.moveTo(30, H - 30 - cornerSize);
            ctx.lineTo(30, H - 30);
            ctx.lineTo(30 + cornerSize, H - 30);
            ctx.stroke();
            // 右下
            ctx.beginPath();
            ctx.moveTo(W - 30 - cornerSize, H - 30);
            ctx.lineTo(W - 30, H - 30);
            ctx.lineTo(W - 30, H - 30 - cornerSize);
            ctx.stroke();

            // --- キャラクターの描画 (右側に大きく配置) ---
            if (characterImg.complete && characterImg.naturalWidth > 0) {
                const charW = 580;
                const charH = (charW / characterImg.naturalWidth) * characterImg.naturalHeight;
                const charX = W - charW - 10;
                const charY = H - charH + 30;

                // 背面のシャドウ＆グロー
                ctx.save();
                ctx.shadowColor = 'rgba(201, 166, 78, 0.5)';
                ctx.shadowBlur = 40;
                ctx.drawImage(characterImg, charX, charY, charW, charH);
                ctx.restore();

                // 下部を自然にグラデーションでフェードアウト
                const fadeGradient = ctx.createLinearGradient(0, H - 200, 0, H);
                fadeGradient.addColorStop(0, 'rgba(15, 12, 10, 0)');
                fadeGradient.addColorStop(1, 'rgba(15, 12, 10, 0.95)');
                ctx.fillStyle = fadeGradient;
                ctx.fillRect(charX, H - 200, charW + 50, 200);
            }

            // --- タイトルヘッダー ---
            // ブランドロゴ
            ctx.fillStyle = '#c9a64e';
            ctx.font = 'bold 22px "Hiragino Mincho ProN", "Yu Mincho", serif';
            ctx.letterSpacing = '8px';
            ctx.fillText('✦ MAISON DE KYO ✦', 70, 95);

            // メインタイトル
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 52px "Hiragino Mincho ProN", "Yu Mincho", serif';
            ctx.shadowColor = 'rgba(201, 166, 78, 0.7)';
            ctx.shadowBlur = 15;
            ctx.fillText(setlist.title, 70, 165);
            ctx.shadowBlur = 0;

            // 制作者名 & 12曲クレジット
            ctx.fillStyle = '#ffe29a';
            ctx.font = 'bold 26px "Hiragino Kaku Gothic ProN", sans-serif';
            const creatorText = setlist.creator ? `Selected by  ${setlist.creator}` : 'Selected by  きょーめいと';
            ctx.fillText(creatorText, 70, 215);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '18px monospace';
            ctx.fillText('12 SPECIAL TRACKS  |  PERSONAL BEST SETLIST', 70, 250);

            // 仕切り線
            const lineGrad = ctx.createLinearGradient(70, 0, W - 70, 0);
            lineGrad.addColorStop(0, 'rgba(201, 166, 78, 0.8)');
            lineGrad.addColorStop(0.7, 'rgba(201, 166, 78, 0.2)');
            lineGrad.addColorStop(1, 'rgba(201, 166, 78, 0)');
            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(70, 275);
            ctx.lineTo(W - 70, 275);
            ctx.stroke();

            // --- 12曲トラックリスト描画 ---
            const startY = 320;
            const itemH = 92;
            const cardW = 680; // キャラの左側に収まる幅

            setlist.songs.forEach((song, i) => {
                const y = startY + i * itemH;
                const trackNum = (i + 1).toString().padStart(2, '0');

                // カード背景（半透明ブラック＋ゴールド縁）
                ctx.fillStyle = 'rgba(10, 8, 14, 0.75)';
                ctx.fillRect(70, y, cardW, 76);

                ctx.strokeStyle = 'rgba(201, 166, 78, 0.3)';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(70, y, cardW, 76);

                // トラック番号バッジ
                ctx.fillStyle = 'rgba(201, 166, 78, 0.25)';
                ctx.fillRect(80, y + 10, 56, 56);
                ctx.strokeStyle = '#c9a64e';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(80, y + 10, 56, 56);

                ctx.fillStyle = '#ffe29a';
                ctx.font = 'bold 24px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(trackNum, 108, y + 46);
                ctx.textAlign = 'left';

                // カテゴリ / 名義タグ
                let tagText = song.alias ? song.alias : song.category === 'original' ? 'オリジナル' : song.category === 'cover' ? 'カバー' : '歌枠';
                ctx.fillStyle = song.category === 'original' ? '#ffd778' : song.category === 'cover' ? '#93c5fd' : '#d8b4fe';
                ctx.font = 'bold 13px sans-serif';
                ctx.fillText(`[ ${tagText} ]`, 150, y + 30);

                // 曲名
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 21px "Hiragino Mincho ProN", "Yu Mincho", serif';
                const maxTitleW = cardW - 170;
                let displayTitle = song.title;
                if (ctx.measureText(displayTitle).width > maxTitleW) {
                    while (displayTitle.length > 0 && ctx.measureText(displayTitle + '...').width > maxTitleW) {
                        displayTitle = displayTitle.slice(0, -1);
                    }
                    displayTitle += '...';
                }
                ctx.fillText(displayTitle, 150, y + 58);
            });

            // --- フッター ---
            ctx.fillStyle = 'rgba(201, 166, 78, 0.8)';
            ctx.font = '16px "Hiragino Mincho ProN", "Yu Mincho", serif';
            ctx.fillText('佳鏡院 (Kakyo-in)  —  Maison de Kyo Official Fan Setlist', 70, H - 65);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.font = '14px monospace';
            ctx.fillText(new Date().toLocaleDateString('ja-JP'), W - 200, H - 65);

            // 3. PNGダウンロード
            const dataUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `${setlist.title || '最強セトリ'}_MaisonDeKyo.png`;
            downloadLink.href = dataUrl;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (err) {
            console.error('Canvas generation error:', err);
            alert(locale === 'zh' ? '保存PNG失败，请重试' : 'PNG画像の保存に失敗しました。もう一度お試しください。');
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

                    {/* PNG画像ダウンロードボタン */}
                    <button
                        onClick={handleDownloadPng}
                        disabled={downloading}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#e5c97b] to-amber-500 text-black text-xs sm:text-sm font-serif font-black transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(201,166,78,0.4)] hover:shadow-[0_0_30px_rgba(201,166,78,0.7)] hover:scale-105 active:scale-95 disabled:opacity-50"
                        title="セトリを高画質PNGで保存"
                    >
                        <span className="text-base">{downloading ? '⏳' : '🖼️'}</span>
                        <span>
                            {downloading
                                ? (locale === 'zh' ? '生成PNG中...' : 'PNG画像生成中...')
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

            {/* カッコいいセトリ表示カード本体 */}
            <div
                ref={cardRef}
                className="bg-gradient-to-br from-[#0c0910] via-[#120f18] to-[#18100a] border-2 border-[#c9a64e]/60 rounded-[3rem] p-6 sm:p-10 md:p-12 shadow-[0_0_60px_rgba(201,166,78,0.3)] relative overflow-hidden"
            >
                {/* 背景装飾 */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a64e]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

                {/* 立ち絵キャラクター (右側にスタイリッシュに配置) */}
                <div className="absolute -right-6 sm:right-2 bottom-0 w-48 sm:w-72 md:w-84 pointer-events-none z-0 select-none opacity-40 sm:opacity-85 transition-opacity">
                    <img
                        src="/images/kakyo_singer.png"
                        alt="佳鏡院"
                        className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(201,166,78,0.5)]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#18100a] to-transparent" />
                </div>

                {/* ヘッダーエリア */}
                <header className="border-b border-[#c9a64e]/30 pb-6 mb-8 relative z-10">
                    <div className="flex items-center gap-2 text-xs font-sans font-black tracking-[0.4em] uppercase text-[#c9a64e] mb-2 drop-shadow">
                        <span>✦ MAISON DE KYO ✦</span>
                        <span className="text-[#ffe29a]/60">OFFICIAL SETLIST</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-serif font-black text-white text-outline mb-3 tracking-wide drop-shadow-md">
                        {setlist.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-serif">
                        <div className="px-4 py-1.5 rounded-full bg-black/60 border border-[#c9a64e]/50 text-[#ffe29a] shadow-inner flex items-center gap-1.5">
                            <span>👤</span>
                            <span>Selected by:</span>
                            <strong className="text-white font-bold">{setlist.creator || 'きょーめいと'}</strong>
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-[#d4c5b0]/70 font-mono text-xs">
                            12 SPECIAL TRACKS
                        </div>
                    </div>
                </header>

                {/* トラックリスト (キャラの左側に配置) */}
                <div className="relative z-10 max-w-2xl space-y-2.5 mb-8">
                    {setlist.songs.map((song, idx) => {
                        const trackNum = (idx + 1).toString().padStart(2, '0');
                        const hasUrl = !!song.url;

                        const itemContent = (
                            <>
                                {/* トラック番号 */}
                                <div className="w-10 h-10 rounded-xl bg-black/70 border border-[#c9a64e]/50 flex items-center justify-center font-mono font-black text-sm text-[#ffe29a] flex-shrink-0 group-hover:border-[#c9a64e] group-hover:bg-[#c9a64e] group-hover:text-black transition-all shadow-md">
                                    {trackNum}
                                </div>

                                {/* 曲情報 */}
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
                                    <div className="w-8 h-8 rounded-full bg-[#c9a64e]/10 border border-[#c9a64e]/40 flex items-center justify-center text-xs text-[#ffe29a] group-hover:bg-[#c9a64e] group-hover:text-black group-hover:scale-110 transition-all flex-shrink-0 shadow">
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
                                className="p-3 sm:p-3.5 rounded-2xl bg-black/60 hover:bg-[#c9a64e]/15 border border-[#c9a64e]/20 hover:border-[#c9a64e] transition-all duration-300 flex items-center gap-3.5 group shadow-md hover:shadow-[0_0_20px_rgba(201,166,78,0.25)] hover:translate-x-1.5 cursor-pointer backdrop-blur-sm"
                                title={`${song.title} を再生する (新しいタブで開く)`}
                            >
                                {itemContent}
                            </a>
                        ) : (
                            <div
                                key={idx}
                                className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3.5 opacity-80 backdrop-blur-sm"
                            >
                                {itemContent}
                            </div>
                        );
                    })}
                </div>

                {/* カードフッター */}
                <footer className="pt-6 border-t border-[#c9a64e]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#d4c5b0]/70 font-serif gap-2 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-[#c9a64e]">❖</span>
                        <span>Maison de Kyo - Kakyo-no-ma</span>
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
