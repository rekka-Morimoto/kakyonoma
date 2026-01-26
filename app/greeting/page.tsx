import Link from 'next/link';

export default function GreetingPage() {
    return (
        <main className="min-h-screen bg-[#fcf9f2] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative corner ornaments */}
            <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-[#8b7355] opacity-40" />
            <div className="absolute top-8 right-8 w-24 h-24 border-t-4 border-r-4 border-[#8b7355] opacity-40" />
            <div className="absolute bottom-8 left-8 w-24 h-24 border-b-4 border-l-4 border-[#8b7355] opacity-40" />
            <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-[#8b7355] opacity-40" />

            {/* Decorative Japanese patterns in background */}
            <div className="absolute top-20 right-20 text-6xl opacity-5 rotate-12">🌸</div>
            <p>
                みなさま、当サイトへお越しいただき、誠にありがとうございます。<br />
                <span className="font-bold">「メゾン・ド・きょー」管理人代理兼、サイト管理者の烈火モリモト</span>と申します。
            </p>

            <div className="border-l-4 border-[#c9a64e] pl-6 py-2 bg-[#fcf9f2]">
                <p className="text-[#6b5d4f]">
                    当サイトは、佳鏡院さんの活動を応援することを目的とした、ファンメイドの非公式サイトです。
                </p>
            </div>

            <p>
                兼ねてより一ファンとして、コミュニティ全体がよりあたたかく、楽しい場となるような企画を模索してまいりました。<br />
                ファンコミュニティへの新規参加は、興味があってもなかなか一歩を踏み出しづらいものではないでしょうか。
            </p>

            <p>
                かくいう私自身も、友人に背中を押してもらう形で改変者のコミュニティに参加し、気がつけば、たくさんの大切なご縁に恵まれていました。
            </p>

            <div className="bg-gradient-to-r from-[#fcf9f2] to-[#f5f1e8] p-6 rounded border-2 border-[#d4c5b0] my-6">
                <p className="text-center font-serif italic text-[#6b5d4f]">
                    皆さまにとっても、そんな「最初のとっかかり」になるような場所をつくれないか――<br />
                    <span className="text-[#43341b] font-bold not-italic">その想いから、この企画を立ち上げました。</span>
                </p>
            </div>

            <p>
                きょーめいと同士であることは知っていても、これまで接点のなかった方々が、ほんのひとこと挨拶を交わせる。<br />
                たまたま同じ部屋になった方、たまたま隣の畳に座った方。<br />
                そんな偶然の中に、ささやかなご縁が生まれましたら幸いです。
            </p>

            <div className="border-t-2 border-dashed border-[#d4c5b0] pt-6 mt-8">
                <p className="mb-4">
                    最後に、この場所は、皆さま一人ひとりの思いやりとご配慮によって成り立っています。<br />
                    ご協力に、心より感謝申し上げます。
                </p>
                <p className="text-center font-bold text-lg text-[#6b5d4f]">
                    どうぞ「メゾン・ド・きょー」でのひとときを、<br />
                    ゆっくりとお楽しみください。
                </p>
            </div>

            {/* Signature */}
            <div className="text-right mt-8 pt-6 border-t border-[#d4c5b0]">
                <p className="text-2xl font-serif font-black text-[#43341b] mb-1">
                    烈火モリモト
                </p>
                <p className="text-xs text-[#9a8b7a] tracking-wider">
                    Rekka Morimoto
                </p>
            </div>
        </div>
                </div >

        {/* Back Button */ }
        < div className = "mt-8 text-center" >
            <Link
                href="/home"
                className="inline-block px-10 py-3 bg-[#c9a64e] text-[#43341b] font-bold hover:bg-[#d4b05f] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(67,52,27,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(67,52,27,0.3)]"
            >
                ← ホームに戻る
            </Link>
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
