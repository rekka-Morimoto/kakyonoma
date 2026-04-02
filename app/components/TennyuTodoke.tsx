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
            className={`w-[850px] h-[600px] text-black pt-10 pb-8 px-16 relative mx-auto overflow-hidden bg-white flex flex-col justify-between ${captureMode ? '' : 'shadow-2xl'}`}
            style={{
                fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif',
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
            
            {/* Main Outer Decorative Border */}
            <div className="absolute top-6 left-6 right-6 bottom-6 border-[1.5px] border-[#2d2418] pointer-events-none force-border opacity-80" />

            {/* --- Block 1: Header (Title, Date, No.) --- */}
            <header className="relative z-10 w-full mb-3">
                <div className="text-center mb-3">
                    <div className="text-[10px] tracking-[0.5em] font-bold text-[#c9a64e] mb-1 font-serif uppercase">Resident Registration Form</div>
                    <h1 className="text-4xl font-black tracking-[0.8em] whitespace-nowrap text-[#2d2418] mr-[-0.8em] font-serif leading-tight">入居届</h1>
                    <div className="w-56 h-[1px] bg-gradient-to-r from-transparent via-[#2d2418]/20 to-transparent mx-auto mt-2" />
                </div>
                
                <div className="flex justify-between items-end px-2">
                    <div className="min-w-[180px]">
                        <span className="text-[9px] font-bold text-[#c9a64e] tracking-widest block mb-1">REGISTRATION DATE</span>
                        <div className="text-lg font-bold border-b border-[#2d2418]/10 force-border pb-1">令和七年 七月 十一日</div>
                    </div>
                    <div className="text-xl font-black italic flex items-baseline gap-1" style={{ color: '#c9a64e' }}>
                        <span className="text-[9px] not-italic opacity-40 font-serif mr-1">No.</span>
                        <span className="tracking-tighter">0004</span>
                    </div>
                </div>
            </header>

            {/* --- Block 2: Main Body (Photo + Profile) --- */}
            <main className="relative z-10 flex-grow flex gap-10 py-1 overflow-hidden">
                {/* Photo Column */}
                <div className="w-[150px] shrink-0 pt-2">
                    <div className="aspect-[3/4] w-full bg-[#fafaf9] rounded-[2rem] border-[2px] border-[#2d2418] shadow-sm relative overflow-hidden force-border">
                        {image ? (
                            <img src={image} alt="顔写真" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center flex flex-col items-center justify-center h-full opacity-5">
                                <span className="text-5xl">📸</span>
                                <span className="text-[10px] font-black tracking-widest mt-2">PHOTO</span>
                            </div>
                        )}
                    </div>
                    <p className="mt-3 text-[9px] text-center font-bold tracking-widest text-[#a8a29e] opacity-70">近影・加工可</p>
                </div>

                {/* Profile Column */}
                <div className="flex-1 flex flex-col justify-between gap-4 py-1">
                    {/* Name & Nickname Group */}
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="text-[9px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                               <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e]"></span> なまえ
                            </span>
                            <div className="text-2xl pl-4 font-black h-8 flex items-center text-[#2d2418]">
                               {name || ''}
                            </div>
                            <div className="w-full h-[2px] bg-[#2d2418] rounded-full" />
                        </div>

                        <div className="relative">
                            <span className="text-[9px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1 opacity-70">
                               <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e] opacity-70"></span> 呼び方
                            </span>
                            <div className="text-base pl-6 font-bold h-6 flex items-center text-[#2d2418]">
                               {nickname || ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/20" />
                        </div>
                    </div>

                    {/* SNS Group */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="relative">
                            <span className="text-[9px] font-black text-[#c9a64e] flex items-center gap-2 mb-1">
                                <span className="w-1 h-1 rounded-full bg-[#c9a64e]"></span> X ID
                            </span>
                            <div className="text-sm pl-4 font-bold h-6 flex items-center text-[#2d2418]">
                                {xAccount || ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/20" />
                        </div>
                        <div className="relative">
                            <span className="text-[9px] font-black text-[#c9a64e] flex items-center gap-2 mb-1">
                                <span className="w-1 h-1 rounded-full bg-[#c9a64e]"></span> Youtube Channel
                            </span>
                            <div className="text-sm pl-4 font-bold h-6 flex items-center text-[#2d2418] truncate">
                                {youtubeAccount || ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/20" />
                        </div>
                    </div>

                    {/* Room & Location Group */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="relative">
                            <span className="text-[9px] font-bold text-[#c9a64e] block mb-1 tracking-wider">部屋番号</span>
                            <div className="text-xl pl-4 font-black h-7 flex items-end text-[#a84032] italic">
                               {roomNumber ? `${roomNumber}号室` : ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/10 mt-1" />
                        </div>
                        <div className="relative">
                            <span className="text-[9px] font-bold text-[#c9a64e] block mb-1 tracking-wider">本拠地</span>
                            <div className="text-sm pl-4 font-bold h-7 flex items-end text-[#2d2418] truncate">
                               {baseLocation || ''}
                            </div>
                            <div className="w-full h-[1px] bg-[#2d2418]/10 mt-1" />
                        </div>
                    </div>
                </div>
            </main>

            {/* --- Block 3: Footer (Signature, SNS Icons, Stamp) --- */}
            <footer className="relative z-10 w-full pt-2 flex flex-col justify-end">
                <div className="flex justify-between items-end">
                    {/* Left: Signature area */}
                    <div className="pb-1 max-w-[420px]">
                        <div className="flex items-center gap-4 mb-2 opacity-20">
                            <span className="text-[8px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">Above information is accurate and true.</span>
                            <div className="h-px bg-[#2d2418] flex-grow"></div>
                        </div>
                        <h2 className="text-3xl font-black tracking-[0.4em] font-serif text-[#2d2418] leading-none mb-1">メゾン・ド・きょー管理委員会</h2>
                    </div>

                    {/* Right: Free Text and Icons */}
                    <div className="flex flex-col items-end gap-2 pr-24">
                        <div className="text-right">
                            <span className="text-[9px] font-black text-[#c9a64e] mb-1 block tracking-widest">自由記載</span>
                            <div className="text-[10px] font-bold text-[#2d2418]/50 leading-tight max-w-[180px] whitespace-pre-wrap">{freeText || ''}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#2d2418] flex items-center justify-center text-white text-[10px] font-black shadow-sm">X</div>
                            <div className="w-7 h-7 rounded-full bg-[#a84032] flex items-center justify-center text-white text-[8px] font-black shadow-sm font-sans italic">Yt</div>
                        </div>
                    </div>
                </div>

                {/* Stamp */}
                <div className="absolute -top-6 right-8 w-32 h-32 pointer-events-none select-none z-20">
                    <div className="w-full h-full rounded-full flex flex-col items-center justify-center font-black transform -rotate-[12deg] force-border" 
                         style={{ border: '3px solid rgba(168, 64, 50, 0.25)', color: 'rgba(168, 64, 50, 0.45)' }}>
                        <div className="w-full text-center py-1 flex flex-col items-center">
                            <div className="w-2/3 h-[1px] bg-[#a84032]/20 mb-2" />
                            <span className="text-[7px] tracking-[0.1em] font-black opacity-60 uppercase mb-1">Approve</span>
                            <span className="text-2xl block leading-none tracking-[0.3em] pr-[-0.3em]">承認済</span>
                            <div className="w-2/3 h-[1px] bg-[#a84032]/20 mt-2" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
