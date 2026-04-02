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
            className={`w-[850px] h-[600px] pt-10 pb-8 px-16 relative mx-auto overflow-hidden flex flex-col justify-between ${captureMode ? '' : 'shadow-2xl'}`}
            style={{
                fontFamily: "'Kaisei Tokumin', serif",
                backgroundColor: '#fdfbf7',
                color: '#2d2418',
                boxShadow: captureMode ? 'none' : '0 20px 50px rgba(0,0,0,0.3)',
            }}
        >
            <style>{`
                .stamp-texture { filter: url(#stamp-filter); }
                .text-luxury { text-shadow: 0.8px 0.8px 0px rgba(201, 166, 78, 0.4); }
                .corner-accent { width: 40px; height: 40px; border-color: #c9a64e !important; opacity: 0.6; pointer-events: none; }
            `}</style>
            
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="stamp-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                </filter>
            </svg>

            {/* Decorations */}
            <div className="absolute inset-0 bg-radial-gradient(circle, transparent 70%, rgba(201, 166, 78, 0.05) 100%) pointer-events-none z-0" />
            <div className="absolute top-4 left-4 right-4 bottom-4 border-[3px] border-[#2d2418] border-solid pointer-events-none z-0 opacity-90" />
            <div className="absolute top-6 left-6 right-6 bottom-6 border border-[#c9a64e]/50 border-solid pointer-events-none z-0" />
            <div className="absolute top-8 left-8 corner-accent border-t-2 border-l-2 border-solid z-0" />
            <div className="absolute top-8 right-8 corner-accent border-t-2 border-r-2 border-solid z-0" />
            <div className="absolute bottom-8 left-8 corner-accent border-b-2 border-l-2 border-solid z-0" />
            <div className="absolute bottom-8 right-8 corner-accent border-b-2 border-r-2 border-solid z-0" />

            {/* Header */}
            <header className="relative z-10 w-full mb-2">
                <div className="absolute top-[-25px] right-[-35px] w-56 h-56 pointer-events-none select-none z-20">
                    <img src="/mascot.png" alt="" className="w-full h-full object-contain" style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.1))' }} />
                </div>
                <div className="w-full flex flex-col items-center justify-center pt-2">
                    <div className="text-[11px] tracking-[0.4em] font-bold text-[#c9a64e] mb-2 uppercase leading-none whitespace-nowrap">RESIDENT REGISTRATION CARD</div>
                    <div className="flex items-center justify-center gap-6 w-full max-w-[400px]">
                        <div className="flex-grow h-[1px] bg-[#c9a64e]/40" />
                        <h1 className="text-5xl font-black tracking-[0.8em] text-[#2d2418] mr-[-0.8em] leading-none text-luxury whitespace-nowrap">入居届</h1>
                        <div className="flex-grow h-[1px] bg-[#c9a64e]/40" />
                    </div>
                </div>
                <div className="flex justify-between items-end px-8 mt-10 w-full">
                    <div className="flex flex-col min-w-[240px]">
                        <span className="text-[9px] font-bold text-[#c9a64e] tracking-widest block mb-1.5 uppercase leading-none">REGISTRATION DATE</span>
                        <div className="text-xl font-bold text-[#2d2418] leading-none">{currentDate}</div>
                        <div className="h-[1px] bg-[#2d2418]/20 w-full mt-2" />
                    </div>
                    <div className="flex flex-col items-end pr-20">
                        <span className="text-[9px] font-bold text-[#c9a64e] tracking-[0.1em] mb-1 uppercase leading-none">RESIDENT ID</span>
                        <div className="text-2xl font-black italic flex items-baseline gap-1" style={{ color: '#c9a64e' }}>
                            <span className="text-[10px] not-italic opacity-40 mr-1">NO.</span>
                            <span className="tracking-tighter">{String(residentId).padStart(4, '0')}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="relative z-10 flex-grow flex gap-12 py-2 overflow-hidden font-medium">
                <div className="w-[160px] shrink-0 pt-4">
                    <div className="aspect-[3/4] w-full bg-white rounded-2xl border-[3.8px] border-solid border-[#2d2418] shadow-lg relative overflow-hidden">
                        {image && <img src={image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="mt-4 px-3 py-1 bg-[#c9a64e]/10 rounded-full text-center border border-solid border-[#c9a64e]/20 shadow-sm">
                        <p className="text-[10px] font-bold tracking-widest text-[#a8a29e]">近影・加工可</p>
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-2 overflow-hidden">
                    <div className="space-y-5">
                        <div className="relative">
                            <span className="text-[11px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1 uppercase leading-none">なまえ</span>
                            <div className="text-3xl pl-4 font-black h-10 flex items-center text-[#2d2418] tracking-wider leading-none">{name}</div>
                            <div className="w-full h-[3px] bg-[#2d2418] rounded-full opacity-90" />
                        </div>
                        <div className="relative">
                            <span className="text-[11px] font-black tracking-widest text-[#c9a64e] flex items-center gap-2 mb-1 opacity-80 uppercase leading-none">呼び方</span>
                            <div className="text-xl pl-6 font-bold h-8 flex items-center text-[#2d2418] leading-none">{nickname}</div>
                            <div className="h-[1px] bg-[#2d2418]/20 w-full mt-1.5" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="text-[10px] font-black tracking-widest text-[#c9a64e] block mb-1.5 uppercase leading-none">Twitter(現 X)</span>
                            <div className="text-sm pl-4 font-bold h-6 flex items-center text-[#2d2418] leading-none">{xAccount}</div>
                            <div className="h-[1px] bg-[#2d2418]/20 w-full mt-1.5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black tracking-widest text-[#c9a64e] block mb-1.5 uppercase leading-none">YouTube</span>
                            <div className="text-sm pl-4 font-bold h-6 flex items-center text-[#2d2418] truncate leading-none">{youtubeAccount}</div>
                            <div className="h-[1px] bg-[#2d2418]/20 w-full mt-1.5" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="text-[10px] font-bold text-[#c9a64e] block mb-1.5 tracking-widest uppercase leading-none">ROOM NUMBER</span>
                            <div className="text-2xl pl-4 font-black h-8 flex items-end text-[#a84032] italic leading-none">{roomNumber ? `${roomNumber}号室` : ''}</div>
                            <div className="h-[1px] bg-[#2d2418]/20 w-full mt-1.5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-[#c9a64e] block mb-1.5 tracking-widest uppercase leading-none">HOME LOCATION</span>
                            <div className="text-sm pl-4 font-bold h-8 flex items-end text-[#2d2418] truncate leading-none">{baseLocation}</div>
                            <div className="h-[1px] bg-[#2d2418]/20 w-full mt-1.5" />
                        </div>
                    </div>
                    <div>
                        <span className="text-[11px] font-black tracking-widest text-[#c9a64e] block mb-2 uppercase leading-none">自由記載</span>
                        <div className="text-[12px] pl-6 font-bold h-12 flex items-start text-[#2d2418]/70 leading-relaxed whitespace-pre-wrap overflow-hidden">{freeText}</div>
                        <div className="h-[1px] bg-[#2d2418]/15 w-full mt-1" />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full pt-4 min-h-[90px]">
                <div className="flex justify-between items-end">
                    <div className="pb-1 max-w-[500px]">
                        <div className="flex items-center gap-4 mb-2 opacity-50">
                            <span className="text-[8px] font-bold tracking-[0.4em] uppercase whitespace-nowrap leading-none">Official Approval Authority</span>
                            <div className="h-[0.5px] bg-[#2d2418]/40 flex-grow"></div>
                        </div>
                        <h2 className="text-3xl font-black tracking-[0.5em] text-[#2d2418] leading-none mb-1 opacity-95">メゾン・ド・きょー管理委員会</h2>
                    </div>
                    <div className="absolute -top-12 -right-4 w-48 h-48 pointer-events-none select-none z-10 shadow-sm">
                        <div className="w-full h-full rounded-full flex items-center justify-center font-black stamp-texture transform -rotate-[12deg] border-[4.5px] border-double border-solid" style={{ borderColor: 'rgba(168, 64, 50, 0.55)', color: 'rgba(168, 64, 50, 0.85)', backgroundColor: 'rgba(168, 64, 50, 0.05)' }}>
                            <div className="w-[90%] h-[90%] rounded-full flex flex-col items-center justify-center border-2 border-solid border-[rgba(168, 64, 50, 0.25)]">
                                <span className="text-[7px] tracking-[0.4em] font-black opacity-60 uppercase mb-2 leading-none">Seal</span>
                                <div className="w-3/4 h-[0.5px] bg-[rgba(168, 64, 50, 0.3)] mb-2" />
                                <span className="text-4xl block leading-none tracking-[0.4em] pr-[-0.4em]">承認済</span>
                                <div className="w-3/4 h-[0.5px] bg-[rgba(168, 64, 50, 0.3)] mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
