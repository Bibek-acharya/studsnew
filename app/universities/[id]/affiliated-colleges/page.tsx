import AffiliatedColleges from "@/components/education/university-listing/AffiliatedColleges";
import { nepaliUniversities } from "@/components/education/university-listing/nepaliUniversitiesData";
import type { College } from "@/services/api";

const toSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const nepaliSlugs = new Set(nepaliUniversities.map((u) => toSlug(u.name)));

const nepaliUnis = [
  { id: "tu", name: "Tribhuwan University", collegeCount: "950+" },
  { id: "pu", name: "Pokhara University", collegeCount: "320+" },
  { id: "purbanchal", name: "Purbanchal University", collegeCount: "450+" },
  { id: "ku", name: "Kathmandu University", collegeCount: "45+" },
  { id: "nsu", name: "Nepal Sanskrit University", collegeCount: "80+" },
];

const foreignUnis = [
  { id: "harvard", name: "Harvard University", collegeCount: "12+" },
  { id: "stanford", name: "Stanford University", collegeCount: "7+" },
  { id: "oxford", name: "University of Oxford", collegeCount: "39+" },
  { id: "cambridge", name: "University of Cambridge", collegeCount: "31+" },
  { id: "mit", name: "MIT", collegeCount: "5+" },
];

const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop";

const sampleNepaliColleges: College[] = [
  { id: 1, name: "Islington College", location: "Kamalpokhari", rating: 4.5, type: "Private", affiliation: "Tribhuwan University", image_url: SAMPLE_IMAGE, verified: true, description: "Leading college with affiliation to TU. Offering IT and management programs." },
  { id: 2, name: "Pulchowk Engineering Campus", location: "Pulchowk", rating: 4.6, type: "Public", affiliation: "Tribhuwan University", image_url: SAMPLE_IMAGE, verified: true, description: "Premier engineering campus under TU." },
  { id: 3, name: "Kathmandu College of Management", location: "Gwarko", rating: 4.3, type: "Private", affiliation: "Tribhuwan University", image_url: SAMPLE_IMAGE, verified: true, description: "Top management college." },
  { id: 4, name: "Padma Kanya Multiple Campus", location: "Bagbazar", rating: 4.1, type: "Public", affiliation: "Tribhuwan University", image_url: SAMPLE_IMAGE, verified: false, description: "Leading women's college." },
  { id: 5, name: "Bhaktapur Multiple Campus", location: "Bhaktapur", rating: 3.9, type: "Public", affiliation: "Tribhuwan University", image_url: SAMPLE_IMAGE, verified: false, description: "Affordable education in arts and science." },
  { id: 6, name: "Kathmandu Model College", location: "Bagbazar", rating: 4.2, type: "Private", affiliation: "Tribhuwan University", image_url: SAMPLE_IMAGE, verified: true, description: "Well-known for science and management." },
];

const sampleForeignColleges: College[] = [
  { id: 101, name: "Harvard College", location: "Cambridge, MA", rating: 4.8, type: "Private", affiliation: "Harvard University", image_url: SAMPLE_IMAGE, verified: true, description: "Undergraduate liberal arts college of Harvard." },
  { id: 102, name: "Harvard Law School", location: "Cambridge, MA", rating: 4.7, type: "Private", affiliation: "Harvard University", image_url: SAMPLE_IMAGE, verified: true, description: "Top-ranked law school." },
  { id: 103, name: "Harvard Medical School", location: "Boston, MA", rating: 4.8, type: "Private", affiliation: "Harvard University", image_url: SAMPLE_IMAGE, verified: true, description: "Leading medical research institution." },
  { id: 104, name: "Harvard Kennedy School", location: "Cambridge, MA", rating: 4.5, type: "Private", affiliation: "Harvard University", image_url: SAMPLE_IMAGE, verified: true, description: "Public policy and government school." },
  { id: 105, name: "Harvard Business School", location: "Boston, MA", rating: 4.6, type: "Private", affiliation: "Harvard University", image_url: SAMPLE_IMAGE, verified: true, description: "World-renowned MBA program." },
];

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNepali = nepaliSlugs.has(id);

  return (
    <AffiliatedColleges
      universities={isNepali ? nepaliUnis : foreignUnis}
      colleges={isNepali ? sampleNepaliColleges : sampleForeignColleges}
      type={isNepali ? "nepali" : "foreign"}
    />
  );
}
