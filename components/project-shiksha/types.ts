export interface ProjectShikshaFormData {
  // Personal Details
  fullName: string;
  gender: string;
  ethnicity: string;
  ethnicityOther: string;
  dobBS: string;
  dobAD: string;
  age: string;
  phone: string;
  email: string;

  // Education
  seeSchoolType: string;
  schoolName: string;
  seeGpa: string;
  schoolProvince: string;
  schoolDistrict: string;
  schoolMunicipality: string;
  schoolTole: string;

  // Address
  permProvince: string;
  permDistrict: string;
  permMunicipality: string;
  permWard: string;
  permTole: string;
  tempProvince: string;
  tempDistrict: string;
  tempMunicipality: string;
  tempWard: string;
  tempTole: string;

  // Family
  guardianName: string;
  guardianPhone: string;

  // Documents
  seeMarksheet: File | null;
  photo: File | null;

  // Admit Card
  stream: string;
  examCenter: string;

  // Declaration
  declaration: boolean;
}

export const ethnicities = [
  "Bahun (Brahmin)",
  "Chhetri",
  "Newar",
  "Magar",
  "Tamang",
  "Gurung",
  "Rai",
  "Limbu",
  "Tharu",
  "Sherpa",
  "Thakuri",
  "Madhesi",
  "Muslim",
  "Dalit",
  "Janajati",
  "Other",
];

export const schoolTypes = [
  "Private",
  "Public",
  "Community",
];

export const occupations = [
  "Homemaker",
  "Agriculture/Farming",
  "Business/Commerce",
  "Government Service",
  "Private Sector",
  "Teaching/Education",
  "Foreign Employment",
  "Other",
];

export const streams = ["Science", "Management"];

export const examCenters = [
  "Advance Academy Lalitpur",
  "Himalayan White House",
  "Nobel College",
  "Golden Gate International College",
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Chitwan",
  "Rupandehi",
  "Jhapa",
  "Morang",
  "Sunsari",
  "Banke",
  "Kailali",
  "Dharan",
  "Birgunj",
  "Biratnagar",
  "Nepalgunj",
];
