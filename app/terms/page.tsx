import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import TermsAgreement from './TermsAgreement';

export default async function TermsPage() {
    let content = '';
    try {
        const filePath = path.join(process.cwd(), 'data', 'terms.txt');
        content = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error('Failed to read terms file:', error);
        content = '## エラー\n利用規約を読み込めませんでした。';
    }

    // Simple parsing logic for ## headers and content
    const sections = content.split('##').filter(s => s.trim() !== '').map(s => {
        const lines = s.trim().split('\n');
        return {
            title: lines[0].trim(),
            text: lines.slice(1).join('\n').trim()
        };
    });

    return (
        <main className="min-h-screen bg-transparent p-8 md:p-20 relative overflow-hidden flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-12 relative z-10">
                <Link href="/" className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors mb-4 group font-bold tracking-widest text-lg">
                    <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
                    BACK
                </Link>

                <div className="glass-panel p-10 md:p-20 rounded-[3rem] border-white/10 shadow-2xl space-y-12">
                    <header className="border-b border-white/10 pb-10 text-center">
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-4 text-outline title-elegant">ご利用案内</h1>
                        <p className="text-[#c9a64e] tracking-[0.5em] font-sans font-black uppercase text-sm drop-shadow-md">Terms & Guidelines</p>
                    </header>

                    <div className="max-h-[500px] overflow-y-auto pr-4 space-y-12 font-serif leading-loose text-white/90 text-xl custom-scrollbar">
                        {sections.map((section, idx) => {
                            const isDisclaimer = section.title.includes('免責');

                            return (
                                <section key={idx} className="space-y-6">
                                    <h2 className="text-3xl font-black text-[#c9a64e] text-outline title-elegant">{section.title}</h2>
                                    {isDisclaimer ? (
                                        <div className="glass-panel p-6 rounded-2xl border-white/5 bg-black/20 text-base leading-relaxed">
                                            <p className="text-outline opacity-80 whitespace-pre-wrap">
                                                {section.text}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-outline opacity-90 indent-4 whitespace-pre-wrap">
                                            {section.text}
                                        </p>
                                    )}
                                </section>
                            );
                        })}
                    </div>

                    <TermsAgreement />

                    <footer className="text-center opacity-40 pt-6">
                        <p className="text-sm font-serif italic">EST. 2026 • KAKYO-NO-MA</p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
