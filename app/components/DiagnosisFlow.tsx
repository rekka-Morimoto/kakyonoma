'use client';
import React, { useState } from 'react';
import Link from 'next/link';

// --- Types ---
export type ResultType =
    | 'あこがれびと' // NL & Worship
    | 'みまもりびと' // Lang & Worship
    | 'となりびと'   // NL & Ident
    | 'あゆみびと';  // Lang & Ident

type QuestionType = 'LangNonLang' | 'WorshipIdent';

interface Question {
    id: number;
    text: string;
    type: QuestionType;
    optionA: string;
    optionB: string;
}

export const DIAGNOSIS_RESULTS: Record<ResultType, { title: string; description: string; emoji: string; color: string }> = {
    'あこがれびと': {
        title: 'あこがれびと',
        description: `あなたのタイプは「あこがれびと」です。
あなたにとって推しは、手の届かない場所で輝く特別な存在。
言葉にしきれない表現や、その場にしか生まれない空気感に心を奪われ、ただそこに在る姿を受け取ること自体が喜びになります。
すべてを理解しなくてもいい、近づかなくてもいい。
遠くから見上げるその背中が、日常を少しだけ明るく照らしてくれる。
そんな純粋な憧れを大切にするあなたに、「あこがれびと」の名前を授けます。`,
        emoji: '✨',
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
        color: 'from-blue-500 to-cyan-600'
    }
};

export const QUESTIONS: Question[] = [
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
];

interface DiagnosisFlowProps {
    onComplete?: (result: ResultType, answers: Record<number, 'A' | 'B'>) => void;
    embedded?: boolean; // If true, hide restart buttons or adjust padding
}

export default function DiagnosisFlow({ onComplete, embedded = false }: DiagnosisFlowProps) {
    const [step, setStep] = useState<'start' | 'question' | 'result'>('start');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});

    // Scores
    const [scores, setScores] = useState({
        lang: 0,
        nonLang: 0,
        worship: 0,
        ident: 0
    });

    const currentQuestion = QUESTIONS[currentQuestionIndex];

    const handleAnswer = (choice: 'A' | 'B') => {
        const q = currentQuestion;

        // Record Answer
        const newAnswers = { ...answers, [q.id]: choice };
        setAnswers(newAnswers);

        let newScores = { ...scores };

        // Base Logic
        if (q.type === 'LangNonLang') {
            if (choice === 'A') newScores.lang += 1;
            else newScores.nonLang += 1;
        } else {
            if (choice === 'A') newScores.worship += 1;
            else newScores.ident += 1;
        }

        // Special Rules
        if (q.id === 2) {
            if (choice === 'A') newScores.ident += 0.1;
            else newScores.worship += 0.1;
        }

        if (q.id === 3) {
            if (choice === 'A') newScores.lang += 0.1;
            else newScores.nonLang += 0.1;
        }

        setScores(newScores);

        // Next Question or Result
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setStep('result');
            // Determining result here to pass it immediately if needed, 
            // but usually we wait for render. 
            // However, since state update is async, we should calculate again for callback if needed immediately.
            // But let's just wait for step change effectively.
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

    const result = step === 'result' ? DIAGNOSIS_RESULTS[getResult()] : null;

    // Effect to trigger onComplete when result is reached
    React.useEffect(() => {
        if (step === 'result' && onComplete) {
            onComplete(getResult(), answers);
        }
    }, [step, scores, answers, onComplete]); // answers added to dep

    const resetDiagnosis = () => {
        setScores({ lang: 0, nonLang: 0, worship: 0, ident: 0 });
        setCurrentQuestionIndex(0);
        setStep('start');
    };

    return (
        <div className="w-full flex flex-col items-center">

            {/* START SCREEN */}
            {step === 'start' && (
                <div className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-2xl">
                    <div className="space-y-4">
                        <span className="text-stone-400 font-bold tracking-[0.3em] uppercase block">Diagnosis</span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">推しスタイル診断</h1>
                        <p className="text-xl text-stone-500 leading-relaxed font-sans">
                            あなたの言葉や感覚から、<br />
                            推しとの理想の距離感や関わり方を紐解きます。
                        </p>
                    </div>

                    <button
                        onClick={() => setStep('question')}
                        className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-stone-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 font-sans"
                    >
                        診断を始める
                    </button>
                </div>
            )}

            {/* QUESTION SCREEN */}
            {step === 'question' && (
                <div key={currentQuestion.id} className="w-full max-w-2xl space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="text-center space-y-2">
                        <span className="text-stone-400 font-sans font-bold tracking-widest text-sm">QUESTION {currentQuestion.id} / {QUESTIONS.length}</span>
                        <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                            <div
                                className="bg-stone-800 h-full transition-all duration-500 ease-out"
                                style={{ width: `${(currentQuestion.id / QUESTIONS.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-bold text-center leading-snug min-h-[120px] flex items-center justify-center">
                        {currentQuestion.text}
                    </h2>

                    <div className="grid grid-cols-1 gap-6 font-sans">
                        <button
                            onClick={() => handleAnswer('A')}
                            className="group relative bg-white p-8 rounded-2xl border-2 border-stone-100 shadow-md hover:border-stone-400 hover:shadow-xl transition-all duration-300 text-left"
                        >
                            <span className="absolute top-4 left-4 text-xs font-bold text-stone-300 group-hover:text-stone-500 transition-colors">A</span>
                            <span className="text-lg font-bold text-stone-700 group-hover:text-stone-900 block pl-6">
                                {currentQuestion.optionA}
                            </span>
                        </button>

                        <button
                            onClick={() => handleAnswer('B')}
                            className="group relative bg-white p-8 rounded-2xl border-2 border-stone-100 shadow-md hover:border-stone-400 hover:shadow-xl transition-all duration-300 text-left"
                        >
                            <span className="absolute top-4 left-4 text-xs font-bold text-stone-300 group-hover:text-stone-500 transition-colors">B</span>
                            <span className="text-lg font-bold text-stone-700 group-hover:text-stone-900 block pl-6">
                                {currentQuestion.optionB}
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* RESULT SCREEN */}
            {step === 'result' && result && (
                <div className="text-center w-full max-w-lg space-y-10 animate-in zoom-in-95 duration-700">
                    <div className="space-y-2">
                        <p className="text-stone-400 font-sans font-bold tracking-widest text-sm uppercase">Your Style</p>
                        <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${result.color} flex items-center justify-center text-6xl shadow-2xl mb-6`}>
                            {result.emoji}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-6">
                            {result.title}
                        </h2>
                        <p className="text-stone-600 font-sans leading-loose text-lg text-justify bg-white p-8 rounded-3xl shadow-lg border border-stone-100 whitespace-pre-wrap">
                            {result.description}
                        </p>
                    </div>

                    {!embedded && (
                        <div className="flex flex-col gap-4 font-sans">
                            <button
                                onClick={resetDiagnosis}
                                className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold hover:bg-stone-800 transition-all shadow-lg hover:-translate-y-1"
                            >
                                もう一度診断する
                            </button>
                            <Link
                                href="/"
                                className="text-stone-500 hover:text-stone-800 font-bold py-2 transition-colors"
                            >
                                トップへ戻る
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
