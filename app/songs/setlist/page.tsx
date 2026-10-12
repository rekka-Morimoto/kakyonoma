'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../lib/i18nContext';
import { SelectableSong } from '../../api/songs/all/route';

const SETLIST_SIZE = 12;

export interface SetlistPayload {
    title: string;
    creator: string;
    createdAt: string;
    songs: {
        track: number;
        title: string;
        category: 'original' | 'cover' | 'stream';
        alias?: string;
        url?: string;
    }[];
}

export default function CreateSetlistPage() {
    const router = useRouter();
    const { t, locale, translateDynamicText } = useLanguage();

    const [allSongs, setAllSongs] = useState<SelectableSong[]>([]);
    const [loading, setLoading] = useState(true);

    const [setlistTitle, setSetlistTitle] = useState('個人的最強セトリ');
    const [creatorName, setCreatorName] = useState('');

    // 12スロットの選択曲 (null は未選択)
    const [selectedSlots, setSelectedSlots] = useState<(SelectableSong | null)[]>(
        Array(SETLIST_SIZE).fill(null)
    );

    // スロットごとの選曲モーダル/セレクター状態 (null = 開いていない, 0〜11 = そのスロットのモーダル/選択ドロップダウン)
    const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);
    const [modalSearch, setModalSearch] = useState('');
    const [modalCategory, setModalCategory] = useState<'all' | 'original' | 'cover' | 'stream'>('all');

    useEffect(() => {
        async function fetchSongs() {
            try {
                const res = await fetch('/api/songs/all');
                if (res.ok) {
                    const data = await res.json();
                    setAllSongs(data.songs || []);
                }
            } catch (err) {
                console.error('Failed to fetch songs:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchSongs();
    }, []);

    // 検索・絞り込み
    const filteredSongs = useMemo(() => {
        let list = allSongs;
        if (modalCategory !== 'all') {
            list = list.filter((s) => s.category === modalCategory);
        }
        const q = modalSearch.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (s) =>
                    s.title.toLowerCase().includes(q) ||
                    (s.alias && s.alias.toLowerCase().includes(q)) ||
                    (s.streamTitle && s.streamTitle.toLowerCase().includes(q))
            );
        }
        return list;
    }, [allSongs, modalCategory, modalSearch]);

    // スロットに曲をセット
    const handleSelectSong = (song: SelectableSong) => {
        if (activeSlotIdx === null) return;
        const newSlots = [...selectedSlots];
        newSlots[activeSlotIdx] = song;
        setSelectedSlots(newSlots);
        setActiveSlotIdx(null);
        setModalSearch('');
    };

    // スロットのクリア
    const handleClearSlot = (idx: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSlots = [...selectedSlots];
        newSlots[idx] = null;
        setSelectedSlots(newSlots);
    };

    // ランダム自動選曲 (12曲重複なし)
    const handleRandomFill = () => {
        if (allSongs.length < SETLIST_SIZE) return;
        const shuffled = [...allSongs].sort(() => 0.5 - Math.random());
        setSelectedSlots(shuffled.slice(0, SETLIST_SIZE));
    };

    // 全クリア
    const handleClearAll = () => {
        if (confirm(locale === 'zh' ? '确定要清空全部曲目吗？' : 'すべてのスロットをクリアしますか？')) {
            setSelectedSlots(Array(SETLIST_SIZE).fill(null));
        }
    };

    // セトリ完成＆閲覧ページへ遷移
    const handleComplete = () => {
        const filledCount = selectedSlots.filter(Boolean).length;
        if (filledCount === 0) {
            alert(locale === 'zh' ? '请至少选择一首歌曲。' : '最低1曲以上選択してください。');
            return;
        }

        const payload = {
            t: setlistTitle.trim() || '個人的最強セトリ',
            c: creatorName.trim() || (locale === 'zh' ? '院院めいと' : 'きょーめいと'),
            d: new Date().toISOString(),
            s: selectedSlots.map((song, i) => [
                i + 1,
                song ? song.title : (locale === 'zh' ? '（未选择）' : '（未設定）'),
                song?.category || 'original',
                song?.alias || '',
                song?.url || ''
            ])
        };

        try {
            const jsonStr = JSON.stringify(payload);
            const bytes = new TextEncoder().encode(jsonStr);
            let binary = '';
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const base64 = btoa(binary);
            router.push(`/songs/setlist/view?data=${encodeURIComponent(base64)}`);
        } catch (e) {
            console.error('Encoding error:', e);
            alert(locale === 'zh' ? '保存歌单时出错' : 'セトリの生成に失敗しました');
        }
    };

    const filledCount = selectedSlots.filter(Boolean).length;

    return (
        <main className="min-h-screen bg-transparent p-4 sm:p-8 md:p-16 relative overflow-hidden flex flex-col items-center">
            <div className="max-w-5xl w-full space-y-8 relative z-10">
                {/* 戻るリンク */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/songs"
                        className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors group font-bold tracking-widest text-base sm:text-lg"
                    >
                        <span className="mr-2 transform group-hover:-translate-x-2 transition-transform text-xl">←</span>
                        {locale === 'zh' ? '返回きょー的一曲' : 'きょーの一曲に戻る'}
                    </Link>
                    <div className="text-xs font-mono text-[#c9a64e]/80 border border-[#c9a64e]/30 px-3 py-1 rounded-full bg-black/40">
                        {filledCount} / {SETLIST_SIZE} {locale === 'zh' ? '已选择' : '曲選択中'}
                    </div>
                </div>

                {/* メインパネル */}
                <div className="glass-panel p-6 sm:p-10 md:p-14 rounded-[2.5rem] border-white/10 shadow-2xl space-y-8">
                    <header className="border-b border-white/10 pb-6 text-center">
                        <div className="inline-block px-4 py-1 rounded-full bg-[#c9a64e]/20 border border-[#c9a64e]/40 text-[#c9a64e] text-xs font-sans font-bold tracking-widest uppercase mb-3">
                            Setlist Maker
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white mb-2 text-outline">
                            {locale === 'zh' ? '制作个人最强歌单' : '個人的最強セトリ'}
                        </h1>
                        <p className="text-[#d4c5b0]/80 text-sm sm:text-base font-serif max-w-2xl mx-auto">
                            {locale === 'zh'
                                ? '挑选12首你最喜欢的曲目，打造属于自己的专属神级歌单。'
                                : 'あなたの心に刺さる12曲を選んで、自分だけの究極のセットリストを完成させましょう。'}
                        </p>
                    </header>

                    {/* セトリ情報入力 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/30 p-4 sm:p-6 rounded-2xl border border-white/10">
                        <div>
                            <label className="block text-xs font-serif font-bold text-[#c9a64e] mb-1">
                                {locale === 'zh' ? '歌单标题' : 'セトリのタイトル'}
                            </label>
                            <input
                                type="text"
                                value={setlistTitle}
                                onChange={(e) => setSetlistTitle(e.target.value)}
                                placeholder="個人的最強セトリ"
                                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white font-serif focus:outline-none focus:border-[#c9a64e] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-serif font-bold text-[#c9a64e] mb-1">
                                {locale === 'zh' ? '制作者名（可选）' : 'セトリ制作者名（ニックネーム）'}
                            </label>
                            <input
                                type="text"
                                value={creatorName}
                                onChange={(e) => setCreatorName(e.target.value)}
                                placeholder={locale === 'zh' ? '例如：院院めいと' : '例：きょーめいと'}
                                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white font-serif focus:outline-none focus:border-[#c9a64e] transition-colors"
                            />
                        </div>
                    </div>

                    {/* コントロールバー */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRandomFill}
                                disabled={loading}
                                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-serif text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:border-[#c9a64e]/50"
                            >
                                <span>🎲</span>
                                <span>{locale === 'zh' ? '随机填充12曲' : 'ランダムで12曲選曲'}</span>
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-[#d4c5b0] hover:text-red-300 font-serif text-xs transition-all flex items-center gap-1 cursor-pointer"
                            >
                                <span>🗑️</span>
                                <span>{locale === 'zh' ? '清空' : '全クリア'}</span>
                            </button>
                        </div>
                        <div className="text-xs text-[#d4c5b0]/60 font-sans">
                            {locale === 'zh' ? '※ 对应各曲目原曲/视频链接' : '※ 各曲をクリックすると視聴リンクへ誘導されます'}
                        </div>
                    </div>

                    {/* 12スロット一覧 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSlots.map((song, idx) => {
                            const trackNum = (idx + 1).toString().padStart(2, '0');
                            return (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setActiveSlotIdx(idx);
                                        setModalSearch('');
                                    }}
                                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 group relative ${
                                        song
                                            ? 'bg-gradient-to-r from-black/60 to-black/30 border-[#c9a64e]/40 hover:border-[#c9a64e] shadow-lg'
                                            : 'bg-black/20 border-white/10 hover:border-white/30 border-dashed'
                                    }`}
                                >
                                    {/* トラック番号 */}
                                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-[#c9a64e]/30 flex items-center justify-center font-mono font-black text-sm text-[#c9a64e] flex-shrink-0">
                                        {trackNum}
                                    </div>

                                    {/* 曲情報 または 選曲案内 */}
                                    <div className="flex-1 overflow-hidden">
                                        {song ? (
                                            <>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full font-bold ${
                                                        song.category === 'original'
                                                            ? 'bg-[#c9a64e]/20 text-[#ffe29a] border border-[#c9a64e]/40'
                                                            : song.category === 'cover'
                                                            ? 'bg-blue-500/20 text-blue-200 border border-blue-500/40'
                                                            : 'bg-purple-500/20 text-purple-200 border border-purple-500/40'
                                                    }`}>
                                                        {song.alias ? `${song.categoryLabel}・${song.alias}` : song.categoryLabel}
                                                    </span>
                                                    {song.url && (
                                                        <span className="text-[10px] text-[#c9a64e] font-sans">🔗</span>
                                                    )}
                                                </div>
                                                <div className="text-white font-serif font-bold text-sm truncate group-hover:text-[#ffe29a] transition-colors">
                                                    {translateDynamicText(song.title)}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-[#d4c5b0]/60 font-serif text-sm group-hover:text-white transition-colors flex items-center gap-2">
                                                <span>➕</span>
                                                <span>{locale === 'zh' ? '点击选择曲目...' : 'クリックして曲を選択...'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* 削除ボタン */}
                                    {song && (
                                        <button
                                            onClick={(e) => handleClearSlot(idx, e)}
                                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/30 text-white/40 hover:text-red-200 flex items-center justify-center text-xs transition-colors"
                                            title={locale === 'zh' ? '清除此曲目' : 'この曲を解除'}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* 完成アクションボタン */}
                    <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-4">
                        <button
                            onClick={handleComplete}
                            className="w-full max-w-md py-4 px-8 rounded-2xl bg-gradient-to-r from-[#c9a64e] via-[#e5c97b] to-[#c9a64e] text-black font-serif font-black text-lg tracking-wider shadow-[0_0_30px_rgba(201,166,78,0.4)] hover:shadow-[0_0_45px_rgba(201,166,78,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            <span>✨</span>
                            <span>{locale === 'zh' ? '生成歌单并查看' : 'セトリを完成させる'}</span>
                            <span>→</span>
                        </button>
                        <p className="text-xs text-[#d4c5b0]/60 font-sans text-center">
                            {locale === 'zh'
                                ? '生成后可获得专属分享链接，并支持一键下载PNG高清图片'
                                : '完成後は閲覧専用の共有リンクが発行され、PNG画像としても保存できます'}
                        </p>
                    </div>
                </div>
            </div>

            {/* 曲選択モーダル */}
            {activeSlotIdx !== null && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#15110d] border border-[#c9a64e]/40 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
                        {/* モーダルヘッダー */}
                        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#c9a64e]/20 border border-[#c9a64e]/40 text-[#c9a64e] flex items-center justify-center font-mono font-bold text-sm">
                                    {(activeSlotIdx + 1).toString().padStart(2, '0')}
                                </div>
                                <h3 className="text-white font-serif font-bold text-base sm:text-lg">
                                    {locale === 'zh' ? `选择第 ${activeSlotIdx + 1} 曲` : `Track ${(activeSlotIdx + 1).toString().padStart(2, '0')} の選曲`}
                                </h3>
                            </div>
                            <button
                                onClick={() => setActiveSlotIdx(null)}
                                className="text-white/60 hover:text-white text-lg w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* 検索・絞り込みフィルター */}
                        <div className="p-4 border-b border-white/10 space-y-3 bg-black/20">
                            {/* 検索入力窓 */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={modalSearch}
                                    onChange={(e) => setModalSearch(e.target.value)}
                                    placeholder={locale === 'zh' ? '搜索歌名、名义或歌回...' : '曲名・名義・歌枠名で検索...'}
                                    autoFocus
                                    className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white font-serif text-sm focus:outline-none focus:border-[#c9a64e] transition-colors"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-60">
                                    🔍
                                </span>
                                {modalSearch && (
                                    <button
                                        onClick={() => setModalSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* カテゴリ切り替えボタン/プルダウン */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                                {[
                                    { id: 'all', label: locale === 'zh' ? '全曲' : 'すべて' },
                                    { id: 'original', label: locale === 'zh' ? '原创曲' : 'オリジナル曲' },
                                    { id: 'cover', label: locale === 'zh' ? '翻唱曲' : 'カバー曲' },
                                    { id: 'stream', label: locale === 'zh' ? '歌回' : '歌枠セトリ' }
                                ].map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setModalCategory(cat.id as any)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all whitespace-nowrap cursor-pointer ${
                                            modalCategory === cat.id
                                                ? 'bg-[#c9a64e] text-black font-black'
                                                : 'bg-white/5 text-[#d4c5b0] hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                                <span className="text-[11px] text-[#d4c5b0]/60 ml-auto font-mono whitespace-nowrap">
                                    {filteredSongs.length} {locale === 'zh' ? '曲' : '件'}
                                </span>
                            </div>
                        </div>

                        {/* 曲一覧リスト */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 voice-scrollbar max-h-[50vh]">
                            {filteredSongs.length > 0 ? (
                                filteredSongs.map((song) => (
                                    <button
                                        key={song.id}
                                        onClick={() => handleSelectSong(song)}
                                        className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/5 hover:border-[#c9a64e]/50 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                                    >
                                        <div className="overflow-hidden flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-[10px] font-sans px-2 py-0.2 rounded-full font-bold ${
                                                    song.category === 'original'
                                                        ? 'bg-[#c9a64e]/20 text-[#ffe29a]'
                                                        : song.category === 'cover'
                                                        ? 'bg-blue-500/20 text-blue-200'
                                                        : 'bg-purple-500/20 text-purple-200'
                                                }`}>
                                                    {song.alias ? `${song.categoryLabel}・${song.alias}` : song.categoryLabel}
                                                </span>
                                                {song.streamTitle && (
                                                    <span className="text-[10px] text-[#d4c5b0]/60 font-sans truncate max-w-[200px]">
                                                        {song.streamTitle}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-white font-serif font-bold text-sm truncate group-hover:text-[#ffe29a] transition-colors">
                                                {translateDynamicText(song.title)}
                                            </div>
                                        </div>
                                        <div className="text-xs text-[#c9a64e] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            {locale === 'zh' ? '选择 →' : '選択 →'}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-12 text-[#d4c5b0]/60 font-serif text-sm">
                                    {locale === 'zh' ? '未找到符合条件的曲目' : '一致する曲が見つかりませんでした'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
