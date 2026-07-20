'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showScrollVideo, setShowScrollVideo] = useState(false);
  const [showWhiteout, setShowWhiteout] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPassword === '5226') {
      sessionStorage.setItem('timeline_auth', '5226');
      setShowAuthModal(false);
      setShowScrollVideo(true);
    } else {
      setAuthError('暗証番号が正しくありません。');
    }
  };

  const handleVideoEnded = () => {
    // 動画が通常終了したときは、すでに timeupdate によってホワイトアウトが完了しているため即時遷移
    setShowWhiteout(true);
    router.push('/timeline');
    setTimeout(() => {
      setShowScrollVideo(false);
      setShowWhiteout(false);
    }, 1000);
  };

  const handleVideoSkip = () => {
    // スキップされた場合はその場でホワイトアウトを開始し、フェード完了後(0.45秒)に遷移
    setShowWhiteout(true);
    setTimeout(() => {
      router.push('/timeline');
      setTimeout(() => {
        setShowScrollVideo(false);
        setShowWhiteout(false);
      }, 500);
    }, 450);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration) {
      // 動画終了の0.45秒前にホワイトアウトを開始する
      if (video.currentTime >= video.duration - 0.45) {
        setShowWhiteout(true);
      }
    }
  };

  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 relative overflow-x-hidden">
      {/* Decorative corner ornaments */}
      <div className="absolute top-12 left-12 w-32 h-32 border-t-2 border-l-2 border-[#c9a64e]/40 pointer-events-none" />
      <div className="absolute top-12 right-12 w-32 h-32 border-t-2 border-r-2 border-[#c9a64e]/40 pointer-events-none" />
      <div className="absolute bottom-12 left-12 w-32 h-32 border-b-2 border-l-2 border-[#c9a64e]/40 pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-32 h-32 border-b-2 border-r-2 border-[#c9a64e]/40 pointer-events-none" />

      <div className="max-w-7xl w-full text-center space-y-16 relative z-10 pt-10 pb-20">

        {/* Header Section */}
        <div className="space-y-12 relative">

          {/* Illustration Banner with Window Frame */}
          <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden window-frame shadow-2xl">
            <div className="relative flex items-center justify-center">
              <img
                src="/banner.webp"
                alt="かきょの間 バナー"
                className="w-full h-full object-cover relative z-0"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.endsWith('.webp')) {
                    img.src = '/banner.png';
                  } else {
                    img.style.display = 'none';
                    img.parentElement!.classList.add('p-12', 'bg-gradient-to-b', 'from-[#2d2418]', 'to-[#43341b]');
                    const container = document.createElement('div');
                    container.className = 'text-center space-y-4';
                    container.innerHTML = '<div class="text-8xl">🏘️</div><div class="flex items-center justify-center gap-4"><span class="text-4xl opacity-30">🌿</span><span class="text-5xl opacity-40">📮</span><span class="text-6xl text-glow">🏮</span><span class="text-5xl opacity-40">🍵</span><span class="text-4xl opacity-30">🌸</span></div>';
                    img.parentElement!.appendChild(container);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-4 px-4 overflow-hidden">
            <h1 className="text-white tracking-tight leading-none text-outline title-elegant flex justify-center w-full">
              <span className="block text-3xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl whitespace-nowrap drop-shadow-2xl mx-auto max-w-full break-keep overflow-anywhere tracking-tight md:tracking-normal">メゾン・ド・きょー</span>
            </h1>
            <div className="text-xs md:text-base tracking-[0.6em] md:tracking-[0.8em] text-[#c9a64e] font-serif uppercase font-bold drop-shadow-lg">
              Maison de Kyo
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6">
            <p className="text-lg md:text-2xl text-white font-serif leading-relaxed text-outline opacity-95 break-keep">
              ようこそ、この古き良き集合住宅へ。<br />
              あなたの居場所を記録し、<br className="md:hidden" />仲間たちと過ごす時間を。
            </p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* ── かきょ年表（アニバーサリー特別横長タイル） ── */}
          <div
            onClick={() => setShowAuthModal(true)}
            className="group cursor-pointer md:col-span-2 lg:col-span-3"
          >
            <div className="glass-panel p-6 md:p-10 h-full flex flex-col md:flex-row items-center justify-between hover:scale-[1.01] transition-all duration-500 rounded-[2.5rem] group-hover:border-[#c9a64e]/60 relative overflow-hidden bg-gradient-to-r from-[#0a1224]/90 via-[#18233c]/80 to-[#0a1224]/90 border border-[#c9a64e]/30 shadow-[0_0_30px_rgba(201,166,78,0.15)] min-h-[220px]">
              
              {/* ギフトリボン・アニバーサリー演出 */}
              <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                <div className="absolute top-6 left-[-35px] w-[160px] text-center bg-gradient-to-r from-[#a06830] via-[#c9a64e] to-[#a06830] text-[#080d1a] font-serif text-[10px] md:text-xs font-black uppercase tracking-widest py-1.5 -rotate-45 shadow-[0_2px_8px_rgba(0,0,0,0.5)] border-y border-[#ffe29a]/40">
                  Anniversary
                </div>
              </div>
              
              <div className="absolute top-4 right-12 text-[#c9a64e]/30 text-xl animate-pulse select-none pointer-events-none">✦</div>
              <div className="absolute bottom-6 left-1/3 text-[#c9a64e]/20 text-2xl animate-bounce select-none pointer-events-none" style={{ animationDuration: '4s' }}>✦</div>
              
              {/* 左側：巻物画像 */}
              <div className="flex-shrink-0 relative w-full md:w-1/3 h-40 md:h-full flex items-center justify-center mb-6 md:mb-0">
                <div className="absolute w-1.5 h-full bg-gradient-to-b from-rose-700 via-rose-500 to-rose-700 opacity-60 z-0" />
                <div className="absolute h-1.5 w-full bg-gradient-to-r from-rose-700 via-rose-500 to-rose-700 opacity-60 z-0" />
                <div className="absolute w-32 h-32 bg-[#c9a64e]/10 rounded-full blur-2xl group-hover:bg-[#c9a64e]/20 transition-all duration-700 z-0" />
                
                <div className="relative z-10 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500 w-36 h-36 flex items-center justify-center">
                  <img
                    src="/makimono.webp"
                    alt="かきょ年表"
                    className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(201,166,78,0.4)]"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-rose-600 text-[10px] text-white font-serif px-2 py-0.5 rounded border border-rose-400 shadow-md">
                    GIFT ✦
                  </div>
                </div>
              </div>

              {/* 右側：テキストコンテンツ */}
              <div className="flex-1 md:pl-10 text-center md:text-left relative z-10 flex flex-col justify-center h-full">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2 flex-wrap">
                  <span className="bg-[#c9a64e]/20 text-[#ffe29a] text-[10px] md:text-xs tracking-wider px-3 py-1 rounded-full border border-[#c9a64e]/40 font-serif">
                    特別記念絵巻
                  </span>
                  <span className="text-[#ffe29a] text-xs">🎉 Anniversary Edition</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 text-outline tracking-wider" style={{ textShadow: '0 0 15px rgba(255,226,154,0.15)' }}>
                  かきょ年表
                </h3>
                
                <p className="text-[#d4c5b0] text-sm md:text-base leading-relaxed mb-6 max-w-xl">
                  かきょの記念すべき軌跡を紐解く、特別な年表ギフト。<br className="hidden lg:block" />
                  これまでの大切な想い出と歩みが、美しい天の川に沿って開かれます。
                </p>
                
                <div className="text-[#c9a64e] font-bold text-lg border-b border-transparent group-hover:border-[#c9a64e] transition-all pb-1 uppercase tracking-widest inline-flex items-center gap-2 self-center md:self-start cursor-pointer">
                  <span>絵巻を紐解く (Open)</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

            </div>
          </div>

          <Link href="/register" className="group">
            <div className="glass-panel p-6 md:p-10 h-full flex flex-col items-center hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] group-hover:border-[#c9a64e]/40 relative overflow-hidden">
              <div className="mb-0 group-hover:rotate-6 transition-transform h-32 md:h-48 w-32 md:w-48 flex items-center justify-center absolute top-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 duration-500">
                <img src="/入居届.webp" alt="入居届" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="relative z-10 mt-28 md:mt-44 flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 text-outline">入居届</h3>
                <p className="text-[#d4c5b0] text-base md:text-lg leading-relaxed mb-10 flex-1 drop-shadow-md">
                  自分だけのプロフィールを作成し、<br className="hidden md:block" />
                  この場所の一員として登録します。
                </p>
                <div className="text-[#c9a64e] font-bold text-xl border-b-2 border-transparent group-hover:border-[#c9a64e] transition-all pb-1 uppercase tracking-widest">
                  Check In →
                </div>
              </div>
            </div>
          </Link>

          <Link href="/registry" className="group">
            <div className="glass-panel p-6 md:p-10 h-full flex flex-col items-center hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] group-hover:border-white/30 relative overflow-hidden">
              <div className="mb-0 group-hover:-rotate-6 transition-transform h-32 md:h-48 w-32 md:w-48 flex items-center justify-center absolute top-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 duration-500">
                <img src="/住人名簿.webp" alt="住人名簿" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="relative z-10 mt-28 md:mt-44 flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 text-outline">住人名簿</h3>
                <p className="text-[#d4c5b0] text-base md:text-lg leading-relaxed mb-10 flex-1 drop-shadow-md">
                  ここに住まう仲間たちの記録。<br className="hidden md:block" />
                  いつでも誰でも閲覧できます。
                </p>
                <div className="text-white font-bold text-xl border-b-2 border-transparent group-hover:border-white transition-all pb-1 uppercase tracking-widest">
                  Registry →
                </div>
              </div>
            </div>
          </Link>

          <Link href="/kakyonoma" className="group">
            <div className="glass-panel p-6 md:p-10 h-full flex flex-col items-center hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] group-hover:border-[#c9a64e]/40 relative overflow-hidden">
              <div className="mb-0 group-hover:scale-110 transition-transform h-32 md:h-48 w-32 md:w-48 flex items-center justify-center absolute top-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 duration-500">
                <img src="/かきょの間.webp" alt="かきょの間" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="relative z-10 mt-28 md:mt-44 flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 text-outline">かきょの間</h3>
                <p className="text-[#d4c5b0] text-base md:text-lg leading-relaxed mb-10 flex-1 drop-shadow-md">
                  和の空気漂う憩いの場。<br className="hidden md:block" />
                  皆の存在が畳となって広がります。
                </p>
                <div className="text-[#c9a64e] font-bold text-xl border-b-2 border-transparent group-hover:border-[#c9a64e] transition-all pb-1 uppercase tracking-widest">
                  Explore →
                </div>
              </div>
            </div>
          </Link>

          <Link href="/songs" className="group">
            <div className="glass-panel p-6 md:p-10 h-full flex flex-col items-center hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] group-hover:border-[#c9a64e]/40 relative overflow-hidden">
              <div className="mb-0 group-hover:rotate-6 transition-transform h-32 md:h-48 w-32 md:w-48 flex items-center justify-center absolute top-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 duration-500">
                <img src="/きょーの一曲.webp" alt="きょーの一曲" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="relative z-10 mt-28 md:mt-44 flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 text-outline">きょーの一曲</h3>
                <p className="text-[#d4c5b0] text-base md:text-lg leading-relaxed mb-10 flex-1 drop-shadow-md">
                  オリジナルやカバーの中から、<br className="hidden md:block" />
                  今のあなたにぴったりの一曲を。
                </p>
                <div className="text-[#c9a64e] font-bold text-xl border-b-2 border-transparent group-hover:border-[#c9a64e] transition-all pb-1 uppercase tracking-widest">
                  Listen →
                </div>
              </div>
            </div>
          </Link>

          <Link href="/diagnosis" className="group">
            <div className="glass-panel p-6 md:p-10 h-full flex flex-col items-center hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] group-hover:border-white/30 relative overflow-hidden">
              <div className="mb-0 group-hover:scale-110 transition-transform h-32 md:h-48 w-32 md:w-48 flex items-center justify-center absolute top-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 duration-500">
                <img src="/推しタイプ診断.webp" alt="推しスタイル診断" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="relative z-10 mt-28 md:mt-44 flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 text-outline">推しスタイル診断</h3>
                <p className="text-[#d4c5b0] text-base md:text-lg leading-relaxed mb-10 flex-1 drop-shadow-md">
                  質問に答えて、あなたの<br className="hidden md:block" />
                  推しへの向き合い方を診断します。
                </p>
                <div className="text-white font-bold text-xl border-b-2 border-transparent group-hover:border-white transition-all pb-1 uppercase tracking-widest">
                  Start →
                </div>
              </div>
            </div>
          </Link>

          <Link href="/kakyovoice" className="group">
            <div className="glass-panel p-6 md:p-10 h-full flex flex-col items-center hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] group-hover:border-[#c9a64e]/40 relative overflow-hidden">
              <div className="mb-0 group-hover:scale-110 transition-transform h-32 md:h-48 w-32 md:w-48 flex items-center justify-center absolute top-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 duration-500">
                <img src="/kakyovoice.png" alt="まいにちかきょボイス" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="relative z-10 mt-28 md:mt-44 flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 text-outline whitespace-nowrap">まいにちかきょボイス</h3>
                <p className="text-[#d4c5b0] text-base md:text-lg leading-relaxed mb-10 flex-1 drop-shadow-md">
                  日々の声をここに集めて。<br className="hidden md:block" />
                  これまでのボイスを振り返ります。
                </p>
                <div className="text-[#c9a64e] font-bold text-xl border-b-2 border-transparent group-hover:border-[#c9a64e] transition-all pb-1 uppercase tracking-widest">
                  Listen →
                </div>
              </div>
            </div>
          </Link>

          <Link href="/greeting" className="group">
            <div className="glass-panel p-6 md:p-10 h-full flex flex-col items-center hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] group-hover:border-[#c9a64e]/40 relative overflow-hidden">
              <div className="mb-0 group-hover:translate-x-2 transition-transform h-32 md:h-48 w-32 md:w-48 flex items-center justify-center absolute top-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 duration-500">
                <img src="/管理人から.webp" alt="管理人から" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="relative z-10 mt-28 md:mt-44 flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 text-outline">管理人から</h3>
                <p className="text-[#d4c5b0] text-base md:text-lg leading-relaxed mb-10 flex-1 drop-shadow-md">
                  本サイトの立ち上げへの想いと、<br className="hidden md:block" />
                  皆様へのメッセージです。
                </p>
                <div className="text-[#c9a64e] font-bold text-xl border-b-2 border-transparent group-hover:border-[#c9a64e] transition-all pb-1 uppercase tracking-widest">
                  Message →
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* Dynamic Message Section */}
        <HomeMessage />

        {/* Footer */}
        <div className="pt-20 opacity-60">
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="h-px bg-white/20 w-24" />
            <div className="text-[#c9a64e] text-2xl">✦</div>
            <div className="h-px bg-white/20 w-24" />
          </div>
          <p className="text-white/40 text-sm tracking-[0.5em] font-serif uppercase">Resident Support Portal</p>
          <p className="text-white/20 text-[10px] mt-4 tracking-[0.2em] font-serif">© 2026 MAISON-DE-KYO • EST. 2026</p>
        </div>

      </div>

      {/* ── パスワード入力モーダル ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-filter backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative max-w-md w-full glass-panel p-8 md:p-10 rounded-[2.5rem] border-[#c9a64e]/30 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            {/* 装飾の角枠 */}
            <div className="absolute inset-4 border border-[#c9a64e]/20 rounded-[1.8rem] pointer-events-none" />
            
            <div className="space-y-2">
              <div className="text-4xl">📜</div>
              <h3 className="text-2xl font-serif font-black text-[#ffe29a] tracking-widest text-glow">
                かきょ年表の紐解き
              </h3>
              <p className="text-xs text-[#c9a64e] tracking-wider uppercase font-sans">
                Scroll Authentication
              </p>
            </div>

            <p className="text-[#d4c5b0] text-sm leading-relaxed font-serif">
              かきょの歴史を刻んだ年表を紐解くには、<br />
              四桁の暗証番号が必要です。
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4 pt-2">
              <input
                autoFocus
                type="password"
                value={authPassword}
                onChange={(e) => {
                  setAuthPassword(e.target.value);
                  setAuthError('');
                }}
                placeholder="暗証番号を入力"
                className="w-full px-5 py-3 rounded-xl bg-[#080d1a]/85 border border-[#c9a64e]/40 text-center text-lg text-white tracking-[0.3em] focus:outline-none focus:border-[#c9a64e] focus:ring-2 focus:ring-[#c9a64e]/20 transition-all font-sans shadow-inner placeholder:tracking-normal placeholder:text-gray-600"
              />
              {authError && (
                <p className="text-rose-400 text-xs font-sans animate-bounce">
                  {authError}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    setAuthPassword('');
                    setAuthError('');
                  }}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 active:scale-[0.98] transition-all tracking-wider text-sm font-bold font-sans"
                >
                  閉じる
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#c9a64e] via-[#e2c575] to-[#a06830] text-[#080d1a] font-black tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(201,166,78,0.3)] text-sm font-sans"
                >
                  紐解く
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 巻物オープニング動画オーバーレイ（宇宙背景＋枠＋透過動画） ── */}
      {showScrollVideo && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 100 }}
        >
          {/* 背景：星空写真（ダークオーバーレイなし） */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/timeline-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* 装飾フレーム */}
          <div className="absolute inset-6 border border-[#c9a64e]/30 pointer-events-none rounded-lg" />
          <div className="absolute inset-8 border border-[#c9a64e]/15 pointer-events-none rounded-lg" />
          {/* 四隅の装飾 */}
          <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-[#c9a64e]/60 pointer-events-none" />
          <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-[#c9a64e]/60 pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-[#c9a64e]/60 pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-[#c9a64e]/60 pointer-events-none" />

          {/* 透過WebM動画 */}
          <video
            key="scroll-opening"
            autoPlay
            playsInline
            muted
            onClick={handleVideoSkip}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'contain',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <source src="/0001-0120.webm" type="video/webm" />
            <source src="/0001-0120.mp4" type="video/mp4" />
          </video>

          {/* ホワイトアウトオーバーレイ */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'white',
              opacity: showWhiteout ? 1 : 0,
              transition: 'opacity 0.45s ease-in',
            }}
          />

          {/* スキップヒント */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#c9a64e]/50 text-xs tracking-widest font-sans pointer-events-none">
            クリックでスキップ
          </div>
        </div>
      )}

    </main>
  );
}

