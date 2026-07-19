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


const getTitleFontSize = (title: string, imp: number) => {
  const len = title.length;
  if (imp === 4) {
    if (len > 35) return 'text-lg md:text-xl font-bold text-white leading-relaxed tracking-wider break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]';
    if (len > 20) return 'text-xl md:text-2xl font-black text-white leading-relaxed tracking-wider break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]';
    return 'text-2xl md:text-3.5xl font-black text-white leading-relaxed tracking-wider break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]';
  }
  if (imp === 3) {
    if (len > 35) return 'text-base md:text-lg font-bold text-white leading-relaxed tracking-wider break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]';
    if (len > 20) return 'text-lg md:text-xl font-bold text-white leading-relaxed tracking-wider break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]';
    return 'text-xl md:text-2.5xl font-black text-white leading-relaxed tracking-wider break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]';
  }
  if (imp === 2) {
    if (len > 35) return 'text-[11px] md:text-xs font-bold text-[#f8fafc] leading-snug break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]';
    if (len > 20) return 'text-xs md:text-sm font-bold text-[#f8fafc] leading-normal break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]';
    return 'text-sm md:text-base font-bold text-[#f8fafc] leading-relaxed break-keep [overflow-wrap:anywhere] [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]';
  }
  // imp === 1
  if (len > 25) return 'text-[10px] md:text-[11px] text-[#e2e8f0] font-semibold tracking-wide truncate';
  return 'text-[11px] md:text-xs text-[#e2e8f0] font-semibold tracking-wide truncate';
};

