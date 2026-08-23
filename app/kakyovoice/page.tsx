'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface VoiceItem {
  title: string;
  date?: string;
  subtitle?: string;
  url: string;
}

interface VoiceSection {
  category: string;
  items: VoiceItem[];
}

export default function KakyoArchivePage() {
  const [sections, setSections] = useState<VoiceSection[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'まいにちかきょボイス':
        return '🎙️';
      case 'おやすみかきょボイス':
        return '🌙';
      case '#きょーのお話':
        return '📖';
      case 'かきょみこ、ふたりのーと。':
        return '📓';
      default:
        return '📝';
    }
  };

  const activeSection = sections.find(s => s.category === selectedCategory);

  return (
    <main className="min-h-screen bg-transparent p-4 md:p-12 relative overflow-hidden flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-8 relative z-10">
        <Link href="/home" className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors mb-2 group font-bold tracking-widest text-lg">
          <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
          BACK TO HOME
        </Link>

        <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] border-white/10 shadow-2xl space-y-8">
          <header className="border-b border-white/10 pb-6 text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-3 text-outline">かきょあーかいぶ</h1>
            <p className="text-[#c9a64e] tracking-[0.4em] font-sans font-black uppercase text-xs drop-shadow-md">Kakyo Voice & Story Archive</p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20 text-[#d4c5b0] text-xl font-serif">
              アーカイブを読み込み中...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#a84032] text-xl font-serif">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Category Tiles Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sections.map((section) => {
                  const isSelected = selectedCategory === section.category;
                  const icon = getCategoryIcon(section.category);
                  return (
                    <button
                      key={section.category}
                      onClick={() => handleCategorySelect(section.category)}
                      className={`p-5 rounded-2xl transition-all duration-300 border flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#c9a64e]/30 to-[#1a140d]/90 border-[#c9a64e] shadow-[0_0_20px_rgba(201,166,78,0.3)] scale-[1.02]'
                          : 'bg-white/5 border-white/10 text-[#d4c5b0] hover:bg-white/10 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">
                        {icon}
                      </div>
                      <div className={`font-serif font-bold text-sm md:text-base leading-snug break-keep ${isSelected ? 'text-white' : ''}`}>
                        {section.category}
                      </div>
                      <div className="text-[11px] text-[#c9a64e]/80 font-sans mt-1">
                        {section.items.length} 件の記録
                      </div>

                      {isSelected && (
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-[#c9a64e]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Main Content Area: Left Item List + Right Embedded View */}
              <div className="flex flex-col lg:flex-row gap-8 pt-4">
                {/* Left Column: Voice / Story List */}
                <div className="w-full lg:w-5/12 flex flex-col space-y-4">
                  <h3 className="text-lg font-serif font-bold text-[#c9a64e] border-b border-[#c9a64e]/20 pb-2 flex items-center justify-between">
                    <span>{getCategoryIcon(selectedCategory)} {selectedCategory} 一覧</span>
                    <span className="text-xs text-[#d4c5b0] font-sans font-normal opacity-80">日付 / 回数</span>
                  </h3>
                  
                  <div className="voice-scrollbar overflow-y-auto space-y-3 pr-2 max-h-[500px]">
                    {activeSection && activeSection.items.length > 0 ? (
                      activeSection.items.map((item, index) => {
                        const isSelected = selectedVoice?.url === item.url && selectedVoice?.title === item.title;
                        const displayTabLabel = item.date || item.title;

                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedVoice(item)}
                            className={`w-full text-left p-4 rounded-xl transition-all duration-300 border font-serif cursor-pointer ${
                              isSelected
                                ? 'bg-white/15 border-[#c9a64e] text-white shadow-[0_0_15px_rgba(201,166,78,0.25)] translate-x-1'
                                : 'bg-white/5 border-transparent text-[#d4c5b0] hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="font-bold text-sm md:text-base leading-relaxed break-words">
                              {displayTabLabel}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center py-10 text-[#d4c5b0]/60 font-serif">
                        項目がありません。
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Embedded Content View */}
                <div className="w-full lg:w-7/12 flex flex-col">
                  <h3 className="text-lg font-serif font-bold text-[#c9a64e] mb-4 border-b border-[#c9a64e]/20 pb-2">
                    📻 プレビュー画面 (クリックで投稿を開く)
                  </h3>
                  
                  {selectedVoice ? (
                    <a
                      href={selectedVoice.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-panel rounded-2xl p-6 border-white/5 hover:border-[#c9a64e]/60 transition-all duration-300 group flex-1 flex flex-col items-center justify-center min-h-[480px] cursor-pointer relative overflow-hidden shadow-2xl"
                    >
                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#c9a64e]/5 via-transparent to-[#c9a64e]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <div className="w-full space-y-4 flex flex-col items-center relative z-10">
                        {/* Header Title inside Preview */}
                        <div className="text-center mb-2">
                          <div className="text-xs text-[#c9a64e] tracking-widest font-sans font-bold uppercase mb-1 flex items-center justify-center gap-1.5">
                            <span>Viewing Preview</span>
                            <span className="group-hover:translate-x-1 transition-transform">↗</span>
                          </div>

                          {/* Display Subtitle in Brackets 【表題】 */}
                          <h4 className="text-white font-serif font-bold text-xl md:text-2xl max-w-md mx-auto break-words leading-relaxed group-hover:text-[#ffe29a] transition-colors">
                            {selectedVoice.subtitle || selectedVoice.title}
                          </h4>
                          {selectedVoice.date && (
                            <div className="text-xs text-[#d4c5b0]/80 font-sans mt-1">
                              {selectedVoice.date}
                            </div>
                          )}
                        </div>

                        {/* Embedded Container for X or YouTube */}
                        <div className="w-full max-w-[500px] flex justify-center py-2 bg-[#1a140d]/40 rounded-xl p-3 border border-white/5 shadow-inner pointer-events-auto">
                          <MediaEmbed url={selectedVoice.url} title={selectedVoice.title} />
                        </div>

                        <div className="text-xs text-[#c9a64e] font-serif font-bold tracking-wider pt-2 group-hover:underline flex items-center gap-1">
                          <span>クリックしてリンク先の投稿ページを開く</span>
                          <span>↗</span>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="glass-panel rounded-2xl p-6 border-white/5 flex-1 flex flex-col items-center justify-center min-h-[480px]">
                      <div className="text-[#d4c5b0] font-serif text-center">
                        表示する項目を選択してください。
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <footer className="pt-8 border-t border-white/10 opacity-40 text-center">
            <p className="text-white text-xs md:text-sm font-serif italic">
              きょーちゃんの思い出や声を聞いて、今日も素敵な一日に。
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

function MediaEmbed({ url, title }: { url: string; title: string }) {
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

  // YouTubeコミュニティポストなどの場合
  return (
    <div className="w-full space-y-4 flex flex-col items-center py-6 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#ff0000]/20 border border-[#ff0000]/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
        🔴
      </div>
      <div className="space-y-1.5 max-w-sm">
        <div className="text-white font-serif font-bold text-base leading-relaxed group-hover:text-[#ffe29a] transition-colors">
          YouTube コミュニティポスト
        </div>
        <p className="text-xs text-[#d4c5b0] leading-relaxed">
          YouTubeのコミュニティ投稿です。このカードをクリックするとYouTubeで直接ご覧いただけます。
        </p>
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
            if (!el && containerRef.current) {
              containerRef.current.innerHTML = `<p class="text-[#a84032] text-sm text-center font-sans py-4">ツイートの読み込みに失敗しました。<br/>削除されたか、非公開アカウントの可能性があります。</p>`;
            }
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
