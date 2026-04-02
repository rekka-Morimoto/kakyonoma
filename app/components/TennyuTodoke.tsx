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
            className={`w-[850px] h-[600px] text-black pt-12 pb-10 px-16 relative mx-auto overflow-hidden flex flex-col ${captureMode ? '' : 'shadow-2xl'}`}
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

            {/* Subtle Outer Frame */}
            <div className="absolute top-6 left-6 right-6 bottom-6 border-[1.5px] border-[#2d2418] pointer-events-none force-border opacity-80" />

            {/* 1. Header Area: Centered Title */}
            <div className="text-center mb-6">
                <div className="text-[10px] tracking-[0.4em] font-bold text-[#c9a64e] mb-1 font-serif uppercase">Resident Registration Form</div>
                <h1 className="text-5xl font-black tracking-[0.8em] whitespace-nowrap text-[#2d2418] mr-[-0.8em] font-serif">入居届</h1>
                <div className="w-64 h-[1px] bg-gradient-to-r from-transparent via-[#2d2418]/20 to-transparent mx-auto mt-3" />
            </div>

            {/* 2. Sub-header Area: Date and ID */}
            <div className="flex justify-between items-end mb-6">
                <div className="min-w-[200px]">
                    <span className="text-[9px] font-bold text-[#c9a64e] tracking-[0.2em] block mb-1">REGISTRATION DATE</span>
                    <div className="text-xl font-bold border-b border-[#2d2418]/10 force-border pb-1">令和七年 七月 十一日</div>
                </div>
                <div className="text-2xl font-black italic flex items-baseline gap-1" style={{ color: '#c9a64e' }}>
                    <span className="text-[10px] not-italic opacity-40 font-serif mr-1">ID No.</span>
                    <span className="tracking-tighter">0004</span>
                </div>
            </div>

            {/* 3. Main Content: Flex Container (Photo + Attributes) */}
            <div className="flex gap-10 flex-grow mb-4">
                {/* Photo Column */}
                <div className="w-[160px] shrink-0">
                    <div className="aspect-[3/4] w-full bg-[#fafaf9] rounded-[2rem] border-[2px] border-[#2d2418] shadow-sm relative overflow-hidden force-border">
                        {image ? (
                            <img src={image} alt="顔写真" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center flex flex-col items-center justify-center h-full opacity-5">
                                <span className="text-6xl">📸</span>
                                <span className="text-[10px] font-black tracking-[0.2em] mt-2">PHOTO</span>
                            </div>
                        )}
                    </div>
                   <p className="mt-3 text-[10px] text-center font-bold tracking-[0.2em] text-[#a8a29e]">近影・加工可</p>
                </div>

                {/* Information Column */}
                <div className="flex-1 flex flex-col gap-6 pt-2">
                    {/* Name Block */}
                    <div className="relative">
                        <span className="text-[10px] font-black tracking-[0.2em] text-[#c9a64e] flex items-center gap-2 mb-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e]"></span> なまえ
                        </span>
                        <div className="text-3xl pl-4 font-black h-10 flex items-center text-[#2d2418]">
                            {name || ''}
                        </div>
                        <div className="w-full h-[3px] bg-[#2d2418] rounded-full" />
                    </div>

                    {/* Nickname Block */}
                    <div className="relative">
                        <span className="text-[10px] font-black tracking-[0.2em] text-[#c9a64e] flex items-center gap-2 mb-1 opacity-70">
                           <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e] opacity-70"></span> 呼び方
                        </span>
                        <div className="text-xl pl-6 font-bold h-7 flex items-center text-[#2d2418]">
                            {nickname || ''}
                        </div>
                        <div className="w-full h-[1px] bg-[#2d2418]/20" />
                    </div>

                    {/* Room and Home row */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="relative">
                            <span className="text-[9px] font-black text-[#c9a64e] block mb-1">部屋番号</span>
                            <div className="text-2xl pl-4 font-black h-8 flex items-end text-[#a84032] italic">
                                {roomNumber ? `${roomNumber}号室` : ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/10 mt-1" />
                        </div>
                        <div className="relative">
                            <span className="text-[9px] font-black text-[#c9a64e] block mb-1">本拠地</span>
                            <div className="text-base pl-4 font-bold h-8 flex items-end overflow-hidden text-[#2d2418] truncate">
                                {baseLocation || ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/10 mt-1" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Footer Section: Committee Signature & Small Stamp Area */}
            <div className="mt-auto">
                <div className="flex justify-between items-end">
                    {/* Committee Signature Block */}
                    <div className="pb-2">
                        <div className="flex items-center gap-4 mb-2 opacity-20">
                            <span className="text-[8px] font-bold tracking-widest uppercase">ABOVE INFORMATION IS ACCURATE AND TRUE.</span>
                            <div className="h-px bg-[#2d2418] w-24"></div>
                        </div>
                        <h2 className="text-4xl font-black tracking-[0.3em] font-serif text-[#2d2418] leading-none">メゾン・ド・きょー管理委員会</h2>
                    </div>

                    {/* SNS and Text Block */}
                    <div className="flex flex-col items-end gap-3 pr-24 pb-1">
                        <div className="text-right">
                             <span className="text-[9px] font-black text-[#c9a64e] mb-1 block">自由記載</span>
                             <div className="text-[11px] font-bold text-[#2d2418]/60 leading-tight max-w-[180px] whitespace-pre-wrap">{freeText || ''}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#2d2418] flex items-center justify-center text-white text-[10px] font-black shadow-md">X</div>
                            <div className="w-7 h-7 rounded-lg bg-[#a84032] flex items-center justify-center text-white text-[8px] font-black shadow-md">Yt</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Approval Stamp (Overlaid) */}
            <div className="absolute bottom-6 right-10 w-36 h-36 pointer-events-none select-none z-30">
                <div className="w-full h-full rounded-full flex flex-col items-center justify-center font-black transform -rotate-[12deg] force-border" 
                     style={{ border: '4px solid rgba(168, 64, 50, 0.3)', color: 'rgba(168, 64, 50, 0.5)' }}>
                    <div className="w-full text-center py-1 flex flex-col items-center">
                        <div className="w-3/4 h-[1px] bg-[#a84032]/20 mb-2" />
                        <span className="text-[7px] tracking-[0.2em] font-black opacity-60 uppercase mb-1">Approved by Maison</span>
                        <span className="text-4xl block leading-none tracking-[0.3em] pr-[-0.3em]">承認済</span>
                        <div className="w-3/4 h-[1px] bg-[#a84032]/20 mt-2" />
                    </div>
                </div>
            </div>
        </div>
    );
}
