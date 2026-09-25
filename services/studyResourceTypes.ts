/**
 * The StudyResource type contract, kept in a leaf module so both the service
 * and the public category config can depend on it without an import cycle.
 */

/** The four downloadable document types (unchanged since launch). */
export const STUDY_RESOURCE_DOCUMENT_TYPES = [
  "past-questions",
  "study-notes",
  "model-questions",
  "syllabus",
] as const;

/** Fifth StudyResource type: streamed video lectures, same storage model. */
export const STUDY_RESOURCE_VIDEO_TYPE = "video-lectures" as const;

/** Every type the study-resources API serves: documents plus video lectures. */
export const STUDY_RESOURCE_API_TYPES = [
  ...STUDY_RESOURCE_DOCUMENT_TYPES,
  STUDY_RESOURCE_VIDEO_TYPE,
] as const;

export type StudyResourceApiType = (typeof STUDY_RESOURCE_API_TYPES)[number];

export function isVideoStudyResourceType(
  type: string | undefined,
): boolean {
  return type === STUDY_RESOURCE_VIDEO_TYPE;
}
