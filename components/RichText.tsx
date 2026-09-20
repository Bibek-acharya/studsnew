"use client";

import React, { useEffect, useMemo, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import {
  findNoBreakTextTokens,
  normalizeRichTextText,
} from "./richTextUtils";

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    "p", "br",
    "h1", "h2", "h3",
    "strong", "em", "u", "s",
    "ol", "ul", "li",
    "a", "img",
    "blockquote",
    "pre", "code",
    "table", "thead", "tbody", "tr", "th", "td",
    "span", "div",
  ] as string[],
  ALLOWED_ATTR: [
    "href", "src", "alt", "width", "height",
    "target", "rel",
    "class", "style",
  ] as string[],
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel):|(?!javascript:))/i,
  ADD_ATTR: ["target"],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: [
    "script", "style", "iframe", "video",
    "audio", "embed", "object", "form", "input",
  ] as string[],
  FORBID_ATTR: [
    "onerror", "onload", "onclick",
    "onmouseover", "onfocus", "onblur",
  ] as string[],
};

const IFRAME_TAGS = ["p", "br", "span", "div", "iframe"];
const IFRAME_ATTRS = [
  "href", "src", "alt", "width", "height",
  "target", "rel",
  "class", "style",
  "allow", "allowfullscreen", "frameborder", "loading", "referrerpolicy",
];
const IFRAME_URI_REGEXP = /^(?:(?:https):|(?!(?:javascript|data):))/i;

function getConfig(allowIframe: boolean) {
  if (!allowIframe) return PURIFY_CONFIG;
  return {
    ...PURIFY_CONFIG,
    ALLOWED_TAGS: IFRAME_TAGS,
    ALLOWED_ATTR: IFRAME_ATTRS,
    ALLOWED_URI_REGEXP: IFRAME_URI_REGEXP,
    FORBID_TAGS: PURIFY_CONFIG.FORBID_TAGS.filter((t) => t !== "iframe"),
  };
};

type Variant = "sm" | "base" | "lg";

const variantClass: Record<Variant, string> = {
  sm: "prose-sm",
  base: "prose",
  lg: "prose-lg",
};

function protectDashPhrases(html: string): string {
  if (typeof DOMParser === "undefined" || !html) return html;

  const document = new DOMParser().parseFromString(
    `<div>${html}</div>`,
    "text/html",
  );
  const root = document.body.firstElementChild;
  if (!root) return html;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    textNodes.push(node as Text);
    node = walker.nextNode();
  }

  for (const textNode of textNodes) {
    if (textNode.parentElement?.closest("a, code, pre")) continue;
    textNode.data = normalizeRichTextText(textNode.data);

    const tokens = findNoBreakTextTokens(textNode.data);
    if (tokens.length === 0) continue;

    const pattern = new RegExp(
      tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
      "g",
    );
    const fragment = document.createDocumentFragment();
    let offset = 0;

    textNode.data.replace(pattern, (match, index: number) => {
      fragment.append(textNode.data.slice(offset, index));
      const span = document.createElement("span");
      span.className = "rich-text-no-break";
      span.textContent = match;
      fragment.append(span);
      offset = index + match.length;
      return match;
    });
    fragment.append(textNode.data.slice(offset));
    textNode.replaceWith(fragment);
  }

  return root.innerHTML;
}

interface RichTextProps {
  html: string;
  className?: string;
  variant?: Variant;
  as?: keyof React.JSX.IntrinsicElements;
  /** Allow iframe embeds (e.g. Google Maps). Use only for trusted admin-authored content. */
  allowIframe?: boolean;
}

const RichText: React.FC<RichTextProps> = ({
  html,
  className = "",
  variant = "base",
  as: Tag = "div",
  allowIframe = false,
}) => {
  const sanitized = useMemo(
    () => DOMPurify.sanitize(html || "", getConfig(allowIframe)),
    [html, allowIframe],
  );
  const [renderedHtml, setRenderedHtml] = useState(sanitized);

  useEffect(() => {
    setRenderedHtml(protectDashPhrases(sanitized));
  }, [sanitized]);

  return (
    <Tag
      className={
        `rich-text-content prose prose-slate max-w-none break-normal hyphens-none text-left ` +
        `${variantClass[variant]} ${className}`
      }
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default RichText;
