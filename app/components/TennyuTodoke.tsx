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
            className={`w-[850px] h-[600px] text-black p-10 relative mx-auto overflow-hidden ${captureMode ? '' : 'shadow-2xl'}`}
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

            {/* Solid Frame Line */}
            <div className="absolute top-5 left-5 right-5 bottom-5 border-[2.5px] border-[#2d2418] pointer-events-none force-border" />

            {/* Header Section: Title & Date/No */}
            <header className="relative z-10 pt-4 px-10">
                <div className="text-center mb-6">
                    <div className="text-[9px] tracking-[0.5em] font-bold text-[#c9a64e] mb-1 opacity-80">MAISON DE KYO RESIDENT REGISTRATION</div>
                    <h1 className="text-5xl font-black tracking-[0.8em] whitespace-nowrap text-[#2d2418] mr-[-0.8em] font-serif">入居届</h1>
                    <div className="w-80 h-[1.5px] bg-gradient-to-r from-transparent via-[#2d2418]/20 to-transparent mx-auto mt-4" />
                </div>

                <div className="flex justify-between items-end mb-4 px-4">
                    <div className="min-w-[200px]">
                        <span className="text-[9px] font-bold text-[#c9a64e] tracking-widest block mb-1">REGISTRATION DATE</span>
                        <div className="text-2xl font-black text-[#2d2418] font-serif border-b-[2px] border-[#2d2418]/10 force-border pb-1">令和七年 七月 十一日</div>
                    </div>
                    <div className="text-2xl font-black italic flex items-baseline" style={{ color: '#c9a64e' }}>
                        <span className="text-[10px] not-italic opacity-60 font-serif mr-1">No.</span>
                        <span className="tracking-tighter">0004</span>
                    </div>
                </div>
            </header>

            {/* Content Section: Flex Grid */}
            <div className="flex gap-10 px-14 relative z-10">
                {/* Left: Photo column */}
                <div className="w-[180px] shrink-0">
                    <div className="aspect-[3/4] w-full bg-[#fafaf9] rounded-[2.5rem] border-[3px] border-[#2d2418] shadow-md relative overflow-hidden force-border">
                        {image ? (
                            <img src={image} alt="顔写真" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center flex flex-col items-center justify-center h-full opacity-10">
                                <span className="text-5xl">📸</span>
                                <span className="text-[8px] font-black tracking-widest mt-1">PHOTO</span>
                            </div>
                        )}
                    </div>
                    <p className="mt-4 text-[10px] text-center font-black tracking-widest text-[#a8a29e] bg-[#2d2418]/5 py-1.5 rounded-full">近影・加工可</p>
                </div>

                {/* Right: Info column */}
                <div className="flex-1 space-y-6 pt-2">
                    {/* Name */}
                    <div className="relative">
                        <span className="text-[9px] font-black tracking-widest text-[#c9a64e] flex items-center gap-1.5 mb-1">
                           <span className="w-1 h-1 rounded-full bg-[#c9a64e]"></span> なまえ
                        </span>
                        <div className="text-3xl pl-4 font-black text-[#2d2418] h-10 flex items-center">{name || ''}</div>
                        <div className="w-full h-[4px] bg-[#2d2418] rounded-full" />
                    </div>

                    {/* Nickname */}
                    <div className="relative">
                        <span className="text-[9px] font-black tracking-widest text-[#c9a64e] flex items-center gap-1.5 mb-1 opacity-70">
                           <span className="w-1 h-1 rounded-full bg-[#c9a64e] opacity-70"></span> 呼び方
                        </span>
                        <div className="text-xl pl-6 font-black text-[#2d2418] h-8 flex items-center">{nickname || ''}</div>
                        <div className="w-full h-[1px] bg-[#2d2418]/20" />
                    </div>

                    {/* Room & Location row */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="relative">
                            <span className="text-[9px] font-black tracking-[0.2em] text-[#c9a64e] block mb-1">部屋番号</span>
                            <div className="text-2xl pl-4 font-black h-8 flex items-end text-[#a84032] italic tracking-tighter">
                                {roomNumber ? `${roomNumber}号室` : ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/10" />
                        </div>
                        <div className="relative">
                            <span className="text-[9px] font-black tracking-[0.2em] text-[#c9a64e] block mb-1">本拠地</span>
                            <div className="text-lg pl-4 font-bold h-8 flex items-end text-[#2d2418] truncate">
                                {baseLocation || ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/10" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Separated to avoid overlap */}
            <div className="absolute bottom-10 left-0 w-full px-14 z-10">
                <div className="flex justify-between items-end">
                    {/* Signature and Committee */}
                    <div className="max-w-[450px]">
                        <div className="flex items-center gap-4 mb-2 opacity-20">
                            <span className="text-[8px] font-bold tracking-widest whitespace-nowrap">ABOVE INFORMATION IS ACCURATE AND TRUE.</span>
                            <div className="h-px bg-[#2d2418] flex-1"></div>
                        </div>
                        <h2 className="text-3xl font-black tracking-[0.4em] font-serif text-[#2d2418] whitespace-nowrap">メゾン・ド・きょー管理委員会</h2>
                    </div>

                    {/* Free Text and SNS Icons */}
                    <div className="flex flex-col items-end gap-3 pr-28">
                         <div className="text-right">
                            <span className="text-[9px] font-black text-[#c9a64e] block mb-1">自由記載</span>
                            <div className="text-[11px] font-bold text-[#2d2418]/60 leading-tight max-w-[150px] whitespace-pre-wrap">
                                {freeText || ''}
                            </div>
                         </div>
                         <div className="flex gap-2 mr-4">
                            <div className="w-7 h-7 rounded-lg bg-[#2d2418] flex items-center justify-center text-white text-[10px] font-black shadow-md">X</div>
                            <div className="w-7 h-7 rounded-lg bg-[#a84032] flex items-center justify-center text-white text-[8px] font-black shadow-md">Yt</div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Approval Stamp: Absolute positioned to avoid content push */}
            <div className="absolute bottom-8 right-12 w-40 h-40 pointer-events-none select-none z-20">
                <div className="w-full h-full rounded-full flex flex-col items-center justify-center font-black transform -rotate-[12deg] force-border" 
                     style={{ border: '4px solid rgba(168, 64, 50, 0.4)', color: 'rgba(168, 64, 50, 0.6)' }}>
                    <div className="w-full text-center py-2 relative flex flex-col items-center">
                        <div className="w-2/3 h-[1px] bg-[#a84032]/20 mb-2" />
                        <span className="text-[7px] tracking-[0.4em] block leading-none font-black opacity-60 mb-2 uppercase">Approved by Maison</span>
                        <span className="text-4xl block leading-none tracking-[0.4em] pr-[-0.4em]">承認済</span>
                        <div className="w-2/3 h-[1px] bg-[#a84032]/20 mt-2" />
                    </div>
                </div>
            </div>
        </div>
    );
}
}
