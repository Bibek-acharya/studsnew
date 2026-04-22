const nepaliCalendarData: Record<number, number[]> = {
  2050: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2051: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2052: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2053: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2054: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2055: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2056: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2057: [31, 31, 32, 31, 32, 30, 30, 30, 29, 30, 29, 31],
  2058: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2059: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2060: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2061: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2062: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2063: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2064: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2065: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2066: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2067: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2068: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2069: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2070: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2071: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2072: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2073: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2074: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2075: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2076: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2077: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2078: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2079: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2081: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2083: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2085: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2086: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2087: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2088: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2089: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
};

const nepaliMonths = [
  "Baisakh", "Jestha", "Ashad", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const englishMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getDaysInNepaliMonth(year: number, month: number): number {
  if (nepaliCalendarData[year]) {
    return nepaliCalendarData[year][month];
  }
  return 30;
}

export function bsToAd(bsYear: number, bsMonth: number, bsDay: number): Date {
  const baseAdDate = new Date(1943, 3, 13);
  
  let totalDays = 0;
  
  for (let year = 2000; year < bsYear; year++) {
    const daysInYear = nepaliCalendarData[year]?.reduce((a, b) => a + b, 0) || 365;
    totalDays += daysInYear;
  }
  
  for (let month = 0; month < bsMonth; month++) {
    totalDays += getDaysInNepaliMonth(bsYear, month);
  }
  
  totalDays += bsDay - 1;
  
  const adDate = new Date(baseAdDate);
  adDate.setDate(adDate.getDate() + totalDays);
  
  return adDate;
}

export function adToBs(adDate: Date): { year: number; month: number; day: number } {
  const baseAdDate = new Date(1943, 3, 13);
  
  const diffTime = adDate.getTime() - baseAdDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  let remainingDays = diffDays;
  let bsYear = 2000;
  
  while (remainingDays >= 0) {
    const daysInYear = nepaliCalendarData[bsYear]?.reduce((a, b) => a + b, 0) || 365;
    if (remainingDays < daysInYear) {
      break;
    }
    remainingDays -= daysInYear;
    bsYear++;
  }
  
  let bsMonth = 0;
  while (remainingDays >= 0) {
    const daysInMonth = getDaysInNepaliMonth(bsYear, bsMonth);
    if (remainingDays < daysInMonth) {
      break;
    }
    remainingDays -= daysInMonth;
    bsMonth++;
  }
  
  const bsDay = remainingDays + 1;
  
  return { year: bsYear, month: bsMonth, day: bsDay };
}

export function formatNepaliDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatEnglishDate(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function calculateAge(dob: Date): string {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age.toString();
}

export function getNepaliMonths(): string[] {
  return nepaliMonths;
}

export function getEnglishMonths(): string[] {
  return englishMonths;
}

export function getDaysInMonth(year: number, month: number): number {
  return getDaysInNepaliMonth(year, month);
}

export function getCurrentBsDate(): { year: number; month: number; day: number } {
  return adToBs(new Date());
}
