import Link from "next/link";
import { Home } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const toSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function fetchFromAPI<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success ? (json.data as T) : null;
  } catch { return null; }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const uniPayload = await fetchFromAPI<{ universities: { id: number; name: string; is_nepali: boolean }[] }>("/api/v1/universities?pageSize=200");
  const allUnis = uniPayload?.universities ?? [];
  const matched = allUnis.find((u) => toSlug(u.name) === id) ?? null;

  let institutions: any[] = [];
  if (matched) {
    const instPayload = await fetchFromAPI<{ institutions: any[] }>(`/api/v1/institutions/public/by-university/${matched.id}`);
    institutions = instPayload?.institutions ?? [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Home className="w-4 h-4" /> <span>Universities</span> <span>-</span> <span className="text-gray-800 font-medium">{matched?.name || "University"} - Affiliated Colleges</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{matched?.name || "University"} - Affiliated Colleges</h1>
        <p className="text-gray-500 mb-8">{institutions.length} affiliated institutions</p>

        {institutions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No affiliated institutions found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((inst: any) => (
              <Link key={inst.id} href={`/find-college/${inst.college_id || inst.id}`} className="block bg-white border border-gray-200 rounded-[14px] p-5 transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-[60px] h-[60px] rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 p-1">
                    {inst.logo_url ? (
                      <img src={inst.logo_url} alt={inst.institution_name} className="w-full h-full object-contain rounded" />
                    ) : (
                      <div className="w-full h-full bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center rounded uppercase">{inst.institution_name?.charAt(0) || "C"}</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[17px] font-bold text-gray-900 truncate">{inst.institution_name}</h3>
                    {inst.district && <p className="text-[13px] text-gray-500 mt-0.5">{inst.district}</p>}
                    {inst.website_url && (
                      <a href={inst.website_url.startsWith("http") ? inst.website_url : `https://${inst.website_url}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-brand-blue text-[13px] font-medium hover:text-brand-hover mt-1">
                        <i className="fa-solid fa-globe text-xs"></i>
                        {inst.website_url.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
