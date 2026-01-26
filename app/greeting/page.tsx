import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';

export default async function GreetingPage() {
    let content = '';
    try {
        const filePath = path.join(process.cwd(), 'data', 'greeting.txt');
        content = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error('Failed to read greeting file:', error);
        content = 'ご挨拶を読み込めませんでした。';
    }

    // Split content by double newlines for paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');

    return (
        <main className="min-h-screen bg-transparent p-8 md:p-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                <Link href="/" className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors mb-4 group font-bold tracking-widest text-lg">
                    <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
                    BACK
                </Link>

                <div className="glass-panel p-12 md:p-20 rounded-[3rem] border-white/10 shadow-2xl space-y-12">
                    <header className="border-b border-white/10 pb-10 text-center">
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-4 text-outline title-elegant">ご挨拶</h1>
                        <p className="text-[#c9a64e] tracking-[0.5em] font-sans font-black uppercase text-sm drop-shadow-md">A Message from the Manager</p>
                    </header>

                    <article className="prose prose-invert prose-stone max-w-none space-y-10 font-serif leading-loose text-white/90 text-xl text-justify">
                        {paragraphs.map((para, idx) => (
                            <p key={idx} className="text-outline opacity-90 whitespace-pre-wrap">
                                {para}
                            </p>
                        ))}
                    </article>

                    <footer className="pt-12 border-t border-white/10 flex flex-col items-center">
                        <div className="text-right w-full mb-10">
                            <p className="text-3xl font-serif font-black text-white text-outline title-elegant">
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
