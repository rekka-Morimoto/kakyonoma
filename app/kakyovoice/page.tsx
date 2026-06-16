'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Voice {
  title: string;
  url: string;
}

export default function KakyoVoicePage() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
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
        setVoices(data.voices || []);
        if (data.voices && data.voices.length > 0) {
          setSelectedVoice(data.voices[0]);
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


  return (
    <main className="min-h-screen bg-transparent p-4 md:p-20 relative overflow-hidden flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-8 relative z-10">
        <Link href="/home" className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors mb-4 group font-bold tracking-widest text-lg">
          <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
          BACK TO HOME
        </Link>

        <div className="glass-panel p-6 md:p-12 rounded-[2.5rem] border-white/10 shadow-2xl space-y-8">
          <header className="border-b border-white/10 pb-6 text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-3 text-outline">まいにちかきょボイス</h1>
            <p className="text-[#c9a64e] tracking-[0.4em] font-sans font-black uppercase text-xs drop-shadow-md">Daily Kakyo Voice Log</p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20 text-[#d4c5b0] text-xl font-serif">
              ボイス一覧を読み込み中...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#a84032] text-xl font-serif">
              {error}
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Voice List */}
              <div className="w-full lg:w-5/12 flex flex-col">
                <h3 className="text-lg font-serif font-bold text-[#c9a64e] mb-4 border-b border-[#c9a64e]/20 pb-2">
                  📝 ボイス一覧
                </h3>
                <div className="voice-scrollbar overflow-y-auto max-h-[500px] space-y-3 pr-2">
                  {voices.map((voice, index) => {
                    const isSelected = selectedVoice?.url === voice.url;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedVoice(voice)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 border font-serif cursor-pointer ${
                          isSelected
                            ? 'bg-white/10 border-[#c9a64e] text-white shadow-[0_0_15px_rgba(201,166,78,0.2)]'
                            : 'bg-white/5 border-transparent text-[#d4c5b0] hover:bg-white/8 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-sm md:text-base leading-relaxed break-all">
                          {voice.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Embedded Post */}
              <div className="w-full lg:w-7/12 flex flex-col">
                <h3 className="text-lg font-serif font-bold text-[#c9a64e] mb-4 border-b border-[#c9a64e]/20 pb-2">
                  📻 ポスト表示
                </h3>
                <div className="glass-panel rounded-2xl p-6 border-white/5 flex-1 flex flex-col items-center justify-center min-h-[450px]">
                  {selectedVoice ? (
                    <div className="w-full space-y-4 flex flex-col items-center">
                      <div className="text-center mb-2">
                        <div className="text-xs text-[#c9a64e] tracking-widest font-sans font-bold uppercase mb-1">
                          Now Playing
                        </div>
                        <h4 className="text-white font-serif font-bold text-lg max-w-md mx-auto">
                          {selectedVoice.title}
                        </h4>
                      </div>

                      {/* X Post Embedded Container */}
                      <div className="w-full max-w-[500px] flex justify-center py-2 bg-[#1a140d]/40 rounded-xl p-2 border border-white/5 shadow-inner">
                        <TweetEmbed url={selectedVoice.url} />
                      </div>

                      {/* Fallback button to open directly */}
                      <a
                        href={selectedVoice.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 px-6 py-3 rounded-full bg-[#1da1f2]/20 hover:bg-[#1da1f2]/30 border border-[#1da1f2]/50 text-white font-bold text-sm tracking-wider transition-colors inline-flex items-center gap-2"
                      >
                        <span>🐦</span>
                        <span>Xで直接ポストを開く</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-[#d4c5b0] font-serif text-center">
                      表示するボイスを選択してください。
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <footer className="pt-8 border-t border-white/10 opacity-40 text-center">
            <p className="text-white text-xs md:text-sm font-serif italic">
              きょーちゃんの毎日の声を聞いて、今日も素敵な一日に。
            </p>
          </footer>
        </div>
      </div>
    </main>
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
