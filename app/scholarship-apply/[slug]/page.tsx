import { scholarshipApi } from "@/services/api";
import DynamicScholarshipForm from "@/components/scholarship-apply/DynamicScholarshipForm";

interface PageProps {
  params: { slug: string };
}

export default async function ScholarshipApplyPage({ params }: PageProps) {
  const scholarship = await scholarshipApi.getScholarshipById(params.slug);

  const formConfig = scholarship.form_config || {
    sections: [
      {
        id: "personal",
        title: "Personal Details",
        fields: [
          { id: "full_name", label: "Full Name", type: "text", required: true },
          { id: "email", label: "Email", type: "email", required: true },
          { id: "phone", label: "Phone", type: "tel", required: true },
        ],
      },
    ],
  };

  return (
    <DynamicScholarshipForm
      scholarshipId={scholarship.id}
      scholarshipSlug={params.slug}
      scholarshipTitle={scholarship.title}
      formConfig={formConfig}
    />
  );
}
