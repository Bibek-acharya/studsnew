"use client";

import React, { useEffect, useState } from "react";
import { getProviderProfile, ProviderProfile } from "@/services/providerApi";
import {
  MapPin, Building, Globe, ArrowUpRight, Download, Share2, Heart, ShieldCheck,
  BookOpen, PenTool, GraduationCap, Droplet, TriangleAlert, Users, Coffee,
  Calendar, ArrowRight, Star, ChevronLeft, ChevronRight, X, ExternalLink,
  Newspaper, FileText
} from "lucide-react";

const TABS = [
  "About", "Our Service", "Our Sector", "Our Projects",
  "News & Notice", "Scholarship", "Gallery", "Review"
] as const;

type Tab = (typeof TABS)[number];

const ProviderDetailPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const [id, setId] = useState<string>("");
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("About");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProviderProfile(parseInt(id))
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-semibold">
        Provider not found.
      </div>
    );
  }

  const rating = (profile.reviews?.length ?? 0) > 0
    ? (profile.reviews!.reduce((s, r) => s + r.rating, 0) / profile.reviews!.length)
    : 0;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const starArr = Array(5).fill(0).map((_, i) => {
    if (i < fullStars) return "full";
    if (i === fullStars && hasHalf) return "half";
    return "empty";
  });

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Banner */}
      <div
        className="relative w-full h-[220px] md:h-[360px] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000&h=600)`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Header */}
      <div className="relative bg-white">
        <div className="px-6 md:px-12 lg:px-24 xl:px-32 pb-8 relative">
          <div className="absolute -top-12 md:-top-8 left-6 md:left-12 lg:left-24 xl:left-32 w-[100px] md:w-[150px] h-[100px] md:h-[150px] bg-white rounded-2xl border border-gray-200 flex items-center justify-center p-2 z-10 overflow-hidden">
            {profile.logo_url ? (
              <img src={profile.logo_url} alt={profile.provider_name} className="w-full h-full object-contain" />
            ) : (
              <Building className="w-12 h-12 text-gray-400" />
            )}
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end pt-[60px] md:pt-[70px] lg:pt-6 lg:pl-[180px]">
            <div className="space-y-2 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] md:text-3xl font-bold text-gray-900 tracking-tight">
                  {profile.provider_name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] md:text-[15px] text-gray-600 font-medium">
                {profile.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{profile.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span>Scholarship Provider</span>
                </div>
              </div>
              {rating > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center text-yellow-400 text-sm">
                    {starArr.map((s, i) => (
                      <Star key={i} className={`w-4 h-4 ${s === "full" ? "fill-yellow-400 text-yellow-400" : s === "half" ? "fill-yellow-400/50 text-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-[13px] font-bold text-gray-900">{rating.toFixed(1)}/5.0</span>
                </div>
              )}
              {profile.website_url && (
                <div className="flex items-center gap-5 text-[14px] font-medium pt-1">
                  <a href={profile.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors lowercase tracking-wide text-[13px] font-bold">
                    <Globe className="w-4 h-4" />
                    {new URL(profile.website_url).hostname}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 lg:mt-0 w-full lg:w-auto">
              <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-[14px] font-semibold transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Brochure
              </button>
              <button className="flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 p-2.5 rounded-lg transition-colors shadow-sm">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-100 px-6 md:px-12 lg:px-24 xl:px-32 overflow-x-auto no-scrollbar bg-white sticky top-0 z-40 shadow-sm">
        <nav className="flex space-x-8 whitespace-nowrap" id="tab-nav">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 py-4 text-[14px] font-semibold transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-12 lg:px-24 xl:px-32 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-10 bg-white">
        <div className="lg:col-span-2 min-h-[500px]">
          {activeTab === "About" && (
            <div className="space-y-10">
              <div className="space-y-6 text-gray-600 text-[15px] md:text-[15.5px] leading-[1.8]">
                {profile.about_text ? (
                  <div dangerouslySetInnerHTML={{ __html: profile.about_text }} />
                ) : (
                  <p className="text-gray-400 italic">No description provided.</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.mission && (
                  <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-[20px]">
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100/80 flex items-center justify-center text-blue-600">
                        <Heart className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-[16px]">Our Mission</h3>
                    </div>
                    <p className="text-[14px] text-gray-600 leading-[1.7]">{profile.mission}</p>
                  </div>
                )}
                {profile.values && (
                  <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-[20px]">
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100/80 flex items-center justify-center text-green-600">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-[16px]">Our Values</h3>
                    </div>
                    <p className="text-[14px] text-gray-600 leading-[1.7]">{profile.values}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Our Service" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">Our Services</h2>
                <p className="text-[14px] text-gray-500 mt-1">Comprehensive services to support communities in need.</p>
              </div>
              {(profile.services?.length ?? 0) === 0 ? (
                <p className="text-gray-400 italic">No services listed yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {profile.services?.map((svc) => (
                    <div key={svc.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Coffee className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-[15px] mb-2">{svc.title}</h4>
                          <p className="text-[13px] text-gray-600">{svc.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Our Sector" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">Our Sectors</h2>
                <p className="text-[14px] text-gray-500 mt-1">Working across multiple sectors to create lasting impact.</p>
              </div>
              {(profile.sectors?.length ?? 0) === 0 ? (
                <p className="text-gray-400 italic">No sectors listed yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.sectors?.map((sec) => {
                    const iconMap: Record<string, any> = {
                      education: GraduationCap, health: Droplet, disaster: TriangleAlert,
                      community: Users,
                    };
                    const Icon = iconMap[sec.icon] || Building;
                    return (
                      <div key={sec.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm group">
                        <div className="p-4 pb-0">
                          <div
                            className="h-40 flex items-center justify-center rounded-xl overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${sec.color}, ${sec.color}dd)` }}
                          >
                            <Icon className="w-20 h-20 text-white/90" />
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="mb-3">
                            <span
                              className="inline-block px-3 py-1 rounded-full text-[11px] font-bold text-white"
                              style={{ backgroundColor: sec.color }}
                            >
                              {sec.name}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-[16px] mb-2">{sec.name}</h3>
                          <p className="text-[13px] text-gray-600 mb-4 line-clamp-2">{sec.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "Our Projects" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">Our Projects</h2>
                <p className="text-[14px] text-gray-500 mt-1">Innovative initiatives driving change and excellence.</p>
              </div>
              {(profile.projects?.length ?? 0) === 0 ? (
                <p className="text-gray-400 italic">No projects listed yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects?.map((proj) => (
                    <div key={proj.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      <div className="p-4 pb-0">
                        <img
                          src={proj.image_url || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400"}
                          className="w-full h-40 object-cover rounded-xl"
                          alt={proj.title}
                        />
                      </div>
                      <div className="p-5">
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600">
                            {proj.category || "General"}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-[16px] mb-2">{proj.title}</h3>
                        <p className="text-[13px] text-gray-600 mb-4 line-clamp-2">{proj.description}</p>
                        <div className="flex items-center justify-between">
                          {proj.date && (
                            <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{proj.date}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "News & Notice" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">News & Blog</h2>
                <p className="text-[14px] text-gray-500 mt-1">Stay updated with our latest announcements and stories.</p>
              </div>
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <Newspaper className="w-5 h-5 text-blue-600" />
                <span>{profile.news_count} news items</span>
                <FileText className="w-5 h-5 text-blue-600 ml-2" />
                <span>{profile.blog_count} blog posts</span>
              </div>
              <p className="text-gray-400 italic">
                Visit our <a href="/news" className="text-blue-600 hover:underline">News</a> and{" "}
                <a href="/blogs" className="text-blue-600 hover:underline">Blogs</a> pages to explore content from this provider.
              </p>
            </div>
          )}

          {activeTab === "Scholarship" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">Scholarship Project</h2>
                <p className="text-[14px] text-gray-500 mt-1">
                  {profile.scholarship_count} scholarship{profile.scholarship_count !== 1 ? "s" : ""} offered by this provider.
                </p>
              </div>
              <p className="text-gray-400 italic">
                Browse all scholarships from this provider on our{" "}
                <a href={`/scholarship-finder`} className="text-blue-600 hover:underline">Scholarship Finder</a> page.
              </p>
            </div>
          )}

          {activeTab === "Gallery" && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-[20px] font-bold text-gray-900">Photo Gallery</h2>
                  <p className="text-[14px] text-gray-500 mt-1">Glimpses of our programs and impact.</p>
                </div>
              </div>
              {(profile.gallery?.length ?? 0) === 0 ? (
                <p className="text-gray-400 italic">No gallery images yet.</p>
              ) : (
                <div className="photo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
                  {profile.gallery?.map((img, idx) => (
                    <div
                      key={img.id}
                      className="cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white p-2"
                      onClick={() => setLightboxIndex(idx)}
                    >
                      <img
                        src={img.image_url}
                        alt={img.caption || "Gallery image"}
                        className="w-full h-40 object-cover rounded hover:scale-105 transition-transform duration-300"
                      />
                      {img.caption && (
                        <p className="text-xs text-gray-500 mt-1.5 px-1">{img.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {lightboxIndex !== null && (
                <div
                  className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                  onClick={() => setLightboxIndex(null)}
                >
                  <button
                    className="absolute top-5 right-8 text-white text-4xl cursor-pointer z-[60] hover:text-gray-300"
                    onClick={() => setLightboxIndex(null)}
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <button
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-4xl cursor-pointer hover:text-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => prev !== null ? Math.max(0, prev - 1) : null);
                    }}
                  >
                    <ChevronLeft className="w-10 h-10" />
                  </button>
                  <img
                    src={profile.gallery?.[lightboxIndex]?.image_url}
                    alt="Gallery"
                    className="max-w-[90%] max-h-[85vh] object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white text-4xl cursor-pointer hover:text-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => prev !== null ? Math.min((profile.gallery?.length ?? 1) - 1, prev + 1) : null);
                    }}
                  >
                    <ChevronRight className="w-10 h-10" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "Review" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">Testimonials</h2>
                <p className="text-[14px] text-gray-500 mt-1">What our beneficiaries and partners have to say.</p>
              </div>

              {(profile.reviews?.length ?? 0) > 0 && (
                <div className="bg-white border border-gray-100 p-8 rounded-[24px] shadow-sm mb-8 flex flex-col md:flex-row gap-8 items-center">
                  <div className="text-center md:text-left md:border-r border-gray-100 md:pr-10">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-2">{rating.toFixed(1)}</h2>
                    <div className="flex items-center justify-center md:justify-start text-yellow-400 mb-2 text-lg">
                      {starArr.map((s, i) => (
                        <Star key={i} className={`w-5 h-5 ${s === "full" ? "fill-yellow-400 text-yellow-400" : s === "half" ? "fill-yellow-400/50 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Based on {profile.reviews?.length ?? 0} review{profile.reviews?.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              )}

              {(profile.reviews?.length ?? 0) === 0 ? (
                <p className="text-gray-400 italic">No reviews yet.</p>
              ) : (
                <div className="space-y-5">
                  {profile.reviews?.map((rev) => (
                    <div key={rev.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                            {rev.avatar_url ? (
                              <img src={rev.avatar_url} alt={rev.author_name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              rev.author_name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-[15px]">{rev.author_name}</h4>
                          </div>
                        </div>
                        <div className="text-yellow-400 text-[13px] flex">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      {rev.title && <h5 className="font-bold text-gray-800 text-[15px] mb-2">{rev.title}</h5>}
                      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">{rev.content}</p>
                      {(rev.pros || rev.cons) && (
                        <div className="flex gap-4">
                          {rev.pros && (
                            <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <span className="text-green-600 text-[12px] font-bold uppercase block mb-1">Pros</span>
                              <span className="text-[13px] text-gray-700">{rev.pros}</span>
                            </div>
                          )}
                          {rev.cons && (
                            <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <span className="text-red-500 text-[12px] font-bold uppercase block mb-1">Cons</span>
                              <span className="text-[13px] text-gray-700">{rev.cons}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-full mt-12 lg:mt-0">
          <div className="sticky top-8">
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h2>
              <div className="space-y-4">
                {profile.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <a href={`mailto:${profile.email}`} className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.contact_number && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <a href={`tel:${profile.contact_number}`} className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                      {profile.contact_number}
                    </a>
                  </div>
                )}
                {profile.website_url && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <a href={profile.website_url} target="_blank" rel="noreferrer" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                      {new URL(profile.website_url).hostname}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{profile.scholarship_count}</p>
                  <p className="text-[11px] text-gray-500">Scholarships</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{profile.news_count}</p>
                  <p className="text-[11px] text-gray-500">News</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{profile.event_count}</p>
                  <p className="text-[11px] text-gray-500">Events</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{profile.blog_count}</p>
                  <p className="text-[11px] text-gray-500">Blogs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProviderDetailPage;
