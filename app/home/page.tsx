'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fcf9f2] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative corner ornaments */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-[#8b7355] opacity-40" />
      <div className="absolute top-8 right-8 w-24 h-24 border-t-4 border-r-4 border-[#8b7355] opacity-40" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b-4 border-l-4 border-[#8b7355] opacity-40" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-[#8b7355] opacity-40" />

      {/* Decorative Japanese patterns in background */}
      <div className="absolute top-20 right-20 text-6xl opacity-5 rotate-12">🌸</div>
      <div className="absolute bottom-32 left-16 text-5xl opacity-5 -rotate-12">🍵</div>
      <div className="absolute top-40 left-32 text-4xl opacity-5">📚</div>
      <div className="absolute bottom-20 right-32 text-5xl opacity-5 rotate-45">🏮</div>

      <div className="max-w-5xl w-full text-center space-y-16 relative z-10">

        {/* Header Section */}
        <div className="space-y-8 relative">
          {/* Decorative top border */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-[#8b7355] w-20" />
            <div className="text-[#c9a64e] text-2xl">✦</div>
            <div className="h-px bg-[#8b7355] w-20" />
          </div>

          {/* Illustration Banner */}
          <div className="max-w-3xl mx-auto mb-8 rounded-2xl overflow-hidden border-4 border-[#8b7355] shadow-lg bg-[#f5f1e8]">
            <div className="relative min-h-[200px] flex items-center justify-center">
              {/* Image with fallback chain: webp -> png -> emoji */}
              <img
                src="/banner.webp"
                alt="かきょの間 バナー"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.endsWith('.webp')) {
                    // Try png if webp fails
                    img.src = '/banner.png';
                  } else {
                    // Both failed, show fallback
                    img.style.display = 'none';
                    img.parentElement!.classList.add('p-8', 'bg-gradient-to-b', 'from-[#f5f1e8]', 'to-[#e8dcc8]');
                    const container = document.createElement('div');
                    container.className = 'text-center space-y-4';
                    container.innerHTML = '<div class="text-7xl">🏘️</div><div class="flex items-center justify-center gap-3"><span class="text-3xl opacity-30">🌿</span><span class="text-4xl opacity-40">📮</span><span class="text-5xl">🏮</span><span class="text-4xl opacity-40">🍵</span><span class="text-3xl opacity-30">🌸</span></div>';
                    img.parentElement!.appendChild(container);
                  }
                }}
              />
            </div>
          </div>

          {/* Title - Fixed layout to prevent breaking */}
          <div className="space-y-3">
            <h1 className="font-serif font-black text-[#43341b] tracking-tight leading-none">
              <span className="block text-5xl md:text-7xl lg:text-8xl whitespace-nowrap">メゾン・ド・きょー</span>
            </h1>
            <div className="text-sm tracking-[0.5em] text-[#6b5d4f] font-serif uppercase opacity-70">
              Maison de Kyo
            </div>
          </div>

          {/* Description with decorative elements */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute -left-12 top-0 text-4xl opacity-20 hidden md:block">🌿</div>
            <div className="absolute -right-12 top-0 text-4xl opacity-20 hidden md:block">🌿</div>

            <p className="text-lg md:text-xl text-[#6b5d4f] font-serif leading-relaxed px-4 py-6">
              ようこそ、この古き良き集合住宅へ。<br />
              <span className="inline-block mt-2">あなたの居場所を記録し、</span>
              <span className="inline-block mt-1">仲間たちと共に過ごす時間を大切にしましょう。</span>
            </p>
          </div>

          {/* Decorative bottom border */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px bg-[#8b7355] w-20" />
            <div className="text-[#c9a64e] text-2xl">✦</div>
            <div className="h-px bg-[#8b7355] w-20" />
          </div>
        </div>

        {/* Navigation Cards - Retro Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Register Card - Front Desk */}
          <Link href="/register" className="group relative">
            <div className="relative bg-[#f5f1e8] p-8 border-4 border-[#8b7355] shadow-[8px_8px_0px_0px_rgba(67,52,27,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(67,52,27,0.2)] transition-all duration-300 h-full flex flex-col">
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#c9a64e]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#c9a64e]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#c9a64e]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#c9a64e]" />

              {/* Small decorative element */}
              <div className="absolute top-6 right-6 text-2xl opacity-10">📝</div>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">✍️</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-[#43341b] font-serif mb-1">入居届</h3>
                  <div className="text-xs tracking-[0.3em] text-[#6b5d4f] uppercase">Registration</div>
                </div>
              </div>

              <p className="text-[#6b5d4f] text-sm leading-relaxed mb-6 flex-1">
                情報を入力して自分だけの「入居届」画像を作成し、名簿に登録します。
              </p>

              <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-[#d4c5b0]">
                <span className="text-[#a84032] font-bold text-sm group-hover:translate-x-1 transition-transform">受付へ進む</span>
                <span className="text-[#a84032] text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* Registry Card - Mailbox Board */}
          <Link href="/registry" className="group relative">
            <div className="relative bg-[#f5f1e8] p-8 border-4 border-[#8b7355] shadow-[8px_8px_0px_0px_rgba(67,52,27,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(67,52,27,0.2)] transition-all duration-300 h-full flex flex-col">
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#c9a64e]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#c9a64e]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#c9a64e]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#c9a64e]" />

              {/* Small decorative element */}
              <div className="absolute top-6 right-6 text-2xl opacity-10">📋</div>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">📮</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-[#43341b] font-serif mb-1">住人名簿</h3>
                  <div className="text-xs tracking-[0.3em] text-[#6b5d4f] uppercase">Registry</div>
                </div>
              </div>

              <p className="text-[#6b5d4f] text-sm leading-relaxed mb-6 flex-1">
                これまでに登録した全ての住人たちのプロフィールを一覧で確認できます。
              </p>

              <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-[#d4c5b0]">
                <span className="text-[#2f5c48] font-bold text-sm group-hover:translate-x-1 transition-transform">名簿を開く</span>
                <span className="text-[#2f5c48] text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* Kakyo-no-ma Card - Japanese Room */}
          <Link href="/kakyonoma" className="group relative">
            <div className="relative bg-[#f5f1e8] p-8 border-4 border-[#8b7355] shadow-[8px_8px_0px_0px_rgba(67,52,27,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(67,52,27,0.2)] transition-all duration-300 h-full flex flex-col">
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#c9a64e]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#c9a64e]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#c9a64e]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#c9a64e]" />

              {/* Small decorative element */}
              <div className="absolute top-6 right-6 text-2xl opacity-10">🍵</div>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">🏮</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-[#43341b] font-serif mb-1">かきょの間</h3>
                  <div className="text-xs tracking-[0.3em] text-[#6b5d4f] uppercase">Tatami Room</div>
                </div>
              </div>

              <p className="text-[#6b5d4f] text-sm leading-relaxed mb-6 flex-1">
                和の情緒あふれる空間に、住人たちが集う憩いの場。人数に合わせて変化します。
              </p>

              <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-[#d4c5b0]">
                <span className="text-[#c9a64e] font-bold text-sm group-hover:translate-x-1 transition-transform">和室へ入る</span>
                <span className="text-[#c9a64e] text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* Diagnosis Card - Fortune Teller */}
          <Link href="/diagnosis" className="group relative">
            <div className="relative bg-[#f5f1e8] p-8 border-4 border-[#8b7355] shadow-[8px_8px_0px_0px_rgba(67,52,27,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(67,52,27,0.2)] transition-all duration-300 h-full flex flex-col">
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#c9a64e]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#c9a64e]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#c9a64e]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#c9a64e]" />

              {/* Small decorative element */}
              <div className="absolute top-6 right-6 text-2xl opacity-10">✨</div>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">🔮</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-[#43341b] font-serif mb-1">推し診断</h3>
                  <div className="text-xs tracking-[0.3em] text-[#6b5d4f] uppercase">Diagnosis</div>
                </div>
              </div>

              <p className="text-[#6b5d4f] text-sm leading-relaxed mb-6 flex-1">
                簡単な質問に答えて、あなたの推しとの関わり方や理想の距離感を分析します。
              </p>

              <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-[#d4c5b0]">
                <span className="text-[#2d4059] font-bold text-sm group-hover:translate-x-1 transition-transform">診断を始める</span>
                <span className="text-[#2d4059] text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* Greeting Card - Administrator Message */}
          <Link href="/greeting" className="group relative">
            <div className="relative bg-[#f5f1e8] p-8 border-4 border-[#8b7355] shadow-[8px_8px_0px_0px_rgba(67,52,27,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(67,52,27,0.2)] transition-all duration-300 h-full flex flex-col">
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#c9a64e]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#c9a64e]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#c9a64e]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#c9a64e]" />

              {/* Small decorative element */}
              <div className="absolute top-6 right-6 text-2xl opacity-10">📜</div>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">👤</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-[#43341b] font-serif mb-1">ご挨拶</h3>
                  <div className="text-xs tracking-[0.3em] text-[#6b5d4f] uppercase">Greeting</div>
                </div>
              </div>

              <p className="text-[#6b5d4f] text-sm leading-relaxed mb-6 flex-1">
                サイト管理者からのメッセージをお読みいただけます。
              </p>

              <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-[#d4c5b0]">
                <span className="text-[#6b5d4f] font-bold text-sm group-hover:translate-x-1 transition-transform">ご挨拶を読む</span>
                <span className="text-[#6b5d4f] text-xl">→</span>
              </div>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="pt-16 pb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-[#8b7355] w-16 opacity-40" />
            <div className="text-[#c9a64e] text-sm opacity-60">✦</div>
            <div className="h-px bg-[#8b7355] w-16 opacity-40" />
          </div>
          <p className="text-[#9a8b7a] text-xs tracking-[0.2em] font-serif">© 2026 かきょの間 (Kakyo-no-ma)</p>
        </div>

      </div>
    </main>
  );
}
