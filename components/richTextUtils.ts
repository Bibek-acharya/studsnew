const NO_BREAK_TOKEN = /\S+(?:\s*[-–—]\s*\S+)+/g;

export function findNoBreakTextTokens(text: string): string[] {
  return (text.match(NO_BREAK_TOKEN) ?? []).map((token) =>
    token.replace(/[.,!?;:]+$/, ""),
  );
}
