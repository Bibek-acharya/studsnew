import type { SeriesPoint } from "../../../../services/superadminAnalyticsApi";

function escapeCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Wide series → CSV: union of value keys becomes the sorted header.
export function seriesToCSV(series: SeriesPoint[]): string {
  const keys = Array.from(new Set(series.flatMap((p) => Object.keys(p.values)))).sort();
  const lines = [`bucket${keys.length ? "," + keys.join(",") : ""}`];
  for (const point of series) {
    lines.push(
      [point.bucket, ...keys.map((k) => (point.values[k] ?? "") as string | number)]
        .map(escapeCell)
        .join(","),
    );
  }
  return lines.join("\n");
}

export function downloadCSV(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
