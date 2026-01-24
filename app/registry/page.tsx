'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import TennyuTodoke from '../components/TennyuTodoke';
// @ts-ignore
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

                    // @ts-ignore
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
        <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans relative">
            {/* Delete Modal */}
            {deletingId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full space-y-6">
                        <h3 className="text-xl font-bold text-stone-800 text-center">退去手続き（データ削除）</h3>
                        <p className="text-sm text-stone-500 text-center">
                            削除するには登録時のパスワードを入力してください。<br />
                            <span className="text-xs text-stone-400">※古いデータなどパスワード未設定の場合はそのまま削除できます</span>
                        </p>
                        <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="w-full p-3 border border-stone-300 rounded-lg text-lg"
                            placeholder="Password"
                            autoFocus
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={closeDeleteModal}
                                className="flex-1 py-3 bg-stone-200 rounded-lg font-bold hover:bg-stone-300 transition"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={executeDelete}
                                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition shadow-lg"
                            >
                                削除する
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Certificate Modal */}
            {viewingId && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-300 p-4" onClick={closeViewModal}>
                    <div className="bg-white p-2 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>

                        {isGenerating ? (
                            <div className="p-20 flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 animate-spin rounded-full mb-4"></div>
                                <p className="text-stone-500 font-bold animate-pulse">入居届を準備中...</p>
                            </div>
                        ) : (
                            generatedImage && (
                                <img src={generatedImage} alt="入居届" className="w-full h-auto rounded-xl shadow-inner" />
                            )
                        )}

                        <button
                            onClick={closeViewModal}
                            className="absolute top-4 right-4 bg-stone-100 p-2 rounded-full hover:bg-stone-200 transition shadow-sm"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b border-stone-200 py-12 px-6 shadow-sm relative overflow-hidden bg-[url('/noise.png')]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="text-center md:text-left">
                        <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tighter mb-4 text-stone-900">
                            入居者名簿
                        </h1>
                        <p className="text-stone-500 font-bold tracking-[0.3em] uppercase text-sm">Resident Registry — Kakyo-no-ma Residence</p>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            href="/kakyonoma"
                            className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold hover:bg-stone-800 transition-all shadow-xl hover:shadow-2xl active:scale-95 text-lg"
                        >
                            畳の間へ
                        </Link>
                        <Link
                            href="/"
                            className="border-2 border-stone-200 px-8 py-4 rounded-full font-bold hover:bg-stone-50 transition-all text-stone-600 text-lg"
                        >
                            トップへ
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-12">
                {/* Admin Toolbar & Filters */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Building Filter */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={() => setSelectedBuilding(null)}
                            className={`px-6 py-2 rounded-full font-bold transition-all shadow-sm ${!selectedBuilding ? 'bg-stone-800 text-white shadow-lg scale-105' : 'bg-white text-stone-500 hover:bg-stone-100'}`}
                        >
                            全て
                        </button>
                        {Object.values(BUILDING_STYLES).map((style) => (
                            <button
                                key={style.name}
                                onClick={() => setSelectedBuilding(style.name)}
                                className={`px-6 py-2 rounded-full font-bold transition-all shadow-sm ${selectedBuilding === style.name ? `bg-white text-stone-900 ring-2 ${style.ring} shadow-lg scale-105` : 'bg-white text-stone-500 hover:bg-stone-50'}`}
                            >
                                <span className="mr-2">{style.emoji}</span>{style.name}
                            </button>
                        ))}
                    </div>

                    {isAdminMode && (
                        <button
                            onClick={handleBulkDelete}
                            className="bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-red-700 transition text-sm"
                        >
                            ⚠️ 全データ一括削除
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-8">
                        <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-800 animate-spin rounded-full"></div>
                        <p className="text-stone-500 text-2xl font-serif italic">Loading Resident Data...</p>
                    </div>
                ) : filteredResidents.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-stone-200 rounded-[3rem] p-40 text-center">
                        <span className="text-9xl mb-10 block">🛋️</span>
                        <p className="text-stone-400 text-3xl font-serif italic">
                            {selectedBuilding ? `${selectedBuilding}にはまだ誰もいません` : 'まだ入居者がいません'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredResidents.map((resident) => {
                            const style = getBuildingStyle(resident.building);

                            return (
                                <div
                                    key={resident.id}
                                    className={`bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-2 hover:shadow-2xl transition-all duration-500 group relative flex flex-col ${style.border}`}
                                >
                                    <div className={`h-2 bg-gradient-to-r ${style.gradient} opacity-80`} />

                                    <div className="p-10 flex flex-col flex-1">
                                        {/* Profile Area */}
                                        <div className="flex flex-col items-center mb-8">
                                            <div className="relative mb-6">
                                                <div className={`w-40 h-40 rounded-full overflow-hidden ring-4 ${style.ring} ring-offset-4 shadow-2xl bg-stone-50 group-hover:scale-105 transition-transform duration-700`}>
                                                    {(resident.icon || resident.image) ? (
                                                        <img
                                                            src={resident.icon || resident.image}
                                                            alt={resident.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-200 text-8xl bg-stone-50">👤</div>
                                                    )}
                                                </div>

                                                {/* ID Tag */}
                                                <div className="absolute -bottom-2 -right-2 bg-white text-stone-900 px-3 py-1 rounded-full text-sm font-bold border shadow-md flex items-center gap-1">
                                                    <span className="text-xs text-stone-400">ID</span>
                                                    <span>{resident.id}</span>
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteModal(resident.id);
                                                    }}
                                                    className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-20 transition-all duration-300 ${isAdminMode ? 'bg-red-500 text-white opacity-100 scale-100' : 'bg-stone-100 text-stone-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500'}`}
                                                    title="削除する"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            <div className={`px-4 py-1 rounded-full text-xs font-bold mb-2 tracking-widest ${style.bg} ${style.text}`}>
                                                {style.emoji} {style.name || '所属なし'}
                                            </div>

                                            <h2 className="text-3xl font-serif font-black text-stone-800 tracking-tight mb-2 text-center leading-snug">
                                                {resident.name}
                                            </h2>

                                            <div className="text-stone-400 text-sm font-bold tracking-widest uppercase">
                                                Room {resident.roomNumber}
                                            </div>
                                        </div>

                                        {/* Information List */}
                                        <div className="space-y-6 mb-8 pt-8 border-t border-dashed border-stone-200 flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-lg">🏠</div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Base Location</span>
                                                    <span className="text-stone-700 font-bold">{resident.baseLocation || '未設定'}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-lg">🐦</div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">X (Twitter)</span>
                                                    <span className="text-stone-700 font-bold truncate max-w-[180px]">{resident.xAccount ? `@${resident.xAccount}` : '未登録'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Footer */}
                                        <div className="pt-6 border-t border-stone-100 flex justify-center">
                                            <button
                                                onClick={() => handleViewCertificate(resident)}
                                                className={`w-full py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 hover:shadow-lg ${style.bg} ${style.text} hover:brightness-95`}
                                            >
                                                <span>📄</span>
                                                入居届を表示
                                            </button>
                                        </div>

                                        {/* Hidden Renderer for Generation */}
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

            <footer className="py-40 border-t border-stone-200 max-w-7xl mx-auto px-6 text-center">
                <p className="text-stone-400 text-xl tracking-[0.4em] font-serif italic opacity-40 mb-4">
                    — KAKYO-NO-MA RESIDENCE —
                </p>

                {/* Admin Toggle */}
                {!isAdminMode ? (
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setShowAdminInput(!showAdminInput)}
                            className="text-stone-300 text-xs hover:text-stone-500 px-4 py-2"
                        >
                            管理者モード
                        </button>
                        {showAdminInput && (
                            <div className="flex gap-2 items-center animate-in fade-in slide-in-from-bottom-2">
                                <input
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="Password"
                                    className="border border-stone-300 rounded px-2 py-1 text-sm bg-stone-50"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                                />
                                <button
                                    onClick={handleAdminLogin}
                                    className="bg-stone-800 text-white px-3 py-1 rounded text-sm font-bold"
                                >
                                    Login
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-bold border border-red-200">
                            管理モード中: 削除可能
                        </div>
                        <button
                            onClick={() => {
                                setIsAdminMode(false);
                                setAdminPassword('');
                            }}
                            className="text-stone-400 text-xs underline"
                        >
                            ログアウト
                        </button>
                    </div>
                )}
            </footer>
        </div>
    );
}
