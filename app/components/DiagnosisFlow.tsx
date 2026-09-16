'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18nContext';

export type ResultType =
    | 'あこがれびと'
    | 'みまもりびと'
    | 'となりびと'
    | 'あゆみびと';

type QuestionType = 'LangNonLang' | 'WorshipIdent';

interface Question {
    id: number;
    text: string;
    type: QuestionType;
    optionA: string;
    optionB: string;
}

export const DIAGNOSIS_RESULTS_DATA: Record<'ja' | 'zh' | 'en', Record<ResultType, { title: string; description: string; emoji: string; iconPath?: string; color: string }>> = {
    ja: {
        'あこがれびと': {
            title: 'あこがれびと',
            description: `あなたのタイプは「あこがれびと」です。
あなたにとって推しは、手の届かない場所で輝く特別な存在。
言葉にしきれない表現や、その場にしか生まれない空気感に心を奪われ、ただそこに在る姿を受け取ること自体が喜びになります。
すべてを理解しなくてもいい、近づかなくてもいい。
遠くから見上げるその背中が、日常を少しだけ明るく照らしてくれたら。
そんな純粋な憧れを大切にするあなたに、「あこがれびと」の名前を授けます。`,
            emoji: '✨',
            iconPath: '/あこがれびと.webp',
            color: 'from-purple-500 to-indigo-600'
        },
        'みまもりびと': {
            title: 'みまもりびと',
            description: `あなたのタイプは「みまもりびと」です。
あなたは推しの言葉や選択の積み重ねを、静かに、丁寧に受け取っています。
何を考え、なぜそうしたのかを理解しようとしながらも、自分が踏み込みすぎることは望まない。
推しが選んだ道を尊重し、その歩みを少し後ろから見届けることに安心を感じるタイプです。
干渉せず、期待を押しつけず、ただ変わらぬまなざしを向け続けるあなたに、「みまもりびと」の名前を授けます。`,
            emoji: '🕊️',
            iconPath: '/みまもりびと.webp',
            color: 'from-emerald-500 to-teal-600'
        },
        'となりびと': {
            title: 'となりびと',
            description: `あなたのタイプは「となりびと」です。
あなたは推しと同じ空間、同じ時間を生きている感覚を大切にしています。
理屈よりも感情、説明よりも一体感。
ライブの熱や配信の空気の中で、「今この瞬間を一緒に楽しんでいる」ことに何よりの価値を見出します。
推しは遠い存在ではなく、同じ景色を見ている誰か。
そんな距離感で寄り添うあなたに、「となりびと」の名前を授けます。`,
            emoji: '🔥',
            iconPath: '/となりびと.webp',
            color: 'from-orange-500 to-red-600'
        },
        'あゆみびと': {
            title: 'あゆみびと',
            description: `あなたのタイプは「あゆみびと」です。
あなたは推しを同じ世界に生きるとても近しい存在に感じています。
推しは何を考えてどう選択していくのか？
それを口に出して説明できるほど細やかに捉えようとするあなたにとって、推しの存在は自分の少し前を歩く憧れの人です。
頑張る推しの姿に甘えず、自分もまたともに険しい道を歩もうとするあなたに、「あゆみびと」の名前を授けます。`,
            emoji: '🤝',
            iconPath: '/あゆみびと.webp',
            color: 'from-blue-500 to-cyan-600'
        }
    },
    zh: {
        'あこがれびと': {
            title: '仰望者 (Akogare-bito)',
            description: `您的推活类型是“仰望者”。
对您而言，推是在触不可及之处闪耀的特殊存在。
那些无法言表的情感、唯有当下才能诞生的氛围深深吸引着您，仅仅是接纳推的存在本身便已是莫大的喜悦。
无需理解一切，亦无需拉近距离。
那从远方仰望的背影，能将日常生活微微照亮。
献给珍视这份纯粹憧憬的您，“仰望者”之名。`,
            emoji: '✨',
            iconPath: '/あこがれびと.webp',
            color: 'from-purple-500 to-indigo-600'
        },
        'みまもりびと': {
            title: '守护者 (Mimamori-bito)',
            description: `您的推活类型是“守护者”。
您静静地、细致地接收着推的言语与每一个选择。
在试图理解推的想法与初衷的同时，并不希望自己过多干涉。
尊重推选择的道路，从稍后方静静见证推的脚步会让您感到安心。
不干涉、不强加期望，只是投去始终如一的温柔目光，献给这样的您，“守护者”之名。`,
            emoji: '🕊️',
            iconPath: '/みまもりびと.webp',
            color: 'from-emerald-500 to-teal-600'
        },
        'となりびと': {
            title: '同伴者 (Tonari-bito)',
            description: `您的推活类型是“同伴者”。
您极其珍视与推身处同一空间、共享同一时间的实感。
情感高于道理，一体感胜过繁复说明。
在演唱会的狂热与直播的氛围中，您在“此时此刻正共同享受”中汲取最大的价值。
推并非遥不可及，而是看着同一片风景的身边人。
以这样的心理距离相伴的您，“同伴者”之名。`,
            emoji: '🔥',
            iconPath: '/となりびと.webp',
            color: 'from-orange-500 to-red-600'
        },
        'あゆみびと': {
            title: '同行者 (Ayumi-bito)',
            description: `您的推活类型是“同行者”。
您感到推是生活在同一世界中极为亲近的存在。
推在思考着什么、将如何做出抉择？
对于能够细腻捕捉并用语言描述出来的您而言，推是走在自己稍前方的前行者。
不依赖推努力的身影，自己也决心一同踏上坎坷的道路，献给这样的您，“同行者”之名。`,
            emoji: '🤝',
            iconPath: '/あゆみびと.webp',
            color: 'from-blue-500 to-cyan-600'
        }
    },
    en: {
        'あこがれびと': {
            title: 'The Admirer (Akogare-bito)',
            description: `Your style is "The Admirer".
To you, your Oshi is a shining star in a realm beyond reach.
You are captivated by expressions beyond words and the unique atmosphere born in the moment; simply receiving their presence brings joy.
You don't need to understand everything or get close.
Looking up from afar as their guiding figure brightens your daily life is enough.
To you who treasures this pure admiration, we grant the title of "The Admirer".`,
            emoji: '✨',
            iconPath: '/あこがれびと.webp',
            color: 'from-purple-500 to-indigo-600'
        },
        'みまもりびと': {
            title: 'The Watcher (Mimamori-bito)',
            description: `Your style is "The Watcher".
You quietly and carefully receive your Oshi's words and choices.
While trying to understand what they think and why they chose it, you do not wish to overstep or intrude.
You respect the path your Oshi chooses and find peace in watching their progress from a step behind.
Without interfering or imposing expectations, you offer an unchanging, warm gaze. To you, we grant the title of "The Watcher".`,
            emoji: '🕊️',
            iconPath: '/みまもりびと.webp',
            color: 'from-emerald-500 to-teal-600'
        },
        'となりびと': {
            title: 'The Companion (Tonari-bito)',
            description: `Your style is "The Companion".
You cherish the feeling of sharing the same space and time with your Oshi.
Emotions over logic, unity over explanations.
Amidst concert excitement or stream atmosphere, you find ultimate value in "enjoying this very moment together".
Your Oshi isn't distant, but someone looking at the same horizon.
To you who walks closely at this comfortable distance, we grant the title of "The Companion".`,
            emoji: '🔥',
            iconPath: '/となりびと.webp',
            color: 'from-orange-500 to-red-600'
        },
        'あゆみびと': {
            title: 'The Traveler (Ayumi-bito)',
            description: `Your style is "The Traveler".
You feel your Oshi is a close presence living in the very same world.
What is your Oshi thinking and how do they make decisions?
To you who captures these details vividly, your Oshi is an inspiring trailblazer walking slightly ahead of you.
Rather than leaning on their hard work, you strive to walk the challenging path alongside them. To you, we grant the title of "The Traveler".`,
            emoji: '🤝',
            iconPath: '/あゆみびと.webp',
            color: 'from-blue-500 to-cyan-600'
        }
    }
};

