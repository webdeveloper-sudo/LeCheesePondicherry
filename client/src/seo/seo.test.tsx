import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Seo from "@/components/Seo";
import { getProductSeo, productPath, resolveDbSlug, HOME_SEO } from "./seoConfig";
import schemas from "./schemas.json";

describe("seoConfig", () => {
  it("maps SEO, DB and legacy slugs to the DB slug", () => {
    expect(resolveDbSlug("buy-pizza-cheese")).toBe("pizzaella");
    expect(resolveDbSlug("pizzaella")).toBe("pizzaella");
    expect(resolveDbSlug("halloumi")).toBe("hallomi");
    expect(resolveDbSlug("unknown-product")).toBe("unknown-product");
  });

  it("builds SEO product URLs", () => {
    expect(productPath("pondyorange")).toBe("/products/buy-cheddar-cheese");
    expect(productPath("baby-swiss-cheese")).toBe("/products/buy-baby-swiss-cheese");
    expect(productPath("unknown-product")).toBe("/products/unknown-product");
    expect(getProductSeo("buy-paneer-online")?.productName).toBe("Paneer");
  });

  it("product schemas point at the canonical product URL", () => {
    const seo = getProductSeo("grana-chery")!;
    const graph = (seo.schema as { "@graph": { "@type": string; "@id": string; url?: string }[] })["@graph"];
    const product = graph.find((n) => n["@type"] === "Product")!;
    expect(product["@id"]).toBe(`https://www.lepondicheese.com${seo.path}#product`);
    expect(JSON.stringify(schemas)).not.toMatch(/www\.www\.|www\.schema\.org|\.com\/shop["#]/);
  });
});

describe("Seo", () => {
  it("sets head tags and restores them on unmount", () => {
    document.title = "Le Pondicherry Cheese";
    const { unmount } = render(<Seo {...HOME_SEO} />);

    expect(document.title).toBe(HOME_SEO.title);
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(HOME_SEO.description);
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://www.lepondicheese.com/");
    expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe(HOME_SEO.title);
    expect(document.head.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);

    unmount();
    expect(document.title).toBe(HOME_SEO.title);
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
  });

  it("reuses prerendered tags instead of duplicating them", () => {
    document.head.innerHTML =
      '<link rel="canonical" href="https://www.lepondicheese.com/products/buy-pizza-cheese" />' +
      '<script type="application/ld+json" data-seo="page-schema">{"old":true}</script>';
    const shop = getProductSeo("feta")!;
    const { unmount } = render(<Seo {...shop} />);

    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      "https://www.lepondicheese.com/products/buy-fetta-cheese",
    );
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    expect(scripts[0].textContent).toBe(JSON.stringify(shop.schema));

    unmount();
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelector('script[data-seo="page-schema"]')).toBeNull();
  });
});
