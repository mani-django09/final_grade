import { useEffect } from "react";

const SITE = "https://finalgradecalculators.us";

export interface SeoConfig {
  /** Page <title>. Keep under ~60 chars so Google doesn't truncate it. */
  title: string;
  /** Meta description. Aim for 140–160 chars. */
  description: string;
  /** Path only, e.g. "/grade-calculator". Canonical is built from SITE + path. */
  path: string;
  keywords?: string;
  /** Set on pages that should stay out of the index (404, thank-you pages). */
  noindex?: boolean;
}

function upsertMeta(key: "name" | "property", keyValue: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${keyValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(key, keyValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Per-page SEO tags for this SPA.
 *
 * index.html carries a static set of tags so crawlers that don't run JS still
 * get something sane; this hook rewrites those same tags in place once the
 * route mounts, so each page reports its own title/description/canonical.
 */
export function useSeo({ title, description, path, keywords, noindex }: SeoConfig) {
  useEffect(() => {
    const canonical = `${SITE}${path}`;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    if (keywords) upsertMeta("name", "keywords", keywords);
    upsertLink("canonical", canonical);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);

    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
  }, [title, description, path, keywords, noindex]);
}
