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
                backgroundColor: '#fffdfa',
                color: '#2d2418',
                boxShadow: captureMode ? 'none' : undefined,
            }}
        >
            {/* Pattern Overlay for POP/Cute feeling */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #c9a64e 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #2d2418 25%, transparent 25%, transparent 50%, #2d2418 50%, #2d2418 75%, transparent 75%, transparent)', backgroundSize: '4px 4px' }}></div>

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

            {/* Decorative Elaborate Frames */}
            <div className="absolute top-4 left-4 right-4 h-[3px] bg-[#2d2418] pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 h-[3px] bg-[#2d2418] pointer-events-none" />
            <div className="absolute top-4 bottom-4 left-4 w-[3px] bg-[#2d2418] pointer-events-none" />
            <div className="absolute top-4 bottom-4 right-4 w-[3px] bg-[#2d2418] pointer-events-none" />
            
            <div className="absolute top-[22px] left-[22px] right-[22px] bottom-[22px] border-2 border-[#c9a64e]/30 pointer-events-none force-border rounded-lg" />

            {/* Title Header */}
            <div className="text-center mt-4 mb-4 flex flex-col items-center justify-center relative">
                <div className="inline-block px-16 pb-2">
                    <div className="text-xs tracking-[0.8em] font-bold text-[#c9a64e] mb-1">MAISON DE KYO • RESIDENT REGISTRATION</div>
                    <h1 className="text-6xl font-black tracking-[0.8em] whitespace-nowrap leading-none text-[#2d2418] mr-[-0.8em]">
                        入居届
                    </h1>
                </div>
                {/* Decorative underline */}
                <div className="w-80 h-1 bg-gradient-to-r from-transparent via-[#c9a64e] to-transparent opacity-60 mt-4" />
            </div>

            {/* Date and ID Area */}
            <div className="flex justify-between px-14 mb-6 items-end">
                <div className="min-w-[220px]">
                    <div className="text-[10px] font-bold text-[#c9a64e] tracking-widest mb-0.5">REGISTRATION DATE</div>
                    <div className="text-2xl font-black text-[#2d2418] border-b-2 border-[#2d2418] pb-1 force-border">
                        令和七年 七月 十一日
                    </div>
                </div>
                <div className="text-2xl font-black italic flex items-baseline gap-1" style={{ color: '#c9a64e' }}>
                    <span className="text-sm not-italic opacity-60">No.</span>
                    <span className="tracking-tighter">{String(residentId).padStart(4, '0')}</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex gap-12 px-14 relative z-10">
                {/* Left: Portrait Photo */}
                <div className="w-[190px] flex flex-col items-center">
                    {/* Photo Frame: More stylish */}
                    <div className="aspect-[3/4] w-full bg-[#2d2418] p-[3px] rounded-2xl shadow-xl relative overflow-hidden force-border">
                        <div className="w-full h-full bg-[#fafaf9] rounded-xl flex items-center justify-center overflow-hidden relative force-border">
                            {image ? (
                                <img src={image} alt="顔写真" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center flex flex-col items-center gap-2 text-[#d6d3d1]">
                                    <span className="text-5xl opacity-10">📸</span>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black tracking-widest text-[#c9a64e]">PHOTO</span>
                                        <span className="text-[8px] font-bold tracking-widest text-[#a8a29e]">写真貼付用</span>
                                    </div>
                                </div>
                            )}
                            {/* Decorative corner accents within the photo */}
                            <div className="absolute top-2 left-2 w-2 h-2 border-t-[1px] border-l-[1px] border-[#c9a64e]/40 rounded-tl-sm force-border" />
                            <div className="absolute top-2 right-2 w-2 h-2 border-t-[1px] border-r-[1px] border-[#c9a64e]/40 rounded-tr-sm force-border" />
                        </div>
                    </div>
                    <p className="mt-3 text-[10px] text-center font-bold tracking-widest text-[#a8a29e] bg-[#2d2418]/5 px-4 py-1 rounded-full">
                        近影・加工可
                    </p>
                </div>

                {/* Right: Personal Information */}
                <div className="flex-1 space-y-6">
                    {/* Name Block */}
                    <div className="relative group">
                        <span className="absolute -top-4 left-0 text-[10px] font-black tracking-[0.2em] text-[#c9a64e] flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e]"></span> なまえ
                        </span>
                        <div className="text-4xl pl-4 font-black h-12 flex items-end text-[#2d2418]">
                            {name || ''}
                        </div>
                        <div className="w-full h-[3px] bg-[#2d2418] rounded-full mt-1" />
                    </div>

                    {/* Nickname (Yobikata) */}
                    <div className="relative">
                        <span className="absolute -top-4 left-0 text-[10px] font-black tracking-[0.2em] text-[#c9a64e] flex items-center gap-2 text-opacity-70">
                           <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e] opacity-70"></span> 呼び方
                        </span>
                        <div className="text-2xl pl-6 font-bold h-9 flex items-end text-[#2d2418]">
                            {nickname || ''}
                        </div>
                        <div className="w-full h-px bg-[#2d2418]/40 mt-1" />
                    </div>

                    {/* Room and Location Block */}
                    <div className="grid grid-cols-2 gap-10">
                        <div className="relative">
                            <span className="absolute -top-4 left-0 text-[10px] font-black tracking-[0.2em] text-[#c9a64e] text-opacity-70">部屋番号</span>
                            <div className="text-2xl pl-6 font-black h-9 flex items-end text-[#a84032] italic">
                                {roomNumber ? `${roomNumber}号室` : ''}
                            </div>
                            <div className="w-full h-px bg-[#2d2418]/20 mt-1" />
                        </div>
                        <div className="relative">
                            <span className="absolute -top-4 left-0 text-[10px] font-black tracking-[0.2em] text-[#c9a64e] text-opacity-70">本拠地</span>
                            <div className="text-lg pl-6 font-bold h-9 flex items-end overflow-hidden text-[#2d2418]">
                                <span className="truncate">{baseLocation || ''}</span>
                            </div>
                            <div className="w-full h-px bg-[#2d2418]/20 mt-1" />
                        </div>
                    </div>

                    {/* Contacts & Free Text */}
                    <div className="grid grid-cols-5 gap-6 pt-2">
                        <div className="col-span-2 space-y-4">
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-[#2d2418] flex items-center justify-center text-white text-xs font-black">X</div>
                               <div className="text-sm font-bold text-[#2d2418] truncate">
                                   {xAccount ? `@${xAccount}` : '-'}
                               </div>
                           </div>
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-[#a84032] flex items-center justify-center text-white text-[8px] font-black">Yt</div>
                               <div className="text-sm font-bold text-[#2d2418] truncate">
                                   {youtubeAccount || '-'}
                               </div>
                           </div>
                        </div>
                        <div className="col-span-3 relative pl-4 border-l-2 border-[#c9a64e]/20 force-border h-[90px]">
                            <span className="absolute -top-4 left-4 text-[10px] font-black tracking-[0.2em] text-[#c9a64e]">自由記載</span>
                            <div className="text-[13px] leading-relaxed font-bold text-[#2d2418]/80 whitespace-pre-wrap h-full overflow-hidden">
                                {freeText || ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer and Declaration */}
            <div className="absolute bottom-8 left-0 w-full px-16 flex justify-between items-end">
                <div className="space-y-1">
                    <p className="text-[11px] tracking-[0.3em] font-bold text-[#2d2418]/40 uppercase">Above information is accurate and true.</p>
                    <p className="text-2xl font-black tracking-[0.3em] font-serif text-[#2d2418]">メゾン・ド・きょー管理委員会</p>
                </div>
            </div>

            {/* Pop & Modern Approval Stamp */}
            <div className="absolute bottom-10 right-20 w-32 h-32 pointer-events-none select-none">
                <div className="w-full h-full rounded-full flex flex-col items-center justify-center font-black transform -rotate-[15deg] force-border scale-110" 
                     style={{ border: '5px solid #a84032', color: '#a84032', boxShadow: '0 0 0 2px rgba(168, 64, 50, 0.1)' }}>
                    <div className="w-full text-center py-2 relative flex flex-col items-center">
                        <div className="w-4/5 h-[2px] bg-[#a84032]/40 mb-1" />
                        <span className="text-[9px] tracking-widest block leading-none font-black opacity-80 mb-1">APPROVED BY MAISON</span>
                        <span className="text-[32px] block leading-none tracking-[0.2em] mr-[-0.2em]">承認済</span>
                        <div className="w-4/5 h-[2px] bg-[#a84032]/40 mt-1" />
                    </div>
                </div>
                {/* Subtle digital glitch/offset effect for pop feel */}
                <div className="absolute inset-0 rounded-full border-4 border-[#c9a64e]/20 -z-10 blur-[1px]"></div>
            </div>
        </div>
    );
}
