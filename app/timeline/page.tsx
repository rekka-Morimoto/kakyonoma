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

const getEventStyles = (imp: number, title: string = '') => {
  const isSpace = title.includes('#かきょすぺーす') || title.includes('かきょすぺーす');
  const isStory = title.includes('#きょーのお話') || title.includes('きょーのお話');
    // ☆1を標準基準（コンパクト）として、☆2・☆3を明確に大きく拡大
  const cardClass = imp === 3
    ? 'p-8 md:p-10 rounded-3xl border-2 shadow-[0_4px_45px_rgba(201,166,78,0.25)] hover:shadow-[0_12px_60px_rgba(201,166,78,0.5),_0_0_35px_rgba(255,226,154,0.3)] relative overflow-hidden cursor-pointer group'
    : imp === 2
      ? 'p-6 md:p-8 rounded-3xl border shadow-xl relative overflow-hidden cursor-pointer group'
      : 'py-2 px-3.5 rounded-lg border relative overflow-hidden cursor-pointer group';

  // タグカラー分岐
  let cardBg = '';
  let borderClass = '';
  let dateClass = '';
  let overlayGradient = '';

  if (isSpace) {
    // #かきょすぺーす: 紫色テーマ
    cardBg = imp === 3
      ? 'radial-gradient(circle at 90% 10%, rgba(168, 85, 247, 0.35) 0%, rgba(24, 9, 43, 0.97) 70%)'
      : imp === 2
        ? 'rgba(38, 16, 64, 0.88)'
        : 'rgba(28, 12, 48, 0.78)';
    borderClass = imp === 3 ? 'border-purple-400/80' : imp === 2 ? 'border-purple-500/50 hover:border-purple-300/80' : 'border-purple-500/30 hover:border-purple-400/60';
    dateClass = imp === 3
      ? 'text-xs md:text-sm font-black text-purple-300 tracking-widest mb-2 font-sans'
      : imp === 2
        ? 'text-[11px] md:text-xs font-bold text-purple-300 tracking-wider mb-1 font-sans'
        : 'text-[10px] md:text-[11px] font-bold text-purple-300/80 tracking-wide mb-0.5 font-sans';
    overlayGradient = 'linear-gradient(to right, rgba(28, 12, 48, 0.98) 0%, rgba(28, 12, 48, 0.8) 40%, rgba(28, 12, 48, 0.3) 100%)';
  } else if (isStory) {
    // #きょーのお話: 青色テーマ
    cardBg = imp === 3
      ? 'radial-gradient(circle at 90% 10%, rgba(59, 130, 246, 0.35) 0%, rgba(10, 25, 54, 0.97) 70%)'
      : imp === 2
        ? 'rgba(14, 35, 71, 0.88)'
        : 'rgba(10, 24, 50, 0.78)';
    borderClass = imp === 3 ? 'border-blue-400/80' : imp === 2 ? 'border-blue-500/50 hover:border-blue-300/80' : 'border-blue-500/30 hover:border-blue-400/60';
    dateClass = imp === 3
      ? 'text-xs md:text-sm font-black text-blue-300 tracking-widest mb-2 font-sans'
      : imp === 2
        ? 'text-[11px] md:text-xs font-bold text-blue-300 tracking-wider mb-1 font-sans'
        : 'text-[10px] md:text-[11px] font-bold text-blue-300/80 tracking-wide mb-0.5 font-sans';
    overlayGradient = 'linear-gradient(to right, rgba(10, 24, 50, 0.98) 0%, rgba(10, 24, 50, 0.8) 40%, rgba(10, 24, 50, 0.3) 100%)';
  } else {
    // 通常（金/紺テーマ）
    cardBg = imp === 3
      ? 'radial-gradient(circle at 90% 10%, rgba(251, 191, 36, 0.22) 0%, rgba(12, 19, 38, 0.96) 70%)'
      : imp === 2
        ? 'rgba(14, 25, 48, 0.8)'
        : 'rgba(10, 18, 36, 0.7)';
    borderClass = imp === 3 ? 'border-[#c9a64e]/70' : imp === 2 ? 'border-white/20 hover:border-[#c9a64e]/60' : 'border-white/10 hover:border-[#c9a64e]/40';
    dateClass = imp === 3
      ? 'text-xs md:text-sm font-black text-[#ffc56c] tracking-widest mb-2 font-sans'
      : imp === 2
        ? 'text-[11px] md:text-xs font-bold text-[#d4b26f] tracking-wider mb-1 font-sans'
        : 'text-[10px] md:text-[11px] font-bold text-[#a0aec0] tracking-wide mb-0.5 font-sans';
    overlayGradient = 'linear-gradient(to right, rgba(12, 19, 38, 0.98) 0%, rgba(12, 19, 38, 0.75) 40%, rgba(12, 19, 38, 0.3) 100%)';
  }

  const titleClass = imp === 3
    ? 'text-2xl md:text-3xl font-black text-white leading-relaxed tracking-wider break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]'
    : imp === 2
      ? 'text-lg md:text-xl font-bold text-[#f8fafc] leading-relaxed break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]'
      : 'text-[11px] md:text-xs text-[#e2e8f0] font-medium leading-snug break-keep [overflow-wrap:anywhere] [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]';

  const dotClass = imp === 3
    ? 'w-7 h-7 rounded-full z-10 flex items-center justify-center'
    : imp === 2
      ? 'w-4 h-4 rounded-full z-10'
      : 'w-2.5 h-2.5 rounded-full z-10';

  const dotStyle = imp === 3
    ? {
        background: 'radial-gradient(circle, #ffffff 0%, #c9a64e 60%, #5c3010 100%)',
        boxShadow: '0 0 15px 5px rgba(255,255,255,0.65), 0 0 0 4px rgba(6,10,23,0.9)',
      }
    : imp === 2
      ? {
          background: isSpace ? '#c084fc' : isStory ? '#60a5fa' : '#c9a64e',
          boxShadow: `0 0 8px 2px ${isSpace ? 'rgba(192,132,252,0.5)' : isStory ? 'rgba(96,165,250,0.5)' : 'rgba(201,166,78,0.5)'}, 0 0 0 3px rgba(6,10,23,0.9)`,
        }
      : {
          background: isSpace ? '#a855f7' : isStory ? '#3b82f6' : '#a0aec0',
          boxShadow: '0 0 5px 1px rgba(160,174,192,0.4), 0 0 0 2px rgba(6,10,23,0.9)',
        };

  return { cardClass: `${cardClass} ${borderClass}`, cardBg, titleClass, dateClass, dotClass, dotStyle, overlayGradient };
};

