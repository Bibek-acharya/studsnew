export interface ProjectShikshaFormData {
  // Personal Details
  fullName: string;
  gender: string;
  dobBS: string;
  dobAD: string;
  age: string;
  phone: string;
  email: string;
  seeSchoolType: string;
  otherSchoolType: string;
  schoolName: string;

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
  guardianEmail: string;
  fatherOccupation: string;
  motherOccupation: string;
  familyIncome: string;
  familyMembers: string;

  // Education
  seeGpa: string;

  // Documents
  seeMarksheet: File | null;
  citizenship: File | null;
  photo: File | null;

  // Admit Card
  stream: string;
  examCenter: string;

  // Declaration
  declaration: boolean;
}

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
