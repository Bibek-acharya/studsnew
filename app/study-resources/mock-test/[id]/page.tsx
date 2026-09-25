import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MockTestRunner from "@/components/studyResources/mockTests/MockTestRunner";
import { mockTestsApi } from "@/services/mockTestsApi";

// Segment configs must stay literal values for the compiler to read them.
export const revalidate = 300;

type MockTestDetailProps = { params: Promise<{ id: string }> };

/**
 * The runner page stays out of the index: it is a thin shell over one fetched
 * test, and every real surface a student lands on (the list, the video
 * collection) is indexed instead.
 */
const BASE_METADATA: Metadata = {
  title: {
    absolute: "Take a Mock Test | Studsphere",
  },
  description:
    "Attempt a full mock test, submit your answers and get your score with a per-question review.",
  robots: { index: false, follow: true },
};

async function getTest(testId: number) {
  try {
    return await mockTestsApi.getMockTest(testId);
  } catch {
    return null;
  }
}

function parseTestId(raw: string): number | null {
  const testId = Number(raw);
  return Number.isInteger(testId) && testId > 0 ? testId : null;
}

export async function generateMetadata({
  params,
}: MockTestDetailProps): Promise<Metadata> {
  const { id } = await params;
  const testId = parseTestId(id);
  if (testId === null) return BASE_METADATA;

  const test = await getTest(testId);
  if (!test) return BASE_METADATA;

  const questionCount = test.questions.length || test.question_count;

  return {
    title: { absolute: `${test.title} | Mock Test | Studsphere` },
    description: `${questionCount} questions${
      test.course ? ` for ${test.course}` : ""
    }. Sign in to submit your answers and see your score.`,
    alternates: { canonical: `/study-resources/mock-test/${testId}` },
    robots: BASE_METADATA.robots,
  };
}

export default async function MockTestDetailPage({
  params,
}: MockTestDetailProps) {
  const { id } = await params;
  const testId = parseTestId(id);
  if (testId === null) notFound();

  const test = await getTest(testId);
  if (!test) notFound();

  return <MockTestRunner testId={testId} initialTest={test} />;
}
