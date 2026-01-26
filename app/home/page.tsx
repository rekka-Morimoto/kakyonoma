'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative corner ornaments */}
      <div className="absolute top-12 left-12 w-32 h-32 border-t-2 border-l-2 border-[#c9a64e]/40 pointer-events-none" />
      <div className="absolute top-12 right-12 w-32 h-32 border-t-2 border-r-2 border-[#c9a64e]/40 pointer-events-none" />
      <div className="absolute bottom-12 left-12 w-32 h-32 border-b-2 border-l-2 border-[#c9a64e]/40 pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-32 h-32 border-b-2 border-r-2 border-[#c9a64e]/40 pointer-events-none" />

      <div className="max-w-6xl w-full text-center space-y-20 relative z-10 pt-10 pb-20">

        {/* Header Section */}
        <div className="space-y-10 relative">

          {/* Illustration Banner */}
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl bg-black/20 backdrop-blur-md">
            <div className="relative min-h-[250px] flex items-center justify-center">
              <img
                src="/banner.webp"
                alt="かきょの間 バナー"
                className="w-full h-full object-cover"
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

          {/* Title with Strong Outline */}
          <div className="space-y-4">
            <h1 className="font-serif font-black text-white tracking-tight leading-none text-outline">
              <span className="block text-7xl md:text-9xl lg:text-[10rem] whitespace-nowrap drop-shadow-2xl">メゾン・ド・きょー</span>
            </h1>
            <div className="text-sm md:text-base tracking-[0.8em] text-[#c9a64e] font-serif uppercase font-bold drop-shadow-lg">
              Maison de Kyo
            </div>
          </div>

          {/* Description */}
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-xl md:text-3xl text-white font-serif leading-relaxed text-outline opacity-95">
              ようこそ、この古き良き集合住宅へ。<br />
              あなたの居場所を記録し、仲間たちと過ごす時間を。
            </p>
          </div>
        </div>

        {/* Navigation Cards - Immersive Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          <Link href="/register" className="group">
            <div className="glass-panel p-10 h-full flex flex-col items-center hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] group-hover:border-[#c9a64e]/40">
              <div className="text-7xl mb-8 group-hover:rotate-12 transition-transform">✍️</div>
              <h3 className="text-4xl font-black text-white font-serif mb-4 text-outline">入居届</h3>
              <p className="text-[#d4c5b0] text-lg leading-relaxed mb-10 flex-1 drop-shadow-md">
                自分だけのプロフィールを作成し、この場所の一員として登録します。
              </p>
              <div className="text-[#c9a64e] font-bold text-xl border-b-2 border-transparent group-hover:border-[#c9a64e] transition-all pb-1 uppercase tracking-widest">
                Check In →
              </div>
            </div>
          </Link>

          <Link href="/registry" className="group">
            <div className="glass-panel p-10 h-full flex flex-col items-center hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] group-hover:border-white/30">
              <div className="text-7xl mb-8 group-hover:-rotate-12 transition-transform">📮</div>
              <h3 className="text-4xl font-black text-white font-serif mb-4 text-outline">住人名簿</h3>
              <p className="text-[#d4c5b0] text-lg leading-relaxed mb-10 flex-1 drop-shadow-md">
                ここに住まう仲間たちの記録。いつでも誰でも閲覧できます。
              </p>
              <div className="text-white font-bold text-xl border-b-2 border-transparent group-hover:border-white transition-all pb-1 uppercase tracking-widest">
                Registry →
              </div>
            </div>
          </Link>

          <Link href="/kakyonoma" className="group">
            <div className="glass-panel p-10 h-full flex flex-col items-center hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] group-hover:border-[#c9a64e]/40">
              <div className="text-7xl mb-8 group-hover:scale-110 transition-transform">🏮</div>
              <h3 className="text-4xl font-black text-white font-serif mb-4 text-outline">かきょの間</h3>
              <h3 className="text-4xl font-black text-white font-serif mb-4 text-outline hidden">かきょの間</h3>
              <p className="text-[#d4c5b0] text-lg leading-relaxed mb-10 flex-1 drop-shadow-md">
                和の空気漂う憩いの場。皆の存在が畳となって広がります。
              </p>
              <div className="text-[#c9a64e] font-bold text-xl border-b-2 border-transparent group-hover:border-[#c9a64e] transition-all pb-1 uppercase tracking-widest">
                Explore →
              </div>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="pt-20 opacity-60">
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="h-px bg-white/20 w-24" />
            <div className="text-[#c9a64e] text-2xl">✦</div>
            <div className="h-px bg-white/20 w-24" />
          </div>
          <p className="text-white/40 text-sm tracking-[0.5em] font-serif">EST. 2026 • KAKYO-NO-MA</p>
        </div>

      </div>
    </main>
  );
}
