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
            className={`w-[850px] h-[600px] text-black pt-10 pb-8 px-16 relative mx-auto overflow-hidden flex flex-col justify-between border-none ${captureMode ? '' : 'shadow-2xl'}`}
            style={{
                fontFamily: "'Kaisei Tokumin', serif",
                backgroundColor: '#fdfbf7', // Antique Off-white
                color: '#2d2418',
                boxShadow: captureMode ? 'none' : '0 20px 50px rgba(0,0,0,0.3)',
                isolation: 'isolate',
                border: 'none',
            }}
        >
            {/* CSS Logic to forcefully suppress ANY external borders from Tailwind v4 */}
            <style>{`
                #tennyu-todoke, #tennyu-todoke * {
                    border-color: transparent !important;
                    border-style: none !important;
                    border-width: 0 !important;
                    box-sizing: border-box;
                }
                .stamp-texture {
                    filter: url(#stamp-filter);
                }
                .text-luxury {
                    text-shadow: 0.8px 0.8px 0px rgba(201, 166, 78, 0.4), -0.8px -0.8px 0px rgba(201, 166, 78, 0.4);
                }
            `}</style>
            
            {/* SVG Filter for Stamp Texture */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="stamp-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                </filter>
            </svg>

            {/* --- PHYSICAL BORDERS (REPLACING CSS BORDERS) --- */}
            {/* Luxurious Double Border (Physical Elements) */}
            <div className="absolute top-4 left-4 right-4 h-[3px] bg-[#2d2418] z-10" />
            <div className="absolute bottom-4 left-4 right-4 h-[3px] bg-[#2d2418] z-10" />
            <div className="absolute top-4 bottom-4 left-4 w-[3px] bg-[#2d2418] z-10" />
            <div className="absolute top-4 bottom-4 right-4 w-[3px] bg-[#2d2418] z-10" />
            
            {/* Inner Thin Border */}
            <div className="absolute top-6 left-6 right-6 h-px bg-[#c9a64e]/50 z-10" />
            <div className="absolute bottom-6 left-6 right-6 h-px bg-[#c9a64e]/50 z-10" />
            <div className="absolute top-6 bottom-6 left-6 w-px bg-[#c9a64e]/50 z-10" />
            <div className="absolute top-6 bottom-6 right-6 w-px bg-[#c9a64e]/50 z-10" />

            {/* Corner Accents (Physical) */}
            <div className="absolute top-8 left-8 w-10 h-0.5 bg-[#c9a64e] opacity-60 z-10" />
            <div className="absolute top-8 left-8 w-0.5 h-10 bg-[#c9a64e] opacity-60 z-10" />
            <div className="absolute top-8 right-8 w-10 h-0.5 bg-[#c9a64e] opacity-60 z-10" />
            <div className="absolute top-8 right-8 w-0.5 h-10 bg-[#c9a64e] opacity-60 z-10" />
            <div className="absolute bottom-8 left-8 w-10 h-0.5 bg-[#c9a64e] opacity-60 z-10" />
            <div className="absolute bottom-8 left-8 w-0.5 h-10 bg-[#c9a64e] opacity-60 z-10" />
            <div className="absolute bottom-8 right-8 w-10 h-0.5 bg-[#c9a64e] opacity-60 z-10" />
            <div className="absolute bottom-8 right-8 w-0.5 h-10 bg-[#c9a64e] opacity-60 z-10" />

            {/* --- Block 1: Header --- */}
            <header className="relative z-10 w-full mb-2">
                <div className="absolute top-[-25px] right-[-35px] w-56 h-56 pointer-events-none select-none z-20">
                    <img 
                        src="/mascot.png" 
                        alt="Mascot" 
                        className="w-full h-full object-contain"
                        style={{
                            filter: 'drop-shadow(3px 3px 0 white) drop-shadow(-3px -3px 0 white) drop-shadow(3px -3px 0 white) drop-shadow(-3px 3px 0 white) drop-shadow(0 6px 12px rgba(0,0,0,0.1))'
                        }}
                    />
                </div>

                <div className="w-full flex flex-col items-center justify-center pt-2">
                    <div className="text-[11px] tracking-[0.4em] font-bold text-[#c9a64e] mb-2 uppercase opacity-90">RESIDENT REGISTRATION CARD</div>
                    <div className="flex items-center justify-center gap-6 w-full max-w-[500px]">
                        <div className="flex-grow h-px bg-[#c9a64e]/40" />
                        <h1 className="text-5xl font-black tracking-[0.8em] text-[#2d2418] mr-[-0.8em] leading-none text-luxury whitespace-nowrap">入居届</h1>
                        <div className="flex-grow h-px bg-[#c9a64e]/40" />
                    </div>
                </div>
                
                <div className="flex justify-between items-end px-4 mt-8 pr-12 w-full">
                    <div className="flex flex-col relative">
                        <span className="text-[9px] font-bold text-[#c9a64e] tracking-widest block mb-1">REGISTRATION DATE</span>
                        <div className="text-lg font-bold pb-1 min-w-[220px]">令和七年 七月 十一日</div>
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#2d2418]/20" />
                    </div>
                    {/* Move ID to a place where it won't overlap the character icon (middle-right) */}
                    <div className="flex flex-col items-end pr-36 relative">
                        <span className="text-[9px] font-bold text-[#c9a64e] tracking-[0.1em] mb-0.5 whitespace-nowrap">RESIDENT ID</span>
                        <div className="text-xl font-black italic flex items-baseline gap-1" style={{ color: '#c9a64e' }}>
                            <span className="text-[10px] not-italic opacity-40 mr-1">NO.</span>
                            <span className="tracking-tighter">{String(residentId).padStart(4, '0')}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Block 2: Main Body --- */}
            <main className="relative z-10 flex-grow flex gap-12 py-1 overflow-hidden font-medium">
                {/* Photo Frame (Physical Lines) */}
                <div className="w-[160px] shrink-0 pt-4">
                    <div className="aspect-[3/4] w-full bg-white rounded-2xl relative overflow-hidden shadow-lg">
                        {/* Physical Border for Photo */}
                        <div className="absolute inset-0 rounded-2xl border-none pointer-events-none z-20">
                            <div className="absolute top-0 left-0 right-0 h-[3.8px] bg-[#2d2418]" />
                            <div className="absolute bottom-0 left-0 right-0 h-[3.8px] bg-[#2d2418]" />
                            <div className="absolute top-0 bottom-0 left-0 w-[3.8px] bg-[#2d2418]" />
                            <div className="absolute top-0 bottom-0 right-0 w-[3.8px] bg-[#2d2418]" />
                        </div>
                        {image ? (
                            <img src={image} alt="顔写真" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center flex flex-col items-center justify-center h-full bg-[#f5f1e8]">
                                <span className="text-5xl opacity-10">📸</span>
                                <span className="text-[9px] font-black tracking-widest mt-2 opacity-30 text-[#2d2418]">貼付欄</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 px-3 py-1 bg-[#c9a64e]/10 rounded-full text-center shadow-sm">
                        <p className="text-[10px] font-bold tracking-widest text-[#a8a29e]">近影・加工可</p>
                    </div>
                </div>

                {/* Profile Fields */}
                <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="text-[11px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                               <span className="w-2.5 h-2.5 rounded-sm rotate-45 bg-[#c9a64e]"></span> なまえ
                            </span>
                            <div className="text-3xl pl-4 font-black h-9 flex items-center text-[#2d2418] tracking-wider leading-none">
                               {name || ''}
                            </div>
                            <div className="w-full h-1 bg-[#2d2418] rounded-full opacity-90" />
                        </div>

                        <div className="relative pb-0.5">
                            <span className="text-[11px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1 opacity-80">
                               <span className="w-2.5 h-2.5 rounded-sm rotate-45 bg-[#c9a64e]/60 opacity-70"></span> 呼び方
                            </span>
                            <div className="text-xl pl-6 font-bold h-7 flex items-center text-[#2d2418] leading-none">
                               {nickname || ''}
                            </div>
                            <div className="h-px bg-[#2d2418]/20 w-full mt-1.5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-2">
                        <div className="relative pb-0.5">
                            <span className="text-[10px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e]"></span> Twitter(現 X)
                            </span>
                            <div className="text-sm pl-4 font-bold h-6 flex items-center text-[#2d2418] leading-none">
                                {xAccount || ''}
                            </div>
                            <div className="h-px bg-[#2d2418]/20 w-full mt-1" />
                        </div>
                        <div className="relative pb-0.5">
                            <span className="text-[10px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e]"></span> YouTube
                            </span>
                            <div className="text-sm pl-4 font-bold h-6 flex items-center text-[#2d2418] truncate leading-none">
                                {youtubeAccount || ''}
                            </div>
                            <div className="h-px bg-[#2d2418]/20 w-full mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-2">
                        <div className="relative pb-1">
                            <span className="text-[10px] font-bold text-[#c9a64e] block mb-1 tracking-widest uppercase leading-none">ROOM NUMBER</span>
                            <div className="text-2xl pl-4 font-black h-8 flex items-end text-[#a84032] italic leading-none">
                               {roomNumber ? `${roomNumber}号室` : ''}
                            </div>
                            <div className="h-px bg-[#2d2418]/20 w-full mt-1" />
                        </div>
                        <div className="relative pb-1">
                            <span className="text-[10px] font-bold text-[#c9a64e] block mb-1 tracking-widest uppercase leading-none">HOME LOCATION</span>
                            <div className="text-base pl-4 font-bold h-8 flex items-end text-[#2d2418] truncate leading-none">
                               {baseLocation || ''}
                            </div>
                            <div className="h-px bg-[#2d2418]/20 w-full mt-1" />
                        </div>
                    </div>

                    <div className="relative mt-4 flex-grow">
                        <span className="text-[10px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-[#c9a64e]/30" /> 自由記載欄
                        </span>
                        <div className="relative px-6 py-3 min-h-[80px] bg-white/40 rounded-xl border-none">
                            {/* Decorative background lines for manual-writing feel */}
                            <div className="absolute inset-x-6 top-8 h-px bg-[#2d2418]/10" />
                            <div className="absolute inset-x-6 top-14 h-px bg-[#2d2418]/10" />
                            <div className="absolute inset-x-6 top-20 h-px bg-[#2d2418]/10" />
                            
                            <div className="relative z-10 text-[13px] font-bold text-[#2d2418]/80 leading-[1.5rem] whitespace-pre-wrap italic">
                                {freeText || '佳鏡院さんへの想いやきょーめいとへのメッセージ等'}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- Block 3: Footer --- */}
            <footer className="relative z-10 w-full pt-4 min-h-[90px]">
                <div className="flex justify-between items-end">
                    <div className="pb-1 w-full">
                        <div className="flex items-center gap-4 mb-2 opacity-50">
                            <span className="text-[8px] font-bold tracking-[0.4em] uppercase whitespace-nowrap leading-none">Official Approval Authority</span>
                            <div className="h-px bg-[#2d2418]/40 flex-grow"></div>
                        </div>
                        <h2 className="text-3xl font-black tracking-[0.5em] text-[#2d2418] leading-none mb-1 opacity-95 whitespace-nowrap">メゾン・ド・きょー管理委員会</h2>
                    </div>

                    <div className="absolute -top-12 -right-4 w-48 h-48 pointer-events-none select-none z-10">
                        <div className="w-full h-full rounded-full flex flex-col items-center justify-center font-black stamp-texture transform -rotate-[12deg] relative" 
                             style={{ 
                                 color: 'rgba(168, 64, 50, 0.85)',
                                 backgroundColor: 'rgba(168, 64, 50, 0.05)',
                             }}>
                            {/* Physical Stamp Circle Borders */}
                            <div className="absolute inset-0 rounded-full border-none z-0">
                                <div className="absolute inset-0 rounded-full border-transparent" style={{ boxShadow: 'inset 0 0 0 3px rgba(168, 64, 50, 0.55)' }} />
                                <div className="absolute inset-4 rounded-full border-transparent" style={{ boxShadow: 'inset 0 0 0 1px rgba(168, 64, 50, 0.25)' }} />
                            </div>
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-[7px] tracking-[0.4em] font-black opacity-60 uppercase mb-2 leading-none">Maison de Kyo Seal</span>
                                <div className="w-16 h-px bg-[rgba(168, 64, 50, 0.3)] mb-2" />
                                <span className="text-4xl block leading-none tracking-[0.4em] pr-[-0.4em]">承認済</span>
                                <div className="w-16 h-px bg-[rgba(168, 64, 50, 0.3)] mt-2" />
                                <span className="text-[9px] mt-2 font-bold opacity-50 tracking-widest leading-none">管理委員会之印</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}