const getEventStyles = (imp: number, title: string = '') => {
  const isSpace = title.includes('#かきょすぺーす') || title.includes('かきょすぺーす');
  const isStory = title.includes('#きょーのお話') || title.includes('きょーのお話');
  
  const cardClass = imp === 4
    ? 'p-8 md:p-10 rounded-3xl border-2 relative overflow-visible cursor-pointer group'
    : imp === 3
      ? 'p-8 md:p-10 rounded-3xl border-2 shadow-[0_4px_45px_rgba(201,166,78,0.25)] hover:shadow-[0_12px_60px_rgba(201,166,78,0.5),_0_0_35px_rgba(255,226,154,0.3)] relative overflow-hidden cursor-pointer group'
      : imp === 2
        ? 'p-5 md:p-6 rounded-2xl border shadow-xl relative overflow-hidden cursor-pointer group'
        : 'py-1 px-3 rounded-lg border relative overflow-hidden cursor-pointer group flex flex-col justify-center';

  let cardBg = '';
  let borderClass = '';
  let dateClass = '';
  let overlayGradient = '';

  if (isSpace) {
    cardBg = imp === 4
      ? 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.45) 0%, rgba(20, 5, 35, 0.98) 70%)'
      : imp === 3
        ? 'radial-gradient(circle at 90% 10%, rgba(168, 85, 247, 0.35) 0%, rgba(24, 9, 43, 0.97) 70%)'
        : imp === 2
          ? 'rgba(38, 16, 64, 0.88)'
          : 'rgba(28, 12, 48, 0.78)';
    borderClass = imp === 4 ? 'border-[#e9d5ff]/90 shadow-[0_0_40px_rgba(168, 85, 247, 0.45)]' : imp === 3 ? 'border-purple-400/80' : imp === 2 ? 'border-rose-500/50 hover:border-rose-400/80 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'border-purple-500/30 hover:border-purple-400/60';
    dateClass = imp === 4
      ? 'text-xs md:text-sm font-black text-purple-200 tracking-[0.2em] mb-2 font-sans'
      : imp === 3
        ? 'text-xs md:text-sm font-black text-purple-300 tracking-widest mb-2 font-sans'
        : imp === 2
          ? 'text-[11px] md:text-xs font-bold text-purple-300 tracking-wider mb-1 font-sans'
          : 'text-[10px] md:text-[11px] font-bold text-purple-300/80 tracking-wide mb-0.5 font-sans';
    overlayGradient = 'linear-gradient(to right, rgba(28, 12, 48, 0.98) 0%, rgba(28, 12, 48, 0.8) 40%, rgba(28, 12, 48, 0.3) 100%)';
  } else if (isStory) {
    cardBg = imp === 4
      ? 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.45) 0%, rgba(5, 15, 45, 0.98) 70%)'
      : imp === 3
        ? 'radial-gradient(circle at 90% 10%, rgba(59, 130, 246, 0.35) 0%, rgba(10, 25, 54, 0.97) 70%)'
        : imp === 2
          ? 'rgba(14, 35, 71, 0.88)'
          : 'rgba(10, 24, 50, 0.78)';
    borderClass = imp === 4 ? 'border-[#bfdbfe]/90 shadow-[0_0_40px_rgba(59, 130, 246, 0.45)]' : imp === 3 ? 'border-blue-400/80' : imp === 2 ? 'border-rose-500/50 hover:border-rose-400/80 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'border-blue-500/30 hover:border-blue-400/60';
    dateClass = imp === 4
      ? 'text-xs md:text-sm font-black text-blue-200 tracking-[0.2em] mb-2 font-sans'
      : imp === 3
        ? 'text-xs md:text-sm font-black text-blue-300 tracking-widest mb-2 font-sans'
        : imp === 2
          ? 'text-[11px] md:text-xs font-bold text-blue-300 tracking-wider mb-1 font-sans'
          : 'text-[10px] md:text-[11px] font-bold text-blue-300/80 tracking-wide mb-0.5 font-sans';
    overlayGradient = 'linear-gradient(to right, rgba(10, 24, 50, 0.98) 0%, rgba(10, 24, 50, 0.8) 40%, rgba(10, 24, 50, 0.3) 100%)';
  } else {
    cardBg = imp === 4
      ? 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.28) 0%, rgba(18, 9, 4, 0.98) 70%)'
      : imp === 3
        ? 'radial-gradient(circle at 90% 10%, rgba(251, 191, 36, 0.22) 0%, rgba(12, 19, 38, 0.96) 70%)'
        : imp === 2
          ? 'rgba(14, 25, 48, 0.8)'
          : 'rgba(10, 18, 36, 0.7)';
    borderClass = imp === 4 ? 'border-[#ffe29a]/90 shadow-[0_0_45px_rgba(251,191,36,0.4)]' : imp === 3 ? 'border-[#c9a64e]/70' : imp === 2 ? 'border-red-500/40 hover:border-red-400/70 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-white/10 hover:border-[#c9a64e]/40';
    dateClass = imp === 4
      ? 'text-xs md:text-sm font-black text-[#ffc56c] tracking-[0.2em] mb-2 font-sans'
      : imp === 3
        ? 'text-xs md:text-sm font-black text-[#ffc56c] tracking-widest mb-2 font-sans'
        : imp === 2
          ? 'text-[11px] md:text-xs font-bold text-[#d4b26f] tracking-wider mb-1 font-sans'
          : 'text-[10px] md:text-[11px] font-bold text-[#a0aec0] tracking-wide mb-0.5 font-sans';
    overlayGradient = 'linear-gradient(to right, rgba(12, 19, 38, 0.98) 0%, rgba(12, 19, 38, 0.75) 40%, rgba(12, 19, 38, 0.3) 100%)';
  }

  const titleClass = getTitleFontSize(title, imp);

  const dotClass = imp === 4 || imp === 3
    ? 'w-7 h-7 rounded-full z-10 flex items-center justify-center'
    : imp === 2
      ? 'w-4 h-4 rounded-full z-10'
      : 'w-2.5 h-2.5 rounded-full z-10';

  const dotStyle = imp === 4
    ? {
        background: 'radial-gradient(circle, #ffffff 0%, #ffd700 40%, #ff4500 100%)',
        boxShadow: '0 0 25px 8px rgba(255,226,154,0.85), 0 0 0 4px rgba(6,10,23,0.9)',
      }
    : imp === 3
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
  const [isScrollAnimating, setIsScrollAnimating] = useState(false);
  const [scrollOpened, setScrollOpened] = useState(false);

  // 流れ星アニメーション
  type ShootingStar = {
    id: number;
    x: number;      // 開始位置 X (%)
    y: number;      // 開始位置 Y (%)
    angle: number;  // 射出角度 (deg)
    length: number; // 尾の長さ (px)
    duration: number; // アニメーション時間 (ms)
  };
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const shootingStarIdRef = React.useRef(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const schedule = () => {
      // 3・5秒ごとに流れ星を発生（ランダム間隔）
      const delay = 3000 + Math.random() * 6000;
      timeoutId = setTimeout(() => {
        const id = ++shootingStarIdRef.current;
        const star: ShootingStar = {
          id,
          x: 5 + Math.random() * 70,       // 画面左5～75%の上部から
          y: 2 + Math.random() * 35,        // 画面上部2～37%の下に向かって
          angle: 20 + Math.random() * 30,   // 射出角度20～50度
          length: 120 + Math.random() * 180,
          duration: 700 + Math.random() * 500,
        };
        setShootingStars(prev => [...prev.slice(-2), star]); // 同時最大3本
        // アニメ完了後に削除
        setTimeout(() => {
          setShootingStars(prev => prev.filter(s => s.id !== id));
        }, star.duration + 200);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  // 検索フィルタリング済みイベント
  const filteredEvents = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return events.filter(
      (ev) => ev.title.toLowerCase().includes(q) || ev.date.includes(q)
    );
  }, [events, searchQuery]);

  const [spans, setSpans] = useState<{ [key: string]: number }>({});
  const spansRef = React.useRef<{ [key: string]: number }>({});
  const cardRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

  const calculateSpans = React.useCallback(() => {
    const newSpans: { [key: string]: number } = {};
    let changed = false;

    events.forEach((event, idx) => {
      const id = `pc-${idx}`;
      const element = cardRefs.current[id];
      if (element) {
        // グリッドスパンの影響を受けないカード本体の純粋な高さを測定
        const cardBody = element.querySelector('.rounded-3xl, .rounded-lg, .rounded-2xl') as HTMLDivElement;
        const height = cardBody 
          ? (cardBody.getBoundingClientRect().height || cardBody.offsetHeight) 
          : (element.getBoundingClientRect().height || element.offsetHeight);
        
        // 1スパン = 10px。少しの余白を含めてスパン数を算出
        const span = Math.ceil(height / 10) + 3;
        if (spansRef.current[id] !== span) {
          newSpans[id] = span;
          changed = true;
        } else {
          newSpans[id] = spansRef.current[id];
        }
      }
    });

    if (changed) {
      spansRef.current = newSpans;
      setSpans(newSpans);
    }
  }, [events]);

  useEffect(() => {
    const isAuthed = sessionStorage.getItem('timeline_auth') === '5226';
    if (isAuthed) {
      setIsAuthenticated(true);
      fetchEvents();
      
      const shouldAnimate = sessionStorage.getItem('timeline_scroll_animate') === 'true';
      if (shouldAnimate) {
        setIsScrollAnimating(true);
        sessionStorage.removeItem('timeline_scroll_animate');
        
        const timer1 = setTimeout(() => {
          setScrollOpened(true);
        }, 150);
        
        const timer2 = setTimeout(() => {
          setIsScrollAnimating(false);
        }, 1500);
        
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    } else {
      setLoading(false);
    }
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
        {/* サムネイル画像（サムネイルがある場合に右側背景として重ね合わせ） */}
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

        {/* テキストコンテンツ (☆1なら横並びで省スペース化、その他は縦並び) */}
        {imp === 1 ? (
          <div className="relative z-10 flex items-center w-full text-left gap-2 pl-0.5 overflow-hidden">
            <span className={`${dateClass} shrink-0 mb-0 leading-none text-[10px] md:text-[11px]`}>{event.date}</span>
            <span className="text-[#ffe29a]/40 text-[9px] select-none leading-none">|</span>
            <h3 className={`${titleClass} truncate flex-1 leading-none`}>{event.title}</h3>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col justify-center w-full pr-4">
            <div className={dateClass}>{event.date}</div>
            <h3 className={titleClass}>{event.title}</h3>
          </div>
        )}
      </>
    );
  };

  // 左右交互（千鳥配置）用インデックスカウンター
  let nonStar3Counter = 0;

  return (
    <main className="min-h-screen bg-[#030712] text-gray-100 font-serif relative overflow-x-hidden selection:bg-[#c9a64e]/30 selection:text-amber-200">
      {/* ── 天の川星空写真背景 (z-0) ── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/timeline-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(2,5,18,0.45) 0%, rgba(4,8,25,0.35) 40%, rgba(3,6,20,0.50) 100%)',
          }}
        />
      </div>

      {/* ── モーダル表示時の年表カバー (z-40): 背景写真だけ透けさせ年表を隠す ── */}
      {showCharSearch && (
        <div className="fixed inset-0 pointer-events-none z-40" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/timeline-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(2,5,18,0.45) 0%, rgba(4,8,25,0.35) 40%, rgba(3,6,20,0.50) 100%)',
            }}
          />
        </div>
      )}

      {/* ── 流れ星レイヤー (z-[45]): カバーより上・モーダルより下で常に表示 ── */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 45, overflow: 'hidden' }}
        aria-hidden
      >
        <defs>
          <style>{`
            @keyframes shootingstar {
              0%   { opacity: 0; stroke-dashoffset: 0; }
              8%   { opacity: 1; }
              85%  { opacity: 0.9; }
              100% { opacity: 0; stroke-dashoffset: -600; }
            }
            @keyframes shootingstarHead {
              0%   { opacity: 0; r: 1; }
              8%   { opacity: 1; r: 2.5; }
              70%  { opacity: 0.8; r: 1.5; }
              100% { opacity: 0; r: 0; }
            }
          `}</style>
          <linearGradient id="shootGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="60%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
        </defs>
        {shootingStars.map(star => {
          const rad = (star.angle * Math.PI) / 180;
          const vx = Math.cos(rad);
          const vy = Math.sin(rad);
          const x1 = `${star.x}vw`;
          const y1 = `${star.y}vh`;
          const dx = vx * star.length;
          const dy = vy * star.length;
          return (
            <g key={star.id}>
              <line
                x1={x1} y1={y1}
                x2={`calc(${star.x}vw + ${dx}px)`}
                y2={`calc(${star.y}vh + ${dy}px)`}
                stroke="url(#shootGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{
                  animation: `shootingstar ${star.duration}ms ease-out forwards`,
                  strokeDasharray: star.length,
                  strokeDashoffset: 0,
                }}
              />
              <circle
                cx={`calc(${star.x}vw + ${dx}px)`}
                cy={`calc(${star.y}vh + ${dy}px)`}
                r="2.5"
                fill="white"
                style={{
                  animation: `shootingstarHead ${star.duration}ms ease-out forwards`,
                  filter: 'drop-shadow(0 0 4px white)',
                }}
              />
            </g>
          );
        })}
      </svg>

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
          className="w-full relative flex flex-col items-center"
          style={{
            background: 'linear-gradient(to bottom, rgba(6,10,23,0.82) 0%, rgba(13,23,46,0.80) 40%, rgba(8,15,29,0.82) 100%)',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.7), 0 0 15px rgba(201,166,78,0.15)',
            borderLeft: isScrollAnimating ? 'none' : '4px solid #1a0f05',
            borderRight: isScrollAnimating ? 'none' : '4px solid #1a0f05',
            borderRadius: '16px',
            padding: '24px 16px',
            // アニメーション用のスタイル
            transition: 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease',
            width: isScrollAnimating ? (scrollOpened ? '100%' : '60px') : '100%',
            opacity: isScrollAnimating ? (scrollOpened ? 1 : 0) : 1,
            overflow: isScrollAnimating && !scrollOpened ? 'hidden' : 'visible',
            minHeight: isScrollAnimating ? '600px' : 'auto',
          }}
        >
          {/* 巻物の軸（左右のローラー） - アニメーション中のみ表示 */}
          {isScrollAnimating && (
            <>
              {/* 左の軸 */}
              <div
                className="absolute top-0 bottom-0 w-8 pointer-events-none z-30"
                style={{
                  left: scrollOpened ? '-16px' : 'calc(50% - 16px)',
                  transition: 'left 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
                  background: 'linear-gradient(to right, #3d2314, #8a5a36, #c9a64e, #8a5a36, #3d2314)',
                  borderRadius: '4px',
                  boxShadow: '-4px 0 10px rgba(0,0,0,0.5)',
                }}
              >
                {/* 上の金キャップ */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-3 bg-gradient-to-r from-[#8a5a36] via-[#ffe29a] to-[#8a5a36] rounded-t-full border-b border-[#3d2314]" />
                {/* 下の金キャップ */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-3 bg-gradient-to-r from-[#8a5a36] via-[#ffe29a] to-[#8a5a36] rounded-b-full border-t border-[#3d2314]" />
              </div>

              {/* 右の軸 */}
              <div
                className="absolute top-0 bottom-0 w-8 pointer-events-none z-30"
                style={{
                  right: scrollOpened ? '-16px' : 'calc(50% - 16px)',
                  transition: 'right 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
                  background: 'linear-gradient(to right, #3d2314, #8a5a36, #c9a64e, #8a5a36, #3d2314)',
                  borderRadius: '4px',
                  boxShadow: '4px 0 10px rgba(0,0,0,0.5)',
                }}
              >
                {/* 上の金キャップ */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-3 bg-gradient-to-r from-[#8a5a36] via-[#ffe29a] to-[#8a5a36] rounded-t-full border-b border-[#3d2314]" />
                {/* 下の金キャップ */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-3 bg-gradient-to-r from-[#8a5a36] via-[#ffe29a] to-[#8a5a36] rounded-b-full border-t border-[#3d2314]" />
              </div>
            </>
          )}
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
            <div
              className="w-full"
              style={{
                opacity: isScrollAnimating ? (scrollOpened ? 1 : 0) : 1,
                transition: 'opacity 0.6s ease-out 0.6s',
              }}
            >
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

                  {(() => {
                    // ─── Pass 1: rowStart を全イベントについて計算し、日付ごとの代表ポイント行を記録 ───
                    const pass1LeftRow = { v: 1 };
                    const pass1RightRow = { v: 1 };
                    let pass1LastRowStart = 1;
                    let pass1NonStar3Counter = 0;
                    // 日付 → { rowCenter: number (代表ドットのグリッド行中央), firstIdx: number }
                    const datePointRowMap: Record<string, { rowCenter: number; firstIdx: number }> = {};
                    const rowStartList: number[] = [];
                    const isLeftList: boolean[] = [];

                    events.forEach((event, idx) => {
                      const imp = event.importance;
                      const cardSpan = imp === 4 ? 28 : imp === 3 ? 24 : imp === 2 ? 14 : 7;
                      let rowStart = 1;
                      let isLeft = false;

                      if (imp === 4 || imp === 3) {
                        rowStart = Math.max(pass1LeftRow.v, pass1RightRow.v);
                        pass1LeftRow.v = rowStart + cardSpan;
                        pass1RightRow.v = rowStart + cardSpan;
                      } else {
                        isLeft = pass1NonStar3Counter % 2 === 0;
                        pass1NonStar3Counter++;
                        if (isLeft) {
                          rowStart = pass1LeftRow.v;
                          if (idx > 0) rowStart = Math.max(rowStart, pass1LastRowStart + 4);
                          pass1LeftRow.v = rowStart + cardSpan;
                        } else {
                          rowStart = pass1RightRow.v;
                          if (idx > 0) rowStart = Math.max(rowStart, pass1LastRowStart + 4);
                          pass1RightRow.v = rowStart + cardSpan;
                        }
                      }
                      pass1LastRowStart = rowStart;
                      rowStartList.push(rowStart);
                      isLeftList.push(isLeft);

                      // ☆1・☆2のみ日付ポイントを共有（☆3・☆4は独立）
                      // 最小rowCenter（視覚上最も上に配置されるカード）を代表に選ぶ
                      if (imp === 1 || imp === 2) {
                        const rowCenter = rowStart + Math.floor(cardSpan / 2);
                        const existing = datePointRowMap[event.date];
                        if (!existing || rowCenter < existing.rowCenter) {
                          datePointRowMap[event.date] = { rowCenter, firstIdx: idx };
                        }
                      }
                    });

                    // ─── Pass 2: 実際のレンダリング ───
                    return events.map((event, idx) => {
                      const imp = event.importance;
                      const { cardClass, cardBg, dotClass, dotStyle } = getEventStyles(imp, event.title);
                      const id = `pc-${idx}`;
                      const cardSpan = imp === 4 ? 28 : imp === 3 ? 24 : imp === 2 ? 14 : 7;
                      const cardHeight = imp === 4 ? '256px' : imp === 3 ? '216px' : imp === 2 ? '116px' : '46px';
                      const rowStart = rowStartList[idx];
                      const isLeft = isLeftList[idx];

                      // 同日付の代表ポイント情報（☆1・☆2のみ共有、☆3・☆4は常に独立扱い）
                      const dateInfo = (imp === 1 || imp === 2) ? datePointRowMap[event.date] : undefined;
                      const isFirstOfDate = !dateInfo || dateInfo.firstIdx === idx;

                      if (imp === 4 || imp === 3) {
                        return (
                          <div 
                            key={id} 
                            className="relative flex justify-center items-start z-10"
                            style={{
                              gridColumn: '1 / -1',
                              gridRowStart: rowStart,
                              gridRowEnd: `span ${cardSpan}`,
                              paddingBottom: '24px',
                            }}
                          >
                            <div
                              className="absolute left-1/2 -translate-x-1/2 -top-1 w-7 h-7 rounded-full z-20 flex items-center justify-center"
                              style={dotStyle}
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-white opacity-90 animate-ping" />
                            </div>

                            <div
                              className={`${cardClass} w-full max-w-2xl transition-all duration-300 hover:scale-[1.015] flex flex-col justify-center overflow-visible`}
                              style={{ background: cardBg, height: cardHeight }}
                              onClick={() => setSelectedEvent(event)}
                            >
                              {imp === 4 && (
                                <div className="absolute inset-0 pointer-events-none border border-[#ffe29a]/60 rounded-3xl m-1.5 z-20">
                                  <svg className="absolute -top-3.5 -left-3.5 w-7 h-7 text-[#ffe29a] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
                                  </svg>
                                  <svg className="absolute -top-3.5 -right-3.5 w-7 h-7 text-[#ffe29a] animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ animationDelay: '0.4s' }}>
                                    <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
                                  </svg>
                                  <svg className="absolute -bottom-3.5 -left-3.5 w-7 h-7 text-[#ffe29a] animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ animationDelay: '0.8s' }}>
                                    <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
                                  </svg>
                                  <svg className="absolute -bottom-3.5 -right-3.5 w-7 h-7 text-[#ffe29a] animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ animationDelay: '1.2s' }}>
                                    <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
                                  </svg>
                                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-px bg-[#ffe29a]/40" />
                                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-px bg-[#ffe29a]/40" />
                                  <div className="absolute left-1/2 top-0 -translate-x-1/2 h-4 w-px bg-[#ffe29a]/40" />
                                  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 h-4 w-px bg-[#ffe29a]/40" />
                                </div>
                              )}
                              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a64e] to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a64e] to-transparent" />
                              <div className="absolute top-3 right-3 text-[#c9a64e]/50 pointer-events-none select-none animate-pulse z-10" style={{ animationDuration: '4s' }}>
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                              </div>
                              <span className="absolute top-2.5 left-2.5 text-[#c9a64e]/60 text-xs animate-pulse select-none z-10" style={{ animationDelay: '0.2s', animationDuration: '3s' }}>✦</span>
                              <span className="absolute bottom-3 right-5 text-[#c9a64e]/50 text-[10px] animate-pulse select-none z-10" style={{ animationDelay: '1.2s', animationDuration: '2.5s' }}>✦</span>
                              <div className="w-full h-full overflow-hidden flex flex-col justify-center">
                                {renderCardInner(event)}
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        const offsetX = imp === 1 ? ((idx * 17) % 3) * 15 : 0;
                        const connWidth = 28 + offsetX;

                        const starColors = [
                          { color: "#9bb0ff", glow: "rgba(155, 176, 255, 0.75)" },
                          { color: "#ffffff", glow: "rgba(255, 255, 255, 0.8)" },
                          { color: "#ffe29a", glow: "rgba(201, 166, 78, 0.75)" },
                          { color: "#ffbb7b", glow: "rgba(255, 187, 123, 0.7)" },
                          { color: "#ff8b8b", glow: "rgba(255, 139, 139, 0.75)" }
                        ];
                        const color1 = starColors[(idx * 3) % starColors.length];
                        const color2 = starColors[(idx * 7) % starColors.length];
                        const colorMain = starColors[(idx * 11) % starColors.length];

                        // 星座ライン：固定30px高さの元のパターンに戻す（クリップ問題・逆方向問題を解消）
                        const patterns = [
                          {
                            getPath: (w: number, isL: boolean) => {
                              const startY = isL ? 15 : 25;
                              const endY = isL ? 5 : 15;
                              return `M 0 ${startY} L 9 6 L ${w - 9} 6 L ${w} ${endY}`;
                            },
                            getDots: (w: number) => [{ cx: 9, cy: 6 }, { cx: w - 9, cy: 6 }]
                          },
                          {
                            getPath: (w: number, isL: boolean) => {
                              const startY = isL ? 15 : 25;
                              const endY = isL ? 5 : 15;
                              return `M 0 ${startY} L 9 24 L ${w - 9} 24 L ${w} ${endY}`;
                            },
                            getDots: (w: number) => [{ cx: 9, cy: 24 }, { cx: w - 9, cy: 24 }]
                          },
                          {
                            getPath: (w: number, isL: boolean) => {
                              const startY = isL ? 15 : 25;
                              const endY = isL ? 5 : 15;
                              return `M 0 ${startY} L 8 7 L ${w - 8} 23 L ${w} ${endY}`;
                            },
                            getDots: (w: number) => [{ cx: 8, cy: 7 }, { cx: w - 8, cy: 23 }]
                          }
                        ];
                        const pattern = patterns[idx % patterns.length];
                        const d = pattern.getPath(connWidth, isLeft);
                        const dots = pattern.getDots(connWidth);

                        return (
                          <div 
                            key={id} 
                            className={`relative flex items-start ${isLeft ? 'justify-end' : 'justify-start'} z-10`}
                            style={{
                              gridColumn: isLeft ? '1' : '2',
                              gridRowStart: rowStart,
                              gridRowEnd: `span ${cardSpan}`,
                              paddingBottom: '24px',
                            }}
                          >
                            <div 
                              className={`relative flex items-start self-start w-full ${imp === 2 ? 'max-w-md' : 'max-w-[298px]'} ${isLeft ? 'ml-auto' : 'mr-auto'}`}
                              style={{
                                marginRight: isLeft ? `${offsetX}px` : undefined,
                                marginLeft: isLeft ? undefined : `${offsetX}px`,
                              }}
                            >
                              {/* 星座接続ライン + 日付ドット */}
                              <div
                                className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20"
                                style={{
                                  right: isLeft ? `-${connWidth}px` : 'auto',
                                  left: isLeft ? 'auto' : `-${connWidth}px`,
                                  width: `${connWidth}px`,
                                  height: '30px',
                                }}
                              >
                                <svg
                                  width={connWidth}
                                  height="30"
                                  viewBox={`0 0 ${connWidth} 30`}
                                  style={{ transform: isLeft ? 'none' : 'scaleX(-1)', overflow: 'visible' }}
                                >
                                  <path d={d} fill="none" stroke="rgba(201, 166, 78, 0.55)" strokeWidth="1.2" strokeDasharray="2, 2" />
                                  <path d={d} fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="0.8" />
                                  {dots.map((dot, dIdx) => {
                                    const sColor = dIdx === 0 ? color1 : color2;
                                    return (
                                      <g key={dIdx}>
                                        <circle cx={dot.cx} cy={dot.cy} r="1.5" fill={sColor.color} />
                                        <circle cx={dot.cx} cy={dot.cy} r="3" fill={sColor.color} className="animate-pulse" opacity="0.6" />
                                      </g>
                                    );
                                  })}
                                </svg>
                                {/* 同日付グループで最も上にある代表カードのみドット表示 */}
                                {isFirstOfDate && (
                                  <div
                                    className={`absolute top-1/2 ${dotClass}`}
                                    style={{
                                      ...dotStyle,
                                      background: colorMain.color,
                                      boxShadow: `0 0 10px 3px ${colorMain.glow}, 0 0 0 2px rgba(6,10,23,0.9)`,
                                      margin: 0,
                                      left: isLeft ? 'auto' : '0px',
                                      right: isLeft ? '0px' : 'auto',
                                      transform: isLeft ? 'translate(50%, -25px)' : 'translate(-50%, -5px)',
                                    }}
                                  />
                                )}
                              </div>
                              <div
                                className={`${cardClass} w-full transition-all duration-300 hover:scale-[1.02] flex flex-col justify-center overflow-hidden`}
                                style={{ background: cardBg, height: cardHeight }}
                                onClick={() => setSelectedEvent(event)}
                              >
                                <div className="w-full h-full overflow-hidden flex flex-col justify-center">
                                  {renderCardInner(event)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    });
                  })()}
                </div>


                {/* ── モバイル表示 (md未満): 時系列順 縦並び ── */}
                <div className="block md:hidden space-y-4 w-full animate-fadeIn">
                  {events.map((event, index) => {
                    const imp = event.importance;
                    const { cardClass, cardBg, dotClass, dotStyle } = getEventStyles(imp, event.title);
                    const cardHeight = imp === 4 ? '230px' : imp === 3 ? '190px' : imp === 2 ? '110px' : '46px';

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
                          {(imp === 4 || imp === 3) && <span className="w-2.5 h-2.5 rounded-full bg-white opacity-90 animate-ping" />}
                        </div>

                        {/* カード */}
                        <div className="w-[calc(100%-2.5rem)] ml-10">
                          <div
                            className={`${cardClass} transition-all duration-300 active:scale-[0.98] flex flex-col justify-center overflow-visible`}
                            style={{ background: cardBg, height: cardHeight }}
                            onClick={() => setSelectedEvent(event)}
                          >
                            {/* ☆4専用：ラグジュアリーな星座・星飾りイラストフレーム */}
                            {imp === 4 && (
                              <div className="absolute inset-0 pointer-events-none border border-[#ffe29a]/60 rounded-3xl m-1.5 z-20">
                                {/* 左上星 */}
                                <svg className="absolute -top-3 -left-3 w-5 h-5 text-[#ffe29a] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
                                </svg>
                                {/* 右上星 */}
                                <svg className="absolute -top-3 -right-3 w-5 h-5 text-[#ffe29a] animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ animationDelay: '0.4s' }}>
                                  <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
                                </svg>
                                {/* 左下星 */}
                                <svg className="absolute -bottom-3 -left-3 w-5 h-5 text-[#ffe29a] animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ animationDelay: '0.8s' }}>
                                  <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
                                </svg>
                                {/* 右下星 */}
                                <svg className="absolute -bottom-3 -right-3 w-5 h-5 text-[#ffe29a] animate-pulse" viewBox="0 0 24 24" fill="currentColor" style={{ animationDelay: '1.2s' }}>
                                  <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
                                </svg>
                              </div>
                            )}

                            {(imp === 4 || imp === 3) && (
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

                            <div className="w-full h-full overflow-hidden flex flex-col justify-center">
                              {renderCardInner(event)}
                            </div>
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
