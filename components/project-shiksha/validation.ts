import { ProjectShikshaFormData } from "./types";

export function validateForm(data: ProjectShikshaFormData): {
  valid: boolean;
  errors: Partial<Record<keyof ProjectShikshaFormData, string>>;
} {
  const errors: Partial<Record<keyof ProjectShikshaFormData, string>> = {};

  // Personal Details
  if (!data.fullName.trim()) errors.fullName = "Full name is required";
  if (!data.gender) errors.gender = "Gender is required";
  if (!data.dobBS) errors.dobBS = "Date of birth is required";
  if (!data.phone || data.phone.length !== 10) {
    errors.phone = "Valid 10-digit phone number is required";
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }
  if (!data.seeSchoolType) errors.seeSchoolType = "School type is required";
  if (data.seeSchoolType === "Other" && !data.otherSchoolType.trim()) {
    (errors as Record<string, string>).otherSchoolType = "Please specify the school type";
  }
  if (data.seeSchoolType && !data.schoolName.trim()) {
    errors.schoolName = "School name is required";
  }

  // Address
  if (!data.permProvince) errors.permProvince = "Province is required";
  if (!data.permDistrict.trim()) errors.permDistrict = "District is required";
  if (!data.permMunicipality.trim()) errors.permMunicipality = "Municipality is required";
  if (!data.permWard) errors.permWard = "Ward number is required";
  
  if (!data.tempProvince) errors.tempProvince = "Province is required";
  if (!data.tempDistrict.trim()) errors.tempDistrict = "District is required";
  if (!data.tempMunicipality.trim()) errors.tempMunicipality = "Municipality is required";
  if (!data.tempWard) errors.tempWard = "Ward number is required";

  // Family
  if (!data.guardianName.trim()) errors.guardianName = "Guardian name is required";
  if (!data.guardianPhone || data.guardianPhone.length !== 10) {
    errors.guardianPhone = "Valid 10-digit phone number is required";
  }
  if (data.guardianEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.guardianEmail)) {
    errors.guardianEmail = "Invalid email format";
  }
  if (!data.fatherOccupation) errors.fatherOccupation = "Father's occupation is required";
  if (!data.motherOccupation) errors.motherOccupation = "Mother's occupation is required";
  if (!data.familyIncome || parseInt(data.familyIncome) <= 0) {
    errors.familyIncome = "Family income is required";
  }
  if (!data.familyMembers || parseInt(data.familyMembers) <= 0) {
    errors.familyMembers = "Family members count is required";
  }

  // Documents
  if (!data.seeMarksheet) errors.seeMarksheet = "SEE marksheet is required";
  if (!data.citizenship) errors.citizenship = "Citizenship/Birth certificate is required";
  if (!data.photo) errors.photo = "Passport photo is required";

  // Declaration
  if (!data.declaration) errors.declaration = "You must accept the declaration";

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
