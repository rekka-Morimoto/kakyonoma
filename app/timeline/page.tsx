'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface TimelineEvent {
  importance: number;
  date: string;
  title: string;
}

/* ─── 背景：夜空に浮かぶ星屑のSVG星の生成 ─── */
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.round(Math.sin(i * 137.508) * 50 + 50), // 0-100%
  y: Math.round(Math.cos(i * 97.311) * 50 + 50),  // 0-100%
  size: (i % 3) + 1,
  opacity: (((i * 31) % 70) + 30) / 100,
}));

export default function TimelinePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

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

  /* ─── パスワード認証画面 ─── */
  if (!isAuthenticated) {
    return (
      <main
        className="min-h-screen flex items-center justify-center p-6 font-serif relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 60% 20%, #1a2a4a 0%, #0d1520 40%, #08100c 100%)',
        }}
      >
        {/* 夜空の星 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {STARS.map(s => (
            <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.size} fill="white" opacity={s.opacity} />
          ))}
        </svg>
        {/* 月 */}
        <div className="absolute top-12 right-16 w-20 h-20 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle at 35% 35%, #fffbe6, #c9a64e)', boxShadow: '0 0 40px 10px rgba(201,166,78,0.25)' }} />

        <div className="max-w-md w-full glass-panel p-8 rounded-[2rem] border-white/10 shadow-2xl relative overflow-hidden text-center space-y-6 z-10"
          style={{ background: 'rgba(13,21,32,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="absolute inset-2 border border-[#c9a64e]/20 rounded-[1.8rem] pointer-events-none" />
          <div className="text-6xl my-4">📜</div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest">かきょ年表</h2>
            <p className="text-xs text-[#c9a64e] tracking-[0.3em] uppercase">Private Archive</p>
          </div>
          <p className="text-sm text-[#d4c5b0] leading-relaxed">
            この記録は現在、一般には非公開となっています。閲覧するには暗証番号を入力してください。
          </p>
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <input
              type="password"
              placeholder="暗証番号を入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-white focus:outline-none focus:border-[#c9a64e] font-sans tracking-[0.5em] text-lg transition-colors placeholder:font-serif placeholder:tracking-normal"
            />
            {error && <p className="text-[#e87c6a] text-sm">{error}</p>}
            <div className="flex gap-4 pt-2">
              <Link href="/home"
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-sans uppercase font-bold tracking-wider">
                戻る
              </Link>
              <button type="submit"
                className="flex-1 px-4 py-3 rounded-xl bg-[#c9a64e] hover:bg-[#b08f3f] text-[#0d1520] font-sans font-bold tracking-wider text-sm transition-all shadow-lg">
                入室する
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  /* ─── 年表本体 ─── */
  return (
    <main
      className="min-h-screen p-4 sm:p-8 md:p-16 relative overflow-x-hidden flex flex-col items-center"
      style={{
        background: 'radial-gradient(ellipse at 65% 15%, #1a2a4a 0%, #0d1520 45%, #08100c 100%)',
      }}
    >
      {/* 夜空の星 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        {STARS.map(s => (
          <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.size} fill="white" opacity={s.opacity} />
        ))}
      </svg>

      {/* 月（右上） */}
      <div
        className="fixed top-10 right-10 w-24 h-24 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #fffbe6 0%, #f0d080 40%, #c9a64e 100%)',
          boxShadow: '0 0 60px 15px rgba(201,166,78,0.20), 0 0 120px 30px rgba(201,166,78,0.08)',
        }}
      />
      {/* 月の光の靄 */}
      <div
        className="fixed top-0 right-0 w-72 h-72 rounded-full pointer-events-none z-0 opacity-10"
        style={{ background: 'radial-gradient(circle, #c9a64e 0%, transparent 70%)' }}
      />

      <div className="max-w-3xl w-full space-y-0 relative z-10 flex flex-col items-center">
        {/* Back link */}
        <div className="w-full flex justify-start mb-6">
          <Link href="/home"
            className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors group font-bold tracking-widest text-base font-serif">
            <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
            BACK TO HOME
          </Link>
        </div>

        {/* ── 巻物の上端 軸 ── */}
        <div className="w-full h-10 rounded-full relative flex items-center justify-between px-5 shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
          style={{ background: 'linear-gradient(to right, #2a1a08, #a06830, #c8884a, #a06830, #2a1a08)' }}>
          <div className="w-7 h-7 rounded-full shadow-inner" style={{ background: 'radial-gradient(circle at 35% 35%, #5c3010, #1c0c04)' }} />
          <div className="text-[#c9a64e]/40 text-xs tracking-[0.5em] font-sans uppercase select-none">Chronicle</div>
          <div className="w-7 h-7 rounded-full shadow-inner" style={{ background: 'radial-gradient(circle at 35% 35%, #5c3010, #1c0c04)' }} />
        </div>

        {/* ── 巻物の紙面 ── */}
        <div
          className="w-full relative flex flex-col items-center"
          style={{
            background: 'linear-gradient(to bottom, #060a17 0%, #0d172e 40%, #080f1d 100%)',
            borderLeft: '12px solid #140e0a',
            borderRight: '12px solid #140e0a',
            boxShadow: 'inset 24px 0 35px -15px rgba(0,0,0,0.95), inset -24px 0 35px -15px rgba(0,0,0,0.95), 0 10px 50px rgba(0,0,0,0.85)',
          }}
        >
          {/* 宇宙の微細な星屑テクスチャ */}
          <div className="absolute inset-0 pointer-events-none opacity-35"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), radial-gradient(rgba(170,200,255,0.12) 1.5px, transparent 1.5px)',
              backgroundSize: '28px 28px, 44px 44px',
            }}
          />
          {/* 巻物内枠の装飾線（金枠） */}
          <div className="absolute inset-x-1.5 inset-y-0 border-l border-r border-[#c9a64e]/20 pointer-events-none" />
          <div className="absolute inset-x-3 inset-y-0 border-l border-r border-[#c9a64e]/08 pointer-events-none" />

          {loading ? (
            <div className="py-32 text-[#c9a64e]/80 text-xl text-center font-serif tracking-widest animate-pulse">絵巻を紐解いています...</div>
          ) : (
            <div className="w-full px-4 sm:px-10 py-14 relative">
              {/* ヘッダー */}
              <header className="text-center pb-8 mb-4 border-b-2 border-[#c9a64e]/20 relative">
                <p className="text-[10px] text-[#c9a64e]/70 tracking-[0.6em] uppercase font-sans mb-2">Maison de Kyo</p>
                <h1 className="text-4xl md:text-5xl font-black tracking-[0.25em] text-[#ffe29a]" style={{ textShadow: '0 0 15px rgba(255,226,154,0.15)' }}>かきょ年表</h1>
                <p className="text-[10px] text-[#c9a64e]/70 tracking-[0.4em] uppercase font-sans mt-3">Chronicle of Kakyo</p>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0c1326] border border-[#c9a64e]/40 rounded-full flex items-center justify-center text-[#c9a64e] text-xs shadow-[0_0_8px_rgba(201,166,78,0.3)]">✦</div>
              </header>

              {/* ── タイムライン ── */}
              <div className="relative pt-10">
                {/* 天の川（Milky Way）ガイド線：星雲のようなぼかし光 */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-8 md:-translate-x-1/2 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(160, 195, 255, 0.18) 5%, rgba(255, 255, 255, 0.28) 50%, rgba(200, 180, 255, 0.18) 95%, transparent)',
                    filter: 'blur(6px)',
                  }} />
                {/* 天の川の芯線 */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.35) 5%, rgba(255, 255, 255, 0.75) 50%, rgba(255, 255, 255, 0.35) 95%, transparent)',
                    filter: 'blur(1px)',
                  }} />

                <div className="space-y-10">
                  {events.map((event, index) => {
                    const isEven = index % 2 === 0;
                    const imp = event.importance;

                    /* ── 重要度別スタイル定義 ── */
                    const cardClass = imp === 3
                      ? 'p-5 md:p-6 rounded-2xl border-2 border-[#c9a64e]/60 shadow-[0_4px_25px_rgba(201,166,78,0.15)] relative overflow-hidden'
                      : imp === 2
                        ? 'p-4 rounded-xl border border-white/10 hover:border-[#c9a64e]/40 shadow-sm'
                        : 'py-2 px-3 rounded-lg border-b border-white/5';

                    const cardBg = imp === 3
                      ? 'rgba(14, 25, 48, 0.85)'
                      : imp === 2
                        ? 'rgba(14, 25, 48, 0.55)'
                        : 'transparent';

                    const titleClass = imp === 3
                      ? 'text-lg md:text-xl font-black text-white leading-snug tracking-wider'
                      : imp === 2
                        ? 'text-sm md:text-base font-bold text-[#e2e8f0] leading-snug'
                        : 'text-xs text-[#cbd5e1] leading-snug';

                    const dateClass = imp === 3
                      ? 'text-xs font-black text-[#ffc56c] tracking-widest mb-2 font-sans'
                      : imp === 2
                        ? 'text-[11px] font-bold text-[#d4b26f] tracking-wider mb-1.5 font-sans'
                        : 'text-[10px] font-bold text-[#a0aec0] tracking-wide mb-1 font-sans';

                    const dotClass = imp === 3
                      ? 'w-5 h-5 rounded-full z-10 flex items-center justify-center'
                      : imp === 2
                        ? 'w-3.5 h-3.5 rounded-full z-10'
                        : 'w-2.5 h-2.5 rounded-full z-10';

                    const dotStyle = imp === 3
                      ? {
                          background: 'radial-gradient(circle, #ffffff 0%, #c9a64e 60%, #5c3010 100%)',
                          boxShadow: '0 0 15px 5px rgba(255,255,255,0.65), 0 0 0 4px rgba(6,10,23,0.9)',
                        }
                      : imp === 2
                        ? {
                            background: '#c9a64e',
                            boxShadow: '0 0 8px 2px rgba(201,166,78,0.5), 0 0 0 3px rgba(6,10,23,0.9)',
                          }
                        : {
                            background: '#a0aec0',
                            boxShadow: '0 0 5px 1px rgba(160,174,192,0.4), 0 0 0 2px rgba(6,10,23,0.9)',
                          };

                    return (
                      <div
                        key={index}
                        className={`flex flex-col md:flex-row items-start md:items-center relative w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
                      >
                        {/* ドット */}
                        <div
                          className={`absolute left-4 md:left-1/2 -translate-x-1/2 top-4 md:top-1/2 md:-translate-y-1/2 ${dotClass}`}
                          style={{
                            background: dotStyle.background,
                            boxShadow: dotStyle.boxShadow,
                          }}
                        >
                          {imp === 3 && <span className="w-2 h-2 rounded-full bg-white opacity-90 animate-ping" />}
                        </div>

                        {/* カード */}
                        <div className={`w-[calc(100%-2.5rem)] md:w-[45%] ml-10 md:ml-0 ${isEven ? 'md:pr-10' : 'md:pl-10'}`}>
                          <div
                            className={`${cardClass} transition-all duration-300 hover:scale-[1.015]`}
                            style={{ background: cardBg }}
                          >
                            {/* ☆☆☆ 豪華装飾：金の箔押し風ラインと輝き */}
                            {imp === 3 && (
                              <>
                                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                                  style={{ background: 'linear-gradient(to right, transparent, #c9a64e, transparent)' }} />
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
                                  style={{ background: 'linear-gradient(to right, transparent, #c9a64e, transparent)' }} />
                                {/* 隅の金星 */}
                                <span className="absolute top-2 right-2 text-[#c9a64e] text-xs opacity-80 animate-pulse select-none">✦</span>
                                <span className="absolute top-2 left-2 text-[#c9a64e] text-xs opacity-80 animate-pulse select-none">✦</span>
                              </>
                            )}
                            <div className={dateClass}>{event.date}</div>
                            <h3 className={titleClass}>{event.title}</h3>
                          </div>
                        </div>

                        {/* MD幅用スペーサー */}
                        <div className="hidden md:block md:w-[45%]" />
                      </div>
                    );
                  })}
                </div>

                {/* タイムライン末端の飾り */}
                <div className="relative flex justify-center mt-12 mb-4">
                  <div className="text-[#c9a64e]/60 text-2xl select-none">✦</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 巻物の下端 軸 ── */}
        <div className="w-full h-10 rounded-full relative flex items-center justify-between px-5 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]"
          style={{ background: 'linear-gradient(to right, #2a1a08, #a06830, #c8884a, #a06830, #2a1a08)' }}>
          <div className="w-7 h-7 rounded-full shadow-inner" style={{ background: 'radial-gradient(circle at 35% 35%, #5c3010, #1c0c04)' }} />
          <div className="w-7 h-7 rounded-full shadow-inner" style={{ background: 'radial-gradient(circle at 35% 35%, #5c3010, #1c0c04)' }} />
        </div>
      </div>
    </main>
  );
}
