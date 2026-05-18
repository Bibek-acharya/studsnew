export interface ScholarshipFormData {
  mainTitle: string;
  providerName: string;
  fundingType: string;
  scholarshipType: string;
  educationLevel: string;
  location: string;
  bannerBgUrl: string;
  startDate: string;
  endDate: string;
  contactEmail: string;
  primaryPhone: string;
  secondaryPhone: string;
  websiteUrl: string;
  coverageArea: string;
  officeAddress: string;
  mapUrl: string;
  scholarshipSectionTitle: string;
  scholarshipSubtitle: string;
  scholarshipDescription: string;
  eligibilitySectionTitle: string;
  eligibilitySubtitle: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
}

export function validateScholarshipData(data: ScholarshipFormData): ValidationResult {
  const errors: FieldError[] = [];

  if (!data.mainTitle.trim()) {
    errors.push({ field: "mainTitle", message: "Main title is required" });
  }

  if (!data.providerName.trim()) {
    errors.push({ field: "providerName", message: "Provider name is required" });
  }

  if (!data.fundingType) {
    errors.push({ field: "fundingType", message: "Funding type is required" });
  }

  if (!data.scholarshipType) {
    errors.push({ field: "scholarshipType", message: "Scholarship type is required" });
  }

  if (!data.educationLevel) {
    errors.push({ field: "educationLevel", message: "Education level is required" });
  }

  if (!data.location.trim()) {
    errors.push({ field: "location", message: "Location is required" });
  }

  if (!data.bannerBgUrl) {
    errors.push({ field: "bannerBgUrl", message: "Banner image is required" });
  }

  if (!data.contactEmail) {
    errors.push({ field: "contactEmail", message: "Contact email is required" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
    errors.push({ field: "contactEmail", message: "Invalid contact email format" });
  }

  if (!data.primaryPhone) {
    errors.push({ field: "primaryPhone", message: "Primary phone is required" });
  } else if (!/^9\d{9}$/.test(data.primaryPhone)) {
    errors.push({ field: "primaryPhone", message: "Primary phone must be 10 digits starting with 9" });
  }

  if (data.secondaryPhone && !/^9\d{9}$/.test(data.secondaryPhone)) {
    errors.push({ field: "secondaryPhone", message: "Secondary phone must be 10 digits starting with 9" });
  }

  if (!data.websiteUrl) {
    errors.push({ field: "websiteUrl", message: "Website URL is required" });
  } else {
    try {
      const url = new URL(data.websiteUrl);
      if (!url.protocol.startsWith("http")) {
        errors.push({ field: "websiteUrl", message: "Website URL must start with http:// or https://" });
      }
    } catch {
      errors.push({ field: "websiteUrl", message: "Invalid website URL" });
    }
  }

  if (!data.coverageArea.trim()) {
    errors.push({ field: "coverageArea", message: "Coverage area is required" });
  }

  if (!data.officeAddress.trim()) {
    errors.push({ field: "officeAddress", message: "Office address is required" });
  }

  if (!data.mapUrl.trim()) {
    errors.push({ field: "mapUrl", message: "Map URL is required" });
  } else {
    try {
      const url = new URL(data.mapUrl);
      if (!url.protocol.startsWith("http")) {
        errors.push({ field: "mapUrl", message: "Map URL must start with http:// or https://" });
      }
    } catch {
      errors.push({ field: "mapUrl", message: "Invalid map URL" });
    }
  }

  if (!data.scholarshipSectionTitle.trim()) {
    errors.push({ field: "scholarshipSectionTitle", message: "Scholarship section title is required" });
  }

  if (!data.scholarshipSubtitle.trim()) {
    errors.push({ field: "scholarshipSubtitle", message: "Scholarship subtitle is required" });
  }

  if (!data.scholarshipDescription.trim()) {
    errors.push({ field: "scholarshipDescription", message: "Scholarship description is required" });
  }

  if (!data.eligibilitySectionTitle.trim()) {
    errors.push({ field: "eligibilitySectionTitle", message: "Eligibility section title is required" });
  }

  if (!data.eligibilitySubtitle.trim()) {
    errors.push({ field: "eligibilitySubtitle", message: "Eligibility subtitle is required" });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateDates(startDate: string, endDate: string): ValidationResult {
  const errors: FieldError[] = [];

  if (!startDate) {
    errors.push({ field: "startDate", message: "Start date is required" });
  } else {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      errors.push({ field: "startDate", message: "Invalid start date format" });
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        errors.push({ field: "startDate", message: "Start date must be in the future" });
      }
    }
  }

  if (!endDate) {
    errors.push({ field: "endDate", message: "End date is required" });
  } else {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      errors.push({ field: "endDate", message: "Invalid end date format" });
    } else if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime()) && end <= start) {
        errors.push({ field: "endDate", message: "End date must be after start date" });
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}
