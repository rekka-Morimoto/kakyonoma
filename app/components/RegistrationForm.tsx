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
        // @ts-ignore
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
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center min-h-screen p-8 bg-gray-100 text-gray-900">
            {/* Main Content Area */}
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-lg transition-all duration-500">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">入居手続き</h2>

                {/* STEP 1: FORM */}
                {step === 'form' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">姓 (Sei)</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                                    placeholder="例: 山田"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">名 (Mei)</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                                    placeholder="例: 太郎"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">呼び方 (Nickname)</label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                                placeholder="例: やまちゃん"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">X (旧Twitter) ID</label>
                            <input
                                type="text"
                                value={xAccount}
                                onChange={(e) => setXAccount(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                                placeholder="@username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">本拠地</label>
                            <select
                                value={baseLocation}
                                onChange={(e) => setBaseLocation(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition outline-none text-gray-800 bg-white"
                            >
                                <option value="">選択してください</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">YouTube チャンネル名</label>
                            <input
                                type="text"
                                value={youtubeAccount}
                                onChange={(e) => setYoutubeAccount(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition outline-none text-gray-800"
                                placeholder="例: @YourChannel"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                削除用パスワード <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                maxLength={8}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition outline-none text-gray-800 bg-stone-50"
                                placeholder="数字や英字で自由に設定"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">自由記載欄</label>
                            <textarea
                                value={freeText}
                                onChange={(e) => setFreeText(e.target.value)}
                                maxLength={200}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition outline-none text-gray-800 resize-none"
                                placeholder="自己紹介や一言メッセージなど（200文字まで）"
                            />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4 text-center">アイコン画像をアップロード</label>
                                <div className="flex flex-col items-center space-y-4">
                                    <label className="cursor-pointer group">
                                        <div className="w-40 h-40 rounded-full border-4 border-dashed border-stone-300 group-hover:border-indigo-400 flex flex-col items-center justify-center transition overflow-hidden bg-stone-50 shadow-inner">
                                            {image ? (
                                                <img src={image} alt="Upload Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center">
                                                    <span className="text-4xl">📸</span>
                                                    <p className="text-xs text-stone-400 mt-1">Click to Upload</p>
                                                </div>
                                            )}
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleFormNext}
                            disabled={!firstName || !lastName || !password}
                            className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${!firstName || !lastName ? 'bg-gray-400 cursor-not-allowed' : 'bg-stone-800 hover:bg-stone-900'}`}
                        >
                            次へ（入居審査）
                        </button>
                    </div>
                )}

                {/* STEP 2: DIAGNOSIS */}
                {step === 'diagnosis' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="mb-4">
                            <button onClick={() => setStep('form')} className="text-sm text-stone-500 hover:underline">← フォームに戻る</button>
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-stone-800">入居審査：推しタイプ診断</h3>
                        <p className="text-sm text-stone-500 mb-6">あなたのタイプに合わせて入居する棟（あこがれびと・みまもりびと・となりびと・あゆみびと）を決定します。</p>

                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                            <DiagnosisFlow onComplete={handleDiagnosisComplete} embedded={true} />
                        </div>
                    </div>
                )}

                {/* STEP 3: CONFIRM */}
                {step === 'confirm' && diagnosisResult && (
                    <div className="space-y-8 animate-in zoom-in-95 duration-300 text-center">
                        <div>
                            <h3 className="text-xl font-bold text-stone-800">診断結果</h3>
                            <div className={`mt-4 w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${DIAGNOSIS_RESULTS[diagnosisResult].color} flex items-center justify-center text-4xl shadow-xl`}>
                                {DIAGNOSIS_RESULTS[diagnosisResult].emoji}
                            </div>
                            <h4 className="text-2xl font-black mt-4 text-stone-900">{diagnosisResult}</h4>
                            <p className="text-stone-600 mt-2 text-sm leading-relaxed px-4 whitespace-pre-wrap">
                                {DIAGNOSIS_RESULTS[diagnosisResult].description}
                            </p>
                            <p className="text-stone-500 text-xs mt-4">
                                あなたは<span className="font-bold text-stone-800">「{diagnosisResult}棟」</span>に入居します。
                            </p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full py-4 rounded-lg font-bold text-white text-xl shadow-lg transition-colors ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800'}`}
                        >
                            {loading ? '入居手続き中...' : '決定して入居する'}
                        </button>

                        <button onClick={() => setStep('diagnosis')} className="text-sm text-stone-400 underline">
                            診断をやり直す
                        </button>
                    </div>
                )}
            </div>

            {/* Preview Section */}
            <div className="w-full lg:w-auto overflow-auto flex justify-center bg-gray-200 p-8 border border-gray-300 rounded-xl shadow-inner">
                <div className="scale-[0.6] origin-top md:scale-95 lg:scale-100 transition-transform">
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
