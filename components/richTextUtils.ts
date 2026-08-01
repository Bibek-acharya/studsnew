const NO_BREAK_TOKEN = /\S*[-–—]\S*/g;

export function normalizeRichTextText(text: string): string {
  return text.replace(/\u00a0/g, " ");
}

export function findNoBreakTextTokens(text: string): string[] {
  return (text.match(NO_BREAK_TOKEN) ?? []).map((token) =>
    token.replace(/[.,!?;:]+$/, ""),
  );
}
