'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
    const [agreed, setAgreed] = useState(false);
    const router = useRouter();

    const handleProceed = () => {
        if (agreed) {
            // Store agreement in sessionStorage
            sessionStorage.setItem('termsAgreed', 'true');
            router.push('/home');
        }
    };

    return (
        <main className="min-h-screen bg-[#fcf9f2] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative corner ornaments */}
            <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-[#8b7355] opacity-40" />
            <div className="absolute top-8 right-8 w-24 h-24 border-t-4 border-r-4 border-[#8b7355] opacity-40" />
            <div className="absolute bottom-8 left-8 w-24 h-24 border-b-4 border-l-4 border-[#8b7355] opacity-40" />
            <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-[#8b7355] opacity-40" />

            <div className="max-w-4xl w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-px bg-[#8b7355] w-16" />
                        <div className="text-[#c9a64e] text-xl">✦</div>
                        <div className="h-px bg-[#8b7355] w-16" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-black text-[#43341b] mb-3">
                        ご利用にあたって
                    </h1>
                    <p className="text-sm tracking-[0.3em] text-[#6b5d4f] font-serif uppercase opacity-70">
                        Terms of Use
                    </p>
                </div>

                {/* Content Box */}
                <div className="bg-[#f5f1e8] border-4 border-[#8b7355] shadow-[8px_8px_0px_0px_rgba(67,52,27,0.15)] p-8 md:p-12 max-h-[600px] overflow-y-auto">
                    {/* Introduction */}
                    <div className="mb-8 pb-6 border-b-2 border-dashed border-[#d4c5b0]">
                        <p className="text-[#43341b] leading-relaxed mb-4">
                            このサイトは、<span className="font-bold">「少女革命計画 心世紀の佳鏡院」</span>を応援するファン同士の交流を目的とした、<span className="font-bold text-[#a84032]">非公式ファンサイト</span>です。
                        </p>
                        <p className="text-[#6b5d4f] leading-relaxed text-sm">
                            配信やライブを通じて生まれた想いや距離感を、それぞれのペースで持ち寄り、ゆるやかにつながる場として設けられています。
                        </p>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-[#fcf9f2] border-2 border-[#a84032] p-6 mb-8 rounded">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">⚠️</span>
                            <h2 className="text-lg font-black text-[#a84032]">重要なお知らせ</h2>
                        </div>
                        <p className="text-[#43341b] leading-relaxed text-sm">
                            免責事項
                        </p>
                        <p className="text-xs leading-relaxed">
                            本サイトを通じて発生した個人間のやり取り、SNSでの交流、オフラインでの接触、および、それに伴って生じたトラブルについて、当サイトおよび管理人は一切の責任を負いません。
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3 */}
            <section>
                <h3 className="text-xl font-black text-[#43341b] mb-4 flex items-center gap-2">
                    <span className="text-[#c9a64e]">③</span>
                    入力情報・個人情報について
                </h3>
                <div className="pl-6 space-y-3 text-[#6b5d4f]">
                    <p className="leading-relaxed text-sm">
                        入力された情報は、サイト内での表示・集計以外の目的には利用しません。
                    </p>
                    <div className="bg-[#fcf9f2] p-4 rounded border-l-4 border-[#a84032]">
                        <p className="text-sm font-bold text-[#a84032] mb-2">
                            以下のような情報は、絶対に入力しないでください
                        </p>
                        <ul className="text-xs space-y-1 list-disc list-inside">
                            <li>本名</li>
                            <li>住所・居住地が特定できる情報</li>
                            <li>電話番号・メールアドレス</li>
                            <li>学校名・勤務先など、個人が特定される情報</li>
                        </ul>
                        <p className="text-xs mt-3 leading-relaxed">
                            SNSアカウント名についても、公開しても問題のない範囲での記載をお願いします。
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 4 */}
            <section>
                <h3 className="text-xl font-black text-[#43341b] mb-4 flex items-center gap-2">
                    <span className="text-[#c9a64e]">④</span>
                    未成年の方へ
                </h3>
                <div className="pl-6 space-y-3 text-[#6b5d4f]">
                    <p className="leading-relaxed text-sm">
                        個人情報の取り扱いや他者との交流には十分注意してください。<br />
                        <span className="text-xs text-[#9a8b7a]">※ 管理人は年齢確認を行いません</span>
                    </p>
                </div>
            </section>

            {/* Section 5 */}
            <section>
                <h3 className="text-xl font-black text-[#43341b] mb-4 flex items-center gap-2">
                    <span className="text-[#c9a64e]">⑤</span>
                    内容の変更・削除について
                </h3>
                <div className="pl-6 space-y-3 text-[#6b5d4f]">
                    <p className="leading-relaxed text-sm">
                        管理人の判断により、以下を行う場合があります。
                    </p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>投稿内容の非表示・削除</li>
                        <li>サイト仕様の変更</li>
                        <li>サービスの停止・終了</li>
                    </ul>
                    <p className="text-xs text-[#9a8b7a]">
                        その際、個別の理由説明や事前告知を行わない場合があります。
                    </p>
                </div>
            </section>

            {/* Closing Message */}
            <section className="bg-gradient-to-b from-[#fcf9f2] to-[#f5f1e8] p-6 rounded border-2 border-[#c9a64e]">
                <div className="text-center space-y-4">
                    <p className="text-[#43341b] leading-relaxed">
                        この場所が、誰かにとって居心地のよい「となり」や<br />
                        静かに見守れる「距離」になることを願っています。
                    </p>
                    <p className="text-sm font-bold text-[#6b5d4f]">
                        推し方は人それぞれ。<br />
                        その違いを尊重できる方のみ、ご利用ください。
                    </p>
                </div>
            </section>
        </div>
                </div >

        {/* Agreement Checkbox */ }
        < div className = "mt-8 bg-[#f5f1e8] border-4 border-[#8b7355] p-6" >
            <label className="flex items-start gap-4 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#c9a64e] cursor-pointer"
                />
                <span className="text-[#43341b] leading-relaxed flex-1">
                    上記の内容を理解し、同意します
                </span>
            </label>
                </div >

        {/* Proceed Button */ }
        < div className = "mt-6 text-center" >
            <button
                onClick={handleProceed}
                disabled={!agreed}
                className={`px-12 py-4 font-bold text-lg transition-all duration-300 ${agreed
                    ? 'bg-[#c9a64e] text-[#43341b] hover:bg-[#d4b05f] shadow-[4px_4px_0px_0px_rgba(67,52,27,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(67,52,27,0.3)] cursor-pointer'
                    : 'bg-[#d4c5b0] text-[#9a8b7a] cursor-not-allowed opacity-50'
                    }`}
            >
                同意して進む →
            </button>
                </div >

        {/* Footer */ }
        < div className = "mt-12 text-center" >
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-px bg-[#8b7355] w-16 opacity-40" />
                        <div className="text-[#c9a64e] text-sm opacity-60">✦</div>
                        <div className="h-px bg-[#8b7355] w-16 opacity-40" />
                    </div>
                    <p className="text-[#9a8b7a] text-xs tracking-[0.2em] font-serif">© 2026 Maison de Kyo</p>
                </div >
            </div >
        </main >
    );
}
