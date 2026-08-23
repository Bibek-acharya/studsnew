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
    affiliation?: string;
    verified?: boolean;
    claimed?: boolean;
    university_id?: number;
}

interface PopularComparison {
  college1_id: number;
  college1_name: string;
  college1_logo_url: string;
  college2_id: number;
  college2_name: string;
  college2_logo_url: string;
  count: number;
}

interface CompareCollegesPageProps {
    onNavigate: (view: string, data?: { college1: Partial<College> | string; college2: Partial<College> | string }) => void;
}

type SearchError = {
    type: "search1" | "search2" | "popular";
    message: string;
} | null;

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
    const [error, setError] = useState<SearchError>(null);
    const [loadingPopular, setLoadingPopular] = useState(true);

    const wrapperRef1 = useRef<HTMLDivElement>(null);
    const wrapperRef2 = useRef<HTMLDivElement>(null);
    const debounceRef1 = useRef<NodeJS.Timeout | null>(null);
    const debounceRef2 = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        apiService.getPopularComparisons(6)
            .then((res) => setPopularComparisons(res?.data || []))
            .catch((err) => {
                console.error("Failed to fetch popular comparisons:", err);
                setError({ type: "popular", message: "Failed to load popular comparisons" });
            })
            .finally(() => setLoadingPopular(false));
    }, []);

    const fetchColleges = useCallback(async (query: string, setList: (c: College[]) => void, setLoading: (l: boolean) => void, errorType: "search1" | "search2") => {
        if (!query.trim()) {
            setList([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const [collegeRes, instRes] = await Promise.all([
                apiService.getColleges({ search: query, pageSize: 10, page: 1 }),
                apiService.getPublicInstitutions({ search: query, limit: 10 }),
            ]);

            const tableColleges = (collegeRes as { data?: { colleges?: College[] } })?.data?.colleges || [];

            const institutions = (instRes as { data?: { institutions?: InstitutionResult[] } })?.data?.institutions || [];

            const instColleges = institutions
                .map((inst) => ({
                    id: inst.college_id || inst.id,
                    name: inst.institution_name,
                    location: inst.district || inst.location || "",
                    type: inst.type || inst.institution_type || "College",
                    image_url: inst.logo_url || inst.card_image_url || "",
                    rating: inst.rating || 0,
                    reviews: inst.reviews || 0,
                    affiliation: inst.affiliation || "",
                    verified: inst.verified || false,
                    claimed: inst.claimed || false,
                    // Institution ID for reference
                    university_id: inst.university_id,
                }));

            const claimedCollegeIds = new Set(
                institutions
                    .filter((inst) => (inst.college_id || 0) > 0)
                    .map((inst) => inst.college_id),
            );

            const unclaimed = tableColleges.filter((c) => !claimedCollegeIds.has(c.id));

            setList([...instColleges, ...unclaimed] as College[]);
        } catch (err) {
            console.error(`Failed to fetch colleges for ${errorType}:`, err);
            setError({ type: errorType, message: "Failed to search colleges. Please try again." });
            setList([]);
        } finally {
            setLoading(false);
        }
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
        setError(null);
        if (debounceRef1.current) clearTimeout(debounceRef1.current);
        debounceRef1.current = setTimeout(() => fetchColleges(value, setColleges1, setLoading1, "search1"), 250);
    };

    const handleInputChange2 = (value: string) => {
        setCollege2(value);
        setSelectedCollege2(null);
        setShowDropdown2(true);
        setError(null);
        if (debounceRef2.current) clearTimeout(debounceRef2.current);
        debounceRef2.current = setTimeout(() => fetchColleges(value, setColleges2, setLoading2, "search2"), 250);
    };

    const handleSelect1 = async (college: College) => {
        // Check if same college is already selected in the other slot
        if (selectedCollege2?.id && college.id === selectedCollege2.id) {
            setError({ type: "search1", message: "Cannot compare a college with itself" });
            return;
        }
        
        setCollege1(college.name);
        setShowDropdown1(false);
        setError(null);
        
        // If institution has a college_id, fetch full college data
        if (college.id && !college.established && !college.featured_programs) {
            try {
                const res = await apiService.getCollegeById(college.id);
                if (res?.data) {
                    setSelectedCollege1(res.data);
                    return;
                }
            } catch {
                // Fall back to basic data
            }
        }
        setSelectedCollege1(college);
    };

    const handleSelect2 = async (college: College) => {
        // Check if same college is already selected in the other slot
        if (selectedCollege1?.id && college.id === selectedCollege1.id) {
            setError({ type: "search2", message: "Cannot compare a college with itself" });
            return;
        }
        
        setCollege2(college.name);
        setShowDropdown2(false);
        setError(null);
        
        // If institution has a college_id, fetch full college data
        if (college.id && !college.established && !college.featured_programs) {
            try {
                const res = await apiService.getCollegeById(college.id);
                if (res?.data) {
                    setSelectedCollege2(res.data);
                    return;
                }
            } catch {
                // Fall back to basic data
            }
        }
        setSelectedCollege2(college);
    };

    const handleCompare = () => {
        if (!selectedCollege1 || !selectedCollege2) return;

        // Prevent comparing same college
        if (selectedCollege1.id && selectedCollege2.id && selectedCollege1.id === selectedCollege2.id) {
            setError({ type: "search1", message: "Cannot compare a college with itself" });
            return;
        }

        if (selectedCollege1.id && selectedCollege2.id) {
            apiService.logComparison({
                college1_id: selectedCollege1.id,
                college2_id: selectedCollege2.id,
                college1_name: selectedCollege1.name,
                college2_name: selectedCollege2.name,
            }).catch((err) => {
                console.error("Failed to log comparison:", err);
            });
        }

        onNavigate("compareCollegesResult", {
            college1: selectedCollege1,
            college2: selectedCollege2,
        });
    };

    const handlePopularCompare = async (pair: PopularComparison) => {
        // Fetch full college data for both colleges
        let college1: Partial<College> = { name: pair.college1_name, id: pair.college1_id };
        let college2: Partial<College> = { name: pair.college2_name, id: pair.college2_id };

        try {
            const [res1, res2] = await Promise.all([
                apiService.getCollegeById(pair.college1_id),
                apiService.getCollegeById(pair.college2_id),
            ]);
            if (res1?.data) college1 = res1.data;
            if (res2?.data) college2 = res2.data;
        } catch (err) {
            console.error("Failed to fetch college details:", err);
        }

        onNavigate("compareCollegesResult", { college1, college2 });
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
        <div className="bg-white min-h-screen flex flex-col items-center w-full font-sans pb-16 pt-6">
            <div className="bg-brand-blue w-full max-w-350 md:mx-auto relative flex flex-col rounded-2xl">

                <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-12">
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
                            disabled={!selectedCollege1 || !selectedCollege2}
                            className="bg-[#1a2b4c] text-white font-bold text-[16px] px-10 py-3.5 rounded-full shadow-[0_4px_14px_0_rgba(26,43,76,0.39)] hover:shadow-[0_6px_20px_rgba(26,43,76,0.23)] hover:bg-[#111c33] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Compare Now
                        </button>
                    </div>

                    {error && error.type !== "popular" && (
                        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error.message}
                        </div>
                    )}
                </main>
            </div>

            {error?.type === "popular" && (
                <div className="w-full max-w-7xl mx-auto mt-8 px-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error.message}
                    </div>
                </div>
            )}

            {loadingPopular ? (
                <section className="w-full max-w-7xl mx-auto mt-16 px-4 md:px-0">
                    <h2 className="text-[#1a2b4c] text-3xl font-bold mb-8 tracking-tight">Popular comparisons</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-md border border-gray-100 p-6 pt-8 pb-8 animate-pulse">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col items-center w-1/2 px-2">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </div>
                                    <div className="flex flex-col items-center w-1/2 px-2">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : popularComparisons.length > 0 && (
                <section className="w-full max-w-7xl mx-auto mt-16 px-4 md:px-0">
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
                                        <div className="w-10 h-10 bg-[#2c51c6] rounded-full flex items-center justify-center overflow-hidden">
                                            {pair.college1_logo_url ? (
                                                <img src={pair.college1_logo_url} alt={pair.college1_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white font-bold text-xs">{initials(pair.college1_name)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[15px] font-bold text-[#1a2b4c] text-center truncate max-w-full">{pair.college1_name}</span>
                                </div>

                                <div className="flex flex-col items-center w-1/2 px-2 z-10">
                                    <div className="h-14 flex items-center justify-center mb-3">
                                        <div className="w-10 h-10 bg-[#2c51c6] rounded-full flex items-center justify-center overflow-hidden">
                                            {pair.college2_logo_url ? (
                                                <img src={pair.college2_logo_url} alt={pair.college2_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white font-bold text-xs">{initials(pair.college2_name)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[15px] font-bold text-[#1a2b4c] text-center truncate max-w-full">{pair.college2_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}


        </div>
    );
};

export default CompareCollegesPage;
