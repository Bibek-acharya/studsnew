export function safeHtml(html: string): string {
  return html.replace(/-/g, "\u2011");
}
