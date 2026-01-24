'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DiagnosisFlow, { QUESTIONS } from '../components/DiagnosisFlow';

interface DailyStats {
    [questionId: string]: {
        A: number;
        B: number;
    };
}

interface StatsData {
    [date: string]: DailyStats;
}

export default function DiagnosisPage() {
    const [stats, setStats] = useState<DailyStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    // Admin State
    const [adminPassword, setAdminPassword] = useState('');
    const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [adminMsg, setAdminMsg] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats');
            const data: StatsData = await res.json();

            // Aggregate all dates
            const aggregated: DailyStats = {};
            Object.values(data).forEach(daily => {
                Object.entries(daily).forEach(([qId, counts]) => {
                    if (!aggregated[qId]) aggregated[qId] = { A: 0, B: 0 };
                    aggregated[qId].A += counts.A;
                    aggregated[qId].B += counts.B;
                });
            });
            setStats(aggregated);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingStats(false);
        }
    };

    const handleClearStats = async () => {
        if (!confirm(`${targetDate} の統計データを削除しますか？`)) return;

        try {
            const res = await fetch('/api/stats', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: targetDate, password: adminPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setAdminMsg(data.message);
                fetchStats(); // Refresh
            } else {
                setAdminMsg(`Error: ${data.error}`);
            }
        } catch (e) {
            setAdminMsg('Failed to connect');
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-serif flex flex-col">
            {/* Header */}
            <header className="p-6">
                <Link href="/" className="text-stone-400 font-bold tracking-widest hover:text-stone-600 transition-colors">
                    ← KAKYO-NO-MA
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center p-6 w-full space-y-20 pb-40">
                <DiagnosisFlow />

                {/* Statistics Section */}
                <section className="w-full max-w-4xl border-t border-dashed border-stone-300 pt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-black text-stone-800 tracking-wider uppercase mb-2">Diagnosis Statistics</h2>
                        <p className="text-stone-500 font-sans">入居者の回答傾向</p>
                    </div>

                    {loadingStats ? (
                        <p className="text-center text-stone-400">Loading Stats...</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-12">
                            {QUESTIONS.map(q => {
                                const qStats = stats?.[q.id] || { A: 0, B: 0 };
                                const total = qStats.A + qStats.B;
                                const percentA = total === 0 ? 0 : Math.round((qStats.A / total) * 100);
                                const percentB = total === 0 ? 0 : Math.round((qStats.B / total) * 100);

                                return (
                                    <div key={q.id} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 font-sans">
                                        <div className="flex justify-between items-baseline mb-4">
                                            <span className="text-xs font-bold text-stone-400 tracking-widest">Q{q.id}</span>
                                            <span className="text-xs font-bold text-stone-400">{total} Answers</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-stone-800 mb-6">{q.text}</h3>

                                        <div className="space-y-4">
                                            <div className="relative h-12 bg-stone-100 rounded-full overflow-hidden flex text-xs font-bold text-white">
                                                <div
                                                    className="bg-stone-800 flex items-center pl-4 transition-all duration-1000"
                                                    style={{ width: `${percentA}%` }}
                                                >
                                                    {percentA > 10 && `${percentA}%`}
                                                </div>
                                                <div
                                                    className="bg-stone-400 flex items-center justify-end pr-4 transition-all duration-1000 ml-auto"
                                                    style={{ width: `${percentB}%` }}
                                                >
                                                    {percentB > 10 && `${percentB}%`}
                                                </div>
                                            </div>

                                            <div className="flex justify-between text-sm text-stone-600 px-2 gap-4">
                                                <div className="flex-1">
                                                    <span className="font-bold mr-2 text-stone-800">A</span>
                                                    {q.optionA}
                                                </div>
                                                <div className="flex-1 text-right">
                                                    {q.optionB}
                                                    <span className="font-bold ml-2 text-stone-400">B</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Admin Section */}
                <section className="w-full max-w-lg pt-12">
                    <button
                        onClick={() => setIsAdminOpen(!isAdminOpen)}
                        className="text-stone-300 text-xs hover:text-stone-500 transition-colors mx-auto block mb-4"
                    >
                        {isAdminOpen ? 'Close Admin' : 'Admin Area'}
                    </button>

                    {isAdminOpen && (
                        <div className="bg-stone-100 p-8 rounded-2xl border border-stone-200 font-sans animate-in fade-in slide-in-from-bottom-2">
                            <h4 className="font-bold text-stone-700 mb-4">Clear Daily Stats</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 mb-1">Target Date</label>
                                    <input
                                        type="date"
                                        value={targetDate}
                                        onChange={e => setTargetDate(e.target.value)}
                                        className="w-full p-2 rounded border border-stone-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={adminPassword}
                                        onChange={e => setAdminPassword(e.target.value)}
                                        className="w-full p-2 rounded border border-stone-300"
                                    />
                                </div>
                                <button
                                    onClick={handleClearStats}
                                    className="w-full bg-red-500 text-white font-bold py-2 rounded hover:bg-red-600 transition-colors"
                                >
                                    Clear Data
                                </button>
                                {adminMsg && <p className="text-center text-sm font-bold mt-2">{adminMsg}</p>}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
