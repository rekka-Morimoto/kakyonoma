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
            className={`w-[850px] h-[600px] text-black p-12 relative mx-auto overflow-hidden ${captureMode ? '' : 'shadow-2xl'}`}
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

            {/* Main Decorative Frame - Solid Thin Line */}
            <div className="absolute top-6 left-6 right-6 bottom-6 border-[2px] border-[#2d2418] pointer-events-none force-border" />

            {/* Title Header */}
            <div className="text-center mt-6 mb-2 flex flex-col items-center justify-center relative">
                <div className="inline-block px-12">
                   <div className="text-[10px] tracking-[0.6em] font-bold text-[#c9a64e]/80 mb-2 font-serif">
                       MAISON DE KYO • RESIDENT REGISTRATION
                   </div>
                    <h1 className="text-6xl font-black tracking-[0.6em] whitespace-nowrap leading-none text-[#2d2418] mr-[-0.6em] font-serif">
                        入居届
                    </h1>
                </div>
                {/* Subtle horizontal separator */}
                <div className="w-[450px] h-[2px] bg-gradient-to-r from-transparent via-[#2d2418]/20 to-transparent mt-10 mb-2" />
            </div>

            {/* Top Info Area: Date and No. */}
            <div className="flex justify-between px-20 mt-[-10px] mb-6 items-end relative">
                <div className="min-w-[240px]">
                    <div className="text-[10px] font-bold text-[#c9a64e] tracking-widest mb-1">REGISTRATION DATE</div>
                    <div className="text-3xl font-black text-[#2d2418] font-serif">
                        令和七年 七月 十一日
                    </div>
                </div>
                <div className="text-3xl font-black italic flex items-baseline gap-1" style={{ color: '#c9a64e' }}>
                    <span className="text-sm not-italic opacity-60 font-serif pr-1">No.</span>
                    <span className="tracking-tighter font-serif">0004</span>
                </div>
            </div>

            {/* Main Layout: Photo on left, Info on right */}
            <div className="flex gap-12 px-20 relative z-10 pt-4">
                {/* Left: Portrait Photo */}
                <div className="w-[185px] flex flex-col items-center">
                    <div className="aspect-[3/4] w-full bg-[#fafaf9] rounded-[2rem] border-[3px] border-[#2d2418] shadow-lg relative overflow-hidden force-border">
                        {image ? (
                            <img src={image} alt="顔写真" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center flex flex-col items-center gap-2 text-[#d6d3d1] mt-16">
                                <span className="text-6xl opacity-10">📸</span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black tracking-widest text-[#c9a64e]">PHOTO</span>
                                    <span className="text-[8px] font-bold tracking-widest text-[#a8a29e]">写真貼付用</span>
                                </div>
                            </div>
                        )}
                    </div>
                   <p className="mt-4 text-[11px] font-black tracking-[0.2em] text-[#a8a29e] opacity-80">近影・加工可</p>
                </div>

                {/* Right: Personal Info Blocks */}
                <div className="flex-1 space-y-8">
                    {/* Name Block */}
                    <div className="relative pt-2">
                        <span className="absolute -top-1 left-0 text-[10px] font-black tracking-[0.2em] text-[#c9a64e] flex items-center gap-1.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e]"></span> なまえ
                        </span>
                        <div className="text-4xl pl-6 font-black h-12 flex items-end text-[#2d2418]">
                            {name || ''}
                        </div>
                        <div className="w-full h-[4px] bg-[#2d2418] rounded-full mt-2" />
                    </div>

                    {/* Nickname Block */}
                    <div className="relative pt-2">
                        <span className="absolute -top-1 left-0 text-[10px] font-black tracking-[0.2em] text-[#c9a64e] flex items-center gap-1.5 opacity-80">
                           <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e] opacity-80"></span> 呼び方
                        </span>
                        <div className="text-2xl pl-8 font-black h-10 flex items-end text-[#2d2418]">
                            {nickname || ''}
                        </div>
                        <div className="w-full h-[1px] bg-[#2d2418]/30 mt-2" />
                    </div>

                    {/* Room and Location row */}
                    <div className="grid grid-cols-2 gap-10 pt-2">
                        <div className="relative">
                            <span className="text-[10px] font-black tracking-[0.2em] text-[#c9a64e] block mb-2">部屋番号</span>
                            <div className="text-3xl pl-6 font-black h-10 flex items-end text-[#a84032] italic tracking-tighter">
                                {roomNumber ? `${roomNumber}号室` : '1号室'}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/20 mt-1" />
                        </div>
                        <div className="relative">
                            <span className="text-[10px] font-black tracking-[0.2em] text-[#c9a64e] block mb-2">本拠地</span>
                            <div className="text-xl pl-6 font-bold h-10 flex items-end text-[#2d2418] truncate">
                                {baseLocation || ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/20 mt-1" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Signature, Social, and Free Text Area */}
            <div className="absolute bottom-10 left-0 w-full px-20 flex justify-between items-end">
                <div className="flex-1">
                   {/* Signature line at the bottom as per image */}
                   <div className="flex items-center gap-8 mb-2 opacity-30">
                        <span className="text-[10px] font-bold tracking-widest whitespace-nowrap">ABOVE INFORMATION IS ACCURATE AND TRUE.</span>
                        <div className="h-px bg-[#2d2418] flex-1"></div>
                   </div>
                   <div className="flex items-baseline gap-4 mt-2">
                       <h2 className="text-4xl font-black tracking-[0.3em] font-serif text-[#2d2418] whitespace-nowrap">メゾン・ド・きょー管理委員会</h2>
                   </div>
                </div>

                {/* Free Text Label positioned near stamp */}
                <div className="absolute bottom-14 right-[320px] text-right">
                    <span className="text-[10px] font-black text-[#c9a64e] block mb-1">自由記載</span>
                    <div className="text-[12px] font-bold text-[#2d2418]/70 leading-tight max-w-[150px]">
                        {freeText || ''}
                    </div>
                </div>

                {/* SNS Icons at bottom center as per floating markers in image */}
                <div className="absolute bottom-6 left-[410px] flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-lg bg-[#2d2418] flex items-center justify-center text-white text-xs font-black shadow-lg">X</div>
                    <div className="w-8 h-8 rounded-lg bg-[#a84032] flex items-center justify-center text-white text-[10px] font-black shadow-lg">Yt</div>
                </div>
            </div>

            {/* Approval Stamp: Repositioned as per image overlap */}
            <div className="absolute bottom-12 right-20 w-44 h-44 pointer-events-none select-none z-20">
                <div className="w-full h-full rounded-full flex flex-col items-center justify-center font-black transform -rotate-[12deg] force-border" 
                     style={{ border: '4px solid rgba(168, 64, 50, 0.4)', color: 'rgba(168, 64, 50, 0.6)' }}>
                    <div className="w-full text-center py-2 relative flex flex-col items-center">
                        <div className="w-3/4 h-[1px] bg-[#a84032]/20 mb-2" />
                        <span className="text-[8px] tracking-[0.4em] block leading-none font-black opacity-60 mb-2">APPROVED BY MAISON</span>
                        <span className="text-5xl block leading-none tracking-[0.3em] pr-[-0.3em]">承認済</span>
                        <div className="w-3/4 h-[1px] bg-[#a84032]/20 mt-2" />
                    </div>
                </div>
            </div>
        </div>
    );
}
