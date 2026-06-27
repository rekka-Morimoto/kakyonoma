'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface TimelineEvent {
  importance: number;
  date: string;
  title: string;
  linkUrl?: string | null;
  thumbnailUrl?: string | null;
}

/* ─── 背景：夜空に浮かぶ星屑のSVG星の生成 ─── */
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.round(Math.sin(i * 137.508) * 50 + 50), // 0-100%
  y: Math.round(Math.cos(i * 97.311) * 50 + 50),  // 0-100%
  size: (i % 3) + 1,
  opacity: (((i * 31) % 70) + 30) / 100,
}));

interface GridRow {
  left?: TimelineEvent;
  right?: TimelineEvent;
}

interface TimelineBlock {
  type: 'full' | 'gridRows';
  event?: TimelineEvent;
  rows?: GridRow[];
}

const getEventStyles = (imp: number) => {
  const cardClass = imp === 3
    ? 'p-6 md:p-8 rounded-3xl border-2 border-[#c9a64e]/60 shadow-[0_4px_35px_rgba(201,166,78,0.2)] hover:shadow-[0_12px_50px_rgba(201,166,78,0.45),_0_0_30px_rgba(255,226,154,0.25)] relative overflow-hidden cursor-pointer group'
    : imp === 2
      ? 'p-4 md:p-5 rounded-2xl border border-white/15 hover:border-[#c9a64e]/50 shadow-md relative overflow-hidden cursor-pointer group'
      : 'py-3 px-4 rounded-xl border border-white/10 hover:border-[#c9a64e]/40 relative overflow-hidden cursor-pointer group';

  const cardBg = imp === 3
    ? 'radial-gradient(circle at 90% 10%, rgba(251, 191, 36, 0.22) 0%, rgba(12, 19, 38, 0.96) 70%)'
    : imp === 2
      ? 'rgba(14, 25, 48, 0.75)'
      : 'rgba(10, 18, 36, 0.65)';

  const titleClass = imp === 3
    ? 'text-xl md:text-2xl font-black text-white leading-relaxed tracking-wider break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]'
    : imp === 2
      ? 'text-sm md:text-base font-bold text-[#f1f5f9] leading-snug break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]'
      : 'text-xs text-[#e2e8f0] font-medium leading-snug break-keep [overflow-wrap:anywhere] [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]';

  const dateClass = imp === 3
    ? 'text-xs md:text-sm font-black text-[#ffc56c] tracking-widest mb-2 font-sans [text-shadow:0_1px_5px_rgba(0,0,0,0.8)]'
    : imp === 2
      ? 'text-[11px] font-bold text-[#d4b26f] tracking-wider mb-1 font-sans [text-shadow:0_1px_5px_rgba(0,0,0,0.8)]'
      : 'text-[10px] font-bold text-[#a0aec0] tracking-wide mb-0.5 font-sans [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]';

  const dotClass = imp === 3
    ? 'w-6 h-6 rounded-full z-10 flex items-center justify-center'
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

  return { cardClass, cardBg, titleClass, dateClass, dotClass, dotStyle };
};

