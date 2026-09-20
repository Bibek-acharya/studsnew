type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Server-safe JSON-LD injector. Renders an invisible
 * <script type="application/ld+json"> tag — no visual or layout impact.
 * Must not be marked "use client".
 */
export default function JsonLd({ data }: JsonLdProps) {
  // Escape "<" so embedded HTML cannot break out of the script tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
