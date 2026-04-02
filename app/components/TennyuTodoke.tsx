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
                fontFamily: "'Kaisei Tokumin', serif",
                backgroundColor: '#fdfbf7', // Antique Off-white
                color: '#2d2418',
                boxShadow: captureMode ? 'none' : '0 20px 50px rgba(0,0,0,0.3)',
            }}
        >
            {/* FORCE RESET BORDERS FOR IMAGE GENERATION - SURGICAL RESET */}
            <style>{`
                #tennyu-todoke *:not(.force-border) {
                    border: none !important;
                    outline: none !important;
                }
                #tennyu-todoke .force-border {
                    border-style: solid !important;
                }
                .stamp-texture {
                    filter: url(#stamp-filter);
                }
                .text-luxury {
                    text-shadow: 0.8px 0.8px 0px rgba(201, 166, 78, 0.4), -0.8px -0.8px 0px rgba(201, 166, 78, 0.4);
                }
                .corner-accent {
                    width: 40px;
                    height: 40px;
                    border-color: #c9a64e !important;
                    opacity: 0.6;
                }
            `}</style>
            
            {/* SVG Filter for Stamp Texture */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="stamp-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                </filter>
            </svg>

            {/* Luxurious Double Border & Glow */}
            <div className="absolute inset-0 bg-radial-gradient(circle, transparent 70%, rgba(201, 166, 78, 0.05) 100%) pointer-events-none z-0" />
            <div className="absolute top-4 left-4 right-4 bottom-4 border-[3px] border-[#2d2418] pointer-events-none force-border z-0 opacity-90 shadow-sm" />
            <div className="absolute top-6 left-6 right-6 bottom-6 border border-[#c9a64e]/50 pointer-events-none force-border z-0" />

            {/* Corner Ornaments */}
            <div className="absolute top-8 left-8 corner-accent border-t-2 border-l-2 force-border z-0" />
            <div className="absolute top-8 right-8 corner-accent border-t-2 border-r-2 force-border z-0" />
            <div className="absolute bottom-8 left-8 corner-accent border-b-2 border-l-2 force-border z-0" />
            <div className="absolute bottom-8 right-8 corner-accent border-b-2 border-r-2 force-border z-0" />

            {/* --- Block 1: Header --- */}
            <header className="relative z-10 w-full mb-2">
                {/* Mascot Sticker Placement */}
                <div className="absolute top-[-15px] right-[-15px] w-52 h-52 pointer-events-none select-none z-20">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-[#c9a64e]/10 rounded-full blur-2xl" />
                    <img 
                        src="/mascot.png" 
                        alt="Mascot" 
                        className="w-full h-full object-contain"
                        style={{
                            filter: 'drop-shadow(3px 3px 0 white) drop-shadow(-3px -3px 0 white) drop-shadow(3px -3px 0 white) drop-shadow(-3px 3px 0 white) drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                        }}
                    />
                </div>

                <div className="text-center mb-6 pl-0 pr-32">
                    <div className="text-[11px] tracking-[0.4em] font-bold text-[#c9a64e] mb-1 uppercase opacity-90">RESIDENT REGISTRATION CARD</div>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-[1px] bg-[#c9a64e]/50" />
                        <h1 className="text-5xl font-black tracking-[0.8em] text-[#2d2418] mr-[-0.8em] leading-none text-luxury">入居届</h1>
                        <div className="w-12 h-[1px] bg-[#c9a64e]/50" />
                    </div>
                </div>
                
                <div className="flex justify-between items-end px-4 pr-48">
                    <div className="min-w-[180px]">
                        <span className="text-[9px] font-bold text-[#c9a64e] tracking-widest block mb-1">REGISTRATION DATE</span>
                        <div className="text-lg font-bold border-b border-[#2d2418]/15 force-border pb-1">令和七年 七月 十一日</div>
                    </div>
                    <div className="flex flex-col items-start translate-x-[-10px]">
                        <span className="text-[9px] font-bold text-[#c9a64e] tracking-[0.1em] mb-0.5">RESIDENT ID</span>
                        <div className="text-xl font-black italic flex items-baseline gap-1" style={{ color: '#c9a64e' }}>
                            <span className="text-[10px] not-italic opacity-40 mr-1">NO.</span>
                            <span className="tracking-tighter">{String(residentId).padStart(4, '0')}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Block 2: Main Body --- */}
            <main className="relative z-10 flex-grow flex gap-12 py-1 overflow-hidden font-medium">
                {/* Photo Frame */}
                <div className="w-[160px] shrink-0 pt-4">
                    <div className="aspect-[3/4] w-full bg-white rounded-2xl border-[3.8px] border-[#2d2418] shadow-lg relative overflow-hidden force-border">
                        {image ? (
                            <img src={image} alt="顔写真" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center flex flex-col items-center justify-center h-full bg-[#f5f1e8]">
                                <span className="text-5xl opacity-10">📸</span>
                                <span className="text-[9px] font-black tracking-widest mt-2 opacity-30 text-[#2d2418]">貼付欄</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 px-3 py-1 bg-[#c9a64e]/10 rounded-full text-center border border-[#c9a64e]/20 force-border shadow-sm">
                        <p className="text-[10px] font-bold tracking-widest text-[#a8a29e]">近影・加工可</p>
                    </div>
                </div>

                {/* Profile Fields */}
                <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="text-[11px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                               <span className="w-2.5 h-2.5 rounded-sm rotate-45 bg-[#c9a64e] shadow-sm"></span> なまえ
                            </span>
                            <div className="text-3xl pl-4 font-black h-9 flex items-center text-[#2d2418] tracking-wider">
                               {name || ''}
                            </div>
                            <div className="w-full h-[3px] bg-[#2d2418] rounded-full opacity-90 shadow-sm" />
                        </div>

                        <div className="relative">
                            <span className="text-[11px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1 opacity-80">
                               <span className="w-2.5 h-2.5 rounded-sm rotate-45 bg-[#c9a64e]/60 opacity-70"></span> 呼び方
                            </span>
                            <div className="text-xl pl-6 font-bold h-7 flex items-center text-[#2d2418]">
                               {nickname || ''}
                            </div>
                            <div className="w-full h-[1px] border-b border-[#2d2418]/20 force-border h-px mt-0.5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="relative">
                            <span className="text-[10px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e]"></span> Twitter(現 X)
                            </span>
                            <div className="text-sm pl-4 font-bold h-6 flex items-center text-[#2d2418]">
                                {xAccount || ''}
                            </div>
                            <div className="w-full border-b border-[#2d2418]/20 force-border h-px" />
                        </div>
                        <div className="relative">
                            <span className="text-[10px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a64e]"></span> YouTube
                            </span>
                            <div className="text-sm pl-4 font-bold h-6 flex items-center text-[#2d2418] truncate">
                                {youtubeAccount || ''}
                            </div>
                            <div className="w-full border-b border-[#2d2418]/20 force-border h-px" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="relative">
                            <span className="text-[10px] font-bold text-[#c9a64e] block mb-1 tracking-widest uppercase">ROOM NUMBER</span>
                            <div className="text-2xl pl-4 font-black h-8 flex items-end text-[#a84032] italic">
                               {roomNumber ? `${roomNumber}号室` : ''}
                            </div>
                            <div className="w-full border-b border-[#2d2418]/20 force-border h-px mt-1" />
                        </div>
                        <div className="relative">
                            <span className="text-[10px] font-bold text-[#c9a64e] block mb-1 tracking-widest uppercase">HOME LOCATION</span>
                            <div className="text-sm pl-4 font-bold h-8 flex items-end text-[#2d2418] truncate">
                               {baseLocation || ''}
                            </div>
                            <div className="w-full border-b border-[#2d2418]/20 force-border h-px mt-1" />
                        </div>
                    </div>

                    <div className="relative">
                        <span className="text-[11px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full border border-[#c9a64e]/50 bg-[#c9a64e]/20 force-border"></span> 自由記載
                        </span>
                        <div className="text-[12px] pl-6 font-bold h-10 flex items-start text-[#2d2418]/70 leading-relaxed whitespace-pre-wrap overflow-hidden">
                            {freeText || ''}
                        </div>
                        <div className="w-full border-b border-[#2d2418]/15 force-border h-px mt-1" />
                    </div>
                </div>
            </main>

            {/* --- Block 3: Footer --- */}
            <footer className="relative z-10 w-full pt-4 min-h-[90px]">
                <div className="flex justify-between items-end">
                    {/* Authority Name */}
                    <div className="pb-1 max-w-[500px]">
                        <div className="flex items-center gap-4 mb-2 opacity-50">
                            <span className="text-[8px] font-bold tracking-[0.4em] uppercase whitespace-nowrap">Official Registration Approval</span>
                            <div className="h-[0.5px] bg-[#2d2418]/40 flex-grow"></div>
                        </div>
                        <h2 className="text-3xl font-black tracking-[0.5em] text-[#2d2418] leading-none mb-1 opacity-95">メゾン・ド・きょー管理委員会</h2>
                    </div>

                    {/* Red Stamp Area */}
                    <div className="absolute -top-12 -right-4 w-48 h-48 pointer-events-none select-none z-10">
                        <div className="w-full h-full rounded-full flex items-center justify-center font-black stamp-texture transform -rotate-[12deg] force-border" 
                             style={{ 
                                 border: '4.5px double rgba(168, 64, 50, 0.55)', 
                                 color: 'rgba(168, 64, 50, 0.85)',
                                 backgroundColor: 'rgba(168, 64, 50, 0.05)',
                                 boxShadow: '0 4px 15px rgba(168, 64, 50, 0.1)'
                             }}>
                            <div className="w-[90%] h-[90%] rounded-full flex flex-col items-center justify-center border-2 border-[rgba(168, 64, 50, 0.25)] force-border">
                                <span className="text-[7px] tracking-[0.4em] font-black opacity-60 uppercase mb-2">Maison de Kyo Seal</span>
                                <div className="w-3/4 h-[0.5px] bg-[rgba(168, 64, 50, 0.3)] mb-2" />
                                <span className="text-4xl block leading-none tracking-[0.4em] pr-[-0.4em]">承認済</span>
                                <div className="w-3/4 h-[0.5px] bg-[rgba(168, 64, 50, 0.3)] mt-2" />
                                <span className="text-[9px] mt-2 font-bold opacity-50 tracking-widest">管理委員会之印</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

