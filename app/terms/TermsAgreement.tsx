'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TermsAgreement() {
    const [agreed, setAgreed] = useState(false);
    const router = useRouter();

    const handleProceed = () => {
        if (agreed) {
            sessionStorage.setItem('termsAgreed', 'true');
            router.push('/home');
        }
    };

    return (
        <div className="pt-10 border-t border-white/10 flex flex-col items-center space-y-8">
            <label className="flex items-center gap-6 cursor-pointer group glass-panel px-10 py-6 rounded-3xl border-white/5 hover:border-[#c9a64e]/30 transition-all shadow-xl">
                <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-8 h-8 accent-[#c9a64e] cursor-pointer"
                />
                <span className="text-xl md:text-2xl font-black text-white text-outline tracking-wider">
                    内容を理解し、同意します
                </span>
            </label>

            <button
                onClick={handleProceed}
                disabled={!agreed}
                className={`px-16 py-6 rounded-2xl font-black text-2xl transition-all shadow-2xl text-outline active:scale-95 ${agreed
                        ? 'bg-[#c9a64e] text-white hover:brightness-110'
                        : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                    }`}
            >
                同意して進む
            </button>
        </div>
    );
}
