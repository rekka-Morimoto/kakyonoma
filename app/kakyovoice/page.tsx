'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18nContext';

interface SongSubItem {
  title: string;
  url?: string;
}

interface VoiceItem {
  title: string;
  date?: string;
  subtitle?: string;
  url: string;
  thumbnailUrl?: string;
  songs?: SongSubItem[];
  category?: string;
}

interface VoiceSection {
  category: string;
  items: VoiceItem[];
}

export default function KakyoArchivePage() {
  const { t, locale, translateDynamicText } = useLanguage();
  const [sections, setSections] = useState<VoiceSection[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('all');

  useEffect(() => {
    async function fetchVoices() {
      try {
        const res = await fetch('/api/kakyovoice');
        if (!res.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await res.json();
        const fetchedSections: VoiceSection[] = data.sections || [];
        setSections(fetchedSections);

        if (fetchedSections.length > 0) {
          const initialCat = fetchedSections[0].category;
          setSelectedCategory(initialCat);
          if (fetchedSections[0].items.length > 0) {
            setSelectedVoice(fetchedSections[0].items[0]);
          }
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    }
    fetchVoices();
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const targetSection = sections.find(s => s.category === categoryName);
    if (targetSection && targetSection.items.length > 0) {
      setSelectedVoice(targetSection.items[0]);
    } else {
      setSelectedVoice(null);
    }
  };

  const getCategoryDisplayName = (catName: string) => {
    switch (catName) {
      case 'まいにちかきょボイス': return t('kakyovoice.catDailyVoice');
      case 'おやすみかきょボイス': return t('kakyovoice.catGoodNightVoice');
      case '#きょーのお話': return t('kakyovoice.catKyoStory');
      case 'かきょみこ、ふたりのーと。': return t('kakyovoice.catFutariNote');
      case 'オリジナル曲': return t('kakyovoice.catOriginalSong');
      case 'カバー曲': return t('kakyovoice.catCoverSong');
      case '歌枠セトリ': return t('kakyovoice.catSetlist');
      case 'Vlog': return t('kakyovoice.catVlog');
      default: return translateDynamicText(catName);
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'まいにちかきょボイス':
        return '🎙️';
      case 'おやすみかきょボイス':
        return '🌙';
      case '#きょーのお話':
        return '📖';
      case 'オリジナル曲':
        return '🎵';
      case 'カバー曲':
        return '🎧';
      case '歌枠セトリ':
        return '🎤';
      case 'Vlog':
        return '📹';
      case 'かきょみこ、ふたりのーと。':
        return '📓';
      default:
        return '📝';
    }
  };

  const activeSection = sections.find(s => s.category === selectedCategory);

  const row1Categories = ["カバー曲", "オリジナル曲", "歌枠セトリ", "Vlog"];
  const row2Categories = ["おやすみかきょボイス", "かきょみこ、ふたりのーと。", "#きょーのお話", "まいにちかきょボイス"];

  const row1Sections = useMemo(() => {
    return row1Categories
      .map(cat => sections.find(s => s.category === cat))
      .filter((s): s is VoiceSection => s !== undefined);
  }, [sections]);

  const row2Sections = useMemo(() => {
    return row2Categories
      .map(cat => sections.find(s => s.category === cat))
      .filter((s): s is VoiceSection => s !== undefined);
  }, [sections]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    let targetSections = sections;
    if (searchCategory !== 'all') {
      targetSections = sections.filter(s => s.category === searchCategory);
    }

    const results: VoiceItem[] = [];
    for (const sec of targetSections) {
      for (const item of sec.items) {
        const titleMatch = item.title.toLowerCase().includes(q);
        const dateMatch = item.date ? item.date.toLowerCase().includes(q) : false;
        const subtitleMatch = item.subtitle ? item.subtitle.toLowerCase().includes(q) : false;
        const songMatch = item.songs
          ? item.songs.some(s => s.title.toLowerCase().includes(q))
          : false;

        if (titleMatch || dateMatch || subtitleMatch || songMatch) {
          results.push({
            ...item,
            category: sec.category
          });
        }
      }
    }
    return results;
  }, [searchQuery, searchCategory, sections]);

  const isSearching = searchQuery.trim().length > 0;

  const renderTileButton = (section: VoiceSection) => {
    const isSelected = !isSearching && selectedCategory === section.category;
    const icon = getCategoryIcon(section.category);
    return (
      <button
        key={section.category}
        onClick={() => handleCategorySelect(section.category)}
        className={`p-3.5 md:p-4 rounded-2xl transition-all duration-300 border flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group ${
          isSelected
            ? 'bg-gradient-to-b from-[#c9a64e]/30 to-[#1a140d]/90 border-[#c9a64e] shadow-[0_0_20px_rgba(201,166,78,0.3)] scale-[1.02]'
            : 'bg-white/5 border-white/10 text-[#d4c5b0] hover:bg-white/10 hover:border-white/20 hover:text-white'
        }`}
      >
        <div className="text-2xl md:text-3xl mb-1 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className={`font-serif font-bold text-xs md:text-sm leading-snug break-keep ${isSelected ? 'text-white' : ''}`}>
          {getCategoryDisplayName(section.category)}
        </div>
        <div className="text-[10px] text-[#c9a64e]/80 font-sans mt-0.5">
          {section.items.length} 件
        </div>

        {isSelected && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-[#c9a64e]" />
        )}
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-transparent p-4 md:p-12 relative overflow-hidden flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-8 relative z-10">
        <Link href="/home" className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors mb-2 group font-bold tracking-widest text-lg">
          <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
          {t('common.back')}
        </Link>

        <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] border-white/10 shadow-2xl space-y-8">
          <header className="border-b border-white/10 pb-6 text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-3 text-outline">
              {t('kakyovoice.title')}
            </h1>
            <p className="text-[#c9a64e] tracking-[0.4em] font-sans font-black uppercase text-xs drop-shadow-md">
              {t('kakyovoice.subtitle')}
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20 text-[#d4c5b0] text-xl font-serif">
              読み込み中...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#a84032] text-xl font-serif">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Category Tiles Section */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {row1Sections.map(renderTileButton)}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {row2Sections.map(renderTileButton)}
                </div>
              </div>

              {/* Search Bar Container */}
              <div className="glass-panel p-4 rounded-2xl border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between shadow-inner bg-black/20">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-[#c9a64e] text-sm font-serif font-bold whitespace-nowrap hidden sm:inline">
                    {locale === 'zh' ? '搜索范围:' : '検索範囲:'}
                  </span>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full md:w-auto bg-[#1a140d]/90 text-white font-serif border border-[#c9a64e]/40 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:border-[#c9a64e] cursor-pointer shadow-md"
                  >
                    <option value="all">🔍 {t('kakyovoice.filterAll')}</option>
                    {sections.map((s) => (
                      <option key={s.category} value={s.category}>
                        {getCategoryIcon(s.category)} {getCategoryDisplayName(s.category)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative w-full md:w-7/12">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={locale === 'zh' ? '搜索...' : '検索...'}
                    className="w-full bg-white/10 text-white font-serif placeholder-[#d4c5b0]/50 border border-white/15 rounded-xl pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-[#c9a64e] focus:bg-black/40 transition-all shadow-inner"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base opacity-60">
                    🔍
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs bg-white/10 hover:bg-white/20 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex flex-col lg:flex-row gap-8 pt-2">
                {/* Left Column: List */}
                <div className="w-full lg:w-5/12 flex flex-col space-y-4">
                  <h3 className="text-lg font-serif font-bold text-[#c9a64e] border-b border-[#c9a64e]/20 pb-2 flex items-center justify-between">
                    <span>
                      {isSearching ? (
                        <>{locale === 'zh' ? `🔍 搜索结果: 『${searchQuery}』` : `🔍 検索結果: 『${searchQuery}』`}</>
                      ) : (
                        <>{getCategoryIcon(selectedCategory)} {getCategoryDisplayName(selectedCategory)}</>
                      )}
                    </span>
                    <span className="text-xs text-[#d4c5b0] font-sans font-normal opacity-80">
                      {isSearching
                        ? (locale === 'zh' ? `匹配 ${filteredItems.length} 项` : `${filteredItems.length} 件一致`)
                        : (locale === 'zh' ? `共 ${activeSection?.items.length || 0} 项` : `全 ${activeSection?.items.length || 0} 件`)}
                    </span>
                  </h3>
                  
                  <div className="voice-scrollbar overflow-y-auto space-y-3 pr-2 max-h-[540px]">
                    {isSearching ? (
                      filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => {
                          const isSelected = selectedVoice?.url === item.url && selectedVoice?.title === item.title;
                          const displayTabLabel = item.category === '#きょーのお話' 
                            ? (item.date || item.title)
                            : item.title;

                          return (
                            <button
                              key={index}
                              onClick={() => setSelectedVoice(item)}
                              className={`w-full text-left p-3.5 rounded-xl transition-all duration-300 border font-serif cursor-pointer flex items-center gap-3 ${
                                isSelected
                                  ? 'bg-white/15 border-[#c9a64e] text-white shadow-[0_0_15px_rgba(201,166,78,0.25)] translate-x-1'
                                  : 'bg-white/5 border-transparent text-[#d4c5b0] hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {item.thumbnailUrl && (
                                <img
                                  src={item.thumbnailUrl}
                                  alt={item.title}
                                  className="w-14 h-10 object-cover rounded-lg flex-shrink-0 border border-white/10 shadow"
                                />
                              )}
                              <div className="flex-1 overflow-hidden">
                                {item.category && (
                                  <div className="text-[11px] text-[#c9a64e] font-sans font-bold mb-0.5 flex items-center gap-1">
                                    <span>{getCategoryIcon(item.category)}</span>
                                    <span>{getCategoryDisplayName(item.category)}</span>
                                  </div>
                                )}
                                <div className="font-bold text-sm leading-relaxed break-words line-clamp-2">
                                  {translateDynamicText(displayTabLabel)}
                                </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-center py-10 text-[#d4c5b0]/60 font-serif">
                          {t('kakyovoice.noItems')}
                        </div>
                      )
                    ) : activeSection && activeSection.items.length > 0 ? (
                      activeSection.items.map((item, index) => {
                        const isSelected = selectedVoice?.url === item.url && selectedVoice?.title === item.title;
                        const displayTabLabel = selectedCategory === '#きょーのお話' 
                          ? (item.date || item.title)
                          : item.title;

                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedVoice({ ...item, category: selectedCategory })}
                            className={`w-full text-left p-3.5 rounded-xl transition-all duration-300 border font-serif cursor-pointer flex items-center gap-3 ${
                              isSelected
                                ? 'bg-white/15 border-[#c9a64e] text-white shadow-[0_0_15px_rgba(201,166,78,0.25)] translate-x-1'
                                : 'bg-white/5 border-transparent text-[#d4c5b0] hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {item.thumbnailUrl && (
                              <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className="w-14 h-10 object-cover rounded-lg flex-shrink-0 border border-white/10 shadow"
                              />
                            )}
                            <div className="flex-1 overflow-hidden">
                              <div className="font-bold text-sm leading-relaxed break-words line-clamp-2">
                                {translateDynamicText(displayTabLabel)}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center py-10 text-[#d4c5b0]/60 font-serif">
                        {t('kakyovoice.noItems')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Embedded Content */}
                <div className="w-full lg:w-7/12 flex flex-col">
                  <h3 className="text-lg font-serif font-bold text-[#c9a64e] mb-4 border-b border-[#c9a64e]/20 pb-2">
                    📻 {(selectedVoice?.category || selectedCategory) === '歌枠セトリ' ? getCategoryDisplayName('歌枠セトリ') : 'プレビュー'}
                  </h3>
                  
                  {selectedVoice ? (
                    (selectedVoice.category || selectedCategory) === '歌枠セトリ' ? (
                      <div className="glass-panel rounded-2xl p-6 border-white/5 flex-1 flex flex-col justify-between min-h-[480px] shadow-2xl">
                        <div className="space-y-6">
                          <div className="text-center border-b border-white/10 pb-4">
                            <div className="text-xs text-[#c9a64e] tracking-widest font-sans font-bold uppercase mb-1">
                              Setlist Overview
                            </div>
                            <h4 className="text-white font-serif font-bold text-xl md:text-2xl leading-relaxed">
                              {translateDynamicText(selectedVoice.title)}
                            </h4>
                          </div>

                          {selectedVoice.songs && selectedVoice.songs.length > 0 ? (
                            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-2 voice-scrollbar">
                              {selectedVoice.songs.map((song, sIdx) => {
                                const isSongMatched = isSearching && song.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
                                return (
                                  <div
                                    key={sIdx}
                                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-sm font-serif transition-colors ${
                                      isSongMatched
                                        ? 'bg-[#c9a64e]/20 border-[#c9a64e]/60 text-white font-bold'
                                        : 'bg-white/5 border-white/5 text-white/90 hover:bg-white/10'
                                    }`}
                                  >
                                    <span className="break-words flex-1">
                                      {translateDynamicText(song.title)}
                                    </span>
                                    {song.url && (
                                      <a
                                        href={song.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 rounded-full bg-[#c9a64e]/20 hover:bg-[#c9a64e]/40 border border-[#c9a64e]/40 text-[#ffe29a] text-xs font-sans font-bold transition-colors whitespace-nowrap flex items-center gap-1"
                                      >
                                        <span>再生</span>
                                        <span>↗</span>
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-[#d4c5b0]/60 font-serif">
                              {t('kakyovoice.noItems')}
                            </div>
                          )}
                        </div>

                        {selectedVoice.url && (
                          <div className="pt-6 border-t border-white/10 text-center">
                            <a
                              href={selectedVoice.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#c9a64e]/30 via-[#c9a64e]/20 to-[#c9a64e]/30 hover:from-[#c9a64e]/40 hover:to-[#c9a64e]/40 border border-[#c9a64e]/60 text-white font-serif font-bold text-sm tracking-wider transition-all shadow-lg inline-flex items-center justify-center gap-2 group"
                            >
                              <span>📺 {t('kakyovoice.streamLink')}</span>
                              <span className="group-hover:translate-x-1 transition-transform">↗</span>
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <a
                        href={selectedVoice.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`glass-panel rounded-2xl p-6 border-white/5 hover:border-[#c9a64e]/60 transition-all duration-300 group flex-1 flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden shadow-2xl ${
                          selectedVoice.url ? 'cursor-pointer' : 'cursor-default pointer-events-none'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a64e]/5 via-transparent to-[#c9a64e]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="w-full space-y-4 flex flex-col items-center relative z-10">
                          <div className="text-center mb-2">
                            <div className="text-xs text-[#c9a64e] tracking-widest font-sans font-bold uppercase mb-1 flex items-center justify-center gap-1.5">
                              <span>Viewing {getCategoryDisplayName(selectedVoice.category || selectedCategory)}</span>
                              {selectedVoice.url && (
                                <span className="group-hover:translate-x-1 transition-transform">↗</span>
                              )}
                            </div>

                            <h4 className="text-white font-serif font-bold text-xl md:text-2xl max-w-md mx-auto break-words leading-relaxed group-hover:text-[#ffe29a] transition-colors">
                              {translateDynamicText(selectedVoice.subtitle || selectedVoice.title)}
                            </h4>
                            {selectedVoice.date && (
                              <div className="text-xs text-[#d4c5b0]/80 font-sans mt-1">
                                {selectedVoice.date}
                              </div>
                            )}
                          </div>

                          <div className="w-full max-w-[500px] flex justify-center py-2">
                            {selectedVoice.thumbnailUrl ? (
                              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-[#c9a64e]/50 transition-all">
                                <img
                                  src={selectedVoice.thumbnailUrl}
                                  alt={selectedVoice.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <div className="w-16 h-16 rounded-full bg-[#c9a64e]/90 text-black flex items-center justify-center pl-1 text-2xl shadow-2xl group-hover:scale-110 transition-transform">
                                    ▶
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full bg-[#1a140d]/40 rounded-xl p-3 border border-white/5 shadow-inner pointer-events-auto">
                                <MediaEmbed url={selectedVoice.url} title={selectedVoice.title} />
                              </div>
                            )}
                          </div>

                          {selectedVoice.url && (
                            <div className="text-xs text-[#c9a64e] font-serif font-bold tracking-wider pt-2 group-hover:underline flex items-center gap-1">
                              <span>{t('kakyovoice.viewPost')}</span>
                              <span>↗</span>
                            </div>
                          )}
                        </div>
                      </a>
                    )
                  ) : (
                    <div className="glass-panel rounded-2xl p-6 border-white/5 flex-1 flex flex-col items-center justify-center min-h-[480px]">
                      <div className="text-[#d4c5b0] font-serif text-center">
                        {t('kakyovoice.noItems')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function MediaEmbed({ url, title }: { url: string; title: string }) {
  if (!url) return null;
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  
  if (isYouTube) {
    return <YouTubeEmbed url={url} title={title} />;
  }

  return <TweetEmbed url={url} />;
}

function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  let videoId = '';
  const watchMatch = url.match(/(?:v=|\/embed\/|\/watch\?v=|\/v\/|https?:\/\/youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    videoId = watchMatch[1];
  }

  if (videoId) {
    return (
      <div className="w-full space-y-4 flex flex-col items-center">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-white/10">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 flex flex-col items-center py-6 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#ff0000]/20 border border-[#ff0000]/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
        🔴
      </div>
      <div className="space-y-1.5 max-w-sm">
        <div className="text-white font-serif font-bold text-base leading-relaxed group-hover:text-[#ffe29a] transition-colors">
          YouTube
        </div>
      </div>
    </div>
  );
}

function TweetEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const tweetId = url.split('/').pop()?.split('?')[0];

    if (!tweetId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const loadTweet = () => {
      // @ts-ignore
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.createTweet(
          tweetId,
          containerRef.current,
          {
            theme: 'dark',
            align: 'center',
          }
        ).then((el: any) => {
          if (isMounted) {
            setLoading(false);
          }
        });
      } else {
        setTimeout(loadTweet, 100);
      }
    };

    const scriptId = 'twitter-wjs';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
      
      const handleScriptLoad = () => {
        if (isMounted) loadTweet();
      };
      script.addEventListener('load', handleScriptLoad);
      return () => {
        isMounted = false;
        script.removeEventListener('load', handleScriptLoad);
      };
    } else {
      loadTweet();
      return () => {
        isMounted = false;
      };
    }
  }, [url]);

  return (
    <div className="w-full flex flex-col items-center">
      {loading && (
        <div className="text-[#d4c5b0] text-sm py-4 animate-pulse font-serif">
          読み込み中...
        </div>
      )}
      <div ref={containerRef} className="w-full max-w-[500px] flex justify-center" />
    </div>
  );
}
