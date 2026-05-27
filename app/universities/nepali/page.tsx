import { UniversityListing } from "@/components/education/university-listing";
import { nepaliUniversities } from "@/components/education/university-listing/nepaliUniversitiesData";

export default function NepaliUniversitiesPage() {
  return <UniversityListing universities={nepaliUniversities} type="nepali" />;
}