export const DIAGNOSIS_RESULTS = DIAGNOSIS_RESULTS_DATA.ja;

export const QUESTIONS_DATA: Record<'ja' | 'zh' | 'en', Question[]> = {
    ja: [
        {
            id: 1,
            text: '推しの一番の魅力はどこにある？',
            type: 'LangNonLang',
            optionA: '考え方や価値観が言動に繋がっているところ',
            optionB: 'その場、その瞬間に生み出される空気感や世界観'
        },
        {
            id: 2,
            text: '推しのライブや歌を聞き終えて、あなたが感動と呼ぶものは何？',
            type: 'LangNonLang',
            optionA: '「こういう表現をしたかったんだな」という理解',
            optionB: '言葉にできない高揚感や余韻'
        },
        {
            id: 3,
            text: '推しとのかかわり方であなたが求めるものは？',
            type: 'WorshipIdent',
            optionA: '人となりや考え方をお互いに知っていく時間',
            optionB: '一緒に同じ感動や瞬間を共有する時間'
        },
        {
            id: 4,
            text: '雑談配信を見ている時、より印象に残るのは？',
            type: 'LangNonLang',
            optionA: '話の流れや考え方が見える瞬間',
            optionB: '間やテンポ、空気感が心地よい瞬間'
        },
        {
            id: 5,
            text: '推しの配信にコメントするときの気持ちに近いのは？',
            type: 'WorshipIdent',
            optionA: '話を邪魔しないよう、そっと反応を添える感覚',
            optionB: '配信の流れを一緒に作っている感覚'
        },
        {
            id: 6,
            text: 'ライブ会場（または配信ライブ）での自分の立ち位置は？',
            type: 'WorshipIdent',
            optionA: '推しの表現を全力で受け取りたい',
            optionB: '会場全体の一体感の一部でいたい'
        },
        {
            id: 7,
            text: '推しについて誰かに語るとしたら？',
            type: 'LangNonLang',
            optionA: 'どんな考え方や信念を持っているかを話したい',
            optionB: 'どんな雰囲気や感情を味わえるかを伝えたい'
        },
        {
            id: 8,
            text: '推しの活動に対して、あなたが一番大切にしている距離感は？',
            type: 'WorshipIdent',
            optionA: '推しが選んだ道を尊重して見届けること',
            optionB: '推しと一緒に進んでいると感じられること'
        }
    ],
    zh: [
        {
            id: 1,
            text: '推最大的魅力在于何处？',
            type: 'LangNonLang',
            optionA: '思考方式与价值观贯穿于一言一行中',
            optionB: '在当下、那瞬间所营造出的氛围与世界观'
        },
        {
            id: 2,
            text: '听完推的演唱会或歌曲后，您所感受到的“感动”是什么？',
            type: 'LangNonLang',
            optionA: '深刻理解到“原来想要展现这样的表达啊”',
            optionB: '难以用言语形容的高扬感与无尽余韵'
        },
        {
            id: 3,
            text: '在与推的相处与联系中，您最追求的是什么？',
            type: 'WorshipIdent',
            optionA: '相互了解彼此人品与想法的时间',
            optionB: '共同分享同一份感动与瞬间的时间'
        },
        {
            id: 4,
            text: '观看杂谈直播时，最让您印象深刻的是？',
            type: 'LangNonLang',
            optionA: '能够看清话题走向与思考方式的瞬间',
            optionB: '停顿、节奏与空气感令人无比舒适的瞬间'
        },
        {
            id: 5,
            text: '在推的直播中发弹幕评论时，最贴近您心境的是？',
            type: 'WorshipIdent',
            optionA: '为了不打扰说话，轻轻附和回应的感觉',
            optionB: '与推一同构建直播氛围的感觉'
        },
        {
            id: 6,
            text: '在 Live 现场（或线上直播）中，您对自己的定位是？',
            type: 'WorshipIdent',
            optionA: '想要全心全意倾听并接纳推的一切表达',
            optionB: '想要成为全场一体感中的一部分'
        },
        {
            id: 7,
            text: '如果要向他人讲述推的魅力，您会倾向于？',
            type: 'LangNonLang',
            optionA: '讲述推拥有怎样的想法与坚定的信念',
            optionB: '传递能感受到怎样的氛围与美妙情绪'
        },
        {
            id: 8,
            text: '对于推的活动，您最珍视的心理距离是？',
            type: 'WorshipIdent',
            optionA: '尊重推所选择的道路并静静见证',
            optionB: '能够真切感受到正与推一同前行'
        }
    ],
    en: [
        {
            id: 1,
            text: "Where does your Oshi's greatest charm lie?",
            type: 'LangNonLang',
            optionA: 'Their mindset and values directly reflect in their actions',
            optionB: 'The atmospheric world created in that specific moment'
        },
        {
            id: 2,
            text: 'After listening to your Oshi live or in song, what do you call "true emotion"?',
            type: 'LangNonLang',
            optionA: 'Understanding "So this is the expression they wanted to deliver"',
            optionB: 'An indescribable exhilaration and lingering resonance'
        },
        {
            id: 3,
            text: 'What do you seek most in your relationship with your Oshi?',
            type: 'WorshipIdent',
            optionA: 'Time spent understanding each other\'s personality and thoughts',
            optionB: 'Time spent sharing the same exact emotions and moments together'
        },
        {
            id: 4,
            text: 'When watching a casual talk stream, what leaves the strongest impression?',
            type: 'LangNonLang',
            optionA: 'Moments where their thought flow and perspective shine through',
            optionB: 'Moments where the pauses, tempo, and cozy air feel comforting'
        },
        {
            id: 5,
            text: 'Which feeling comes closest when commenting on your Oshi\'s stream?',
            type: 'WorshipIdent',
            optionA: 'Gently adding a quiet reaction so as not to interrupt',
            optionB: 'Feeling like you are building the stream atmosphere together'
        },
        {
            id: 6,
            text: 'What is your position at a live concert (or live stream)?',
            type: 'WorshipIdent',
            optionA: 'Wanting to absorb your Oshi\'s performance with all your heart',
            optionB: 'Wanting to be part of the shared unity of the entire venue'
        },
        {
            id: 7,
            text: 'If you were to talk about your Oshi to someone else, what would you say?',
            type: 'LangNonLang',
            optionA: 'Talk about what core beliefs and convictions they hold',
            optionB: 'Convey what atmosphere and emotions one can experience'
        },
        {
            id: 8,
            text: 'What distance do you value most regarding your Oshi\'s activities?',
            type: 'WorshipIdent',
            optionA: 'Respecting and watching over whichever path they choose',
            optionB: 'Feeling that you are moving forward together with your Oshi'
        }
    ]
};

