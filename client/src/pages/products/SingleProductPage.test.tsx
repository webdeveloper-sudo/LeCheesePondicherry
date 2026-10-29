import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import ProductPage from "./SingleProductPage";

vi.mock("@/config", () => ({ FETCH_MODE: "static", API_BASE_URL: "" }));
vi.mock("@/components/ProductDetailClient", () => ({
  default: ({ product }: { product: { id: string } }) => <p>product:{product.id}</p>,
}));

const CurrentPath = () => <span data-testid="path">{useLocation().pathname}</span>;

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/products/:slug"
          element={
            <>
              <ProductPage />
              <CurrentPath />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe("SingleProductPage (static mode)", () => {
  it("finds static products by their SEO URL", async () => {
    renderAt("/products/buy-mozzarella-cheese");
    expect(await screen.findByText("product:mozzarella-cheese")).toBeTruthy();
  });

  it("redirects static catalogue ids to the SEO URL", async () => {
    renderAt("/products/pondy-orange-cheese");
    expect(await screen.findByText("product:pondy-orange-cheese")).toBeTruthy();
    expect(screen.getByTestId("path").textContent).toBe("/products/buy-cheddar-cheese");
  });

  it("finds static products without SEO content by their id", async () => {
    renderAt("/products/skyr-cheese");
    expect(await screen.findByText("product:skyr-cheese")).toBeTruthy();
  });
});
