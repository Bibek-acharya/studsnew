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
  
  // Documents
  seeMarksheet: File | null;
  citizenship: File | null;
  photo: File | null;
  
  // Declaration
  declaration: boolean;
}

export const schoolTypes = [
  "Private",
  "Government",
  "Community",
  "Other",
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