export const QUESTIONS = QUESTIONS_DATA.ja;

interface DiagnosisFlowProps {
    onComplete?: (result: ResultType, answers: Record<number, 'A' | 'B'>) => void;
    embedded?: boolean;
}

export default function DiagnosisFlow({ onComplete, embedded = false }: DiagnosisFlowProps) {
    const { t, locale, translateDynamicText } = useLanguage();
    const currentLocale: 'ja' | 'zh' | 'en' = (locale === 'zh' || locale === 'en') ? locale : 'ja';
    const questions = QUESTIONS_DATA[currentLocale];

    const [step, setStep] = useState<'start' | 'question' | 'result'>('start');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});

    const [scores, setScores] = useState({
        lang: 0,
        nonLang: 0,
        worship: 0,
        ident: 0
    });

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (choice: 'A' | 'B') => {
        const q = currentQuestion;
        const newAnswers = { ...answers, [q.id]: choice };
        setAnswers(newAnswers);

        let newScores = { ...scores };

        if (q.type === 'LangNonLang') {
            if (choice === 'A') newScores.lang += 1;
            else newScores.nonLang += 1;
        } else {
            if (choice === 'A') newScores.worship += 1;
            else newScores.ident += 1;
        }

        if (q.id === 2) {
            if (choice === 'A') newScores.ident += 0.1;
            else newScores.worship += 0.1;
        }

        if (q.id === 3) {
            if (choice === 'A') newScores.lang += 0.1;
            else newScores.nonLang += 0.1;
        }

        setScores(newScores);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setStep('result');
        }
    };

    const getResult = (): ResultType => {
        const isLang = scores.lang > scores.nonLang;
        const isWorship = scores.worship > scores.ident;

        if (!isLang && isWorship) return 'あこがれびと';
        if (isLang && isWorship) return 'みまもりびと';
        if (!isLang && !isWorship) return 'となりびと';
        return 'あゆみびと';
    };

    const result = step === 'result' ? DIAGNOSIS_RESULTS_DATA[currentLocale][getResult()] : null;

    React.useEffect(() => {
        if (step === 'result' && onComplete) {
            onComplete(getResult(), answers);
        }
    }, [step, scores, answers, onComplete]);

    const resetDiagnosis = () => {
        setScores({ lang: 0, nonLang: 0, worship: 0, ident: 0 });
        setCurrentQuestionIndex(0);
        setStep('start');
    };

    return (
        <div className="w-full flex flex-col items-center">

            {/* START SCREEN */}
            {step === 'start' && (
                <div className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-2xl px-4 py-10">
                    <div className="space-y-6">
                        <span className="text-[#c9a64e] font-black tracking-[0.4em] uppercase block drop-shadow-lg">Maison Diagnosis</span>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 text-white text-outline">{t('register.diagnosisTitle')}</h1>
                        <p className="text-xl md:text-3xl text-white/90 leading-relaxed font-serif text-outline opacity-90">
                            {locale === 'zh' ? (
                                <>从您的言语与直觉中，<br />梳理出最理想的心理距离与相处方式。</>
                            ) : locale === 'en' ? (
                                <>Discover your ideal relationship and connection<br />from your own words and intuition.</>
                            ) : (
                                <>あなたの言葉や感覚から、<br />理想の距離感や関わり方を紐解きます。</>
                            )}
                        </p>
                    </div>

                    <button
                        onClick={() => setStep('question')}
                        className="bg-[#c9a64e] text-white px-16 py-6 rounded-2xl font-black text-2xl hover:brightness-110 transition-all shadow-2xl active:scale-95 text-outline"
                    >
                        {locale === 'zh' ? '开始诊断' : locale === 'en' ? 'Start Diagnosis' : '診断を始める'}
                    </button>
                </div>
            )}

            {/* QUESTION SCREEN */}
            {step === 'question' && (
                <div key={currentQuestion.id} className="w-full max-w-3xl space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="text-center space-y-4">
                        <span className="text-[#d4c5b0] font-sans font-black tracking-widest text-sm drop-shadow-md uppercase">Question {currentQuestion.id} / {questions.length}</span>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="bg-[#c9a64e] h-full transition-all duration-700 ease-out shadow-[0_0_10px_#c9a64e]"
                                style={{ width: `${(currentQuestion.id / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-center leading-snug min-h-[160px] flex items-center justify-center text-white text-outline">
                        {translateDynamicText(currentQuestion.text)}
                    </h2>

                    <div className="grid grid-cols-1 gap-6">
                        <button
                            onClick={() => handleAnswer('A')}
                            className="glass-panel p-10 rounded-3xl border-2 border-white/5 hover:border-[#c9a64e]/40 transition-all duration-500 text-left active:scale-[0.98] group"
                        >
                            <span className="text-white text-xl font-bold leading-relaxed block pl-2 group-hover:text-[#c9a64e] transition-colors">
                                {translateDynamicText(currentQuestion.optionA)}
                            </span>
                        </button>

                        <button
                            onClick={() => handleAnswer('B')}
                            className="glass-panel p-10 rounded-3xl border-2 border-white/5 hover:border-[#c9a64e]/40 transition-all duration-500 text-left active:scale-[0.98] group"
                        >
                            <span className="text-white text-xl font-bold leading-relaxed block pl-2 group-hover:text-[#c9a64e] transition-colors">
                                {translateDynamicText(currentQuestion.optionB)}
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* RESULT SCREEN */}
            {step === 'result' && result && (
                <div className="text-center w-full max-w-2xl space-y-12 animate-in zoom-in-95 duration-700">
                    <div className="space-y-6">
                        <p className="text-[#c9a64e] font-sans font-black tracking-widest text-sm uppercase drop-shadow-md">The Conclusion</p>
                        <div className={`w-64 h-64 md:w-[450px] md:h-[450px] mx-auto rounded-full bg-gradient-to-br ${result.color} flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.3)] mb-0 border-[12px] border-white/20 overflow-hidden relative group z-0`}>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {result.iconPath ? (
                                <img src={result.iconPath} alt={result.title} className="w-full h-full object-contain p-4" />
                            ) : (
                                <span className="text-[12rem] md:text-[18rem]">{result.emoji}</span>
                            )}
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white -mt-8 md:-mt-12 relative z-10 text-outline-heavy tracking-wider drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                            {translateDynamicText(result.title)}
                        </h2>
                        <div className="glass-panel p-10 rounded-[3rem] border-white/10 shadow-2xl relative">
                            <div className="absolute -top-4 -left-4 text-4xl opacity-40">📜</div>
                            <div className="absolute -bottom-4 -right-4 text-4xl opacity-40 transform rotate-180">📜</div>
                            <p className="text-white text-lg md:text-xl font-serif leading-loose whitespace-pre-wrap text-justify">
                                {translateDynamicText(result.description)}
                            </p>
                        </div>
                    </div>

                    {!embedded && (
                        <div className="flex flex-col gap-6 pt-10">
                            <button
                                onClick={resetDiagnosis}
                                className="bg-[#c9a64e] text-white px-12 py-5 rounded-2xl font-black text-xl hover:brightness-110 transition-all shadow-2xl active:scale-95 text-outline"
                            >
                                {t('register.redoDiagnosis')}
                            </button>
                            <Link
                                href="/"
                                className="text-[#d4c5b0] hover:text-white font-bold py-2 transition-colors tracking-widest"
                            >
                                ← BACK TO ENTRANCE
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