function HomeMessage() {
  const [content, setContent] = React.useState('');

  React.useEffect(() => {
    fetch('/api/home-message')
      .then(res => res.json())
      .then(data => setContent(data.content))
      .catch(err => console.error(err));
  }, []);

  if (!content) return null;

  return (
    <div className="max-w-4xl mx-auto mt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="glass-panel p-10 md:p-16 rounded-[3rem] relative overflow-hidden group border-white/5 shadow-2xl">
        {/* Decorative Inner Border */}
        <div className="absolute inset-4 border border-[#c9a64e]/20 rounded-[2.2rem] pointer-events-none" />
        
        {/* Subtle Background Ornament */}
        <div className="absolute -bottom-10 -right-10 text-[15rem] text-white/5 pointer-events-none select-none rotate-12">
          📜
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col items-center gap-2">
            <div className="text-[#c9a64e] text-sm tracking-[0.4em] font-black uppercase opacity-80">Announcements</div>
            <h3 className="text-3xl md:text-4xl font-serif font-black text-white text-glow tracking-widest">
              管理役場より
            </h3>
            <div className="w-16 h-px bg-[#c9a64e]/40 mt-2" />
          </div>

          <div className="text-lg md:text-xl text-[#d4c5b0] font-serif leading-[2.2] text-center whitespace-pre-wrap drop-shadow-md px-4">
            {content}
          </div>

          <div className="flex justify-center pt-6">
            <div className="text-xs text-[#c9a64e]/60 tracking-[0.3em] font-bold uppercase py-2 px-6 border border-[#c9a64e]/30 rounded-full">
              Updated 2026.04
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
