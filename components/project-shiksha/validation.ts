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
  if (data.dobBS && data.age && parseInt(data.age) < 14) {
    errors.dobBS = "You must be at least 14 years old to apply";
  }
  if (!data.phone || data.phone.length !== 10) {
    errors.phone = "Valid 10-digit phone number is required";
  } else if (!data.phone.startsWith("9")) {
    errors.phone = "Phone number must start with 9";
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }
  if (!data.seeSchoolType) errors.seeSchoolType = "School type is required";
  if (data.seeSchoolType && !data.schoolName.trim()) {
    errors.schoolName = "School name is required";
  }

  // Education
  if (!data.seeGpa.trim()) errors.seeGpa = "SEE GPA is required";
  if (data.seeGpa.trim() && (isNaN(parseFloat(data.seeGpa)) || parseFloat(data.seeGpa) < 0 || parseFloat(data.seeGpa) > 4)) {
    errors.seeGpa = "GPA must be between 0 and 4";
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
  } else if (!data.guardianPhone.startsWith("9")) {
    errors.guardianPhone = "Phone number must start with 9";
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
  if (!data.birthCertificate) errors.birthCertificate = "Citizenship/Birth certificate is required";
  if (!data.photo) errors.photo = "Passport photo is required";

  // Admit Card
  if (!data.stream) errors.stream = "Stream is required";
  if (!data.examCenter) errors.examCenter = "Exam center is required";

  // Declaration
  if (!data.declaration) errors.declaration = "You must accept the declaration";

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
