import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StudyResourcesPage from "./StudyResourcesPage";
import VideoLecturesPage from "./VideoLecturesPage";
import MockTestListPage from "./mockTests/MockTestListPage";
import {
  getStudyResourceCategory,
  resolveLockedApiType,
  type StudyResourceCategory,
  type StudyResourceCategoryRender,
  type StudyResourceCategorySlug,
} from "./studyResourceCategories";

const THIN_PLACEHOLDER_STATUSES = new Set<StudyResourceCategory["status"]>([
  "coming-soon",
  "planned",
]);

export function createStudyResourceCategoryMetadata(
  slug: StudyResourceCategorySlug,
): Metadata {
  const category = getStudyResourceCategory(slug);
  if (!category) return {};

  const isPlaceholder = THIN_PLACEHOLDER_STATUSES.has(category.status);

  return {
    title: {
      absolute:
        category.status === "available"
          ? `${category.label} — Free Study Materials | Studsphere`
          : `${category.label} | Studsphere`,
    },
    description: category.description,
    alternates: { canonical: category.href },
    openGraph: {
      title: `${category.label} | Studsphere`,
      description: category.description,
      url: category.href,
      type: "website",
    },
    robots: isPlaceholder
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

/** Picks the surface for a category. Each `render` kind has one owner. */
export function renderCategorySurface(
  render: StudyResourceCategoryRender,
  category: StudyResourceCategory,
) {
  switch (render) {
    case "video-lectures":
      return <VideoLecturesPage />;
    case "mock-tests":
      return <MockTestListPage />;
    case "resources":
    default: {
      const lockedType = resolveLockedApiType(category);
      if (!lockedType) notFound();
      return <StudyResourcesPage lockedType={lockedType} />;
    }
  }
}

export default function StudyResourceCategoryPage({
  slug,
}: {
  slug: StudyResourceCategorySlug;
}) {
  const category = getStudyResourceCategory(slug);
  if (!category) notFound();

  return renderCategorySurface(category.render, category);
}
