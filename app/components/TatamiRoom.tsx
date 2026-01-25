'use client';
import React, { useMemo, useState, useRef } from 'react';
import { getBuildingStyle } from '../utils/buildingConstants';

interface Resident {
    id: number;
    name: string;
    icon: string;
    image: string;
    roomNumber: number;
    building?: string;
}

interface TatamiRoomProps {
    residents: Resident[];
}

interface MatPosition {
    gridArea: string;
    orientation: 'v' | 'h';
}

export default function TatamiRoom({ residents }: TatamiRoomProps) {
    const residentCount = residents.length;
    const containerRef = useRef<HTMLDivElement>(null);

    const [scale, setScale] = useState(0.8);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    const getLayout = (count: number): { cols: number; rows: number; mats: MatPosition[] } => {
        // High buffer ratio to allow for sparse placement
        const targetMatCount = Math.ceil(count * 4.0) + 20;
        const cols = Math.ceil(Math.sqrt(targetMatCount * 2));
        const finalCols = cols % 2 === 0 ? cols : cols + 1;
        const rows = Math.ceil((targetMatCount * 2) / finalCols);

        const mats: MatPosition[] = [];
        for (let r = 0; r < rows; r += 2) {
            for (let c = 0; c < finalCols; c += 2) {
                if ((Math.floor(r / 2) + Math.floor(c / 2)) % 2 === 0) {
                    mats.push({ gridArea: `${r + 1} / ${c + 1} / ${r + 2} / ${c + 3}`, orientation: 'h' });
                    mats.push({ gridArea: `${r + 2} / ${c + 1} / ${r + 3} / ${c + 3}`, orientation: 'h' });
                } else {
                    mats.push({ gridArea: `${r + 1} / ${c + 1} / ${r + 3} / ${c + 2}`, orientation: 'v' });
                    mats.push({ gridArea: `${r + 1} / ${c + 2} / ${r + 3} / ${c + 3}`, orientation: 'v' });
                }
            }
        }
        return { cols: finalCols, rows, mats };
    };

    const layout = useMemo(() => getLayout(residentCount), [residentCount]);

    const placedResidents = useMemo(() => {
        const slots: (Resident | null)[] = new Array(layout.mats.length).fill(null);

        const parseArea = (area: string) => {
            const parts = area.split(' / ').map(Number);
            return { rs: parts[0], cs: parts[1], re: parts[2], ce: parts[3] };
        };

        const sharesEdge = (areaA: string, areaB: string) => {
            const a = parseArea(areaA);
            const b = parseArea(areaB);

            // Overlap check
            const hOverlap = Math.max(a.cs, b.cs) < Math.min(a.ce, b.ce);
            const vOverlap = Math.max(a.rs, b.rs) < Math.min(a.re, b.re);

            const touchesH = a.rs === b.re || a.re === b.rs;
            const touchesV = a.cs === b.ce || a.ce === b.cs;

            return (touchesH && hOverlap) || (touchesV && vOverlap);
        };

        // Placement Logic: Greedy + Relaxed Validation
        residents.forEach((resident) => {
            for (let i = 0; i < layout.mats.length; i++) {
                if (slots[i]) continue;

                const candidateArea = layout.mats[i].gridArea;
                const candidateRoom = Number(resident.roomNumber);
                const candidateBuilding = resident.building;

                // Get all residents already sharing an edge with THIS mat
                const currentNeighbors: { idx: number, res: Resident }[] = [];
                for (let j = 0; j < layout.mats.length; j++) {
                    if (slots[j] && sharesEdge(candidateArea, layout.mats[j].gridArea)) {
                        currentNeighbors.push({ idx: j, res: slots[j]! });
                    }
                }

                // 1. Same-room-and-building adjacency check: 
                // Candidate can't touch anyone from same room AND same building
                // But can touch same room from DIFFERENT building
                if (currentNeighbors.some(n =>
                    Number(n.res.roomNumber) === candidateRoom &&
                    n.res.building === candidateBuilding
                )) continue;

                // Removed strict clique uniqueness to allow clustering of different buildings with same room #

                // Passed checks
                slots[i] = resident;
                break;
            }
        });

        return slots;
    }, [residents, layout]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMousePos.x;
        const dy = e.clientY - lastMousePos.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleWheel = (e: React.WheelEvent) => {
        setScale(s => Math.min(Math.max(s + (e.deltaY > 0 ? -0.1 : 0.1), 0.2), 3));
    };

    return (
        <div
            ref={containerRef}
            className={`w-full h-full bg-[#3e3b2e] relative overflow-hidden cursor-${isDragging ? 'grabbing' : 'grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out select-none"
                style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}>
                <div className="grid border-4 border-[#1a1814] shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    style={{ gridTemplateColumns: `repeat(${layout.cols}, 80px)`, gridTemplateRows: `repeat(${layout.rows}, 80px)`, backgroundColor: '#1a1814', padding: '1px' }}>
                    {layout.mats.map((mat, index) => {
                        const resident = placedResidents[index];
                        const isHorizontal = mat.orientation === 'h';
                        return (
                            <div key={index} className="bg-[#d7cc95] relative group" style={{ gridArea: mat.gridArea }}>
                                {isHorizontal ? (
                                    <>
                                        <div className="absolute top-0 w-full h-[10px] bg-[#1a2e1d]" />
                                        <div className="absolute bottom-0 w-full h-[10px] bg-[#1a2e1d]" />
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute left-0 h-full w-[10px] bg-[#1a2e1d]" />
                                        <div className="absolute right-0 h-full w-[10px] bg-[#1a2e1d]" />
                                    </>
                                )}
                                {resident && (
                                    <div className="absolute inset-0 flex items-center justify-center p-2 z-20 pointer-events-none">
                                        <div
                                            className={`flex items-center gap-2 p-2 bg-[#fcf8e3]/95 rounded border shadow-md ${getBuildingStyle(resident.building).border}`}
                                            style={{ transform: isHorizontal ? 'none' : 'rotate(90deg)', width: isHorizontal ? 'auto' : '170px' }}
                                        >
                                            <div className={`w-12 h-12 rounded-full border-2 overflow-hidden bg-white shrink-0 shadow-sm ${getBuildingStyle(resident.building).border}`}>
                                                <img src={resident.icon || resident.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col text-left overflow-hidden">
                                                <div className="text-sm font-bold text-stone-900 leading-none truncate max-w-[100px]">{resident.name}</div>
                                                <div className={`text-[10px] font-bold uppercase tracking-tighter ${getBuildingStyle(resident.building).text}`}>
                                                    {resident.roomNumber}号室
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls Overlay */}
            <div className="absolute top-1/2 -translate-y-1/2 right-6 bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex flex-col z-[100] shadow-2xl">
                <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-3 text-white hover:bg-white/10 rounded-xl transition text-xl font-bold" title="拡大">+</button>
                <div className="h-px bg-white/10 mx-2" />
                <button onClick={() => setScale(s => Math.max(s - 0.2, 0.2))} className="p-3 text-white hover:bg-white/10 rounded-xl transition text-xl font-bold" title="縮小">-</button>
                <div className="h-px bg-white/10 mx-2" />
                <button onClick={() => { setScale(0.8); setOffset({ x: 0, y: 0 }); }} className="p-3 text-white hover:bg-white/10 rounded-xl transition text-xl" title="リセット">⟲</button>
            </div>

            {/* Legend / Info Overlay */}
            <div className="absolute bottom-6 right-6 z-50 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] tracking-widest text-right">DRAG TO PAN • WHEEL TO ZOOM</p>
            </div>
        </div>
    );
}
