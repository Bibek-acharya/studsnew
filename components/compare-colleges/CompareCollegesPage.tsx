import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type { College } from "@/services/api";

interface CompareCollegesPageProps {
    onNavigate: (view: string, data?: { college1: Partial<College> | string; college2: Partial<College> | string }) => void;
}

const CompareCollegesPage: React.FC<CompareCollegesPageProps> = ({ onNavigate }) => {
    const [college1, setCollege1] = useState("");
    const [college2, setCollege2] = useState("");
    const [selectedCollege1, setSelectedCollege1] = useState<College | null>(null);
    const [selectedCollege2, setSelectedCollege2] = useState<College | null>(null);
    const [showDropdown1, setShowDropdown1] = useState(false);
    const [showDropdown2, setShowDropdown2] = useState(false);

    const wrapperRef1 = useRef<HTMLDivElement>(null);
    const wrapperRef2 = useRef<HTMLDivElement>(null);

    const { data: collegesData, isLoading } = useQuery({
        queryKey: ["all-colleges-compare"],
        queryFn: () => apiService.getColleges({ pageSize: 100 })
    });

    const colleges = collegesData?.data?.colleges || [];
    const collegesList = [...colleges].sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef1.current && !wrapperRef1.current.contains(event.target as Node)) {
                setShowDropdown1(false);
            }
            if (wrapperRef2.current && !wrapperRef2.current.contains(event.target as Node)) {
                setShowDropdown2(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filtered1 = collegesList.filter(c => c.name.toLowerCase().includes(college1.toLowerCase()));
    const filtered2 = collegesList.filter(c => c.name.toLowerCase().includes(college2.toLowerCase()));

    const handleSelect1 = (college: College) => {
        setCollege1(college.name);
        setSelectedCollege1(college);
        setShowDropdown1(false);
    };

    const handleSelect2 = (college: College) => {
        setCollege2(college.name);
        setSelectedCollege2(college);
        setShowDropdown2(false);
    };

    const handleCompare = () => {
        const c1 = selectedCollege1 || colleges.find(c => c.name === college1);
        const c2 = selectedCollege2 || colleges.find(c => c.name === college2);
        if (c1 || c2) {
            onNavigate("compareCollegesResult", {
                college1: c1 || { name: college1 },
                college2: c2 || { name: college2 }
            });
        }
    };

    return (
        <div className="bg-[#f8f9fc] min-h-screen flex flex-col items-center w-full font-sans pb-16 pt-6">
            <div className="bg-[#536DFE] w-full max-w-7xl mx-auto relative overflow-visible flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-2xl mx-4 md:mx-auto" style={{ minHeight: 655 }}>
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-x-0 bottom-0 z-0 h-[300px] pointer-events-none opacity-90">
                        <svg width="100%" height="100%" viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,400 L0,250 L80,250 L80,180 L180,180 L180,220 L280,220 L280,150 L380,150 L380,260 L480,260 L480,120 L600,120 L600,200 L700,200 L700,160 L850,160 L850,240 L950,240 L950,140 L1100,140 L1100,210 L1200,210 L1200,170 L1350,170 L1350,250 L1440,250 L1440,400 Z" fill="#6079F9" opacity="0.7" />
                            <path d="M50,400 L50,280 L200,280 L200,200 L320,200 L320,290 L480,290 L480,180 L620,180 L620,270 L780,270 L780,150 L920,150 L920,280 L1080,280 L1080,190 L1220,190 L1220,290 L1440,290 L1440,400 Z" fill="#4B66EE" />
                            <path d="M0,400 L0,340 Q300,320 600,350 T1440,330 L1440,400 Z" fill="#425EDD" />
                            <path d="M0,400 L0,370 Q400,350 800,380 T1440,360 L1440,400 Z" fill="#3A53C5" />
                            <g transform="translate(0, 80)">
                                <rect x="0" y="0" width="130" height="320" fill="#6A85F5" />
                                <rect x="0" y="0" width="130" height="10" fill="#4B66EE" />
                                <rect x="0" y="100" width="130" height="2" fill="#88A1FB" />
                                <rect x="0" y="210" width="130" height="2" fill="#88A1FB" />
                                <rect x="20" y="30" width="30" height="35" fill="#536DFE" rx="2" />
                                <rect x="80" y="30" width="30" height="35" fill="#536DFE" rx="2" />
                                <rect x="20" y="130" width="30" height="35" fill="#536DFE" rx="2" />
                                <rect x="80" y="130" width="30" height="35" fill="#536DFE" rx="2" />
                                <rect x="20" y="240" width="30" height="35" fill="#536DFE" rx="2" />
                                <rect x="80" y="240" width="30" height="35" fill="#536DFE" rx="2" />
                            </g>
                            <g transform="translate(1310, 80)">
                                <rect x="0" y="0" width="130" height="320" fill="#6A85F5" />
                                <rect x="0" y="0" width="130" height="10" fill="#4B66EE" />
                                <rect x="0" y="120" width="130" height="2" fill="#88A1FB" />
                                <rect x="0" y="230" width="130" height="2" fill="#88A1FB" />
                                <rect x="20" y="40" width="30" height="35" fill="#536DFE" rx="2" />
                                <rect x="80" y="40" width="30" height="35" fill="#536DFE" rx="2" />
                                <rect x="20" y="150" width="30" height="35" fill="#536DFE" rx="2" />
                                <rect x="80" y="150" width="30" height="35" fill="#536DFE" rx="2" />
                                <rect x="20" y="260" width="30" height="35" fill="#536DFE" rx="2" />
                                <rect x="80" y="260" width="30" height="35" fill="#536DFE" rx="2" />
                            </g>
                            <path d="M180,360 Q185,310 195,360 Z" fill="#6A85F5" />
                            <circle cx="190" cy="320" r="18" fill="#6A85F5" />
                            <path d="M400,380 Q420,340 440,380 Z" fill="#425EDD" />
                            <path d="M900,370 Q920,330 940,370 Z" fill="#425EDD" />
                            <path d="M1250,350 Q1255,300 1265,350 Z" fill="#6A85F5" />
                            <circle cx="1255" cy="300" r="15" fill="#6A85F5" />
                            <g fill="#6A85F5" opacity="0.8">
                                <path d="M350,120 Q355,115 360,120 Q365,115 370,120 Q365,122 360,118 Q355,122 350,120 Z" />
                                <path d="M380,135 Q383,132 386,135 Q389,132 392,135 Q389,137 386,134 Q383,137 380,135 Z" />
                                <path d="M1050,90 Q1055,85 1060,90 Q1065,85 1070,90 Q1065,92 1060,88 Q1055,92 1050,90 Z" />
                            </g>
                        </svg>
                    </div>
                </div>

                <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
                    <div className="text-center mb-10 max-w-3xl">
                        <h1 className="text-white text-4xl md:text-5xl lg:text-[52px] font-bold leading-tight tracking-tight mb-4">
                            Compare colleges to<br />find the best fit
                        </h1>
                        <p className="text-white text-lg md:text-xl font-medium opacity-95">
                            Because you deserve better
                        </p>
                    </div>

                    <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                        <div className="relative w-full md:w-[420px] rounded-full" ref={wrapperRef1}>
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg className="h-[22px] w-[22px] text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={college1}
                                onFocus={() => setShowDropdown1(true)}
                                onChange={(e) => {
                                    setCollege1(e.target.value);
                                    setSelectedCollege1(null);
                                    setShowDropdown1(true);
                                }}
                                className="w-full bg-white rounded-full py-4 pl-14 pr-6 text-[16px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
                                placeholder="Add first college"
                                autoComplete="off"
                            />

                            {showDropdown1 && (
                                <ul className="absolute top-full left-0 w-full bg-white mt-2 rounded-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 max-h-[260px] overflow-y-auto z-50 text-left py-2">
                                    {isLoading ? (
                                        <li className="px-5 py-3 text-gray-500 text-sm">Loading colleges...</li>
                                    ) : filtered1.length === 0 ? (
                                        <li className="px-5 py-3 text-gray-500 text-sm italic">No colleges found</li>
                                    ) : (
                                        filtered1.map((c) => (
                                            <li
                                                key={c.id}
                                                className="px-5 py-3.5 text-gray-700 hover:bg-[#F3F4F6] hover:text-[#3182CE] font-medium cursor-pointer text-[15px] transition-colors border-b border-gray-50 last:border-0"
                                                onClick={() => handleSelect1(c)}
                                            >
                                                {c.name}
                                                {c.location && (
                                                    <span className="text-gray-400 text-sm ml-2">- {c.location}</span>
                                                )}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                        </div>

                        <div className="flex-shrink-0 flex items-center justify-center py-2 md:py-0">
                            <span className="text-white font-bold text-xl lowercase tracking-wide">vs</span>
                        </div>

                        <div className="relative w-full md:w-[420px] rounded-full" ref={wrapperRef2}>
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg className="h-[22px] w-[22px] text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={college2}
                                onFocus={() => setShowDropdown2(true)}
                                onChange={(e) => {
                                    setCollege2(e.target.value);
                                    setSelectedCollege2(null);
                                    setShowDropdown2(true);
                                }}
                                className="w-full bg-white rounded-full py-4 pl-14 pr-6 text-[16px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
                                placeholder="Add second college"
                                autoComplete="off"
                            />

                            {showDropdown2 && (
                                <ul className="absolute top-full left-0 w-full bg-white mt-2 rounded-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 max-h-[260px] overflow-y-auto z-50 text-left py-2">
                                    {isLoading ? (
                                        <li className="px-5 py-3 text-gray-500 text-sm">Loading colleges...</li>
                                    ) : filtered2.length === 0 ? (
                                        <li className="px-5 py-3 text-gray-500 text-sm italic">No colleges found</li>
                                    ) : (
                                        filtered2.map((c) => (
                                            <li
                                                key={c.id}
                                                className="px-5 py-3.5 text-gray-700 hover:bg-[#F3F4F6] hover:text-[#3182CE] font-medium cursor-pointer text-[15px] transition-colors border-b border-gray-50 last:border-0"
                                                onClick={() => handleSelect2(c)}
                                            >
                                                {c.name}
                                                {c.location && (
                                                    <span className="text-gray-400 text-sm ml-2">- {c.location}</span>
                                                )}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleCompare}
                            disabled={!college1 && !college2}
                            className="bg-[#1a2b4c] text-white font-bold text-[16px] px-10 py-3.5 rounded-full shadow-[0_4px_14px_0_rgba(26,43,76,0.39)] hover:shadow-[0_6px_20px_rgba(26,43,76,0.23)] hover:bg-[#111c33] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Compare Now
                        </button>
                    </div>
                </main>
            </div>

            <section className="w-full max-w-7xl mx-auto mt-16 px-4">
                <h2 className="text-[#1a2b4c] text-3xl font-bold mb-8 tracking-tight">Popular comparisons</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { c1: "Pulchowk Campus", c2: "Kathmandu University", short1: "Pulchowk", short2: "KU" },
                        { c1: "KUSOM", c2: "Apex College", short1: "KUSOM", short2: "Apex" },
                        { c1: "St. Xavier's College", c2: "Trinity International College", short1: "SXC", short2: "Trinity" },
                        { c1: "NCIT", c2: "Kantipur Engineering College", short1: "NCIT", short2: "KEC" },
                        { c1: "British College", c2: "Islington College", short1: "British", short2: "Islington" },
                        { c1: "NATHM", c2: "Silver Mountain", short1: "NATHM", short2: "SM" },
                    ].map((pair) => {
                        const found1 = colleges.find(c => c.name.toLowerCase() === pair.c1.toLowerCase());
                        const found2 = colleges.find(c => c.name.toLowerCase() === pair.c2.toLowerCase());
                        return (
                            <div
                                key={pair.c1}
                                onClick={() => onNavigate("compareCollegesResult", {
                                    college1: found1 || { name: pair.c1 },
                                    college2: found2 || { name: pair.c2 }
                                })}
                                className="bg-white rounded-md border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 pt-8 pb-8 relative flex justify-between items-center cursor-pointer hover:translate-y-[-4px] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] transition-all duration-200"
                            >
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f1f3f6] text-gray-500 text-[11px] font-bold rounded-full w-8 h-8 flex items-center justify-center border-4 border-white z-10">VS</div>
                                <div className="absolute left-1/2 top-1/4 bottom-1/4 w-px bg-gray-100 -translate-x-1/2 z-0"></div>

                                <div className="flex flex-col items-center w-1/2 px-2 z-10">
                                    <div className="h-14 flex items-center justify-center mb-3">
                                        {found1?.image_url || found1?.logo_url ? (
                                            <img src={found1.image_url || found1.logo_url} alt={pair.short1} className="w-10 h-10 object-contain" />
                                        ) : (
                                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="20" cy="20" r="20" fill="#EBF4FF" />
                                                <path d="M20 10L10 28H30L20 10Z" fill="#3182CE" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="bg-[#73c836] text-white text-[12px] font-bold px-2 py-0.5 rounded flex items-center gap-1 mb-2">
                                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                        {found1?.rating?.toFixed(1) || "N/A"}
                                    </div>
                                    <span className="text-[15px] font-bold text-[#1a2b4c] text-center">{pair.short1}</span>
                                </div>

                                <div className="flex flex-col items-center w-1/2 px-2 z-10">
                                    <div className="h-14 flex items-center justify-center mb-3">
                                        {found2?.image_url || found2?.logo_url ? (
                                            <img src={found2.image_url || found2.logo_url} alt={pair.short2} className="w-10 h-10 object-contain" />
                                        ) : (
                                            <span className="text-xl font-bold text-[#2B6CB0] tracking-wider">{pair.short2}</span>
                                        )}
                                    </div>
                                    <div className="bg-[#73c836] text-white text-[12px] font-bold px-2 py-0.5 rounded flex items-center gap-1 mb-2">
                                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                        {found2?.rating?.toFixed(1) || "N/A"}
                                    </div>
                                    <span className="text-[15px] font-bold text-[#1a2b4c] text-center">{pair.short2}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="w-full max-w-7xl mx-auto mt-8 px-4 mb-16 flex flex-col md:flex-row justify-between gap-4">
                <div className="bg-white rounded-md w-full md:w-[681px] h-[151px] relative overflow-hidden group flex-shrink-0">
                    <span className="absolute top-2 right-2 text-[9px] text-white/90 font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm px-2 py-1 rounded z-10">Advertisement</span>
                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=681&h=151&q=80" alt="Ad 1" className="w-full h-full object-cover" />
                </div>

                <div className="bg-white rounded-md w-full md:w-[681px] h-[151px] relative overflow-hidden group flex-shrink-0">
                    <span className="absolute top-2 right-2 text-[9px] text-white/90 font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm px-2 py-1 rounded z-10">Advertisement</span>
                    <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=681&h=151&q=80" alt="Ad 2" className="w-full h-full object-cover" />
                </div>
            </section>
        </div>
    );
};

export default CompareCollegesPage;
