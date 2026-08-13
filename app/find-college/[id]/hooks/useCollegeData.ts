"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { apiService, getImageUrl } from "@/services/api";
import { getInstitutionCourses } from "@/services/institutionCourses";
import type { LevelFilter } from "../../types";
import {
  FALLBACK_COURSES,
  FALLBACK_OFFERED_PROGRAMS,
  FALLBACK_SCHOLARSHIPS,
  FALLBACK_GALLERY_IMAGES,
} from "../constants";

export function useCollegeData(idStr: string) {
  const collegeId = idStr ? Number(idStr.replace("inst_", "")) : null;

  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (!idStr) {
      setLoading(false);
      return;
    }
    const numericId = Number(idStr.replace("inst_", ""));
    if (!numericId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    apiService
      .getPublicInstitutionById(numericId)
      .then((res) => {
        setCollege(res.data);
        setLoading(false);
      })
      .catch(() => {
        apiService
          .getCollegeById(numericId)
          .then((res) => {
            setCollege(res.data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, [idStr]);

  const isInstitution = !!college?.institution_name;

  const instName = isInstitution ? college?.institution_name : null;
  const instLocation = isInstitution ? college?.district : null;
  const instWebsite = isInstitution ? college?.website_url : null;
  const instDescription = isInstitution ? college?.about : null;
  const instVision = isInstitution ? college?.vision : null;
  const instMission = isInstitution ? college?.mission : null;
  const instOverviewData = isInstitution ? college?.overview_data : null;
  const instLeadershipData = isInstitution ? college?.leadership_data : null;
  const instVideos = isInstitution ? college?.videos : null;
  const instCourses = isInstitution ? college?.courses_data : null;
  const instPrograms = isInstitution ? college?.programs_data : null;
  const instFacilities = isInstitution ? college?.facilities_data : null;
  const instAlumni = isInstitution ? college?.alumni_data : null;
  const instGallery = isInstitution ? college?.gallery_data : null;
  const instDownloads = isInstitution ? college?.downloads_data : null;
  const instFaqs = isInstitution ? college?.faqs_data : null;
  const instInstitutionPrograms = isInstitution
    ? college?.institution_programs
    : null;
  const instInstitutionEvents = isInstitution
    ? college?.institution_events
    : null;
  const instInstitutionNews = isInstitution ? college?.institution_news : null;
  const instInstitutionScholarships = isInstitution
    ? college?.institution_scholarships
    : null;
  const instAdmissionPageData = isInstitution
    ? college?.admission_page_data
    : null;

  const safeImageUrl = useCallback(
    (url: string | null | undefined): string | null => {
      if (
        !url ||
        typeof url !== "string" ||
        url.startsWith("blob:") ||
        url.startsWith("data:")
      )
        return null;
      return getImageUrl(url);
    },
    [],
  );

  const galleryGroups = useMemo(() => {
    if (!instGallery || !Array.isArray(instGallery))
      return FALLBACK_GALLERY_IMAGES;
    return instGallery.map((g: any) => {
      if (g.folder && Array.isArray(g.images)) {
        return {
          folder: g.folder,
          images: g.images
            .map((img: any) => safeImageUrl(img.url || img))
            .filter(Boolean),
        };
      }
      return {
        folder: "Gallery",
        images: [safeImageUrl(g.url || g)].filter(Boolean),
      };
    });
  }, [instGallery, safeImageUrl]);

  const instLogo =
    isInstitution && college?.logo_url ? getImageUrl(college.logo_url) : null;
  const instBanner =
    isInstitution && college?.banner_url
      ? getImageUrl(college.banner_url)
      : null;

  const mappedCourses = useMemo(() => {
    if (instCourses && Array.isArray(instCourses)) {
      return instCourses
        .filter((c: any) => c.courseName || c.name)
        .map((c: any) => ({
          name: c.courseName || c.name || "",
          level: c.level || "",
          specialization: c.specialization || "",
          sub_description: c.sub_description || "",
          duration: c.duration || "",
          type: c.type || "",
          fees: c.feesText || c.fees || "",
          eligibility: c.eligibility || "",
          seats: c.seats || "",
        }));
    }
    return null;
  }, [instCourses]);

  const mappedPrograms = useMemo(() => {
    if (instPrograms && Array.isArray(instPrograms)) {
      return instPrograms
        .filter((p: any) => p.title || p.name)
        .map((p: any) => ({
          name: p.title || p.name || "",
          level: p.subtitle || p.level || "",
          affiliation: p.affiliation || p.subtitle || "",
          status: p.admissionStatus || p.status || "",
        }));
    }
    return null;
  }, [instPrograms]);

  const mappedFacilities = useMemo(() => {
    if (instFacilities && Array.isArray(instFacilities)) {
      return instFacilities.map((f: any) => {
        const rawIcon = (f.facilityIcon || f.icon || "").trim();
        const icon = rawIcon
          ? `fa-${rawIcon.replace(/^fa-/, "").toLowerCase()}`
          : null;
        return {
          icon,
          title: f.heading || f.title || "",
          desc: f.description || f.desc || "",
        };
      });
    }
    return null;
  }, [instFacilities]);

  const mappedDownloads = useMemo(() => {
    if (instDownloads && Array.isArray(instDownloads)) {
      return instDownloads.map((d: any) => ({
        title: d.title || d.name || "",
        size: d.size || d.description || "",
        file: d.file || null,
      }));
    }
    return null;
  }, [instDownloads]);

  const mappedFaqs = useMemo(() => {
    if (instFaqs && Array.isArray(instFaqs)) {
      return instFaqs.map((f: any) => ({
        question: f.question || "",
        answer: f.answer || "",
      }));
    }
    return null;
  }, [instFaqs]);

  const institutionProgramsFromTable = useMemo(() => {
    if (!instInstitutionPrograms || !Array.isArray(instInstitutionPrograms))
      return [];
    return instInstitutionPrograms
      .filter((p: any) => p.globalCourseTitle)
      .map((p: any) => ({
        id: p.id,
        name: p.globalCourseTitle || "",
        level: "",
        affiliation: p.capacity ? `${p.capacity} seats` : "",
        status: p.status === "active" ? "Ongoing" : "Closed",
        courseId: p.id,
      }));
  }, [instInstitutionPrograms]);

  const mappedAdmissions = useMemo(() => {
    if (!instAdmissionPageData) return null;
    const pageData =
      typeof instAdmissionPageData === "string"
        ? JSON.parse(instAdmissionPageData)
        : instAdmissionPageData;
    const level = pageData?.overview_data?.level || "";
    const programs = pageData?.programs_data || [];
    const admissionPageId = college?.admission_page_id;
    return programs.map((p: any) => ({
      level: level || p.subtitle || "",
      status: p.admissionStatus || "Ongoing",
      title: p.title || "",
      affiliation: p.affiliation || p.subtitle || "",
      openDate: p.openDate || "",
      deadline: p.deadline || "",
      image: p.programIcon || "",
      admissionPageId: admissionPageId || 0,
      applyLink: p.applyLink || "",
    }));
  }, [instAdmissionPageData, college?.admission_page_id]);

  const mappedEvents = useMemo(() => {
    if (!instInstitutionEvents || !Array.isArray(instInstitutionEvents))
      return null;
    return instInstitutionEvents
      .filter((e: any) => e.status === "upcoming" || e.status === "published")
      .map((e: any) => ({
        id: e.id,
        slug: e.slug || "",
        image: safeImageUrl(e.image_url || e.image) || "",
        title: e.name || e.title || "",
        date: `${e.start_date || e.date || ""} | ${e.location || "TBD"}`,
        desc: (e.short_desc || e.description || "").trim(),
      }));
  }, [instInstitutionEvents, safeImageUrl]);

  const mappedNews = useMemo(() => {
    if (!instInstitutionNews || !Array.isArray(instInstitutionNews))
      return null;
    return instInstitutionNews
      .filter((n: any) => n.status === "published")
      .map((n: any) => ({
        id: n.id,
        slug: n.slug || "",
        badge: n.news_type || n.category || "News",
        badgeClass: "bg-blue-500 text-white",
        image: safeImageUrl(n.image_url || n.image) || "",
        title: n.title || "",
        desc: (n.short_desc || n.excerpt || n.content || "").trim(),
        time: n.publish_date
          ? new Date(n.publish_date).toLocaleDateString()
          : n.created_at
            ? new Date(n.created_at).toLocaleDateString()
            : "",
      }));
  }, [instInstitutionNews, safeImageUrl]);

  const mappedScholarships = useMemo(() => {
    if (
      !instInstitutionScholarships ||
      !Array.isArray(instInstitutionScholarships)
    )
      return null;
    return instInstitutionScholarships
      .filter((s: any) => s.status === "published")
      .map((s: any) => ({
        id: s.id,
        level: s.degree_level || "",
        program: s.field_of_study?.join(", ") || s.title || "",
        scholarship: s.title || "",
        benefit: s.value || "",
        audience: (s.short_desc || s.description || "").trim(),
      }));
  }, [instInstitutionScholarships]);

  const name = isInstitution ? instName : college?.name || "";
  const locationText = isInstitution ? instLocation : college?.location || "";
  const rating = college?.rating ?? 0;
  const reviewsCount =
    college?.reviews !== undefined
      ? Number(college.reviews || 0).toLocaleString()
      : "0";
  const website = (isInstitution ? instWebsite : college?.website) || "";
  const websiteHref =
    typeof website === "string" && website.startsWith("http")
      ? website
      : website
        ? `https://${website}`
        : "";
  const followerCount = college?.follower_count ?? 0;
  const description =
    (isInstitution ? instDescription : college?.description) || "";
  const isVerified = !!college?.verified || college?.claimed === true;
  const shareTitle = `${name} - Studsphere`;
  const shareText = `Check out ${name} on Studsphere`;

  const filteredCourses = useMemo(
    () => (courseFilter: LevelFilter) =>
      courseFilter === "all"
        ? FALLBACK_COURSES
        : FALLBACK_COURSES.filter((item) => item.level === courseFilter),
    [],
  );
  const filteredPrograms = useMemo(
    () => (programFilter: LevelFilter) =>
      programFilter === "all"
        ? FALLBACK_OFFERED_PROGRAMS
        : FALLBACK_OFFERED_PROGRAMS.filter(
            (item) => item.level === programFilter,
          ),
    [],
  );
  const institutionCoursesFromStorage = useMemo(
    () =>
      getInstitutionCourses().map((c) => ({
        id: c.id,
        level: c.level,
        name: c.name,
        affiliation: c.level === "+2" ? "NEB" : `${c.level} Program`,
        status: c.status === "Active" ? "Ongoing" : "Closed",
        courseId: c.id,
      })),
    [],
  );
  const filteredScholarships = useMemo(
    () => (scholarshipFilter: LevelFilter) =>
      scholarshipFilter === "all"
        ? FALLBACK_SCHOLARSHIPS
        : FALLBACK_SCHOLARSHIPS.filter(
            (item) => item.level === scholarshipFilter,
          ),
    [],
  );

  return {
    collegeId,
    college,
    loading,
    isInstitution,
    name,
    locationText,
    rating,
    reviewsCount,
    website,
    websiteHref,
    followerCount,
    description,
    isVerified,
    shareTitle,
    shareText,
    instLogo,
    instBanner,
    instVideos,
    instVision,
    instMission,
    instOverviewData,
    instLeadershipData,
    instAlumni,
    galleryGroups,
    mappedCourses,
    mappedPrograms,
    mappedFacilities,
    mappedDownloads,
    mappedFaqs,
    mappedAdmissions,
    mappedEvents,
    mappedNews,
    mappedScholarships,
    institutionProgramsFromTable,
    institutionCoursesFromStorage,
    filteredCourses,
    filteredPrograms,
    filteredScholarships,
    reviewsData,
    reviewsLoading,
    loadReviews: () => {
      if (collegeId && !reviewsData) {
        setReviewsLoading(true);
        const isInst = idStr.startsWith("inst_");
        apiService
          .getCollegeReviews(
            isInst ? 0 : collegeId,
            { page: 1, limit: 10, ...(isInst ? { inst_id: collegeId } : {}) },
            { suppressAuthExpired: true },
          )
          .then((res) => {
            if (res?.data) setReviewsData(res.data);
          })
          .catch(console.error)
          .finally(() => setReviewsLoading(false));
      }
    },
  };
}
