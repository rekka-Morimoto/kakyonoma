'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TatamiRoom from '../components/TatamiRoom';

interface Resident {
    id: number;
    name: string;
    icon: string;
    image: string;
    roomNumber: number;
    building?: string;
}

export default function KakyoNoMa() {
    const [residents, setResidents] = useState<Resident[]>([]);

    useEffect(() => {
        fetch('/api/residents')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setResidents(data);
                }
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <main className="min-h-screen bg-stone-200 pb-20 font-serif">
            <div className="max-w-7xl mx-auto px-4 pt-12">
                {/* Navigation and Title */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                    <div className="space-y-2">
                        <Link href="/" className="text-stone-500 hover:text-indigo-600 transition-colors text-sm">
                            ← トップへ戻る
                        </Link>
                        <h1 className="text-5xl font-bold text-stone-800 tracking-widest">
                            かきょの間
                        </h1>
                    </div>

                    <nav className="flex bg-stone-100 p-1 rounded-xl shadow-md border border-stone-300">
                        <Link href="/registry" className="px-6 py-2 rounded-lg text-stone-500 hover:bg-white hover:text-stone-800 transition-all font-sans font-bold">
                            名簿一覧
                        </Link>
                        <div className="px-6 py-2 rounded-lg bg-indigo-600 text-white shadow-lg font-sans font-bold">
                            かきょの間
                        </div>
                    </nav>
                </div>

                {/* Subtitle */}
                <div className="text-center mb-8">
                    <p className="text-stone-600 max-w-2xl mx-auto italic">
                        「畳一枚、一人ひとつ。」<br />
                        入居者数に応じて変化する、安らぎの和室空間。
                    </p>
                </div>

                {/* Tatami Room Component */}
                <TatamiRoom residents={residents} />
            </div>

            {/* Footer decoration */}
            <div className="mt-12 text-center text-stone-400 text-xs">
                <p>畳の香りが漂う、住まいの居間。</p>
            </div>
        </main>
    );
}
