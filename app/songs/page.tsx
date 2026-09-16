'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18nContext';

export default function SongsPage() {
    const { t, locale, translateDynamicText } = useLanguage();
    const [loading, setLoading] = useState<string | null>(null);

    const handleSongClick = async (type: string) => {
        setLoading(type);
        try {
            const res = await fetch(`/api/songs?type=${type}`);
            const data = await res.json();
            if (data.url) {
                window.open(data.url, '_blank');
            } else {
                alert(locale === 'zh' ? '未找到歌曲，请检查列表。' : '曲が見つかりませんでした。リストを確認してください。');
            }
        } catch (error) {
            console.error('Failed to get song:', error);
            alert(locale === 'zh' ? '发生错误。' : 'エラーが発生しました。');
        } finally {
            setLoading(null);
        }
    };

    return (
        <main className="min-h-screen bg-transparent p-8 md:p-20 relative overflow-hidden flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-12 relative z-10">
                <Link href="/" className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors mb-4 group font-bold tracking-widest text-lg">
                    <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
                    {t('common.back')}
                </Link>

                <div className="glass-panel p-10 md:p-20 rounded-[3rem] border-white/10 shadow-2xl space-y-12 text-center">
                    <header className="border-b border-white/10 pb-10">
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-4 text-outline">
                            {translateDynamicText('きょーの一曲')}
                        </h1>
                        <p className="text-[#c9a64e] tracking-[0.5em] font-sans font-black uppercase text-sm drop-shadow-md">Random Song Selection</p>
                    </header>

                    <p className="text-white text-xl font-serif leading-loose text-outline max-w-2xl mx-auto opacity-90">
                        {locale === 'zh' ? (
                            <>根据您此刻的心情选择分类。<br />我们将从列表中随机为您推荐一曲。</>
                        ) : (
                            <>その時の気分に合わせてタイプを選んでください。<br />リストから一曲、ランダムでお届けします。</>
                        )}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">

                        <button
                            onClick={() => handleSongClick('original')}
                            disabled={!!loading}
                            className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-[#c9a64e]/40 transition-all duration-500 group group-hover:bg-white/5"
                        >
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🎵</div>
                            <h3 className="text-2xl font-black text-white font-serif mb-4 text-outline">
                                {locale === 'zh' ? '原创曲' : 'オリジナル曲'}
                            </h3>
                            <div className="text-[#c9a64e] font-bold text-sm tracking-widest">
                                {loading === 'original' ? (locale === 'zh' ? '选曲中...' : '選曲中...') : 'LISTEN →'}
                            </div>
                        </button>

                        <button
                            onClick={() => handleSongClick('cover')}
                            disabled={!!loading}
                            className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-[#accent-blue]/40 transition-all duration-500 group group-hover:bg-white/5"
                        >
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🎙️</div>
                            <h3 className="text-2xl font-black text-white font-serif mb-4 text-outline">
                                {locale === 'zh' ? '翻唱曲' : 'カバー曲'}
                            </h3>
                            <div className="text-[#c9a64e] font-bold text-sm tracking-widest">
                                {loading === 'cover' ? (locale === 'zh' ? '选曲中...' : '選曲中...') : 'LISTEN →'}
                            </div>
                        </button>

                        <button
                            onClick={() => handleSongClick('stream')}
                            disabled={!!loading}
                            className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-[#c9a64e]/40 transition-all duration-500 group group-hover:bg-white/5"
                        >
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📻</div>
                            <h3 className="text-2xl font-black text-white font-serif mb-4 text-outline">
                                {translateDynamicText('きょーの歌枠')}
                            </h3>
                            <div className="text-[#c9a64e] font-bold text-sm tracking-widest">
                                {loading === 'stream' ? (locale === 'zh' ? '选曲中...' : '選曲中...') : 'LISTEN →'}
                            </div>
                        </button>

                        <button
                            onClick={() => handleSongClick('any')}
                            disabled={!!loading}
                            className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-white/30 transition-all duration-500 group group-hover:bg-white/5"
                        >
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🎲</div>
                            <h3 className="text-2xl font-black text-white font-serif mb-4 text-outline">
                                {locale === 'zh' ? '随机一曲' : 'なんでも一曲'}
                            </h3>
                            <div className="text-[#c9a64e] font-bold text-sm tracking-widest">
                                {loading === 'any' ? (locale === 'zh' ? '选曲中...' : '選曲中...') : 'LISTEN →'}
                            </div>
                        </button>

                    </div>

                    <div className="pt-12">
                        <Link
                            href="/kakyovoice"
                            className="glass-panel px-12 py-8 rounded-[2rem] border-white/10 hover:border-[#c9a64e]/50 transition-all duration-500 group inline-flex flex-col items-center gap-2 hover:bg-white/5 min-w-[320px]"
                        >
                            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📋</div>
                            <span className="text-xl font-black text-white font-serif text-outline">
                                {locale === 'zh' ? '查看歌回歌单列表' : '歌枠セトリ一覧を見る'}
                            </span>
                            <span className="text-[#c9a64e] font-bold text-xs tracking-widest opacity-60 group-hover:opacity-100 transition-opacity uppercase font-sans">View in Kakyo Archive →</span>
                        </Link>
                    </div>

                    <footer className="pt-12 opacity-40">
                        <p className="text-white text-sm font-serif italic">
                            {locale === 'zh' ? '愿今日的邂逅，对您而言成为特别的存在。' : '今日の出会いが、あなたにとって特別なものになりますように。'}
                        </p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