export default function TimelinePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // 時系列順に整列されたイベントを、行(Row)単位のブロックへ変換
  const blocks = React.useMemo<TimelineBlock[]>(() => {
    const list: TimelineBlock[] = [];
    let currentBatch: TimelineEvent[] = [];

    const flushGridBatch = () => {
      if (currentBatch.length === 0) return;
      const rows: GridRow[] = [];
      for (let i = 0; i < currentBatch.length; i += 2) {
        rows.push({
          left: currentBatch[i],
          right: currentBatch[i + 1],
        });
      }
      list.push({ type: 'gridRows', rows });
      currentBatch = [];
    };

    events.forEach((event) => {
      if (event.importance === 3) {
        flushGridBatch();
        list.push({ type: 'full', event });
      } else {
        currentBatch.push(event);
      }
    });

    flushGridBatch();
    return list;
  }, [events]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/timeline');
      if (res.ok) {
        const data = await res.json();
        const evList: TimelineEvent[] = data.events || [];
        // 日付順（昇順）にソートを徹底保証
        evList.sort((a, b) => a.date.localeCompare(b.date));
        setEvents(evList);
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
      setIsAuthenticated(true);
      fetchEvents();
    } else {
      setError('暗証番号が正しくありません。');
    }
  };

  // サムネイルとテキストの重ね合わせ表示コンポーネント
  const renderCardInner = (event: TimelineEvent) => {
    const imp = event.importance;
    const { titleClass, dateClass } = getEventStyles(imp);

    return (
      <>
        {/* サムネイル画像（右側背景レイヤーとして重ね合わせ・スペース有効活用） */}
        {event.thumbnailUrl && (
          <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-5/12 h-full overflow-hidden pointer-events-none z-0">
            {/* グラデーションオーバーレイでテキスト可読性を100%確保 */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background: 'linear-gradient(to right, rgba(12, 19, 38, 0.98) 0%, rgba(12, 19, 38, 0.75) 40%, rgba(12, 19, 38, 0.3) 100%)',
              }}
            />
            <img
              src={event.thumbnailUrl}
              alt=""
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
              loading="lazy"
            />
          </div>
        )}

        {/* テキストコンテンツ */}
        <div className="relative z-10 flex flex-col justify-center w-full pr-4">
          <div className={dateClass}>{event.date}</div>
          <h3 className={titleClass}>{event.title}</h3>
        </div>
      </>
    );
  };

  return (
    <main className="min-h-screen bg-[#030712] text-gray-100 font-serif relative overflow-x-hidden selection:bg-[#c9a64e]/30 selection:text-amber-200">
      {/* ── 夜空背景・星屑 ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0b1736] via-[#040914] to-[#02040a]" />
        <svg className="w-full h-full opacity-70">
          {STARS.map((star) => (
            <circle
              key={star.id}
              cx={`${star.x}%`}
              cy={`${star.y}%`}
              r={star.size}
              fill="#ffffff"
              opacity={star.opacity}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-14 flex flex-col items-center min-h-screen">
        {/* ── 巻物の紙面 ── */}
        <div
          className="w-full relative flex flex-col items-center transition-all duration-500"
          style={{
            background: 'linear-gradient(to bottom, #060a17 0%, #0d172e 40%, #080f1d 100%)',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8), 0 0 15px rgba(201,166,78,0.15)',
            borderLeft: '4px solid #1a0f05',
            borderRight: '4px solid #1a0f05',
            borderRadius: '16px',
            padding: '24px 16px',
          }}
        >
          {/* 金の細フレームライン */}
          <div className="absolute inset-2 border border-[#c9a64e]/30 pointer-events-none rounded-lg" />
          <div className="absolute inset-3 border border-[#c9a64e]/15 pointer-events-none rounded-lg" />

          {!isAuthenticated ? (
            /* ── パスワード認証画面 ── */
            <div className="w-full max-w-md py-16 px-6 text-center my-auto animate-fadeIn">
              <div className="mb-6 inline-block">
                <div className="w-16 h-16 rounded-full border-2 border-[#c9a64e]/40 flex items-center justify-center mx-auto bg-[#0a1224] shadow-[0_0_20px_rgba(201,166,78,0.2)]">
                  <span className="text-[#c9a64e] text-2xl">🗝️</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#ffe29a] tracking-widest mb-3" style={{ textShadow: '0 0 12px rgba(255,226,154,0.3)' }}>
                閲覧制限
              </h2>
              <p className="text-xs text-[#c9a64e]/80 tracking-wider mb-8 font-sans">
                かきょ年表を紐解くには暗証番号が必要です
              </p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="暗証番号を入力"
                    className="w-full px-5 py-3.5 rounded-xl bg-[#080d1a] border border-[#c9a64e]/40 text-center text-lg text-white tracking-[0.3em] focus:outline-none focus:border-[#c9a64e] focus:ring-2 focus:ring-[#c9a64e]/30 transition-all placeholder:tracking-normal placeholder:text-gray-600 font-sans shadow-inner"
                  />
                </div>
                {error && <p className="text-rose-400 text-xs font-sans animate-bounce">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c9a64e] via-[#e2c575] to-[#a06830] text-[#080d1a] font-black tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_4px_15px_rgba(201,166,78,0.3)] font-sans"
                >
                  紐解く
                </button>
              </form>
            </div>
          ) : loading ? (
            /* ── ローディング表示 ── */
            <div className="py-24 text-center my-auto">
              <div className="w-10 h-10 border-3 border-[#c9a64e]/20 border-t-[#c9a64e] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#c9a64e]/80 tracking-widest font-sans animate-pulse">絵巻を紐解いています...</p>
            </div>
          ) : (
            /* ── 年表コンテンツ ── */
            <div className="w-full">
              {/* ヘッダー */}
              <header className="text-center pb-8 mb-4 border-b-2 border-[#c9a64e]/20 relative">
                <p className="text-[10px] text-[#c9a64e]/70 tracking-[0.6em] uppercase font-sans mb-2">Maison de Kyo</p>
                <h1 className="text-4xl md:text-5xl font-black tracking-[0.25em] text-[#ffe29a]" style={{ textShadow: '0 0 15px rgba(255,226,154,0.15)' }}>かきょ年表</h1>
                <p className="text-[10px] text-[#c9a64e]/70 tracking-[0.4em] uppercase font-sans mt-3">Chronicle of Kakyo</p>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0c1326] border border-[#c9a64e]/40 rounded-full flex items-center justify-center text-[#c9a64e] text-xs shadow-[0_0_8px_rgba(201,166,78,0.3)]">✦</div>
              </header>

              {/* ── タイムライン ── */}
              <div className="relative pt-10 w-full">
                {/* 天の川（Milky Way）ガイド線 */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-8 md:-translate-x-1/2 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(160, 195, 255, 0.18) 5%, rgba(255, 255, 255, 0.28) 50%, rgba(200, 180, 255, 0.18) 95%, transparent)',
                    filter: 'blur(6px)',
                  }} />
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.35) 5%, rgba(255, 255, 255, 0.75) 50%, rgba(255, 255, 255, 0.35) 95%, transparent)',
                    filter: 'blur(1px)',
                  }} />

                {/* ── PC表示 (md以上): 時系列順 行単位グリッド ── */}
                <div className="hidden md:block space-y-8 relative w-full animate-fadeIn">
                  {blocks.map((block, blockIdx) => {
                    if (block.type === 'full' && block.event) {
                      const ev = block.event;
                      const { cardClass, cardBg, dotStyle } = getEventStyles(3);

                      return (
                        <div key={`full-${blockIdx}`} className="relative w-full py-4 flex justify-center">
                          {/* 中央ドット */}
                          <div
                            className="absolute left-1/2 -translate-x-1/2 -top-1 w-6 h-6 rounded-full z-20 flex items-center justify-center"
                            style={dotStyle}
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-white opacity-90 animate-ping" />
                          </div>

                          {/* カード本体 */}
                          <div
                            className={`${cardClass} w-full max-w-2xl transition-all duration-300 hover:scale-[1.015]`}
                            style={{ background: cardBg }}
                            onClick={() => setSelectedEvent(ev)}
                          >
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a64e] to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a64e] to-transparent" />
                            
                            {/* 三月と星屑の装飾 */}
                            <div className="absolute top-3 right-3 text-[#c9a64e]/50 pointer-events-none select-none animate-pulse z-10" style={{ animationDuration: '4s' }}>
                              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                              </svg>
                            </div>
                            <span className="absolute top-2.5 left-2.5 text-[#c9a64e]/60 text-xs animate-pulse select-none z-10" style={{ animationDelay: '0.2s', animationDuration: '3s' }}>✦</span>
                            <span className="absolute bottom-3 right-5 text-[#c9a64e]/50 text-[10px] animate-pulse select-none z-10" style={{ animationDelay: '1.2s', animationDuration: '2.5s' }}>✦</span>

                            {renderCardInner(ev)}
                          </div>
                        </div>
                      );
                    } else if (block.type === 'gridRows' && block.rows) {
                      return (
                        <div key={`gridRows-${blockIdx}`} className="space-y-6 w-full">
                          {block.rows.map((row, rowIdx) => (
                            <div key={`row-${rowIdx}`} className="grid grid-cols-2 gap-x-12 w-full relative items-center">
                              {/* 左カラム (右寄せ) */}
                              <div className="flex justify-end w-full">
                                {row.left ? (
                                  (() => {
                                    const ev = row.left;
                                    const { cardClass, cardBg, dotClass, dotStyle } = getEventStyles(ev.importance);
                                    return (
                                      <div className="relative w-full max-w-[92%] transition-all duration-300 hover:scale-[1.02]">
                                        <div className="absolute right-[-31px] top-1/2 -translate-y-1/2 flex items-center z-20 pointer-events-none">
                                          <div className="w-[11px] h-px bg-[#c9a64e]/30" />
                                          <div className={`rounded-full ${dotClass}`} style={dotStyle} />
                                        </div>

                                        <div
                                          className={`${cardClass} w-full text-right`}
                                          style={{ background: cardBg }}
                                          onClick={() => setSelectedEvent(ev)}
                                        >
                                          {renderCardInner(ev)}
                                        </div>
                                      </div>
                                    );
                                  })()
                                ) : <div />}
                              </div>

                              {/* 右カラム (左寄せ) */}
                              <div className="flex justify-start w-full">
                                {row.right ? (
                                  (() => {
                                    const ev = row.right;
                                    const { cardClass, cardBg, dotClass, dotStyle } = getEventStyles(ev.importance);
                                    return (
                                      <div className="relative w-full max-w-[92%] transition-all duration-300 hover:scale-[1.02]">
                                        <div className="absolute left-[-31px] top-1/2 -translate-y-1/2 flex items-center flex-row-reverse z-20 pointer-events-none">
                                          <div className="w-[11px] h-px bg-[#c9a64e]/30" />
                                          <div className={`rounded-full ${dotClass}`} style={dotStyle} />
                                        </div>

                                        <div
                                          className={`${cardClass} w-full text-left`}
                                          style={{ background: cardBg }}
                                          onClick={() => setSelectedEvent(ev)}
                                        >
                                          {renderCardInner(ev)}
                                        </div>
                                      </div>
                                    );
                                  })()
                                ) : <div />}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* ── モバイル表示 (md未満): 時系列順 縦並び ── */}
                <div className="block md:hidden space-y-6 w-full animate-fadeIn">
                  {events.map((event, index) => {
                    const imp = event.importance;
                    const { cardClass, cardBg, dotClass, dotStyle } = getEventStyles(imp);

                    return (
                      <div key={`mobile-${index}`} className="flex items-center relative w-full">
                        {/* ドット */}
                        <div
                          className={`absolute left-4 -translate-x-1/2 top-1/2 -translate-y-1/2 ${dotClass}`}
                          style={{
                            background: dotStyle.background,
                            boxShadow: dotStyle.boxShadow,
                          }}
                        >
                          {imp === 3 && <span className="w-2.5 h-2.5 rounded-full bg-white opacity-90 animate-ping" />}
                        </div>

                        {/* カード */}
                        <div className="w-[calc(100%-2.5rem)] ml-10">
                          <div
                            className={`${cardClass} transition-all duration-300 active:scale-[0.98]`}
                            style={{ background: cardBg }}
                            onClick={() => setSelectedEvent(event)}
                          >
                            {imp === 3 && (
                              <>
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a64e] to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a64e] to-transparent" />
                                <div className="absolute top-2 right-2 text-[#c9a64e]/50 pointer-events-none select-none animate-pulse z-10" style={{ animationDuration: '4s' }}>
                                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                  </svg>
                                </div>
                              </>
                            )}

                            {renderCardInner(event)}
                          </div>
                        </div>
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

      {/* ── 詳細拡大モーダル ── */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-[#0c1326] border-2 border-[#c9a64e]/70 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(201,166,78,0.3)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 金の箔押し風ライン & 装飾 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a64e] to-transparent" />
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-[#c9a64e]/70 hover:text-white text-xl font-bold w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-colors font-sans"
            >
              ✕
            </button>

            {/* サムネイル（高画質/拡大表示） */}
            {selectedEvent.thumbnailUrl && (
              <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-inner relative">
                <img
                  src={selectedEvent.thumbnailUrl}
                  alt="Event Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 日付とタイトル */}
            <div className="text-xs md:text-sm font-black text-[#ffc56c] tracking-widest mb-2 font-sans">
              {selectedEvent.date}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white leading-relaxed tracking-wider break-keep mb-6">
              {selectedEvent.title}
            </h2>

            {/* ボタン群 */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {selectedEvent.linkUrl ? (
                <a
                  href={selectedEvent.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#c9a64e] via-[#e2c575] to-[#a06830] text-[#080d1a] font-black text-center shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 font-sans"
                >
                  🔗 リンク先を開く ({selectedEvent.linkUrl.includes('youtube') || selectedEvent.linkUrl.includes('youtu.be') ? 'YouTube' : selectedEvent.linkUrl.includes('twitter.com') || selectedEvent.linkUrl.includes('x.com') ? 'X' : 'Web'})
                </a>
              ) : null}
              <button
                onClick={() => setSelectedEvent(null)}
                className="py-3 px-6 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors font-sans"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
