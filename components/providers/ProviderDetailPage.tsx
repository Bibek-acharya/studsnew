"use client";

import React, { useEffect, useState } from "react";
import { getProviderProfile, ProviderProfile } from "@/services/providerApi";
import {
  MapPin, Building, Globe, ArrowUpRight, Download, Share2, Heart, ShieldCheck,
  BookOpen, PenTool, GraduationCap, Droplet, TriangleAlert, Users, Coffee,
  Calendar, ArrowRight, Star, ChevronLeft, ChevronRight, X, ExternalLink,
  Newspaper, FileText,
  ArrowRightCircle,
  Quote, Phone, Smartphone, Mail
} from "lucide-react";

import * as LucideIcons from "lucide-react";
import { ArrowArcRightIcon } from "@phosphor-icons/react";

const stripHtml = (html: string) => {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => prev !== null ? Math.max(0, prev - 1) : null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && profile?.gallery) ? Math.min(profile.gallery.length - 1, prev + 1) : null);
      } else if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, profile?.gallery]);

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
                  {profile.services?.map((svc) => {
                    const ServiceIcon = (LucideIcons as any)[svc.icon] || Coffee;
                    return (
                      <div key={svc.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <ServiceIcon className="w-7 h-7" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-[16px] mb-2">{svc.title}</h4>
                            <p className="text-[14px] text-gray-600 leading-relaxed">{svc.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                          <div className="h-44 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                            {sec.image_url ? (
                              <img src={sec.image_url} alt={sec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div 
                                className="w-full h-full flex items-center justify-center"
                                style={{ background: `linear-gradient(135deg, ${sec.color}, ${sec.color}dd)` }}
                              >
                                <Icon className="w-16 h-16 text-white/90" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 text-[16px] mb-2">{sec.name}</h3>
                          <p className="text-[14px] text-gray-600 mb-4 line-clamp-2 leading-relaxed">{sec.description}</p>
                          {sec.external_link && (
                            <a 
                              href={sec.external_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-[13px] group/link"
                            >
                              Learn More
                              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </a>
                          )}
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
                        <h3 className="font-bold text-gray-900 text-[16px] mb-2">{proj.title}</h3>
                        <p className="text-[14px] text-gray-600 mb-4 line-clamp-2 leading-relaxed">{proj.description}</p>
                        <div className="flex items-center justify-between">
                          {proj.date && (
                            <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium">
                              <Calendar className="w-4 h-4" />
                              <span>{proj.date}</span>
                            </div>
                          )}
                          {proj.external_link && (
                            <a 
                              href={proj.external_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold text-[13px] group/link"
                            >
                              Learn More
                              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                            </a>
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
                <h2 className="text-[20px] font-bold text-gray-900">News & Notice</h2>
                <p className="text-[14px] text-gray-500 mt-1">Stay updated with our latest announcements and stories.</p>
              </div>
              {(profile.news?.length ?? 0) === 0 ? (
                <p className="text-gray-400 italic">No news listed yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.news?.map((item) => (
                    <article
                      key={item.id}
                      className="bg-white border border-gray-100 hover:border-blue-500/20 rounded-xl p-4 flex flex-col transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="mb-3 flex justify-between items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                          {item.news_type || "Notice"}
                        </span>
                        <span className="text-gray-400 text-[11px] flex items-center font-medium">
                          <Calendar className="w-3 h-3 mr-1" />
                          {item.publish_date ? new Date(item.publish_date).toLocaleDateString() : new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="rounded-lg overflow-hidden aspect-16/10 mb-4 bg-gray-50 h-32 border border-gray-100">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1504711432869-efd597cdd045?auto=format&fit=crop&q=80&w=800"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>

                      <h3 className="font-bold text-[15px] text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-[13px] mb-4 grow line-clamp-2 leading-relaxed">
                        {stripHtml(item.short_desc || item.content || "")}
                      </p>


                      <div className="pt-3 border-t border-gray-50 flex justify-between items-center text-[12px] mt-auto">
                        <span className="text-slate-400">By {item.published_by || "Provider"}</span>
                        <a href={`/news/${item.id}`} className="text-blue-600 font-bold hover:underline">
                          View Details
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Scholarship" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">Available Scholarships</h2>
                <p className="text-[14px] text-gray-500 mt-1">Explore scholarship opportunities from this provider.</p>
              </div>
              {(profile.scholarships?.length ?? 0) === 0 ? (
                <p className="text-gray-400 italic">No scholarships listed yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.scholarships?.map((sch) => (
                    <div key={sch.id} className="relative flex flex-col bg-white rounded-xl border border-gray-200/80 transition-all duration-300 p-3 hover:shadow-md group">
                      <div className="h-32 w-full bg-gray-100 relative overflow-hidden rounded-lg mb-3 border border-gray-100">
                        <img 
                          src={sch.banner_background_image_url || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800"} 
                          alt={sch.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>

                      <div className="flex flex-col grow px-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-600 bg-blue-50 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                            {sch.scholarship_type || "SCHOLARSHIP"}
                          </span>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${sch.status === 'OPEN' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                            <span className={`w-1 h-1 rounded-full ${sch.status === 'OPEN' ? 'bg-green-600' : 'bg-yellow-600'}`}></span>
                            <span className="text-[10px] font-bold uppercase tracking-wide">
                              {sch.status || "OPEN"}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-bold text-[15px] leading-tight text-slate-900 mb-2 group-hover:text-blue-600 line-clamp-1">
                          {sch.title}
                        </h3>

                        <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100 mb-4 mt-auto flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium">
                            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">{sch.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium">
                            <GraduationCap className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">{sch.degree_level}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-800 font-bold mt-1">
                            <Calendar className="w-3 h-3 text-red-500 shrink-0" />
                            <span>Ends: {sch.deadline}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`/scholarship-finder/${sch.id}`}
                            className="flex-1 py-1.5 text-center text-[12px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Details
                          </a>
                          <a 
                            href={`/scholarship-finder/apply/${sch.id}`} 
                            className="flex-1 py-1.5 text-center text-[12px] font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Apply
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Gallery" && (
            <div className="space-y-12">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-[20px] font-bold text-gray-900">Photo Gallery</h2>
                  <p className="text-[14px] text-gray-500 mt-1">Glimpses of our programs and impact.</p>
                </div>
              </div>
              {(profile.gallery?.length ?? 0) === 0 ? (
                <p className="text-gray-400 italic">No gallery images yet.</p>
              ) : (
                <div className="space-y-10">
                  {Object.entries(
                    profile.gallery!.reduce((acc: any, img: any) => {
                      const folder = img.folder || "General";
                      if (!acc[folder]) acc[folder] = [];
                      acc[folder].push(img);
                      return acc;
                    }, {})
                  ).map(([folder, images]: [string, any]) => (
                    <div key={folder} className="space-y-5">
                      <div className="flex items-center gap-3 ">
                        <h3 className="text-lg font-bold text-gray-800 capitalize tracking-tight">
                          {folder}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                        {images.slice(0, images.length > 8 ? 7 : 8).map((img: any) => (
                          <div
                            key={img.id}
                            className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm hover:shadow-md transition-all duration-300"
                            onClick={() => setLightboxIndex(profile.gallery!.findIndex(i => i.id === img.id))}
                          >
                            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-50">
                              <img
                                src={img.image_url}
                                alt={img.caption || "Gallery image"}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            {img.caption && (
                              <p className="text-[12px] text-gray-600 mt-2 px-1 text-center font-semibold truncate group-hover:text-blue-600 transition-colors">
                                {img.caption}
                              </p>
                            )}
                          </div>
                        ))}
                        
                        {images.length > 8 && (
                          <div 
                            className="group cursor-pointer overflow-hidden rounded-2xl border border-blue-100 border-dashed bg-blue-50/30 p-1.5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
                            onClick={() => setLightboxIndex(profile.gallery!.findIndex(i => i.id === images[0].id))}
                          >
                            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-blue-600/5 flex flex-col items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <ArrowRight className="w-6 h-6" />
                              </div>
                              <span className="mt-2 font-bold text-sm text-blue-700">View All</span>
                            </div>
                            <p className="text-[12px] text-blue-600/60 mt-2 px-1 text-center font-bold tracking-tight">
                              +{images.length - 7} PHOTOS
                            </p>
                          </div>
                        )}
                      </div>
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
                    className="max-w-[90%] max-h-[85vh] object-contain rounded-lg shadow-2xl"
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
                  <div className="absolute bottom-10 left-0 right-0 text-center text-white">
                    <p className="text-lg font-bold">{profile.gallery?.[lightboxIndex]?.caption}</p>
                    <p className="text-sm text-gray-400 capitalize">{profile.gallery?.[lightboxIndex]?.folder || 'General'}</p>
                  </div>
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
        <div className="lg:col-span-1 space-y-6">
          {/* Founder's Message Card */}
          <div className="bg-blue-600 rounded-2xl p-5 shadow-sm text-white min-h-[280px]">
            <div className="flex items-start gap-4">
              <img 
                src={profile.founder_image_url || "https://sowersaction.org.np/wp-content/uploads/2025/03/1.jpg"} 
                alt="Founder" 
                className="w-20 h-20 object-cover rounded-xl shadow-md flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-3">
                  <Quote className="w-4 h-4 text-blue-200" />
                  <h3 className="font-bold text-white text-[15px]">Founder's Message</h3>
                </div>
                <p className="text-[12px] text-blue-100 leading-relaxed mb-3 italic">
                  {profile.founder_message ? `"${profile.founder_message}"` : `"At ${profile.provider_name}, we believe that every individual deserves access to quality education, healthcare, and opportunities for a better life."`}
                </p>
                <div className="pt-3 border-t border-blue-500/50">
                  <p className="font-bold text-white text-[13px]">{profile.founder_name || "Founder & Chairperson"}</p>
                  <p className="text-blue-200 text-[11px]">{profile.founder_role || profile.provider_name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-[18px] mb-5">Contact Information</h3>
            
            <ul className="space-y-4">
              {/* Address */}
              <li className="flex items-start gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">Address</span>
                  <span className="text-gray-500 font-medium text-[12px]">
                    {profile.address}
                  </span>
                </div>
              </li>
              {/* Phone */}
              <li className="flex items-center gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">Phone</span>
                  <a href={`tel:${profile.contact_number}`} className="text-gray-500 font-medium text-[12px] hover:text-emerald-600 transition">
                    {profile.contact_number}
                  </a>
                </div>
              </li>
              {/* Email */}
              <li className="flex items-center gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">Email</span>
                  <a href={`mailto:${profile.email}`} className="text-gray-500 font-medium text-[12px] hover:text-red-500 transition">
                    {profile.email}
                  </a>
                </div>
              </li>
              {/* Website */}
              <li className="flex items-center gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">Website</span>
                  <a href={profile.website_url} target="_blank" rel="noreferrer" className="text-blue-500 font-medium text-[12px] hover:underline transition">
                    {profile.website_url ? new URL(profile.website_url).hostname : ""}
                  </a>
                </div>
              </li>
            </ul>

            {/* Social Media */}
            {(profile.facebook_url || profile.instagram_url || profile.youtube_url || profile.linkedin_url) && (
              <div className="mt-5">
                <h4 className="font-bold text-gray-900 text-[13px] mb-3">Social Media</h4>
                <div className="flex items-center gap-3 text-xl">
                  {profile.facebook_url && (
                    <a href={profile.facebook_url} target="_blank" rel="noreferrer" className="text-[#1877F2] hover:opacity-80 transition">
                      <i className="fab fa-facebook"></i>
                    </a>
                  )}
                  {profile.instagram_url && (
                    <a href={profile.instagram_url} target="_blank" rel="noreferrer" className="text-[#E4405F] hover:opacity-80 transition">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {profile.youtube_url && (
                    <a href={profile.youtube_url} target="_blank" rel="noreferrer" className="text-[#FF0000] hover:opacity-80 transition">
                      <i className="fab fa-youtube"></i>
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-[#0A66C2] hover:opacity-80 transition">
                      <i className="fab fa-linkedin"></i>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Brochure Download */}
            {profile.brochure_url && (
              <div className="mt-5">
                <a 
                  href={profile.brochure_url.startsWith('http') ? profile.brochure_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${profile.brochure_url}`}
                  target="_blank" 
                  rel="noreferrer"
                  download="Provider_Brochure"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Brochure
                </a>
              </div>
            )}


            {/* Google Maps Embed */}

            {profile.map_url && (
              <div className="mt-5 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <iframe 
                  src={profile.map_url} 
                  width="100%" 
                  height="150" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
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
