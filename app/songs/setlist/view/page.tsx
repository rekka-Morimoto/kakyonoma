'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../../lib/i18nContext';
import { SetlistPayload } from '../page';

function SetlistViewContent() {
    const searchParams = useSearchParams();
    const { locale, translateDynamicText } = useLanguage();

    const [setlist, setSetlist] = useState<SetlistPayload | null>(null);
    const [copied, setCopied] = useState(false);

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
        <div className="max-w-3xl w-full space-y-5 relative z-10 flex flex-col items-center">
            {/* 上部アクションバー */}
            <div className="w-full max-w-[720px] flex items-center justify-between gap-3 px-1">
                <Link
                    href="/songs/setlist"
                    className="inline-flex items-center text-[#ffe29a] hover:text-white transition-colors group font-bold tracking-wider text-xs sm:text-sm"
                >
                    <span className="mr-1 transform group-hover:-translate-x-1 transition-transform">←</span>
                    {locale === 'zh' ? '重新制作歌单' : '新しくセトリを作る'}
                </Link>

                <div className="flex items-center gap-2">
                    {/* クリップボードコピーボタン */}
                    <button
                        onClick={handleCopyLink}
                        className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                            copied
                                ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                                : 'bg-black/60 border border-[#ffe29a]/40 text-[#ffe29a] hover:bg-[#ffe29a]/20 hover:scale-105'
                        }`}
                        title="閲覧リンクをコピー"
                    >
                        <span>{copied ? '✓' : '📋'}</span>
                        <span>
                            {copied
                                ? (locale === 'zh' ? '已复制！' : 'コピー完了！')
                                : (locale === 'zh' ? '复制链接' : 'リンクをコピー')}
                        </span>
                    </button>

                    {/* X シェアボタン */}
                    <button
                        onClick={handleShareTwitter}
                        className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-black/80 hover:bg-black border border-white/20 hover:border-sky-400 text-white text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
                        title="Xでポスト"
                    >
                        <span className="text-sky-400 font-sans font-bold">𝕏</span>
                        <span>{locale === 'zh' ? 'シェア' : 'シェア'}</span>
                    </button>
                </div>
            </div>

            {/* コピー完了トースト通知 */}
            {copied && (
                <div className="fixed bottom-6 right-6 z-50 bg-emerald-700/95 border-2 border-emerald-300 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 font-serif text-xs sm:text-sm animate-bounce">
                    <span className="text-base">✓</span>
                    <span>{locale === 'zh' ? '閲覧用链接已复制！' : '閲覧用リンクをコピーしました！'}</span>
                </div>
            )}

            {/* 🌟 テンプレート画像（月＋佳鏡院＋SET LISTリボン＋星空）をベースにしたセトリカード 🌟 */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '720px',
                    aspectRatio: '717 / 1024',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '1.25rem',
                    boxShadow: '0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 226, 154, 0.25)',
                    backgroundColor: '#04030a',
                    containerType: 'inline-size'
                }}
                className="select-none"
            >
                {/* ベース背景イラスト（月＋佳鏡院＋SET LISTリボン＋星空） */}
                <img
                    src="/images/setlist_template.png"
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

                {/* 🌟 右側の星空余白スペース（モバイル・PC問わず100%比率連動で絶対に枠外へはみ出さない） 🌟 */}
                <div
                    style={{
                        position: 'absolute',
                        left: '46%',
                        right: '3.5%',
                        top: '17.5%',
                        bottom: '4.5%',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    {/* タイトル＆制作者名ヘッダー */}
                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: '0.8cqi',
                            paddingBottom: '0.8cqi',
                            boxShadow: '0 1px 0 rgba(255, 226, 154, 0.35)'
                        }}
                    >
                        {/* セトリタイトル（画面幅連動で美しくフィット） */}
                        <h2
                            style={{
                                fontSize: 'clamp(0.85rem, 3.4cqi, 1.7rem)',
                                fontWeight: 900,
                                color: '#ffffff',
                                letterSpacing: '0.04em',
                                lineHeight: 1.15,
                                textShadow: '0 0 14px rgba(255, 226, 154, 0.8), 0 2px 4px #000000',
                                marginBottom: '0.4cqi'
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
                                gap: '0.4cqi',
                                background: 'rgba(0, 0, 0, 0.65)',
                                padding: '0.2cqi 1.2cqi',
                                borderRadius: '9999px',
                                boxShadow: 'inset 0 0 0 1px rgba(255, 226, 154, 0.45)'
                            }}
                        >
                            <span style={{ fontSize: 'clamp(0.55rem, 1.6cqi, 0.8rem)', color: '#ffe29a' }}>Selected by</span>
                            <span
                                style={{
                                    fontSize: 'clamp(0.65rem, 2cqi, 0.98rem)',
                                    fontWeight: 800,
                                    color: '#ffffff'
                                }}
                                className="font-serif"
                            >
                                {setlist.creator || 'きょーめいと'}
                            </span>
                        </div>
                    </div>

                    {/* 12曲のトラックリスト（星空スペースの高さに合わせて等分割され、モバイルでも絶対にはみ出さない） */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            flex: 1,
                            minHeight: 0,
                            gap: '0.3cqi'
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
                                        gap: '0.6cqi',
                                        width: '100%',
                                        height: '100%',
                                        padding: '0 clamp(4px, 0.8cqi, 8px)',
                                        borderRadius: 'clamp(3px, 0.7cqi, 6px)',
                                        background: 'linear-gradient(90deg, rgba(8, 6, 20, 0.72) 0%, rgba(12, 10, 26, 0.58) 100%)',
                                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 226, 154, 0.22)',
                                        transition: 'all 0.15s ease'
                                    }}
                                    className="group-hover:bg-[#ffe29a]/20 group-hover:shadow-[0_0_10px_rgba(255,226,154,0.3)]"
                                >
                                    {/* トラック番号 */}
                                    <span
                                        style={{
                                            fontFamily: 'monospace',
                                            fontWeight: 900,
                                            fontSize: 'clamp(0.62rem, 2.2cqi, 1rem)',
                                            color: '#ffe29a',
                                            flexShrink: 0,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {trackNum}
                                    </span>

                                    {/* カテゴリタグ */}
                                    <span
                                        style={{
                                            fontSize: 'clamp(0.5rem, 1.5cqi, 0.72rem)',
                                            fontWeight: 800,
                                            padding: '0.1cqi 0.5cqi',
                                            borderRadius: 'clamp(2px, 0.4cqi, 4px)',
                                            flexShrink: 0,
                                            fontFamily: 'sans-serif',
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
                                            boxShadow: `inset 0 0 0 1px ${
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

                                    {/* 曲名（モバイルでもはみ出さず、読める絶妙なフォントサイズ） */}
                                    <span
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            fontSize: 'clamp(0.65rem, 2.3cqi, 1.05rem)',
                                            fontWeight: 800,
                                            color: '#ffffff',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.95)',
                                            letterSpacing: '0.01em'
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
                                                fontSize: 'clamp(0.55rem, 1.6cqi, 0.75rem)',
                                                color: '#ffe29a',
                                                flexShrink: 0,
                                                opacity: 0.9
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
                                    style={{ flex: 1, minHeight: 0, display: 'flex' }}
                                    className="block group cursor-pointer focus:outline-none"
                                    title={`${song.title} を開く`}
                                >
                                    {content}
                                </a>
                            ) : (
                                <div key={idx} style={{ flex: 1, minHeight: 0, display: 'flex' }} className="block">
                                    {content}
                                </div>
                            );
                        })}
                    </div>

                    {/* 下部案内テキスト */}
                    <div
                        style={{
                            textAlign: 'right',
                            fontSize: 'clamp(0.5rem, 1.4cqi, 0.68rem)',
                            color: 'rgba(255, 226, 154, 0.75)',
                            marginTop: '0.5cqi',
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
        <main className="min-h-screen bg-transparent p-3 sm:p-8 md:p-12 relative overflow-hidden flex flex-col items-center">
            <Suspense fallback={<div className="text-[#ffe29a] font-serif py-20">Loading setlist...</div>}>
                <SetlistViewContent />
            </Suspense>
        </main>
    );
}
