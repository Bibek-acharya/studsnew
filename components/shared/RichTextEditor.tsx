/**
 * Shared entry point for the Quill editor.
 *
 * The editor itself lives under components/ScholarshipProvider because that is
 * where it was introduced; re-exporting it here keeps admin surfaces in other
 * role folders from importing across role boundaries.
 */
export { default } from "@/components/ScholarshipProvider/common/RichTextEditor";
