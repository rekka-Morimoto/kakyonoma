'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TermsPage() {
    const [agreed, setAgreed] = useState(false);
    const router = useRouter();

    const handleProceed = () => {
        if (agreed) {
            sessionStorage.setItem('termsAgreed', 'true');
            router.push('/home');
        }
    };

    return (
        <main className="min-h-screen bg-transparent p-8 md:p-20 relative overflow-hidden flex flex-col items-center">

            <div className="max-w-4xl w-full space-y-12 relative z-10">
                <Link href="/" className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors mb-4 group font-bold tracking-widest text-lg">
                    <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
                    BACK
                </Link>

                <div className="glass-panel p-10 md:p-20 rounded-[3rem] border-white/10 shadow-2xl space-y-12">
                    <header className="border-b border-white/10 pb-10 text-center">
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-4 text-outline">ご利用案内</h1>
                        <p className="text-[#c9a64e] tracking-[0.5em] font-sans font-black uppercase text-sm drop-shadow-md">Terms & Guidelines</p>
                    </header>

                    <div className="max-h-[500px] overflow-y-auto pr-4 space-y-12 font-serif leading-loose text-white/90 text-xl custom-scrollbar">

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black text-[#c9a64e] text-outline">1. 登録について</h2>
                            <p className="text-outline opacity-90 indent-4">
                                当サイトは推し活を個人的に振り返り、交流を楽しむための非公式なファンメイドサイトです。
                                入力された情報は名簿として公開されますので、個人情報の取り扱いには十分ご注意ください。
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black text-[#c9a64e] text-outline">2. データの管理</h2>
                            <p className="text-outline opacity-90 indent-4">
                                登録したデータの削除は、設定したパスワードを使用してご自身で行うことができます。
                                システムの都合により、予告なくメンテナンスやデータの整理を行う場合があります。
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black text-[#c9a64e] text-outline">3. 禁止事項</h2>
                            <p className="text-outline opacity-90 indent-4">
                                他者を誹謗中傷する内容や、公序良俗に反する内容の登録は固くお断りします。
                                また、本人や関係者への迷惑行為につながる使い方はお控えください。
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black text-[#c9a64e] text-outline">4. 免責事項</h2>
                            <div className="glass-panel p-6 rounded-2xl border-white/5 bg-black/20 text-base leading-relaxed">
                                <p className="text-outline opacity-80">
                                    本サイトを通じて発生した個人間のやり取り、SNSでの交流、および、それに伴って生じたトラブルについて、当サイトおよび管理人は一切の責任を負いません。
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="pt-10 border-t border-white/10 flex flex-col items-center space-y-8">
                        <label className="flex items-center gap-6 cursor-pointer group glass-panel px-10 py-6 rounded-3xl border-white/5 hover:border-[#c9a64e]/30 transition-all shadow-xl">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="w-8 h-8 accent-[#c9a64e] cursor-pointer"
                            />
                            <span className="text-xl md:text-2xl font-black text-white text-outline tracking-wider">
                                内容を理解し、同意します
                            </span>
                        </label>

                        <button
                            onClick={handleProceed}
                            disabled={!agreed}
                            className={`px-16 py-6 rounded-2xl font-black text-2xl transition-all shadow-2xl text-outline active:scale-95 ${agreed
                                    ? 'bg-[#c9a64e] text-white hover:brightness-110'
                                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                }`}
                        >
                            同意して進む
                        </button>
                    </div>

                    <footer className="text-center opacity-40 pt-6">
                        <p className="text-sm font-serif italic">EST. 2026 • KAKYO-NO-MA</p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
