import React, { useState, useEffect, useRef, useCallback } from "react";
import { apiService } from "@/services/api";
import type { College } from "@/services/api";

interface InstitutionResult {
    id: number;
    institution_name: string;
    district?: string;
    location?: string;
    type?: string;
    institution_type?: string;
    logo_url?: string;
    card_image_url?: string;
    rating?: number;
    reviews?: number;
    college_id?: number;
}

interface PopularComparison {
  college1_id: number;
  college1_name: string;
  college2_id: number;
  college2_name: string;
  count: number;
}

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
    const [colleges1, setColleges1] = useState<College[]>([]);
    const [colleges2, setColleges2] = useState<College[]>([]);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [popularComparisons, setPopularComparisons] = useState<PopularComparison[]>([]);

    const wrapperRef1 = useRef<HTMLDivElement>(null);
    const wrapperRef2 = useRef<HTMLDivElement>(null);
    const debounceRef1 = useRef<NodeJS.Timeout | null>(null);
    const debounceRef2 = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        apiService.getPopularComparisons(6)
            .then((res) => setPopularComparisons(res?.data || []))
            .catch(() => {});
    }, []);

    const fetchColleges = useCallback(async (query: string, setList: (c: College[]) => void, setLoading: (l: boolean) => void) => {
        if (!query.trim()) {
            setList([]);
            return;
        }
        setLoading(true);
        try {
            const [collegeRes, instRes] = await Promise.all([
                apiService.getColleges({ search: query, pageSize: 10, page: 1 }),
                apiService.getPublicInstitutions({ search: query, limit: 10 }),
            ]);

            const tableColleges = (collegeRes as { data?: { colleges?: College[] } })?.data?.colleges || [];

            const institutions = (instRes as { data?: { institutions?: InstitutionResult[] } })?.data?.institutions || [];

            const instColleges = institutions
                .map((inst) => ({
                    id: inst.id,
                    name: inst.institution_name,
                    location: inst.district || inst.location || "",
                    type: inst.type || inst.institution_type || "College",
                    image_url: inst.logo_url || inst.card_image_url || "",
                    rating: inst.rating || 0,
                    reviews: inst.reviews || 0,
                }));

            const claimedCollegeIds = new Set(
                institutions
                    .filter((inst) => (inst.college_id || 0) > 0)
                    .map((inst) => inst.college_id),
            );

            const unclaimed = tableColleges.filter((c) => !claimedCollegeIds.has(c.id));

            setList([...instColleges, ...unclaimed] as College[]);
        } catch {
            setList([]);
        }
        setLoading(false);
    }, []);

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
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange1 = (value: string) => {
        setCollege1(value);
        setSelectedCollege1(null);
        setShowDropdown1(true);
        if (debounceRef1.current) clearTimeout(debounceRef1.current);
        debounceRef1.current = setTimeout(() => fetchColleges(value, setColleges1, setLoading1), 250);
    };

    const handleInputChange2 = (value: string) => {
        setCollege2(value);
        setSelectedCollege2(null);
        setShowDropdown2(true);
        if (debounceRef2.current) clearTimeout(debounceRef2.current);
        debounceRef2.current = setTimeout(() => fetchColleges(value, setColleges2, setLoading2), 250);
    };

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
        const c1 = selectedCollege1;
        const c2 = selectedCollege2;
        if (c1 || c2) {
            const college1Final = c1 || { name: college1 };
            const college2Final = c2 || { name: college2 };

            if (c1?.id && c2?.id) {
                apiService.logComparison({
                    college1_id: c1.id,
                    college2_id: c2.id,
                    college1_name: c1.name,
                    college2_name: c2.name,
                }).catch(() => {});
            }

            onNavigate("compareCollegesResult", {
                college1: college1Final,
                college2: college2Final,
            });
        }
    };

    const handlePopularCompare = (pair: PopularComparison) => {
        onNavigate("compareCollegesResult", {
            college1: { name: pair.college1_name, id: pair.college1_id } as Partial<College>,
            college2: { name: pair.college2_name, id: pair.college2_id } as Partial<College>,
        });
    };

    const initials = (name: string) =>
        name.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join("");

    const renderDropdown = (
        items: College[],
        loading: boolean,
        onSelect: (c: College) => void,
    ) => (
        <ul className="absolute top-full left-0 w-full bg-white mt-2 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 max-h-[280px] overflow-y-auto z-50 text-left py-2">
            {loading ? (
                <li className="px-5 py-4 flex items-center gap-2 text-gray-500 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    Searching colleges...
                </li>
            ) : items.length === 0 ? (
                <li className="px-5 py-4 text-gray-400 text-sm italic">No colleges found</li>
            ) : (
                items.map((c) => (
                    <li
                        key={c.id}
                        className="px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium cursor-pointer text-[15px] transition-colors border-b border-gray-50 last:border-0"
                        onClick={() => onSelect(c)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#2c51c6] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {c.image_url ? (
                                    <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white font-bold text-xs">{initials(c.name)}</span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="font-semibold truncate">{c.name}</div>
                                {c.location && (
                                    <div className="text-gray-400 text-xs font-normal truncate">{c.location}</div>
                                )}
                            </div>
                        </div>
                    </li>
                ))
            )}
        </ul>
    );

    return (
        <div className="bg-[#f8f9fc] min-h-screen flex flex-col items-center w-full font-sans pb-16 pt-6">
            <div className="bg-[#536DFE] w-full max-w-7xl mx-4 md:mx-auto relative flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-2xl" style={{ minHeight: 655 }}>
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

                <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
                    <div className="text-center mb-10 max-w-3xl">
                        <h1 className="text-white text-4xl md:text-5xl lg:text-[52px] font-bold leading-tight tracking-tight mb-4">
                            Compare colleges to<br />find the best fit
                        </h1>
                        <p className="text-white text-lg md:text-xl font-medium opacity-95">
                            Because you deserve better
                        </p>
                    </div>

                    <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                        <div className="relative w-full md:w-[420px]" ref={wrapperRef1}>
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                                <svg className="h-[22px] w-[22px] text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={college1}
                                onFocus={() => { setShowDropdown1(true); if (college1) handleInputChange1(college1); }}
                                onChange={(e) => handleInputChange1(e.target.value)}
                                className="w-full bg-white rounded-full py-4 pl-14 pr-6 text-[16px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
                                placeholder="Search college name..."
                                autoComplete="off"
                            />
                            {showDropdown1 && renderDropdown(colleges1, loading1, handleSelect1)}
                        </div>

                        <div className="flex-shrink-0 flex items-center justify-center py-2 md:py-0">
                            <span className="text-white font-bold text-xl lowercase tracking-wide">vs</span>
                        </div>

                        <div className="relative w-full md:w-[420px]" ref={wrapperRef2}>
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                                <svg className="h-[22px] w-[22px] text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={college2}
                                onFocus={() => { setShowDropdown2(true); if (college2) handleInputChange2(college2); }}
                                onChange={(e) => handleInputChange2(e.target.value)}
                                className="w-full bg-white rounded-full py-4 pl-14 pr-6 text-[16px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
                                placeholder="Search college name..."
                                autoComplete="off"
                            />
                            {showDropdown2 && renderDropdown(colleges2, loading2, handleSelect2)}
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

            {popularComparisons.length > 0 && (
                <section className="w-full max-w-7xl mx-auto mt-16 px-4">
                    <h2 className="text-[#1a2b4c] text-3xl font-bold mb-8 tracking-tight">Popular comparisons</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularComparisons.map((pair) => (
                            <div
                                key={`${pair.college1_id}-${pair.college2_id}`}
                                onClick={() => handlePopularCompare(pair)}
                                className="bg-white rounded-md border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 pt-8 pb-8 relative flex justify-between items-center cursor-pointer hover:translate-y-[-4px] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] transition-all duration-200"
                            >
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f1f3f6] text-gray-500 text-[11px] font-bold rounded-full w-8 h-8 flex items-center justify-center border-4 border-white z-10">VS</div>
                                <div className="absolute left-1/2 top-1/4 bottom-1/4 w-px bg-gray-100 -translate-x-1/2 z-0"></div>

                                <div className="flex flex-col items-center w-1/2 px-2 z-10">
                                    <div className="h-14 flex items-center justify-center mb-3">
                                        <div className="w-10 h-10 bg-[#2c51c6] rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">{initials(pair.college1_name)}</span>
                                        </div>
                                    </div>
                                    <span className="text-[15px] font-bold text-[#1a2b4c] text-center truncate max-w-full">{pair.college1_name}</span>
                                </div>

                                <div className="flex flex-col items-center w-1/2 px-2 z-10">
                                    <div className="h-14 flex items-center justify-center mb-3">
                                        <div className="w-10 h-10 bg-[#2c51c6] rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">{initials(pair.college2_name)}</span>
                                        </div>
                                    </div>
                                    <span className="text-[15px] font-bold text-[#1a2b4c] text-center truncate max-w-full">{pair.college2_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

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
