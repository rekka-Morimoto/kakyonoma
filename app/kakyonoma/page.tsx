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
        <main className="fixed inset-0 bg-[#3e3b2e] overflow-hidden font-serif">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center pointer-events-none">
                <div className="space-y-1 pointer-events-auto">
                    <Link href="/" className="inline-flex items-center text-stone-400 hover:text-white transition-colors text-sm bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span className="mr-1">←</span> トップへ
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-[0.3em] drop-shadow-lg py-2">
                        かきょの間
                    </h1>
                </div>

                <nav className="flex bg-black/30 backdrop-blur-md p-1 rounded-2xl border border-white/10 pointer-events-auto shadow-2xl mt-4 md:mt-0">
                    <Link href="/registry" className="px-6 py-2 rounded-xl text-stone-300 hover:bg-white/10 hover:text-white transition-all font-sans font-bold">
                        名簿一覧
                    </Link>
                    <div className="px-6 py-2 rounded-xl bg-indigo-600 text-white shadow-lg font-sans font-bold">
                        かきょの間
                    </div>
                </nav>
            </div>

            {/* Subtitle Overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none w-full px-4">
                <p className="text-stone-300/80 max-w-2xl mx-auto italic text-sm md:text-base drop-shadow-md">
                    「畳一枚、一人ひとつ。」<br />
                    入居者数に応じて変化する、安らぎの和室空間。
                </p>
                <div className="mt-4 text-[10px] text-stone-500 tracking-[0.5em] uppercase opacity-50">
                    Kakyo-no-ma Residence
                </div>
            </div>

            {/* Tatami Room Component - Now spans full screen */}
            <TatamiRoom residents={residents} />
        </main>
    );
}
