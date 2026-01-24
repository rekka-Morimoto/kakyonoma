'use client';
import React from 'react';

interface TennyuTodokeProps {
    name: string;
    firstName?: string;
    lastName?: string;
    nickname?: string;
    xAccount: string;
    youtubeAccount: string;
    baseLocation: string;
    roomNumber: number;
    image: string; // URL or Base64
    date?: string;
    captureMode?: boolean;
    freeText?: string;
    residentId?: number;
}

export default function TennyuTodoke({
    name,
    firstName,
    lastName,
    nickname,
    xAccount,
    youtubeAccount,
    baseLocation,
    roomNumber,
    image,
    date,
    captureMode = false,
    freeText,
    residentId = 1,
}: TennyuTodokeProps) {
    const currentDate = date || new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div
            id="tennyu-todoke"
            className={`w-[850px] h-[600px] text-black p-12 relative mx-auto overflow-hidden ${captureMode ? '' : 'shadow-2xl border-[1px] border-stone-200'}`}
            style={{
                fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif',
                backgroundColor: '#fefcf8', // Slightly warm paper color
                color: '#000000',
                boxShadow: captureMode ? 'none' : undefined,
                border: captureMode ? 'none' : undefined
            }}
        >
            {/* FORCE RESET BORDERS FOR IMAGE GENERATION */}
            <style>{`
                #tennyu-todoke * {
                    border-style: none !important;
                    border-width: 0 !important;
                }
                #tennyu-todoke .force-border {
                    border-style: solid !important;
                }
            `}</style>

            {/* Outer Decorative Border 1 (Thick) - Simulated with div lines */}
            <div className="absolute top-4 left-4 right-4 h-[2px] bg-black pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 h-[2px] bg-black pointer-events-none" />
            <div className="absolute top-4 bottom-4 left-4 w-[2px] bg-black pointer-events-none" />
            <div className="absolute top-4 bottom-4 right-4 w-[2px] bg-black pointer-events-none" />

            {/* Outer Decorative Border 2 (Thin) - Simulated with div lines */}
            <div className="absolute top-6 left-6 right-6 h-px bg-black/20 pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 h-px bg-black/20 pointer-events-none" />
            <div className="absolute top-6 bottom-6 left-6 w-px bg-black/20 pointer-events-none" />
            <div className="absolute top-6 bottom-6 right-6 w-px bg-black/20 pointer-events-none" />

            {/* Title Header */}
            <div className="text-center mt-3 mb-4 flex flex-col items-center justify-center">
                <div className="inline-block px-12 pb-4">
                    <h1 className="text-5xl font-black tracking-[1em] whitespace-nowrap leading-tight">
                        入居届
                    </h1>
                    <div className="w-full h-1 bg-black mt-1" />
                </div>
            </div>

            {/* Date and ID Area */}
            <div className="flex justify-between px-12 mb-4">
                <div className="min-w-[200px] relative">
                    <div className="text-lg font-bold pb-1 text-black">
                        令和八年 一月 吉日
                    </div>
                    <div className="w-full h-px bg-black/40" />
                </div>
                <div className="text-xl font-black tracking-widest" style={{ color: '#a8a29e' }}>
                    № {String(residentId).padStart(4, '0')}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex gap-10 px-12 relative z-10">
                {/* Left: Portrait Photo */}
                <div className="w-[180px] flex flex-col gap-2">
                    {/* Photo Frame: Simulated border using padding and background */}
                    <div className="aspect-[3/4] bg-black p-[2px] shadow-inner relative">
                        <div className="w-full h-full bg-[#fafaf9] flex items-center justify-center overflow-hidden relative">
                            {image ? (
                                <img src={image} alt="顔写真" className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-center flex flex-col items-center gap-2 text-[#d6d3d1]">
                                    <span className="text-4xl opacity-20">📸</span>
                                    <span className="text-xs font-bold tracking-widest uppercase">写真貼付</span>
                                </div>
                            )}

                            {/* Photo Corners */}
                            <div className="absolute top-0 left-0 w-2 h-2">
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-black/20" />
                                <div className="absolute top-0 left-0 h-full w-[2px] bg-black/20" />
                            </div>
                            <div className="absolute top-0 right-0 w-2 h-2">
                                <div className="absolute top-0 right-0 w-full h-[2px] bg-black/20" />
                                <div className="absolute top-0 right-0 h-full w-[2px] bg-black/20" />
                            </div>
                            <div className="absolute bottom-0 left-0 w-2 h-2">
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black/20" />
                                <div className="absolute bottom-0 left-0 h-full w-[2px] bg-black/20" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-2 h-2">
                                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-black/20" />
                                <div className="absolute bottom-0 right-0 h-full w-[2px] bg-black/20" />
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-center leading-tight text-[#a8a29e]">
                        ※近影・加工可
                    </p>
                </div>

                {/* Right: Personal Information */}
                <div className="flex-1 space-y-6">
                    {/* Name Block: Sei and Mei */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="relative pb-2">
                            <span className="absolute -top-4 left-0 text-[10px] font-bold tracking-widest text-[#78716c]">姓</span>
                            <div className="text-2xl pl-4 font-black h-8 flex items-end">
                                {lastName || (name ? name.split(' ')[0] : '　')}
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
                        </div>
                        <div className="relative pb-2">
                            <span className="absolute -top-4 left-0 text-[10px] font-bold tracking-widest text-[#78716c]">名</span>
                            <div className="text-2xl pl-4 font-black h-8 flex items-end">
                                {firstName || (name && name.includes(' ') ? name.split(' ').slice(1).join(' ') : '　')}
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
                        </div>
                    </div>

                    {/* Nickname (Yobikata) */}
                    <div className="relative pb-1">
                        <span className="absolute -top-4 left-0 text-[10px] font-bold tracking-widest text-[#78716c]">呼び方</span>
                        <div className="text-xl pl-6 font-bold h-8 flex items-end">
                            {nickname || '　'}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-px bg-black" />
                    </div>

                    {/* Room and Location Block */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="relative pb-1">
                            <span className="absolute -top-4 left-0 text-[10px] font-bold tracking-widest text-[#78716c]">部屋番号</span>
                            <div className="text-xl pl-6 font-bold h-8 flex items-end">
                                {roomNumber ? `${roomNumber} 号室` : '　'}
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-px bg-black" />
                        </div>
                        <div className="relative pb-1">
                            <span className="absolute -top-4 left-0 text-[10px] font-bold tracking-widest text-[#78716c]">本拠地</span>
                            <div className="text-base pl-6 font-bold h-8 flex items-end overflow-hidden">
                                <span className="truncate">{baseLocation || '　'}</span>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-px bg-black" />
                        </div>
                    </div>

                    {/* Social Assets Grouped under 'Contact Info' */}
                    <div className="pt-2">
                        <div className="relative pl-4 ml-1">
                            {/* Vertical Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-stone-200" />

                            <span className="absolute -top-5 left-0 text-[10px] font-bold tracking-widest text-[#a8a29e]">連絡先</span>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center">
                                    <span className="w-20 text-[10px] font-bold tracking-widest shrink-0 text-[#a8a29e]">X</span>
                                    <div className="text-base font-sans font-bold pl-2 truncate">
                                        {xAccount ? `@${xAccount}` : '未登録'}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-20 text-[10px] font-bold tracking-widest shrink-0 text-[#a8a29e]">YouTube</span>
                                    <div className="text-base font-sans font-bold pl-2 truncate">
                                        {youtubeAccount || '未登録'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Free Text Field - Always reserve space */}
                    <div className="pt-3">
                        <div className="relative pb-1">
                            <span className="absolute -top-4 left-0 text-[10px] font-bold tracking-widest text-[#78716c]">自由記載</span>
                            <div className="text-xs pl-2 leading-relaxed h-[50px] overflow-hidden">
                                {freeText || ''}
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-px bg-black/30" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer and Declaration */}
            <div className="absolute bottom-6 left-0 w-full px-12">
                <div className="pt-6 flex justify-between items-end relative">
                    <div className="absolute top-0 w-full h-px bg-black/10" />
                    <div className="space-y-1">
                        <p className="text-sm tracking-widest whitespace-nowrap">上記のとおり入居したことを届け出ます。</p>
                        <p className="font-bold text-2xl tracking-[0.2em] font-serif whitespace-nowrap">メゾン・ド・きょー管理委員会</p>
                    </div>
                </div>
            </div>

            {/* Traditional Approval Stamp */}
            <div className="absolute bottom-10 right-20 w-28 h-28 pointer-events-none select-none">
                <div className="w-full h-full rounded-full flex flex-col items-center justify-center font-black transform -rotate-12 force-border" style={{ border: '4px solid rgba(220, 38, 38, 0.6)', color: 'rgba(220, 38, 38, 0.8)' }}>
                    <div className="w-full text-center py-1 relative">
                        <div className="absolute top-0 w-full h-[2px] bg-red-600/40" />
                        <div className="absolute bottom-0 w-full h-[2px] bg-red-600/40" />
                        <span className="text-[10px] tracking-widest block leading-none mb-1">メゾン・ド・きょー</span>
                        <span className="text-3xl block leading-none">承認済</span>
                    </div>
                </div>
            </div>

            {/* Watermark/Texture Overlay (Optional decoration) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        </div>
    );
}
