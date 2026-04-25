export type AdPlacementId =
  | "course-carousel"
  | "course-kist-programs"
  | "course-banner"
  | "find-college-trending"
  | "find-college-feedback"
  | "admissions-featured"
  | "admissions-direct"
  | "home-ad-widgets";

export type AdPlacementKind = "carousel" | "banner" | "panel" | "prompt";

export interface AdCreativeSlide {
  title: string;
  description?: string;
  image: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface AdPlacementRecord {
  id: AdPlacementId;
  label: string;
  route: string;
  component: string;
  kind: AdPlacementKind;
  enabled: boolean;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string;
  accent: string;
  notes: string;
  slides?: AdCreativeSlide[];
}

const STORAGE_KEY = "studsphere_ad_controller";

const DEFAULT_AD_PLACEMENTS: AdPlacementRecord[] = [
  {
    id: "course-carousel",
    label: "Course Finder Carousel",
    route: "/course-finder",
    component: "components/course-finder/ads/CourseCarouselAd.tsx",
    kind: "carousel",
    enabled: true,
    headline: "Courses within different colleges",
    description: "Carousel spotlight shown inside the course finder listing.",
    ctaLabel: "View Colleges",
    ctaUrl: "/course-finder",
    imageUrl:
      "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/media/c41b90bcc485bfd7e06896d9bd8deb1c75a299431672641200.jpg",
    accent: "#0000ff",
    notes: "Appears after the first course cards and repeats in the grid.",
    slides: [
      {
        title: "BSc. CSIT",
        description: "Highly sought-after core computing degree.",
        image:
          "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/media/c41b90bcc485bfd7e06896d9bd8deb1c75a299431672641200.jpg",
        ctaLabel: "Explore CSIT",
        ctaUrl: "/course-finder",
      },
      {
        title: "BCA",
        description: "Application development and software engineering.",
        image:
          "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/e71ee13b2c733ac02f8709c49f3677c3d0f2d9d01766569944.jpg",
        ctaLabel: "Explore BCA",
        ctaUrl: "/course-finder",
      },
    ],
  },
  {
    id: "course-kist-programs",
    label: "KIST Programs Spotlight",
    route: "/course-finder",
    component: "components/course-finder/ads/KistProgramsAd.tsx",
    kind: "panel",
    enabled: true,
    headline: "Best bachelor degree",
    description: "Program spotlight and employer logos in the course finder.",
    ctaLabel: "See Programs",
    ctaUrl: "/course-finder",
    imageUrl: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    accent: "#16a34a",
    notes: "Rendered after the course carousel in the course finder grid.",
  },
  {
    id: "course-banner",
    label: "StudSphere Banner",
    route: "/course-finder",
    component: "components/course-finder/ads/SudsphereBannerAd.tsx",
    kind: "banner",
    enabled: true,
    headline: "Empower your career with StudSphere today",
    description: "Primary promotional banner in the course finder flow.",
    ctaLabel: "Get Started",
    ctaUrl: "/register",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
    accent: "#0b71d1",
    notes: "Used as the final banner in the course finder ad rotation.",
  },
  {
    id: "find-college-trending",
    label: "Trending Colleges",
    route: "/find-college",
    component: "components/find-college/ads/TrendingCollegesAd.tsx",
    kind: "panel",
    enabled: true,
    headline: "Monthly spotlight",
    description: "Shows the most viewed and spotlighted colleges on the discovery page.",
    ctaLabel: "Explore Colleges",
    ctaUrl: "/find-college",
    imageUrl:
      "https://advancefoundation.edu.np/public/assets/img/logo.jpg",
    accent: "#0044ff",
    notes: "Inserted every sixth card in the college grid.",
  },
  {
    id: "find-college-feedback",
    label: "Recommendation Feedback",
    route: "/find-college",
    component: "components/find-college/ads/RecommendationFeedback.tsx",
    kind: "prompt",
    enabled: true,
    headline: "Are these colleges relevant?",
    description: "Feedback prompt for improving recommendation quality.",
    ctaLabel: "Send Feedback",
    ctaUrl: "/find-college",
    imageUrl: "",
    accent: "#0c1844",
    notes: "Appears after the trending colleges placement in the grid.",
  },
  {
    id: "admissions-featured",
    label: "Featured Admission",
    route: "/admissions/[level]",
    component: "components/admissions/FeaturedAdmissionAd.tsx",
    kind: "panel",
    enabled: true,
    headline: "Featured Admission",
    description: "Sponsored admission card block in the admissions grid.",
    ctaLabel: "View Admissions",
    ctaUrl: "/admissions",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop",
    accent: "#2563eb",
    notes: "Rendered after the third row of admissions results.",
  },
  {
    id: "admissions-direct",
    label: "Direct Admission",
    route: "/admissions/[level]",
    component: "components/admissions/DirectAdmissionAd.tsx",
    kind: "panel",
    enabled: true,
    headline: "Skip the queue: Apply directly",
    description: "Direct-admission sponsor panel in the admissions grid.",
    ctaLabel: "Apply Direct",
    ctaUrl: "/admissions",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    accent: "#7c3aed",
    notes: "Rendered later in the admissions flow as the second ad block.",
  },
  {
    id: "home-ad-widgets",
    label: "Home Ad Widgets",
    route: "/",
    component: "components/education/landing/AdWidgetsSection.tsx",
    kind: "carousel",
    enabled: true,
    headline: "Partner spotlights",
    description: "Landing-page ad widgets near the middle of the home page.",
    ctaLabel: "Open Spotlight",
    ctaUrl: "/",
    imageUrl:
      "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/3b46b09ce63aa0e3b287a5b1855ce3df27e6b98e1705905215.jpg",
    accent: "#111827",
    notes: "Shown in the marketing section on the landing page.",
    slides: [
      {
        title: "Discover Campus Life",
        description: "Spotlight placement on the homepage.",
        image:
          "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/media/c41b90bcc485bfd7e06896d9bd8deb1c75a299431672641200.jpg",
      },
      {
        title: "Explore Academic Programs",
        description: "Secondary homepage widget.",
        image:
          "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/e71ee13b2c733ac02f8709c49f3677c3d0f2d9d01766569944.jpg",
      },
    ],
  },
];

function loadState(): Record<AdPlacementId, AdPlacementRecord> {
  if (typeof window === "undefined") {
    return DEFAULT_AD_PLACEMENTS.reduce((acc, placement) => {
      acc[placement.id] = placement;
      return acc;
    }, {} as Record<AdPlacementId, AdPlacementRecord>);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_AD_PLACEMENTS.reduce((acc, placement) => {
        acc[placement.id] = placement;
        return acc;
      }, {} as Record<AdPlacementId, AdPlacementRecord>);
    }

    const parsed = JSON.parse(raw) as Record<AdPlacementId, AdPlacementRecord>;
    return DEFAULT_AD_PLACEMENTS.reduce((acc, placement) => {
      acc[placement.id] = parsed?.[placement.id] ? { ...placement, ...parsed[placement.id] } : placement;
      return acc;
    }, {} as Record<AdPlacementId, AdPlacementRecord>);
  } catch {
    return DEFAULT_AD_PLACEMENTS.reduce((acc, placement) => {
      acc[placement.id] = placement;
      return acc;
    }, {} as Record<AdPlacementId, AdPlacementRecord>);
  }
}

