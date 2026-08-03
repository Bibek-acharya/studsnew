import JobDetailPage from "@/components/careers/JobDetailPage";

export const metadata = {
  title: "Job Details | StudSphere",
};

export default function JobDetailRoutePage({ params }: { params: { id: string } }) {
  return <JobDetailPage jobId={Number(params.id)} />;
}
