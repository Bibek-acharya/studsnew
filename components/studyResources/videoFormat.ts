/** Small presentation helpers shared by the public video page and superadmin. */

/** 95 → "1:35", 3725 → "1:02:05". Missing runtimes render as an em dash. */
export function formatDuration(seconds: number | null | undefined): string {
  const total = Number(seconds);
  if (!Number.isFinite(total) || total <= 0) return "—";
  const rounded = Math.round(total);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const secs = rounded % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`;
}

export function formatFileSize(bytes: number | string | null | undefined): string {
  const size = Number(bytes) || 0;
  if (size <= 0) return "—";
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(size / 1024)} KB`;
}

export function formatCount(value: number | null | undefined): string {
  const count = Number(value) || 0;
  return count.toLocaleString("en-US");
}

/** Accepts "90" or "1:30" and returns seconds; NaN when unparseable. */
export function parseDurationToSeconds(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) return NaN;
  if (!trimmed.includes(":")) {
    const plain = Number(trimmed);
    return Number.isFinite(plain) ? plain : NaN;
  }
  const parts = trimmed.split(":").map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part) || part < 0)) return NaN;
  return parts.reduce((total, part) => total * 60 + part, 0);
}
