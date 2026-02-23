/**
 * EXAMPLE USAGE: DecorativeWrapper Component
 *
 * This file demonstrates how to use the DecorativeWrapper component
 * to add non-intrusive cheese-themed background elements to your pages.
 */

import DecorativeWrapper from "./DecorativeWrapper";

// Example 1: Wrapping a simple page
export function SimplePageExample() {
  return (
    <DecorativeWrapper>
      <div className="min-h-screen bg-[#FAF7F2]">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-6">Welcome</h1>
            <p className="text-gray-600">
              Your content here remains completely unchanged.
            </p>
          </div>
        </section>
      </div>
    </DecorativeWrapper>
  );
}

// Example 2: Wrapping multiple sections
export function MultiSectionExample() {
  return (
    <DecorativeWrapper>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold">Section 1</h2>
          {/* White background sections render perfectly */}
        </div>
      </section>

      <section className="py-20 bg-[#F5E6D3]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold">Section 2</h2>
          {/* Colored backgrounds also work seamlessly */}
        </div>
      </section>
    </DecorativeWrapper>
  );
}

// Example 3: Wrapping with custom className
export function CustomClassExample() {
  return (
    <DecorativeWrapper className="overflow-x-hidden">
      <div className="min-h-screen">{/* Your content */}</div>
    </DecorativeWrapper>
  );
}

// Example 4: Full page layout (recommended usage)
export function FullPageLayoutExample() {
  return (
    <DecorativeWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 py-4">
            {/* Navigation items */}
          </nav>
        </header>

        {/* Main Content */}
        <main>
          <section className="py-20 bg-[#FAF7F2]">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-6">Our Story</h1>
              <div className="bg-white p-8 shadow-lg">
                {/* Card content - completely unaffected */}
              </div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-6">Products</h2>
              <div className="grid grid-cols-3 gap-6">
                {/* Product cards - z-index and styling preserved */}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#2C5530] text-white py-12">
          <div className="container mx-auto px-4">{/* Footer content */}</div>
        </footer>
      </div>
    </DecorativeWrapper>
  );
}

/**
 * INTEGRATION NOTES:
 *
 * 1. The wrapper uses z-[-10] for background elements, ensuring they stay
 *    behind ALL content, including modals, dropdowns, and tooltips.
 *
 * 2. Child components maintain their original z-index hierarchy.
 *
 * 3. No performance impact - uses CSS background-image with fixed positioning.
 *
 * 4. Fully responsive - background elements scale and reposition automatically.
 *
 * 5. Graceful degradation - if images are missing, no broken icons appear.
 *
 * 6. Hover effects are optional and subtle - won't distract from content.
 */
