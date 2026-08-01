"use client";

import React, { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";

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
  ],
  ALLOWED_ATTR: [
    "href", "src", "alt", "width", "height",
    "target", "rel",
    "class", "style",
  ],
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel):|(?!javascript:))/i,
  ADD_ATTR: ["target"],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: [
    "script", "style", "iframe", "video",
    "audio", "embed", "object", "form", "input",
  ],
  FORBID_ATTR: [
    "onerror", "onload", "onclick",
    "onmouseover", "onfocus", "onblur",
  ],
};

type Variant = "sm" | "base" | "lg";

const variantClass: Record<Variant, string> = {
  sm: "prose-sm",
  base: "prose",
  lg: "prose-lg",
};

interface RichTextProps {
  html: string;
  className?: string;
  variant?: Variant;
  as?: keyof React.JSX.IntrinsicElements;
}

const RichText: React.FC<RichTextProps> = ({
  html,
  className = "",
  variant = "base",
  as: Tag = "div",
}) => {
  const sanitized = useMemo(
    () => DOMPurify.sanitize(html || "", PURIFY_CONFIG),
    [html],
  );

  return (
    <Tag
      className={
        `prose prose-slate max-w-none break-words hyphens-none text-left ` +
        `${variantClass[variant]} ${className}`
      }
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default RichText;
