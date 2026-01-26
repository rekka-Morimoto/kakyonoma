'use client';
import Link from 'next/link';

export default function GreetingPage() {
    return (
        <main className="min-h-screen bg-transparent p-8 md:p-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                <Link href="/" className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors mb-4 group font-bold tracking-widest text-lg">
                    <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
                    BACK
                </Link>

                <div className="glass-panel p-12 md:p-20 rounded-[3rem] border-white/10 shadow-2xl space-y-12">
                    <header className="border-b border-white/10 pb-10 text-center">
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-4 text-outline">ご挨拶</h1>
                        <p className="text-[#c9a64e] tracking-[0.5em] font-sans font-black uppercase text-sm drop-shadow-md">A Message from the Manager</p>
                    </header>

                    <article className="prose prose-invert prose-stone max-w-none space-y-10 font-serif leading-loose text-white/90 text-xl text-justify">
                        <p className="indent-4 text-outline opacity-90">
                            「メゾン・ド・きょー」へようこそ。
                        </p>
                        <p className="text-outline opacity-90">
                            ここは、推しを愛する心を持つ人々が、自分の立ち位置や感情をそっと残しておくための静かな居住区です。
                            誰かに強制されることも、誰かと競うこともありません。
                            あなたが推しに向けているその温かな眼差しや、日々の喜びを、一つの「形」として刻んでいただければ幸いです。
                        </p>
                        <p className="text-outline opacity-90">
                            この古いメゾンのようなサイトが、皆様の推し活という長い旅路の中での、小さな休憩所になれることを願っております。
                        </p>
                    </article>

                    <div className="space-y-10 pt-10 border-t border-white/10 text-white/80 font-serif leading-loose">
                        <p className="text-outline">
                            兼ねてより一ファンとして、コミュニティ全体がよりあたたかく、楽しい場となるような企画を模索してまいりました。
                            ファンコミュニティへの新規参加は、興味があってもなかなか一歩を踏み出しづらいものではないでしょうか。
                        </p>

                        <div className="glass-panel p-8 rounded-2xl border-white/5 bg-white/5 shadow-inner italic text-center">
                            <p className="text-[#d4c5b0] text-outline">
                                皆さまにとっても、そんな「最初のとっかかり」になるような場所をつくれないか――
                                <span className="text-white font-bold not-italic block mt-2">その想いから、この企画を立ち上げました。</span>
                            </p>
                        </div>

                        <p className="text-outline">
                            きょーめいと同士であることは知っていても、これまで接点のなかった方々が、ほんのひとこと挨拶を交わせる。
                            たまたま同じ部屋になった方、たまたま隣の畳に座った方。
                            そんな偶然の中に、ささやかなご縁が生まれましたら幸いです。
                        </p>
                    </div>

                    <footer className="pt-12 border-t border-white/10 flex flex-col items-center">
                        <div className="text-right w-full mb-10">
                            <p className="text-3xl font-serif font-black text-white text-outline">
                                烈火モリモト
                            </p>
                            <p className="text-xs text-[#c9a64e] tracking-widest font-black uppercase drop-shadow-md">
                                Rekka Morimoto
                            </p>
                        </div>
                        <div className="text-[#c9a64e] text-3xl mb-4">✦</div>
                        <p className="text-white/40 font-serif italic text-base">Maison de Kyo Manager</p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
