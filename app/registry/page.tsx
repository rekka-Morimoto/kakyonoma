'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import TennyuTodoke from '../components/TennyuTodoke';
// Dynamic import will be handled in handleViewCertificate
import { BUILDING_STYLES, getBuildingStyle } from '../utils/buildingConstants';

interface Resident {
    id: number;
    name: string;
    firstName?: string;
    lastName?: string;
    nickname?: string;
    xAccount?: string;
    youtubeAccount?: string;
    baseLocation?: string;
    image?: string; // This is the old card image
    icon?: string;  // This is the original avatar
    roomNumber: number;
    building?: string;
}

export default function Registry() {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
    const [loading, setLoading] = useState(true);

    // View/Generate State
    const [viewingId, setViewingId] = useState<number | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Filter State
    const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

    // Admin State
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [showAdminInput, setShowAdminInput] = useState(false);

    // Deletion State
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deletePassword, setDeletePassword] = useState('');
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    useEffect(() => {
        fetchResidents();
    }, []);

    useEffect(() => {
        if (selectedBuilding) {
            setFilteredResidents(residents.filter(r => r.building === selectedBuilding));
        } else {
            setFilteredResidents(residents);
        }
    }, [selectedBuilding, residents]);

    const fetchResidents = async () => {
        try {
            const response = await fetch('/api/residents');
            const data = await response.json();
            setResidents(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLogin = () => {
        if (adminPassword === 'admin') {
            setIsAdminMode(true);
            setShowAdminInput(false);
            setDeletePassword('admin');
        } else {
            alert('パスワードが違います');
        }
    };

    // --- Deletion Handlers ---
    const openDeleteModal = (id: number) => {
        setDeletingId(id);
        setDeletePassword(isAdminMode ? 'admin' : '');
    };

    const closeDeleteModal = () => {
        setDeletingId(null);
        setDeletePassword('');
    };

    const executeDelete = async () => {
        if (!deletingId) return;
        if (!confirm('本当に削除しますか？\n（この操作は取り消せません）')) return;

        try {
            const res = await fetch('/api/residents', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deletingId, password: deletePassword }),
            });

            if (res.ok) {
                setResidents(prev => prev.filter(r => r.id !== deletingId));
                alert('削除しました');
                closeDeleteModal();
            } else {
                const data = await res.json();
                alert(`削除失敗: ${data.error}`);
            }
        } catch (error) {
            console.error('Delete error', error);
            alert('通信エラーが発生しました');
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm('【警告】すべてのデータを削除しますか？')) return;
        if (!confirm('本当によろしいですか？\nこの操作は絶対に取り消せません！')) return;

        try {
            const res = await fetch('/api/residents', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deleteAll: true, password: adminPassword }),
            });

            if (res.ok) {
                setResidents([]);
                alert('全データを削除しました');
                setIsBulkDeleting(false);
            } else {
                const data = await res.json();
                alert(`削除失敗: ${data.error}`);
            }
        } catch (error) {
            console.error('Bulk Delete error', error);
            alert('通信エラーが発生しました');
        }
    };

    // --- View Certificate Handler ---
    const handleViewCertificate = async (resident: Resident) => {
        setViewingId(resident.id);
        setIsGenerating(true);
        setGeneratedImage(null);

        // Wait for React to render the hidden component
        setTimeout(async () => {
            const element = document.getElementById(`renderer-${resident.id}`);
            if (element) {
                try {
                    // ブラウザ上であることを確認
                    if (typeof window === 'undefined') return;

                    const domtoimage = (await import('dom-to-image-more')).default;

                    const dataUrl = await domtoimage.toPng(element, {
                        quality: 0.95,
                        bgcolor: '#ffffff',
                    });
                    setGeneratedImage(dataUrl);
                } catch (error) {
                    console.error('Generation error:', error);
                    alert('入居届の生成に失敗しました');
                    setViewingId(null);
                } finally {
                    setIsGenerating(false);
                }
            } else {
                setViewingId(null);
                setIsGenerating(false);
            }
        }, 500);
    };

    const closeViewModal = () => {
        setViewingId(null);
        setGeneratedImage(null);
    };

    return (
        <div className="min-h-screen bg-transparent text-stone-100 font-sans relative">

            {/* Immersive Overlay to dampen background slightly for registry readability */}
            <div className="fixed inset-0 bg-black/40 z-[-1] pointer-events-none" />

            {/* Delete Modal */}
            {deletingId && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-md">
                    <div className="glass-panel p-10 rounded-3xl shadow-2xl max-w-sm w-full space-y-8 border-[#a84032]/30">
                        <h3 className="text-2xl font-bold text-white text-center text-outline">退去手続き</h3>
                        <p className="text-sm text-[#d4c5b0] text-center">
                            削除するにはパスワードを入力してください。
                        </p>
                        <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-xl text-white outline-none focus:border-[#c9a64e]/50 transition-all font-mono"
                            placeholder="••••••"
                            autoFocus
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={closeDeleteModal}
                                className="flex-1 py-4 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition text-stone-300"
                            >
                                戻る
                            </button>
                            <button
                                onClick={executeDelete}
                                className="flex-1 py-4 bg-[#a84032] text-white rounded-xl font-bold hover:brightness-110 transition shadow-lg"
                            >
                                削除
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Certificate Modal */}
            {viewingId && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-xl" onClick={closeViewModal}>
                    <div className="glass-panel p-2 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-auto relative border-white/20" onClick={e => e.stopPropagation()}>
                        {isGenerating ? (
                            <div className="p-24 flex flex-col items-center">
                                <div className="w-16 h-16 border-4 border-amber-200/20 border-t-[#c9a64e] animate-spin rounded-full mb-6"></div>
                                <p className="text-[#c9a64e] font-black text-xl animate-pulse text-outline">生成中...</p>
                            </div>
                        ) : (
                            generatedImage && (
                                <img src={generatedImage} alt="入居届" className="w-full h-auto rounded-2xl shadow-inner" />
                            )
                        )}
                        <button
                            onClick={closeViewModal}
                            className="absolute top-6 right-6 bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/70 transition shadow-xl border border-white/10 text-2xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="py-20 px-8 relative overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10 text-center md:text-left">
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tight text-white text-outline">
                            入居者名簿
                        </h1>
                        <p className="text-[#c9a64e] font-black tracking-[0.4em] uppercase text-sm md:text-base drop-shadow-lg">Resident Registry — Kakyo-no-ma</p>
                    </div>

                    <div className="flex gap-6">
                        <Link
                            href="/kakyonoma"
                            className="bg-[#c9a64e] text-white px-10 py-5 rounded-2xl font-black hover:brightness-110 transition-all shadow-2xl hover:shadow-[#c9a64e]/20 active:scale-95 text-xl text-outline"
                        >
                            かきょの間へ
                        </Link>
                        <Link
                            href="/"
                            className="glass-panel text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all text-xl border-white/20 border"
                        >
                            トップ
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8 md:p-12">
                {/* Admin Toolbar & Filters */}
                <div className="mb-20 flex flex-col md:flex-row justify-between items-center gap-10">
                    {/* Building Filter */}
                    <div className="flex flex-wrap gap-4 justify-center bg-black/20 backdrop-blur-md p-3 rounded-3xl border border-white/10 shadow-xl">
                        <button
                            onClick={() => setSelectedBuilding(null)}
                            className={`px-8 py-3 rounded-2xl font-bold transition-all ${!selectedBuilding ? 'bg-[#c9a64e] text-white shadow-xl scale-105' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}
                        >
                            全て
                        </button>
                        {Object.values(BUILDING_STYLES).map((style) => (
                            <button
                                key={style.name}
                                onClick={() => setSelectedBuilding(style.name)}
                                className={`px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${selectedBuilding === style.name ? `bg-white/15 text-white ring-2 ring-[#c9a64e]/50 shadow-xl scale-105` : 'text-stone-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <span>
                                    {style.iconPath ? (
                                        <img src={style.iconPath} alt="" className="w-6 h-6 object-contain" />
                                    ) : (
                                        style.emoji
                                    )}
                                </span>
                                <span>{style.name}</span>
                            </button>
                        ))}
                    </div>

                    {isAdminMode && (
                        <button
                            onClick={handleBulkDelete}
                            className="bg-[#a84032] text-white px-8 py-3 rounded-2xl font-black shadow-2xl hover:brightness-110 transition-all text-base text-outline"
                        >
                            ⚠️ 全データ一括削除
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-56 space-y-10">
                        <div className="w-24 h-24 border-4 border-white/5 border-t-[#c9a64e] animate-spin rounded-full"></div>
                        <p className="text-[#c9a64e] text-3xl font-serif italic text-outline animate-pulse">読み込み中...</p>
                    </div>
                ) : filteredResidents.length === 0 ? (
                    <div className="glass-panel rounded-[3rem] p-48 text-center border-white/5">
                        <span className="text-[10rem] mb-12 block drop-shadow-2xl">🏙️</span>
                        <p className="text-[#d4c5b0] text-4xl font-serif italic drop-shadow-md">
                            まだ誰もいないようです
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {filteredResidents.map((resident) => {
                            const style = getBuildingStyle(resident.building);

                            return (
                                <div
                                    key={resident.id}
                                    className={`glass-panel rounded-[3rem] overflow-hidden border-2 hover:border-white/30 transition-all duration-700 group relative flex flex-col hover:-translate-y-3 shadow-2xl ${style.border === 'border-amber-400' ? 'border-[#c9a64e]/30' : 'border-white/10'}`}
                                >
                                    {/* Color Indicator Strip */}
                                    <div className={`h-3 bg-gradient-to-r ${style.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

                                    <div className="p-12 flex flex-col flex-1">
                                        {/* Profile Area */}
                                        <div className="flex flex-col items-center mb-10">
                                            <div className="relative mb-8">
                                                <div className={`w-44 h-44 rounded-full overflow-hidden ring-4 ${style.ring === 'ring-amber-400' ? 'ring-[#c9a64e]/40' : 'ring-white/20'} ring-offset-4 ring-offset-[#2d2418] shadow-2xl bg-black/40 group-hover:scale-105 transition-transform duration-700`}>
                                                    {(resident.icon || resident.image) ? (
                                                        <img
                                                            src={resident.icon || resident.image}
                                                            alt={resident.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white/10 text-9xl">👤</div>
                                                    )}
                                                </div>

                                                {/* ID Tag */}
                                                <div className="absolute -bottom-3 -right-3 bg-[#c9a64e] text-white px-4 py-1.5 rounded-full text-sm font-black shadow-2xl border border-white/10 text-outline leading-none">
                                                    ID {resident.id}
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteModal(resident.id);
                                                    }}
                                                    className={`absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl z-20 transition-all duration-300 ${isAdminMode ? 'bg-[#a84032] text-white opacity-100 scale-100' : 'bg-white/10 text-white/30 opacity-0 group-hover:opacity-100 hover:bg-[#a84032] hover:text-white'}`}
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            <div className="relative mb-6">
                                                <div className={`w-36 h-36 mx-auto rounded-full flex items-center justify-center shadow-xl border-4 ${style.border === 'border-amber-400' ? 'border-[#c9a64e]/50' : 'border-white/20'} overflow-hidden bg-gradient-to-br ${style.gradient} relative group-hover:scale-105 transition-transform duration-700`}>
                                                    {style.iconPath ? (
                                                        <img src={style.iconPath} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-6xl">{style.emoji}</span>
                                                    )}
                                                </div>
                                                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] shadow-lg text-outline whitespace-nowrap ${style.bg === 'bg-amber-100' ? 'bg-[#c9a64e]' : 'bg-white/10'}`}>
                                                    {style.name || '所属なし'}
                                                </div>
                                            </div>

                                            <h2 className="text-4xl font-serif font-black text-white tracking-tight mb-3 text-center leading-snug text-outline">
                                                {resident.name}
                                            </h2>

                                            <div className="text-[#c9a64e] text-xs font-black tracking-[0.3em] uppercase opacity-80 drop-shadow-md">
                                                ROOM {resident.roomNumber}
                                            </div>
                                        </div>

                                        {/* Information List */}
                                        <div className="space-y-8 mb-10 pt-10 border-t border-dashed border-white/10 flex-1">
                                            <div className="flex items-center gap-5 group/item">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover/item:bg-white/10 transition-colors shadow-inner">🏠</div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1">Base Location</span>
                                                    <span className="text-stone-100 font-bold text-lg drop-shadow-md">{resident.baseLocation || '---'}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-5 group/item">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover/item:bg-white/10 transition-colors shadow-inner">🐦</div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1">X (Twitter)</span>
                                                    <span className="text-stone-100 font-bold text-lg truncate max-w-[160px] drop-shadow-md">{resident.xAccount ? `@${resident.xAccount}` : '---'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Footer */}
                                        <div className="pt-8 border-t border-white/5 flex justify-center">
                                            <button
                                                onClick={() => handleViewCertificate(resident)}
                                                className={`w-full py-4 rounded-2xl font-black transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 hover:brightness-110 text-outline ${style.bg === 'bg-amber-100' ? 'bg-[#c9a64e] text-white' : 'bg-white/10 text-white border border-white/10'}`}
                                            >
                                                <span>📄</span>
                                                入居届を確認
                                            </button>
                                        </div>

                                        {/* Hidden Renderer */}
                                        <div className="fixed -top-[3000px] -left-[3000px] pointer-events-none">
                                            {viewingId === resident.id && (
                                                <div id={`renderer-${resident.id}`}>
                                                    <TennyuTodoke
                                                        name={resident.name}
                                                        firstName={resident.firstName}
                                                        lastName={resident.lastName}
                                                        nickname={resident.nickname}
                                                        xAccount={resident.xAccount || ''}
                                                        youtubeAccount={resident.youtubeAccount || ''}
                                                        baseLocation={resident.baseLocation || ''}
                                                        roomNumber={resident.roomNumber}
                                                        image={resident.icon || resident.image || ''}
                                                        captureMode={true}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <footer className="py-48 border-t border-white/5 max-w-7xl mx-auto px-10 text-center">
                <p className="text-[#c9a64e]/40 text-2xl tracking-[0.5em] font-serif italic mb-8 drop-shadow-md">
                    — KAKYO-NO-MA —
                </p>

                {/* Admin Toggle */}
                {!isAdminMode ? (
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => setShowAdminInput(!showAdminInput)}
                            className="text-white/20 text-xs hover:text-white/40 px-6 py-3 transition-colors"
                        >
                            MANAGEMENT MODE
                        </button>
                        {showAdminInput && (
                            <div className="flex gap-3 items-center animate-in fade-in slide-in-from-bottom-4">
                                <input
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="Enter ID"
                                    className="bg-black/40 border border-white/10 rounded-xl px-5 py-2 text-sm text-white outline-none focus:border-[#c9a64e]/40 transition-all font-mono"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                                />
                                <button
                                    onClick={handleAdminLogin}
                                    className="bg-white/10 text-white px-5 py-2 rounded-xl text-sm font-black hover:bg-white/20 transition-all shadow-xl"
                                >
                                    GO
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-[#a84032]/20 text-[#a84032] px-8 py-3 rounded-full text-xs font-black border border-[#a84032]/30 text-outline">
                            ADMIN MODE ACTIVE
                        </div>
                        <button
                            onClick={() => {
                                setIsAdminMode(false);
                                setAdminPassword('');
                            }}
                            className="text-white/30 text-xs hover:underline"
                        >
                            LOGOUT
                        </button>
                    </div>
                )}
            </footer>
        </div>
    );
}
