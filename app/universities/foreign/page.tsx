import { UniversityListing } from "@/components/education/university-listing";
import { foreignUniversities } from "@/components/education/university-listing/foreignUniversitiesData";

export default function ForeignUniversitiesPage() {
  return <UniversityListing universities={foreignUniversities} type="foreign" />;
}
