'use client';

import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore
import TennyuTodoke from './TennyuTodoke';
import { useRouter } from 'next/navigation';
import DiagnosisFlow, { ResultType, DIAGNOSIS_RESULTS } from './DiagnosisFlow';
import { useLanguage } from '../../lib/i18nContext';

export default function RegistrationForm() {
    const { t, locale, translateDynamicText } = useLanguage();
    const [step, setStep] = useState<'form' | 'diagnosis' | 'confirm'>('form');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [xAccount, setXAccount] = useState('');
    const [youtubeAccount, setYoutubeAccount] = useState('');
    const [baseLocation, setBaseLocation] = useState('');
    const [password, setPassword] = useState('');
    const [freeText, setFreeText] = useState('');
    const [image, setImage] = useState<string | null>(null);
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

    const handleFormNext = () => {
        if (!name || !password) {
            alert(locale === 'zh' ? '请填写必填项' : '必須項目を入力してください');
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

        setLoading(true);
        try {
            const res = await fetch('/api/residents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    nickname,
                    xAccount,
                    youtubeAccount,
                    baseLocation,
                    image: image, 
                    icon: image,
                    password: password,
                    building: diagnosisResult,
                    answers: diagnosisAnswers,
                    freeText: freeText,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                const msg = locale === 'zh'
                    ? `入住成功！\n您已入住“${translateDynamicText(diagnosisResult)}栋”的 ${data.roomNumber}号房。`
                    : `入居完了！\nあなたは「${diagnosisResult}棟」の ${data.roomNumber}号室 に入居しました。`;
                alert(msg);
                router.push('/registry');
            } else {
                alert(locale === 'zh' ? '注册失败' : '登録に失敗しました');
            }
        } catch (error) {
            console.error(error);
            alert(locale === 'zh' ? '发生错误' : 'エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center min-h-screen p-4 md:p-8 bg-transparent text-white w-full max-w-7xl mx-auto">
            {/* Main Content Area */}
            <div className="w-full lg:w-[400px] shrink-0 glass-panel p-6 md:p-8 rounded-[2.5rem] transition-all duration-500 border-white/10 shadow-2xl">
                <div className="mb-6 p-4 bg-amber-900/40 border border-[#c9a64e]/30 rounded-2xl text-xs text-[#fcf9f2] leading-relaxed">
                    <p className="font-bold text-[#c9a64e] mb-1">{t('register.noteTitle')}</p>
                    <p>{t('register.noteSelfOnly')}</p>
                    <p>{t('register.noteNoPersonal')}</p>
                </div>
                <h2 className="text-3xl font-black mb-8 text-white text-outline">{t('register.title')}</h2>

                {/* STEP 1: FORM */}
                {step === 'form' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">{t('register.nameLabel')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#c9a64e]/50 outline-none text-white transition-all shadow-inner"
                                placeholder={t('register.namePlaceholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">{t('register.nicknameLabel')}</label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#c9a64e]/50 outline-none text-white transition-all shadow-inner"
                                placeholder={t('register.nicknamePlaceholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">{t('register.xAccountLabel')}</label>
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
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">{t('register.locationLabel')}</label>
                            <select
                                value={baseLocation}
                                onChange={(e) => setBaseLocation(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:border-[#c9a64e]/50 transition outline-none cursor-pointer"
                            >
                                <option value="" className="bg-stone-900">{t('register.selectPlaceholder')}</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc} className="bg-stone-900">{translateDynamicText(loc)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">{t('register.youtubeLabel')}</label>
                            <input
                                type="text"
                                value={youtubeAccount}
                                onChange={(e) => setYoutubeAccount(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:border-[#c9a64e]/50 transition outline-none"
                                placeholder={t('register.optional')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">
                                {t('register.passwordLabel')} <span className="text-[#a84032]">*</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                maxLength={8}
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:border-[#c9a64e]/50 transition outline-none font-mono"
                                placeholder={t('register.passwordPlaceholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-[#d4c5b0] uppercase tracking-wider">{t('register.freeTextLabel')}</label>
                            <textarea
                                value={freeText}
                                onChange={(e) => setFreeText(e.target.value)}
                                maxLength={200}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:border-[#c9a64e]/50 transition outline-none resize-none"
                                placeholder={t('register.freeTextPlaceholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-4 text-center text-[#d4c5b0] uppercase tracking-widest">{t('register.uploadIcon')}</label>
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
                            disabled={!name || !password}
                            className={`w-full py-4 rounded-2xl font-black text-xl text-white transition-all shadow-2xl text-outline ${!name || !password ? 'bg-white/5 cursor-not-allowed text-white/20' : 'bg-[#c9a64e] hover:brightness-110 active:scale-95'}`}
                        >
                            {t('register.nextButton')}
                        </button>
                    </div>
                )}

                {/* STEP 2: DIAGNOSIS */}
                {step === 'diagnosis' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="mb-6">
                            <button onClick={() => setStep('form')} className="text-sm text-[#d4c5b0] hover:text-white transition-colors">← {t('register.backToForm')}</button>
                        </div>
                        <h3 className="text-2xl font-black mb-4 text-white text-outline">{t('register.diagnosisTitle')}</h3>
                        <p className="text-base text-[#d4c5b0] mb-8 leading-relaxed">{t('register.diagnosisDesc')}</p>

                        <div className="bg-black/20 p-6 rounded-3xl border border-white/5 shadow-inner">
                            <DiagnosisFlow onComplete={handleDiagnosisComplete} embedded={true} />
                        </div>
                    </div>
                )}

                {/* STEP 3: CONFIRM */}
                {step === 'confirm' && diagnosisResult && (
                    <div className="space-y-10 animate-in zoom-in-95 duration-300 text-center">
                        <div>
                            <h3 className="text-2xl font-black text-white text-outline">{t('register.resultTitle')}</h3>
                            <div className={`mt-6 w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${DIAGNOSIS_RESULTS[diagnosisResult].color} flex items-center justify-center p-4 shadow-2xl border-4 border-white/20 overflow-hidden relative`}>
                                {DIAGNOSIS_RESULTS[diagnosisResult].iconPath ? (
                                    <img 
                                        src={DIAGNOSIS_RESULTS[diagnosisResult].iconPath} 
                                        alt={diagnosisResult} 
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span className="text-6xl">{DIAGNOSIS_RESULTS[diagnosisResult].emoji}</span>
                                )}
                            </div>
                            <h4 className="text-4xl font-black mt-6 text-white text-outline">{translateDynamicText(diagnosisResult)}</h4>
                            <p className="text-[#d4c5b0] mt-4 text-base leading-relaxed px-4 whitespace-pre-wrap drop-shadow-md">
                                {translateDynamicText(DIAGNOSIS_RESULTS[diagnosisResult].description)}
                            </p>
                            <p className="text-[#c9a64e] text-sm mt-6 font-bold tracking-widest leading-loose">
                                {locale === 'zh' ? (
                                    <>恭喜您！<br />您将入住<span className="text-white text-lg">“{translateDynamicText(diagnosisResult)}栋”</span>。</>
                                ) : (
                                    <>おめでとうございます。<br />あなたは<span className="text-white text-lg">「{diagnosisResult}棟」</span>に入居します。</>
                                )}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full py-5 rounded-2xl font-black text-white text-2xl shadow-2xl transition-all text-outline active:scale-95 ${loading ? 'bg-white/5' : 'bg-[#c9a64e] hover:brightness-110'}`}
                            >
                                {loading ? (locale === 'zh' ? '准备中...' : '準備中...') : t('register.submitButton')}
                            </button>

                            <button onClick={() => setStep('diagnosis')} className="text-sm text-[#d4c5b0] hover:text-white transition-colors underline decoration-[#d4c5b0]">
                                {t('register.redoDiagnosis')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Section */}
            <div className="flex-1 w-full max-w-full lg:max-w-none flex justify-center bg-black/30 p-2 md:p-6 border border-white/5 rounded-[3rem] shadow-2xl backdrop-blur-sm overflow-hidden min-h-[400px]">
                <div className="w-full h-full flex justify-center items-center">
                    <TennyuTodoke
                        name={name}
                        nickname={nickname}
                        xAccount={xAccount}
                        youtubeAccount={youtubeAccount}
                        baseLocation={baseLocation}
                        roomNumber={previewRoomNumber}
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
