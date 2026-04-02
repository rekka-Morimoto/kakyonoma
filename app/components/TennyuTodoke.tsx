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
            className={`w-[850px] h-[600px] text-black pt-10 pb-8 px-16 relative mx-auto overflow-hidden flex flex-col justify-between ${captureMode ? '' : 'shadow-2xl'}`}
            style={{
                fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif',
                backgroundColor: '#fdfbf7', // Antique Off-white
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
                .stamp-texture {
                    filter: url(#stamp-filter);
                }
            `}</style>
            
            {/* SVG Filter for Stamp Texture */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="stamp-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                </filter>
            </svg>

            {/* Retro Double Border */}
            <div className="absolute top-5 left-5 right-5 bottom-5 border border-[#2d2418]/20 pointer-events-none force-border z-0" />
            <div className="absolute top-7 left-7 right-7 bottom-7 border-[1.5px] border-[#2d2418] pointer-events-none force-border opacity-80 z-0" />

            {/* --- Block 1: Header Area (Title, Date, No.) --- */}
            <header className="relative z-10 w-full mb-2">
                <div className="text-center mb-4">
                    <div className="text-[10px] tracking-[0.4em] font-bold text-[#c9a64e] mb-1 font-serif uppercase opacity-80">Resident Registration Form</div>
                    <div className="flex items-center justify-center gap-6">
                        <div className="w-12 h-[1px] bg-[#c9a64e]/40" />
                        <h1 className="text-5xl font-black tracking-[0.8em] whitespace-nowrap text-[#2d2418] mr-[-0.8em] font-serif leading-none">入居届</h1>
                        <div className="w-12 h-[1px] bg-[#c9a64e]/40" />
                    </div>
                </div>
                
                <div className="flex justify-between items-end px-4">
                    <div className="min-w-[170px]">
                        <span className="text-[9px] font-bold text-[#c9a64e] tracking-widest block mb-1">REGISTRATION DATE</span>
                        <div className="text-lg font-bold border-b border-[#2d2418]/10 force-border pb-1">令和七年 七月 十一日</div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-bold text-[#c9a64e] tracking-[0.1em] mb-0.5">RESIDENT ID</span>
                        <div className="text-xl font-black italic flex items-baseline gap-1" style={{ color: '#c9a64e' }}>
                            <span className="text-[9px] not-italic opacity-40 font-serif">№</span>
                            <span className="tracking-tighter">0004</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Block 2: Main Body --- */}
            <main className="relative z-10 flex-grow flex gap-12 py-1 overflow-hidden">
                {/* Photo (Retro frame) */}
                <div className="w-[155px] shrink-0 pt-4">
                    <div className="aspect-[3/4] w-full bg-white rounded-2xl border-[3px] border-[#2d2418] shadow-md relative overflow-hidden force-border">
                        {image ? (
                            <img src={image} alt="顔写真" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center flex flex-col items-center justify-center h-full bg-[#f5f1e8]">
                                <span className="text-4xl opacity-10">📸</span>
                                <span className="text-[8px] font-black tracking-widest mt-2 opacity-20 uppercase">貼付</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 px-2 py-1 bg-[#2d2418]/5 rounded-md text-center">
                        <p className="text-[9px] font-bold tracking-widest text-[#a8a29e]">近影・加工可</p>
                    </div>
                </div>

                {/* Profile Grid */}
                <div className="flex-1 flex flex-col justify-between py-2">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="text-[10px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                               <span className="w-2 h-2 rounded-sm rotate-45 border border-[#c9a64e]/30 bg-[#c9a64e] force-border"></span> なまえ
                            </span>
                            <div className="text-3xl pl-4 font-black h-8 flex items-center text-[#2d2418]">
                               {name || ''}
                            </div>
                            <div className="w-full h-[3px] bg-[#2d2418] rounded-full" />
                        </div>

                        <div className="relative">
                            <span className="text-[10px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1 opacity-70">
                               <span className="w-2 h-2 rounded-sm rotate-45 border border-[#c9a64e]/20 bg-[#c9a64e]/60 force-border"></span> 呼び方
                            </span>
                            <div className="text-xl pl-6 font-bold h-6 flex items-center text-[#2d2418]">
                               {nickname || ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/20" />
                        </div>
                    </div>

                    {/* SNS Section (Stacked in columns for retro form feel) */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="relative">
                            <span className="text-[9px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full border border-[#c9a64e]/30 bg-[#c9a64e] force-border"></span> X ID
                            </span>
                            <div className="text-sm pl-4 font-bold h-6 flex items-center text-[#2d2418]">
                                {xAccount || ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/20" />
                        </div>
                        <div className="relative">
                            <span className="text-[9px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full border border-[#c9a64e]/30 bg-[#c9a64e] force-border"></span> Youtube
                            </span>
                            <div className="text-sm pl-4 font-bold h-6 flex items-center text-[#2d2418] truncate">
                                {youtubeAccount || ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/20" />
                        </div>
                    </div>

                    {/* Footer Stats row */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="relative">
                            <span className="text-[9px] font-bold text-[#c9a64e] block mb-1 tracking-widest">部屋番号</span>
                            <div className="text-2xl pl-4 font-black h-7 flex items-end text-[#a84032] italic">
                               {roomNumber ? `${roomNumber}号室` : ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/10 mt-1" />
                        </div>
                        <div className="relative">
                            <span className="text-[9px] font-bold text-[#c9a64e] block mb-1 tracking-widest">本拠地</span>
                            <div className="text-sm pl-4 font-bold h-7 flex items-end text-[#2d2418] truncate">
                               {baseLocation || ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/10 mt-1" />
                        </div>
                    </div>

                    {/* Free Text row */}
                    <div className="relative">
                        <span className="text-[9px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full border border-[#c9a64e]/30 bg-[#c9a64e] force-border"></span> 自由記載
                        </span>
                        <div className="text-[11px] pl-6 font-bold h-10 flex items-start text-[#2d2418]/60 leading-tight whitespace-pre-wrap overflow-hidden">
                            {freeText || ''}
                        </div>
                        <div className="w-full h-[1.5px] bg-[#2d2418]/10 mt-1" />
                    </div>
                </div>
            </main>

            {/* --- Block 3: Footer (Signature and Seal) --- */}
            <footer className="relative z-10 w-full pt-4 min-h-[100px]">
                <div className="flex justify-between items-end">
                    {/* Committee Signature */}
                    <div className="pb-1 max-w-[520px]">
                        <div className="flex items-center gap-4 mb-2 opacity-30">
                            <span className="text-[7px] font-black tracking-[0.3em] uppercase whitespace-nowrap">Resident Registration Approval</span>
                            <div className="h-[0.5px] bg-[#2d2418] flex-grow"></div>
                        </div>
                        <h2 className="text-3xl font-black tracking-[0.5em] font-serif text-[#2d2418] leading-none mb-1 opacity-90">メゾン・ド・きょー管理委員会</h2>
                    </div>

                    {/* Mascot & Stamp area */}
                    <div className="relative w-64 h-24">
                        {/* Mascot Sticker */}
                        <div className="absolute -left-4 bottom-2 w-32 h-32 pointer-events-none select-none z-10 transform rotate-[8deg]">
                            <img 
                                src="/mascot.png" 
                                alt="Mascot" 
                                className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                                style={{
                                    WebkitFilter: 'drop-shadow(2px 2px 0 white) drop-shadow(-2px -2px 0 white) drop-shadow(2px -2px 0 white) drop-shadow(-2px 2px 0 white)'
                                }}
                            />
                        </div>

                        {/* Stamp - Decorative "Kyo Seal" */}
                        <div className="absolute top-[-30px] right-[-10px] w-40 h-40 pointer-events-none select-none z-20">
                            <div className="w-full h-full rounded-full flex items-center justify-center font-black stamp-texture transform -rotate-[14deg] force-border" 
                                 style={{ 
                                     border: '3.5px double rgba(168, 64, 50, 0.5)', 
                                     color: 'rgba(168, 64, 50, 0.75)',
                                     backgroundColor: 'rgba(168, 64, 50, 0.05)'
                                 }}>
                                <div className="w-[90%] h-[90%] rounded-full flex flex-col items-center justify-center border-2 border-[rgba(168, 64, 50, 0.2)] force-border">
                                    <span className="text-[6px] tracking-[0.3em] font-black opacity-60 uppercase mb-2">Maison de Kyo Official</span>
                                    <div className="w-3/4 h-[0.5px] bg-[rgba(168, 64, 50, 0.3)] mb-2" />
                                    <span className="text-4xl block leading-none tracking-[0.3em] pr-[-0.3em] font-serif">承認済</span>
                                    <div className="w-3/4 h-[0.5px] bg-[rgba(168, 64, 50, 0.3)] mt-2" />
                                    <span className="text-[8px] mt-2 font-bold opacity-50 tracking-widest">管理委員会之印</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
