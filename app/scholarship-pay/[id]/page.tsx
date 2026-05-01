import ScholarshipPaymentPage from "@/components/scholarship-apply/ScholarshipPaymentPage";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <ScholarshipPaymentPage scholarshipId={parseInt(params.id)} />;
}