'use client';

import React from 'react';
import { useLanguage } from '../lib/i18nContext';

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-[999] flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-xl transition-all hover:border-[#c9a64e]/50">
      <button
        onClick={() => setLocale('ja')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          locale === 'ja'
            ? 'bg-[#c9a64e] text-black shadow-md'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        日本語
      </button>
      <button
        onClick={() => setLocale('zh')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          locale === 'zh'
            ? 'bg-[#c9a64e] text-black shadow-md'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        简体中文
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          locale === 'en'
            ? 'bg-[#c9a64e] text-black shadow-md'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        English
      </button>
    </div>
  );
}
