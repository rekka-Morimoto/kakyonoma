'use client';

import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore
import TennyuTodoke from './TennyuTodoke';
import { useRouter } from 'next/navigation';
import DiagnosisFlow, { ResultType, DIAGNOSIS_RESULTS } from './DiagnosisFlow';

export default function RegistrationForm() {
    const [step, setStep] = useState<'form' | 'diagnosis' | 'confirm'>('form');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickname, setNickname] = useState('');
    const [xAccount, setXAccount] = useState('');
    const [youtubeAccount, setYoutubeAccount] = useState('');
    const [baseLocation, setBaseLocation] = useState('');
    const [password, setPassword] = useState('');
    const [freeText, setFreeText] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<string[]>([]);
    const [previewRoomNumber, setPreviewRoomNumber] = useState(1);
    const [residentCount, setResidentCount] = useState(0);

    // Diagnosis Result
    const [diagnosisResult, setDiagnosisResult] = useState<ResultType | null>(null);
    const [diagnosisAnswers, setDiagnosisAnswers] = useState<Record<number, 'A' | 'B'> | null>(null);

    const router = useRouter();

    useEffect(() => {
        const initForm = async () => {
            try {
                const [locRes, resRes] = await Promise.all([
                    fetch('/api/locations'),
                    fetch('/api/residents')
                ]);

                const locs = await locRes.json();
                if (Array.isArray(locs)) setLocations(locs);

                const residents = await resRes.json();
                if (Array.isArray(residents)) {
                    setResidentCount(residents.length);
                }
            } catch (err) {
                console.error('Failed to initialize form:', err);
            }
        };

        initForm();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        // 1. ブラウザ上であることを確認する（サーバーでの実行を防止）
        if (typeof window === 'undefined') return null;

        // 2. 実行される瞬間にだけライブラリを読み込む
        const domtoimage = (await import('dom-to-image-more')).default;

        const element = document.getElementById('tennyu-todoke');
        if (element) {
            setLoading(true);
            try {
                const dataUrl = await domtoimage.toPng(element, {
                    quality: 0.95,
                    bgcolor: '#ffffff',
                    style: {
                        transform: 'scale(1)',
                        transformOrigin: 'top left'
                    }
                });
                setGeneratedImage(dataUrl);
                return dataUrl;
            } catch (error) {
                console.error('Image Generation Error:', error);
                alert('画像の生成に失敗しました: ' + (error instanceof Error ? error.message : 'Unknown error'));
                return null;
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFormNext = () => {
        if (!firstName || !lastName || !password) {
            alert('必須項目を入力してください');
            return;
        }
        setStep('diagnosis');
    };

    const handleDiagnosisComplete = (result: ResultType, answers: Record<number, 'A' | 'B'>) => {
        setDiagnosisResult(result);
        setDiagnosisAnswers(answers);
        setStep('confirm');
    };

    const handleSubmit = async () => {
        if (!diagnosisResult) return;

        let finalImage = generatedImage;
        if (!finalImage) {
            finalImage = (await handleGenerate()) || '';
        }

        if (!finalImage) return;

        setLoading(true);
        try {
            const res = await fetch('/api/residents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    name: `${lastName} ${firstName}`,
                    nickname,
                    xAccount,
                    youtubeAccount,
                    baseLocation,
                    image: finalImage,
                    icon: image,
                    password: password,
                    building: diagnosisResult,
                    answers: diagnosisAnswers,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                alert(`入居完了！\nあなたは「${diagnosisResult}棟」の ${data.roomNumber}号室 に入居しました。`);
                router.push('/registry');
            } else {
                alert('登録に失敗しました');
            }
        } catch (error) {
            console.error(error);
            alert('エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center min-h-screen p-8 bg-transparent text-white">
            {/* Main Content Area */}
            <div className="w-full lg:w-1/3 glass-panel p-8 rounded-[2.5rem] transition-all duration-500 border-white/10 shadow-2xl">
                <h2 className="text-3xl font-black mb-8 text-white text-outline">入居手続き</h2>

                {/* STEP 1: FORM */}
                {step === 'form' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">姓 (Sei)</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#c9a64e]/50 outline-none text-white transition-all shadow-inner"
                                    placeholder="例: 山田"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">名 (Mei)</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#c9a64e]/50 outline-none text-white transition-all shadow-inner"
                                    placeholder="例: 太郎"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">呼び方 (Nickname)</label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#c9a64e]/50 outline-none text-white transition-all shadow-inner"
                                placeholder="例: やまちゃん"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">X (旧Twitter) ID</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold select-none">@</span>
                                <input
                                    type="text"
                                    value={xAccount}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/^@/, '');
                                        setXAccount(value);
                                    }}
                                    className="w-full p-3 pl-8 bg-black/40 border border-white/10 rounded-xl focus:border-[#c9a64e]/50 outline-none text-white transition-all shadow-inner"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">本拠地</label>
                            <select
                                value={baseLocation}
                                onChange={(e) => setBaseLocation(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:border-[#c9a64e]/50 transition outline-none cursor-pointer"
                            >
                                <option value="" className="bg-stone-900">選択してください</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc} className="bg-stone-900">{loc}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">YouTube チャンネル名</label>
                            <input
                                type="text"
                                value={youtubeAccount}
                                onChange={(e) => setYoutubeAccount(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:border-[#c9a64e]/50 transition outline-none"
                                placeholder="例: @YourChannel"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">
                                削除用パスワード <span className="text-[#a84032]">*</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                maxLength={8}
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:border-[#c9a64e]/50 transition outline-none font-mono"
                                placeholder="数字や英字"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">自由記載欄</label>
                            <textarea
                                value={freeText}
                                onChange={(e) => setFreeText(e.target.value)}
                                maxLength={200}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:border-[#c9a64e]/50 transition outline-none resize-none"
                                placeholder="自己紹介やきょーちゃんへのメッセージなど"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-4 text-center text-[#d4c5b0] uppercase tracking-widest">アイコンをアップロード</label>
                            <div className="flex flex-col items-center">
                                <label className="cursor-pointer group">
                                    <div className="w-40 h-40 rounded-full border-2 border-dashed border-white/20 group-hover:border-[#c9a64e]/50 flex flex-col items-center justify-center transition overflow-hidden bg-white/5 shadow-inner">
                                        {image ? (
                                            <img src={image} alt="Upload Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center">
                                                <span className="text-5xl opacity-30">📸</span>
                                                <p className="text-[10px] text-white/40 mt-2 font-bold tracking-tighter">U P L O A D</p>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleFormNext}
                            disabled={!firstName || !lastName || !password}
                            className={`w-full py-4 rounded-2xl font-black text-xl text-white transition-all shadow-2xl text-outline ${!firstName || !lastName || !password ? 'bg-white/5 cursor-not-allowed text-white/20' : 'bg-[#c9a64e] hover:brightness-110 active:scale-95'}`}
                        >
                            次へ（入居審査）
                        </button>
                    </div>
                )}

                {/* STEP 2: DIAGNOSIS */}
                {step === 'diagnosis' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="mb-6">
                            <button onClick={() => setStep('form')} className="text-sm text-[#d4c5b0] hover:text-white transition-colors">← フォームに戻る</button>
                        </div>
                        <h3 className="text-2xl font-black mb-4 text-white text-outline">推しタイプ診断</h3>
                        <p className="text-base text-[#d4c5b0] mb-8 leading-relaxed">あなたのタイプに合わせて入居する棟を決定します。</p>

                        <div className="bg-black/20 p-6 rounded-3xl border border-white/5 shadow-inner">
                            <DiagnosisFlow onComplete={handleDiagnosisComplete} embedded={true} />
                        </div>
                    </div>
                )}

                {/* STEP 3: CONFIRM */}
                {step === 'confirm' && diagnosisResult && (
                    <div className="space-y-10 animate-in zoom-in-95 duration-300 text-center">
                        <div>
                            <h3 className="text-2xl font-black text-white text-outline">診断結果</h3>
                            <div className={`mt-6 w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${DIAGNOSIS_RESULTS[diagnosisResult].color} flex items-center justify-center text-5xl shadow-2xl border-4 border-white/20`}>
                                {DIAGNOSIS_RESULTS[diagnosisResult].emoji}
                            </div>
                            <h4 className="text-4xl font-black mt-6 text-white text-outline">{diagnosisResult}</h4>
                            <p className="text-[#d4c5b0] mt-4 text-base leading-relaxed px-4 whitespace-pre-wrap drop-shadow-md">
                                {DIAGNOSIS_RESULTS[diagnosisResult].description}
                            </p>
                            <p className="text-[#c9a64e] text-sm mt-6 font-bold tracking-widest leading-loose">
                                おめでとうございます。<br />あなたは<span className="text-white text-lg">「{diagnosisResult}棟」</span>に入居します。
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full py-5 rounded-2xl font-black text-white text-2xl shadow-2xl transition-all text-outline active:scale-95 ${loading ? 'bg-white/5' : 'bg-[#c9a64e] hover:brightness-110'}`}
                            >
                                {loading ? '準備中...' : '決定して入居する'}
                            </button>

                            <button onClick={() => setStep('diagnosis')} className="text-sm text-[#d4c5b0] hover:text-white transition-colors underline decoration-[#d4c5b0]">
                                診断をやり直す
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Section */}
            <div className="w-full lg:w-auto overflow-auto flex justify-center bg-black/30 p-10 border border-white/5 rounded-[3rem] shadow-2xl backdrop-blur-sm">
                <div className="scale-[0.55] sm:scale-[0.7] md:scale-90 lg:scale-100 transition-transform origin-top">
                    <TennyuTodoke
                        name={`${lastName} ${firstName}`}
                        firstName={firstName}
                        lastName={lastName}
                        nickname={nickname}
                        xAccount={xAccount}
                        youtubeAccount={youtubeAccount}
                        baseLocation={baseLocation}
                        roomNumber={previewRoomNumber} // This is likely inaccurate until building is decided, maybe show '?'
                        image={image || ''}
                        freeText={freeText}
                        residentId={residentCount + 1}
                        captureMode={true}
                    />
                </div>
            </div>
        </div>
    );
}
