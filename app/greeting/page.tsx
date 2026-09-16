'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18nContext';

const zhGreetingText = `大家，非常感谢光临本网站。

我是“Maison de 院院”的代理管理员兼网站管理者 烈火Morimoto。

本网站是以支持佳镜院的活动为目的，由粉丝制作的非官方网站。

此前作为一名粉丝，我一直在探索能够让整个社群变得更加温暖、有趣的项目与契机。

加入新的粉丝社群，即使心生兴趣，往往也难以迈出第一步。

我自己也是在朋友的带领下加入了改变者的社群，如今结识了许多宝贵的缘分。如果没有那个地方，我想我现在依然在一个人看着直播。

能否打造一个为大家提供这种“最初契机”的场所呢？带着这样的构想，我发起了这个项目。

在 Maison de 院院，偶然分到同一个房间的朋友、偶然相邻的榻榻米、虽然知道同为 院院めいと 但此前从未有过交集的朋友们，能够相互打一声简单的招呼。

如果在这样的偶然中，能萌发出微小而美好的缘分，那将是我的荣幸。

最后，这个地方的延续依托于大家每一位的体谅与周到关照。对大家的协助致以最诚挚的感谢。

请在“Maison de 院院”尽情享受属于你的时光。

烈火Morimoto`;

export default function GreetingPage() {
    const [jaContent, setJaContent] = useState('');
    const { locale, t, translateDynamicText } = useLanguage();

    useEffect(() => {
        fetch('/data/greeting.txt')
            .then(res => res.text())
            .then(text => setJaContent(text))
            .catch(() => setJaContent('ご挨拶を読み込めませんでした。'));
    }, []);

    const contentToDisplay = locale === 'zh' ? zhGreetingText : jaContent;
    const paragraphs = contentToDisplay.split('\n\n').filter(p => p.trim() !== '');

    return (
        <main className="min-h-screen bg-transparent p-8 md:p-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                <Link href="/" className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors mb-4 group font-bold tracking-widest text-lg">
                    <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
                    {t('common.back')}
                </Link>

                <div className="glass-panel p-12 md:p-20 rounded-[3rem] border-white/10 shadow-2xl space-y-12">
                    <header className="border-b border-white/10 pb-10 text-center">
                        <h1 className="text-3xl md:text-7xl font-serif font-black text-white mb-4 text-outline title-elegant break-keep">
                            {t('greeting.title')}
                        </h1>
                        <p className="text-[#c9a64e] tracking-[0.5em] font-sans font-black uppercase text-sm drop-shadow-md">
                            {t('greeting.subtitle')}
                        </p>
                    </header>

                    <article className="prose prose-invert prose-stone max-w-none space-y-10 font-serif leading-loose text-white/90 text-lg md:text-xl text-left">
                        {paragraphs.map((para, idx) => (
                            <p key={idx} className="text-outline opacity-90 whitespace-pre-wrap">
                                {translateDynamicText(para)}
                            </p>
                        ))}
                    </article>

                    <footer className="pt-12 border-t border-white/10 flex flex-col items-center">
                        <div className="text-right w-full mb-10">
                            <p className="text-3xl font-serif font-black text-white text-outline title-elegant">
                                {t('greeting.authorName')}
                            </p>
                            <p className="text-xs text-[#c9a64e] tracking-widest font-black uppercase drop-shadow-md">
                                {t('greeting.authorEn')}
                            </p>
                        </div>
                        <div className="text-[#c9a64e] text-3xl mb-4">✦</div>
                        <p className="text-white/40 font-serif italic text-base">{t('greeting.managerRole')}</p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
