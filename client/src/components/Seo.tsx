import { useEffect } from "react";
import { HOME_SEO, SITE_NAME, SITE_URL } from "@/seo/seoConfig";

interface SeoProps {
  title: string;
  description?: string;
  keywords?: string;
  /** Path relative to the site root, e.g. "/buy-cheese-online". */
  path?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
  schema?: object | object[];
}

type HeadTag = {
  selector: string;
  create: () => HTMLElement;
  /** Attribute to set, or "text" for the element's text content. */
  attr: string;
  value?: string;
  /** Value to reset to when the page unmounts; tags without one are removed. */
  fallback?: string;
};

const setValue = (el: HTMLElement, attr: string, value: string) =>
  attr === "text" ? (el.textContent = value) : el.setAttribute(attr, value);

/**
 * Sets the document title, meta/OG tags, canonical link and JSON-LD for the
 * current page. Reuses tags already in the HTML (prerendered at build time by
 * vite-plugin-seo.ts) so nothing is duplicated, and on unmount resets shared
 * tags to the site defaults and removes page-specific ones.
 */
export default function Seo({
  title,
  description,
  keywords,
  path,
  ogTitle,
  ogDescription,
  ogType = "website",
  ogImage,
  schema,
}: SeoProps) {
  const schemaJson = schema ? JSON.stringify(schema) : "";

  useEffect(() => {
    const url = path !== undefined ? `${SITE_URL}${path}` : undefined;
    const element = (tag: string, attrs: Record<string, string>) => () => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el;
    };
    const meta = (key: "name" | "property", name: string) => ({
      selector: `meta[${key}="${name}"]`,
      create: element("meta", { [key]: name }),
      attr: "content",
    });

    const tags: HeadTag[] = [
      { ...meta("name", "description"), value: description, fallback: HOME_SEO.description },
      { ...meta("name", "keywords"), value: keywords },
      { ...meta("property", "og:locale"), value: "en_US", fallback: "en_US" },
      { ...meta("property", "og:type"), value: ogType, fallback: "website" },
      { ...meta("property", "og:site_name"), value: SITE_NAME, fallback: SITE_NAME },
      { ...meta("property", "og:title"), value: ogTitle || title, fallback: HOME_SEO.title },
      { ...meta("property", "og:description"), value: ogDescription || description, fallback: HOME_SEO.description },
      { ...meta("property", "og:url"), value: url },
      { ...meta("property", "og:image"), value: ogImage },
      {
        selector: 'link[rel="canonical"]',
        create: element("link", { rel: "canonical" }),
        attr: "href",
        value: url,
      },
      {
        selector: 'script[data-seo="page-schema"]',
        create: element("script", { type: "application/ld+json", "data-seo": "page-schema" }),
        attr: "text",
        value: schemaJson,
      },
    ];

    document.title = title;
    for (const tag of tags) {
      let el = document.head.querySelector<HTMLElement>(tag.selector);
      if (!tag.value) {
        // Leftover from a prerendered page this page doesn't define.
        if (el && tag.fallback === undefined) el.remove();
        continue;
      }
      if (!el) {
        el = tag.create();
        document.head.appendChild(el);
      }
      setValue(el, tag.attr, tag.value);
    }

    return () => {
      document.title = HOME_SEO.title;
      for (const tag of tags) {
        const el = document.head.querySelector<HTMLElement>(tag.selector);
        if (!el) continue;
        if (tag.fallback === undefined) el.remove();
        else setValue(el, tag.attr, tag.fallback);
      }
    };
  }, [title, description, keywords, path, ogTitle, ogDescription, ogType, ogImage, schemaJson]);

  return null;
}
