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
    const [currentDate, setCurrentDate] = React.useState(date || '');
    React.useEffect(() => {
        if (!date) {
            setCurrentDate(new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }));
        }
    }, [date]);

    return (
        <div
            id="tennyu-todoke"
            className={`w-[850px] h-[600px] text-black p-8 relative mx-auto overflow-hidden flex flex-col ${captureMode ? '' : 'shadow-2xl'}`}
            style={{
                fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif',
                backgroundColor: '#ffffff',
                color: '#2d2418',
                boxShadow: captureMode ? 'none' : undefined,
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

            {/* Main Outer Frame Line */}
            <div className="absolute top-5 left-5 right-5 bottom-5 border-[2px] border-[#2d2418] pointer-events-none force-border z-0" />

            {/* Inner Content Area - Flex Container for vertical distribution */}
            <div className="relative z-10 flex-1 flex flex-col px-12 py-6">
                
                {/* 1. Header (Title) */}
                <header className="text-center mb-8">
                    <div className="text-[9px] tracking-[0.5em] font-bold text-[#c9a64e]/80 mb-1">MAISON DE KYO • RESIDENT REGISTRATION</div>
                    <h1 className="text-5xl font-black tracking-[0.8em] whitespace-nowrap text-[#2d2418] mr-[-0.8em]">入居届</h1>
                    <div className="w-80 h-[1px] bg-gradient-to-r from-transparent via-[#2d2418]/30 to-transparent mx-auto mt-4" />
                </header>

                {/* 2. Date and No. (Sub-header) */}
                <div className="flex justify-between items-end mb-8 px-4">
                    <div className="min-w-[200px]">
                        <span className="text-[10px] font-bold text-[#c9a64e] tracking-widest block mb-1">REGISTRATION DATE</span>
                        <div className="text-2xl font-black text-[#2d2418] border-b-[2px] border-[#2d2418]/10 force-border pb-1">令和七年 七月 十一日</div>
                    </div>
                    <div className="text-2xl font-black italic flex items-baseline gap-1" style={{ color: '#c9a64e' }}>
                        <span className="text-[10px] not-italic opacity-60 font-serif">No.</span>
                        <span className="tracking-tighter">0004</span>
                    </div>
                </div>

                {/* 3. Main Body (Photo + Info) */}
                <div className="flex gap-10 mb-8">
                    {/* Photo Left */}
                    <div className="w-[170px] shrink-0">
                        <div className="aspect-[3/4] w-full bg-[#fafaf9] rounded-[2.5rem] border-[3px] border-[#2d2418] shadow-sm relative overflow-hidden force-border">
                            {image ? (
                                <img src={image} alt="顔写真" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center flex flex-col items-center justify-center h-full opacity-10">
                                    <span className="text-5xl">📸</span>
                                    <span className="text-[8px] font-black mt-1">PHOTO</span>
                                </div>
                            )}
                        </div>
                        <p className="mt-3 text-[10px] text-center font-bold tracking-widest text-[#a8a29e] opacity-70">近影・加工可</p>
                    </div>

                    {/* Info Right */}
                    <div className="flex-1 flex flex-col">
                        {/* Name Block */}
                        <div className="mb-8 relative">
                             <span className="text-[10px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e]"></span> なまえ
                             </span>
                             <div className="text-3xl pl-4 font-black text-[#2d2418] mb-1">{name || ''}</div>
                             <div className="w-full h-[3.5px] bg-[#2d2418] rounded-full" />
                        </div>

                        {/* Nickname Block */}
                        <div className="mb-6 relative">
                             <span className="text-[10px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-2 opacity-70">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e] opacity-70"></span> 呼び方
                             </span>
                             <div className="text-xl pl-6 font-black text-[#2d2418] mb-1">{nickname || ''}</div>
                             <div className="w-full h-[1px] bg-[#2d2418]/20" />
                        </div>

                        {/* Room and Location row */}
                        <div className="grid grid-cols-2 gap-8 mt-auto">
                            <div className="relative">
                                <span className="text-[10px] font-black tracking-[0.2em] text-[#c9a64e] block mb-1">部屋番号</span>
                                <div className="text-2xl pl-4 font-black text-[#a84032] italic tracking-tight">{roomNumber ? `${roomNumber}号室` : ''}</div>
                                <div className="w-full h-[1px] bg-[#2d2418]/10 mt-1" />
                            </div>
                            <div className="relative">
                                <span className="text-[10px] font-black tracking-[0.2em] text-[#c9a64e] block mb-1">本拠地</span>
                                <div className="text-lg pl-4 font-bold text-[#2d2418] truncate">{baseLocation || ''}</div>
                                <div className="w-full h-[1px] bg-[#2d2418]/10 mt-1" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Bottom Row (Committee + SNS/FreeText) */}
                <div className="mt-auto flex justify-between items-end pb-4">
                    {/* Signature */}
                    <div className="shrink-0 pb-1">
                        <div className="flex items-center gap-4 mb-2 opacity-20">
                             <span className="text-[8px] font-bold tracking-widest whitespace-nowrap">ABOVE INFORMATION IS ACCURATE AND TRUE.</span>
                             <div className="h-px bg-[#2d2418] w-24"></div>
                        </div>
                        <h2 className="text-3xl font-black tracking-[0.4em] text-[#2d2418] whitespace-nowrap font-serif">メゾン・ド・きょー管理委員会</h2>
                    </div>

                    {/* SNS and Free Text column */}
                    <div className="flex flex-col items-end gap-4 pr-24">
                        <div className="text-right">
                             <span className="text-[9px] font-black tracking-widest text-[#c9a64e] mb-1 block">自由記載</span>
                             <div className="text-[11px] font-bold text-[#2d2418]/60 leading-snug max-w-[180px] whitespace-pre-wrap">{freeText || ''}</div>
                        </div>
                        <div className="flex gap-2 mr-6">
                            <div className="w-8 h-8 rounded-lg bg-[#2d2418] flex items-center justify-center text-white text-[11px] font-black shadow-md">X</div>
                            <div className="w-8 h-8 rounded-lg bg-[#a84032] flex items-center justify-center text-white text-[9px] font-black shadow-md">Yt</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approval Stamp: Repositioned as an absolute layer for the whole card */}
            <div className="absolute bottom-8 right-12 w-44 h-44 pointer-events-none select-none z-30 opacity-90">
                <div className="w-full h-full rounded-full flex flex-col items-center justify-center font-black transform -rotate-[12deg] force-border" 
                     style={{ border: '4px solid rgba(168, 64, 50, 0.3)', color: 'rgba(168, 64, 50, 0.5)' }}>
                    <div className="w-full text-center py-2 flex flex-col items-center">
                        <div className="w-2/3 h-[1px] bg-[#a84032]/20 mb-2" />
                        <span className="text-[8px] tracking-[0.3em] font-black uppercase opacity-60 mb-2">Approved by Maison</span>
                        <span className="text-5xl block leading-none tracking-[0.3em] pr-[-0.3em]">承認済</span>
                        <div className="w-2/3 h-[1px] bg-[#a84032]/20 mt-2" />
                    </div>
                </div>
            </div>
        </div>
    );
}
