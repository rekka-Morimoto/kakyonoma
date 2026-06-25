'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface TimelineEvent {
  importance: number;
  date: string;
  title: string;
}

export default function TimelinePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // 初回マウント時にセッションストレージの認証状態を確認
  useEffect(() => {
    const auth = sessionStorage.getItem('kakyotimeline_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/timeline');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      } else {
        console.error('Failed to fetch timeline data');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '5226') {
      sessionStorage.setItem('kakyotimeline_auth', 'true');
      setIsAuthenticated(true);
      fetchEvents();
    } else {
      setError('暗証番号が正しくありません。');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#1a140d] flex items-center justify-center p-6 font-serif">
        <div className="max-w-md w-full glass-panel p-8 rounded-[2rem] border-white/10 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute inset-2 border border-[#c9a64e]/20 rounded-[1.8rem] pointer-events-none" />
          
          <div className="text-6xl my-4">📜</div>
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest">かきょ年表</h2>
            <p className="text-xs text-[#c9a64e] tracking-[0.3em] uppercase">Private Archive</p>
          </div>

          <p className="text-sm text-[#d4c5b0] leading-relaxed">
            この記録は現在、一般には非公開となっています。<br />
            閲覧するには暗証番号を入力してください。
          </p>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <input
              type="password"
              placeholder="暗証番号を入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-white focus:outline-none focus:border-[#c9a64e] font-sans tracking-[0.5em] text-lg transition-colors placeholder:font-serif placeholder:tracking-normal"
            />
            {error && <p className="text-[#a84032] text-sm">{error}</p>}
            
            <div className="flex gap-4 pt-2">
              <Link
                href="/home"
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-sans uppercase font-bold tracking-wider"
              >
                戻る
              </Link>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl bg-[#c9a64e] hover:bg-[#b08f3f] text-[#1a140d] font-sans font-bold tracking-wider text-sm transition-all shadow-lg hover:shadow-[#c9a64e]/20"
              >
                入室する
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a140d] p-4 sm:p-8 md:p-20 relative overflow-x-hidden flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8 relative z-10 flex flex-col items-center">
        <div className="w-full flex justify-start">
          <Link href="/home" className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors mb-4 group font-bold tracking-widest text-lg font-serif">
            <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
            BACK TO HOME
          </Link>
        </div>

        {/* Scroll Header Decoration */}
        <div className="w-full max-w-3xl h-8 bg-gradient-to-r from-[#3d2712] via-[#8c6239] to-[#3d2712] rounded-full shadow-lg relative z-20 flex items-center justify-between px-6">
          <div className="w-6 h-6 rounded-full bg-[#1c1209] shadow-inner" />
          <div className="w-6 h-6 rounded-full bg-[#1c1209] shadow-inner" />
        </div>

        {/* Scroll Paper Panel */}
        <div className="w-full max-w-[calc(100%-1rem)] sm:max-w-3xl bg-[#f4ebd0] text-[#2d2418] px-4 sm:px-12 py-16 relative shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(140,98,57,0.15)] min-h-[600px] border-l-[12px] border-r-[12px] border-[#d7c49e] font-serif flex flex-col items-center">
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(140,98,57,0.1)_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none opacity-80" />
          {/* Inner Red border like traditional scrolls */}
          <div className="absolute inset-2 border border-[#a84032]/20 rounded pointer-events-none" />
          <div className="absolute inset-3 border-2 border-[#a84032]/10 rounded pointer-events-none" />

          {loading ? (
            <div className="my-auto py-20 text-[#8c6239] text-xl text-center">
              絵巻を紐解いています...
            </div>
          ) : (
            <div className="w-full relative space-y-12">
              <header className="text-center pb-8 border-b-2 border-[#a84032]/20 relative">
                <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] text-[#4d2f12]">かきょ年表</h1>
                <p className="text-xs text-[#8c6239] tracking-[0.4em] uppercase font-sans mt-3">Maison de Kyo - Chronicle</p>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#f4ebd0] border-2 border-[#a84032]/30 rounded-full flex items-center justify-center text-[#a84032] text-xs">✦</div>
              </header>

              {/* Timeline Container */}
              <div className="relative pt-8">
                {/* Timeline vertical line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#8c6239]/40 -translate-x-1/2" />

                <div className="space-y-12 relative">
                  {events.map((event, index) => {
                    const isEven = index % 2 === 0;
                    
                    // Style adjustments based on importance
                    let titleStyle = "";
                    let itemPadding = "";
                    let dotSize = "";
                    let containerStyle = "";

                    if (event.importance === 3) {
                      titleStyle = "text-xl md:text-2xl font-black text-[#4d2f12] leading-tight";
                      itemPadding = "p-5 md:p-6 bg-[#ebdfbf] border-2 border-[#8c6239]/40 shadow-md";
                      dotSize = "w-5 h-5 bg-[#a84032] ring-4 ring-[#f4ebd0]";
                      containerStyle = "scale-100";
                    } else if (event.importance === 2) {
                      titleStyle = "text-base md:text-lg font-bold text-[#5c3a1b]";
                      itemPadding = "p-4 bg-[#ebdfbf]/70 border border-[#8c6239]/20 shadow-sm";
                      dotSize = "w-4 h-4 bg-[#8c6239] ring-4 ring-[#f4ebd0]";
                      containerStyle = "scale-98";
                    } else {
                      titleStyle = "text-xs md:text-sm text-[#6d4928]";
                      itemPadding = "p-3 bg-transparent border-b border-[#8c6239]/10";
                      dotSize = "w-3 h-3 bg-[#a0805c] ring-2 ring-[#f4ebd0]";
                      containerStyle = "scale-95 opacity-90";
                    }

                    return (
                      <div 
                        key={index} 
                        className={`flex flex-col md:flex-row items-start md:items-center relative w-full ${
                          isEven ? 'md:flex-row-reverse' : ''
                        } ${containerStyle}`}
                      >
                        {/* Timeline Marker Dot */}
                        <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center rounded-full transition-transform hover:scale-125 ${dotSize}`}>
                          {event.importance === 3 && (
                            <span className="absolute w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>

                        {/* Content Card */}
                        <div className={`w-[calc(100%-2.5rem)] md:w-[45%] ml-10 md:ml-0 ${
                          isEven ? 'md:pr-10 text-left md:text-right' : 'md:pl-10 text-left'
                        }`}>
                          <div className={`rounded-2xl transition-all duration-300 hover:scale-[1.01] ${itemPadding}`}>
                            {/* Date */}
                            <div className={`font-sans font-bold text-[#8c6239] mb-1.5 tracking-wider ${
                              event.importance === 3 ? 'text-sm' : 'text-xs'
                            }`}>
                              {event.date}
                            </div>
                            {/* Title */}
                            <h3 className={`${titleStyle} break-keep`}>
                              {event.title}
                            </h3>
                          </div>
                        </div>

                        {/* Spacer for MD screens to align properly */}
                        <div className="hidden md:block md:w-[45%]" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll Footer Decoration */}
        <div className="w-full max-w-3xl h-8 bg-gradient-to-r from-[#3d2712] via-[#8c6239] to-[#3d2712] rounded-full shadow-lg relative z-20 flex items-center justify-between px-6 -mt-4">
          <div className="w-6 h-6 rounded-full bg-[#1c1209] shadow-inner" />
          <div className="w-6 h-6 rounded-full bg-[#1c1209] shadow-inner" />
        </div>
      </div>
    </main>
  );
}