function saveState(state: Record<AdPlacementId, AdPlacementRecord>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function listAdPlacements(): AdPlacementRecord[] {
  return DEFAULT_AD_PLACEMENTS.map((placement) => getAdPlacement(placement.id));
}

export function getAdPlacement(id: AdPlacementId): AdPlacementRecord {
  const state = loadState();
  return state[id] || DEFAULT_AD_PLACEMENTS.find((placement) => placement.id === id)!;
}

export function updateAdPlacement(id: AdPlacementId, patch: Partial<AdPlacementRecord>): AdPlacementRecord {
  const state = loadState();
  const next = {
    ...getAdPlacement(id),
    ...patch,
  };
  state[id] = next;
  saveState(state);
  return next;
}

export function toggleAdPlacement(id: AdPlacementId): AdPlacementRecord {
  const next = updateAdPlacement(id, { enabled: !getAdPlacement(id).enabled });
  return next;
}

export function resetAdPlacement(id: AdPlacementId): AdPlacementRecord {
  const defaultPlacement = DEFAULT_AD_PLACEMENTS.find((placement) => placement.id === id);
  if (!defaultPlacement) {
    throw new Error(`Unknown ad placement: ${id}`);
  }

  const state = loadState();
  state[id] = defaultPlacement;
  saveState(state);
  return defaultPlacement;
}

export function resetAllAdPlacements(): AdPlacementRecord[] {
  const state = DEFAULT_AD_PLACEMENTS.reduce((acc, placement) => {
    acc[placement.id] = placement;
    return acc;
  }, {} as Record<AdPlacementId, AdPlacementRecord>);
  saveState(state);
  return DEFAULT_AD_PLACEMENTS;
}

export function getEnabledAdPlacements(): AdPlacementRecord[] {
  return listAdPlacements().filter((placement) => placement.enabled);
}

export function getSurfacePlacements(surface: string): AdPlacementRecord[] {
  return listAdPlacements().filter((placement) => placement.route === surface);
}