export default function TimelinePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [showCharSearch, setShowCharSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 検索フィルタリング済みイベント
  const filteredEvents = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return events.filter(
      (ev) => ev.title.toLowerCase().includes(q) || ev.date.includes(q)
    );
  }, [events, searchQuery]);

  const [spans, setSpans] = useState<{ [key: string]: number }>({});
  const cardRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

  const calculateSpans = React.useCallback(() => {
    const newSpans: { [key: string]: number } = {};
    let changed = false;

    events.forEach((event, idx) => {
      const id = `pc-${idx}`;
      const element = cardRefs.current[id];
      if (element) {
        const height = element.getBoundingClientRect().height || element.offsetHeight;
        // 1スパン = 10px。少しの余白を含めてスパン数を算出
        const span = Math.ceil(height / 10) + 2;
        if (spans[id] !== span) {
          newSpans[id] = span;
          changed = true;
        } else {
          newSpans[id] = spans[id];
        }
      }
    });

    if (changed) {
      setSpans(newSpans);
    }
  }, [events, spans]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // イベント一覧が更新された時、またはウィンドウのリサイズ時に再計算
  useEffect(() => {
    if (events.length > 0) {
      calculateSpans();
    }
  }, [events, calculateSpans]);

  useEffect(() => {
    const handleResize = () => {
      calculateSpans();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateSpans]);

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
  const renderCardInner = (event: TimelineEvent, overlayGrad?: string) => {
    const imp = event.importance;
    const { titleClass, dateClass, overlayGradient } = getEventStyles(imp, event.title);
    const grad = overlayGrad || overlayGradient;

    return (
      <>
        {/* サムネイル画像（右側背景レイヤーとして重ね合わせ・スペース有効活用） */}
        {event.thumbnailUrl && (
          <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-5/12 h-full overflow-hidden pointer-events-none z-0">
            {/* グラデーションオーバーレイでテキスト可読性を100%確保 */}
            <div
              className="absolute inset-0 z-10"
              style={{ background: grad }}
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

  // 左右交互（千鳥配置）用インデックスカウンター
  let nonStar3Counter = 0;

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
      {/* ── キャラクター立ち絵（常に画面右下・年表右端整列） ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-4xl mx-auto px-2">
          <div className="flex justify-end">
            <button
              onClick={() => setShowCharSearch(true)}
              aria-label="かきょに何か聞く"
              className="pointer-events-auto focus:outline-none group"
              style={{
                width: 'clamp(100px, 13vw, 185px)',
                animation: 'characterFloat 5s ease-in-out infinite',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <img
                src="/kakyonenpyou.png"
                alt="かきょキャラクター"
                className="w-full h-auto object-contain transition-transform duration-200 group-hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 4px 24px rgba(100,120,255,0.55)) drop-shadow(0 0 10px rgba(180,160,255,0.35))',
                }}
                draggable={false}
              />
            </button>
          </div>
        </div>
      </div>


      {/* ── キャラクター検索モーダル（中央キャラ＋下半身に検索窓重ね） ── */}
      {showCharSearch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ background: 'rgba(2,4,10,0.82)', backdropFilter: 'blur(6px)' }}
          onClick={() => { setShowCharSearch(false); setSearchQuery(''); }}
        >
          {/* キャラ＋検索窓の一体コンテナ（クリック伝播止め） */}
          <div
            className="relative flex-shrink-0"
            style={{ height: '92vh', width: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* キャラクター：中央・92vh */}
            <img
              src="/kakyonenpyou.png"
              alt="かきょ"
              style={{
                height: '92vh',
                width: 'auto',
                maxWidth: '92vw',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 0 40px rgba(100,120,255,0.55)) drop-shadow(0 0 80px rgba(180,160,255,0.25))',
              }}
              draggable={false}
            />

            {/* 吹き出し（ドット絵テイスト：キャラクターの顔の左側） */}
            <div
              style={{
                position: 'absolute',
                top: '32%',
                left: '30%',
                zIndex: 15,
                background: '#fff',
                border: '3px solid #111',
                borderRadius: '4px',
                padding: '8px 14px',
                boxShadow: '3px 3px 0 #111',
              }}
            >
              <span style={{ position:'absolute', top:'-3px', left:'-3px', width:'6px', height:'6px', background:'#111', display:'block' }} />
              <span style={{ position:'absolute', top:'-3px', right:'-3px', width:'6px', height:'6px', background:'#111', display:'block' }} />
              <span style={{ position:'absolute', bottom:'-3px', left:'-3px', width:'6px', height:'6px', background:'#111', display:'block' }} />
              <span style={{ position:'absolute', bottom:'-3px', right:'-3px', width:'6px', height:'6px', background:'#111', display:'block' }} />
              <p style={{ fontFamily:"'Courier New',Courier,monospace", fontSize:'13px', fontWeight:'bold', color:'#111', lineHeight:1.5, margin:0, whiteSpace:'nowrap' }}>
                何探してるの？
              </p>
              {/* キャラクターの顔（右側）に向けて伸びる三角しっぽ */}
              <span style={{
                position: 'absolute',
                right: '-11px',
                top: '60%',
                transform: 'translateY(-50%)',
                display: 'block',
                width: 0,
                height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: '9px solid #111',
              }} />
              <span style={{
                position: 'absolute',
                right: '-8px',
                top: '60%',
                transform: 'translateY(-50%)',
                display: 'block',
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderLeft: '8px solid #fff',
              }} />
            </div>

            {/* 検索パネル：下半身に重なる（左端をつま先のあたり left: 12% に合わせる） */}
            <div
              className="absolute"
              style={{
                top: '56%',
                left: '12%',
                width: 'clamp(260px, 80%, 400px)',
                zIndex: 10,
              }}
            >

              {/* 検索ウィンドウ（半透明） */}
              <div
                style={{
                  background: 'rgba(6,10,23,0.65)',
                  border: '2px solid rgba(201,166,78,0.8)',
                  borderRadius: '6px',
                  boxShadow: '3px 3px 0 rgba(92,48,16,0.6), 0 0 40px rgba(201,166,78,0.25)',
                  padding: '14px 16px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* ドット絵風タイトルバー */}
                <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'10px' }}>
                  <span style={{ display:'inline-block', width:'9px', height:'9px', background:'#c9a64e', border:'2px solid #5c3010', imageRendering:'pixelated' }} />
                  <span style={{ display:'inline-block', width:'9px', height:'9px', background:'#a0aec0', border:'2px solid #4a5568', imageRendering:'pixelated' }} />
                  <span style={{ display:'inline-block', width:'9px', height:'9px', background:'#4a5568', border:'2px solid #2d3748', imageRendering:'pixelated' }} />
                  <span style={{ fontFamily:"'Courier New',monospace", fontSize:'10px', fontWeight:'bold', color:'#c9a64e', letterSpacing:'0.1em', marginLeft:'5px' }}>SEARCH.EXE</span>
                </div>

                {/* 検索入力 */}
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="キーワードを入力..."
                  style={{
                    width: '100%',
                    background: 'rgba(10,18,36,0.8)',
                    border: '2px solid #c9a64e',
                    borderRadius: '2px',
                    padding: '8px 12px',
                    color: '#ffe29a',
                    fontFamily: "'Courier New',Courier,monospace",
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    letterSpacing: '0.05em',
                  }}
                />

                {/* 検索結果 */}
                <div style={{ marginTop:'8px', maxHeight:'180px', overflowY:'auto' }}>
                  {searchQuery.trim() === '' ? (
                    <p style={{ fontFamily:"'Courier New',monospace", fontSize:'10px', color:'#4a5568', textAlign:'center', padding:'10px 0' }}>▶ キーワードを入れてね</p>
                  ) : filteredEvents.length === 0 ? (
                    <p style={{ fontFamily:"'Courier New',monospace", fontSize:'10px', color:'#e53e3e', textAlign:'center', padding:'10px 0' }}>× みつからなかった...</p>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                      {filteredEvents.map((ev, i) => (
                        <button
                          key={i}
                          onClick={() => { setSelectedEvent(ev); setShowCharSearch(false); setSearchQuery(''); }}
                          style={{
                            background: 'rgba(201,166,78,0.1)',
                            border: '1px solid rgba(201,166,78,0.4)',
                            borderRadius: '3px',
                            padding: '6px 9px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                            width: '100%',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,166,78,0.25)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(201,166,78,0.1)')}
                        >
                          <div style={{ fontFamily:"'Courier New',monospace", fontSize:'9px', color:'#c9a64e', marginBottom:'2px' }}>{ev.date}</div>
                          <div style={{ fontFamily:'sans-serif', fontSize:'11px', color:'#f1f5f9', lineHeight:1.4 }}>{ev.title}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 閉じる */}
                <button
                  onClick={() => { setShowCharSearch(false); setSearchQuery(''); }}
                  style={{
                    marginTop: '10px',
                    fontFamily: "'Courier New',monospace",
                    fontSize: '10px',
                    color: '#718096',
                    background: 'none',
                    border: '1px solid #4a5568',
                    borderRadius: '2px',
                    padding: '4px 10px',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                  }}
                >[ESC] とじる</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes characterFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-14 flex flex-col items-center min-h-screen" style={{ position: 'relative' }}>
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
                {/* ── PC表示 (md以上): 時系列順 グリッド Masonry 配置 ── */}
                <div 
                  className="hidden md:grid grid-cols-2 grid-auto-rows-[10px] gap-x-14 relative w-full animate-fadeIn"
                  style={{ rowGap: '0px' }}
                >
                  {/* 天の川（Milky Way）ガイド線（グリッドの中央を通るように配置） */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, transparent, rgba(160, 195, 255, 0.18) 5%, rgba(255, 255, 255, 0.28) 50%, rgba(200, 180, 255, 0.18) 95%, transparent)',
                      filter: 'blur(6px)',
                      gridColumn: '1 / -1',
                      zIndex: 5,
                    }} />
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.35) 5%, rgba(255, 255, 255, 0.75) 50%, rgba(255, 255, 255, 0.35) 95%, transparent)',
                      filter: 'blur(1px)',
                      gridColumn: '1 / -1',
                      zIndex: 5,
                    }} />

                  {events.map((event, idx) => {
                    const imp = event.importance;
                    const { cardClass, cardBg, dotClass, dotStyle } = getEventStyles(imp, event.title);
                    const id = `pc-${idx}`;
                    const cardSpan = spans[id] || 15;

                    if (imp === 3) {
                      // ☆3つ: 中央フル幅カード
                      return (
                        <div 
                          key={id} 
                          ref={(el) => { cardRefs.current[id] = el; }}
                          className="relative flex justify-center items-start z-10"
                          style={{
                            gridColumn: '1 / -1',
                            gridRowEnd: `span ${cardSpan}`,
                            paddingBottom: '24px', // 縦余白
                          }}
                        >
                          {/* 中央ドット */}
                          <div
                            className="absolute left-1/2 -translate-x-1/2 -top-1 w-7 h-7 rounded-full z-20 flex items-center justify-center"
                            style={dotStyle}
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-white opacity-90 animate-ping" />
                          </div>

                          {/* カード本体 */}
                          <div
                            className={`${cardClass} w-full max-w-2xl transition-all duration-300 hover:scale-[1.015]`}
                            style={{ background: cardBg }}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a64e] to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a64e] to-transparent" />
                            
                            <div className="absolute top-3 right-3 text-[#c9a64e]/50 pointer-events-none select-none animate-pulse z-10" style={{ animationDuration: '4s' }}>
                              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                              </svg>
                            </div>
                            <span className="absolute top-2.5 left-2.5 text-[#c9a64e]/60 text-xs animate-pulse select-none z-10" style={{ animationDelay: '0.2s', animationDuration: '3s' }}>✦</span>
                            <span className="absolute bottom-3 right-5 text-[#c9a64e]/50 text-[10px] animate-pulse select-none z-10" style={{ animationDelay: '1.2s', animationDuration: '2.5s' }}>✦</span>

                            {renderCardInner(event)}
                          </div>
                        </div>
                      );
                    } else {
                      // ☆1, ☆2: 左右交互 (千鳥) ジグザグ配置
                      const isLeft = nonStar3Counter % 2 === 0;
                      nonStar3Counter++;

                      return (
                        <div 
                          key={id} 
                          ref={(el) => { cardRefs.current[id] = el; }}
                          className={`relative flex items-start ${isLeft ? 'justify-end' : 'justify-start'} z-10`}
                          style={{
                            gridColumn: isLeft ? '1' : '2',
                            gridRowEnd: `span ${cardSpan}`,
                            paddingBottom: '24px', // 縦余白
                          }}
                        >
                          {/* 天の川中央への斜めの接続線とドット */}
                          <div 
                            className="absolute top-1/2 -translate-y-1/2 flex items-center z-20 pointer-events-none"
                            style={{
                              right: isLeft ? '-28px' : 'auto',
                              left: isLeft ? 'auto' : '-28px',
                              flexDirection: isLeft ? 'row' : 'row-reverse',
                            }}
                          >
                            <div 
                              className="w-[20px] h-px bg-white/30"
                              style={{
                                transform: isLeft ? 'rotate(25deg)' : 'rotate(-25deg)',
                                transformOrigin: isLeft ? 'right center' : 'left center',
                              }} 
                            />
                            <div className={`rounded-full ${dotClass}`} style={dotStyle} />
                          </div>

                          <div
                            className={`${cardClass} w-full max-w-md ${isLeft ? 'text-right' : 'text-left'} transition-all duration-300 hover:scale-[1.02] self-start`}
                            style={{ background: cardBg }}
                            onClick={() => setSelectedEvent(event)}
                          >
                            {renderCardInner(event)}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>

                {/* ── モバイル表示 (md未満): 時系列順 縦並び ── */}
                <div className="block md:hidden space-y-3 w-full animate-fadeIn">
                  {events.map((event, index) => {
                    const imp = event.importance;
                    const { cardClass, cardBg, dotClass, dotStyle } = getEventStyles(imp, event.title);

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

        {/* 年表下端の飾り */}
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
