import { nepaliCalendarData } from "./nepali-calendar-data";

const nepaliMonths = [
  "Baisakh", "Jestha", "Ashad", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra",
];

const englishMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInNepaliMonth(year: number, month: number): number {
  const yearData = nepaliCalendarData[year];
  if (!yearData) return 30;
  return yearData[month] ?? 30;
}

function normalizeDateToLocalNoon(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

const nepaliEpochAdDate = new Date(1943, 3, 14, 12, 0, 0, 0);

export function bsToAd(bsYear: number, bsMonth: number, bsDay: number): Date {
  let totalDays = 0;

  for (let year = 2000; year < bsYear; year++) {
    totalDays += sum(nepaliCalendarData[year] ?? []);
  }

  for (let month = 0; month < bsMonth; month++) {
    totalDays += getDaysInNepaliMonth(bsYear, month);
  }

  totalDays += bsDay - 1;

  const adDate = new Date(nepaliEpochAdDate);
  adDate.setDate(adDate.getDate() + totalDays);

  return adDate;
}

export function adToBs(adDate: Date): { year: number; month: number; day: number } {
  const normalizedAdDate = normalizeDateToLocalNoon(adDate);

  const diffTime = normalizedAdDate.getTime() - nepaliEpochAdDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    throw new Error("The date doesn't fall within 2000/01/01 - 2090/12/30");
  }

  let remainingDays = diffDays;
  let bsYear = 2000;

  while (remainingDays >= 0) {
    const daysInYear = sum(nepaliCalendarData[bsYear] ?? []);
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

export function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
