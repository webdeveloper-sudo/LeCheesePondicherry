# Le Pondicherry Cheese - Artisan E-commerce Platform

A premium e-commerce platform for handcrafted artisan cheese from Pondicherry. Built with a focus on high-end aesthetics, search engine optimization (SEO), and data-driven customer interaction.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Hosting/Deployment**: Netlify/Vercel compatible

## ✨ Key Features

### 1. Product Catalog & Shop
- **Server-Side Rendering (SSR)**: Core product and shop pages are Server Components for maximum SEO performance.
- **Dynamic Filtering**: Client-side filtering and sorting for a seamless user experience.
- **Product Detail Pages**: Dynamic routes with rich-text descriptions and related product suggestions.

### 2. Advanced SEO Implementation
- **Dynamic Metadata**: Automatic generation of titles and descriptions for every product.
- **JSON-LD Structured Data**: 
  - `Organization` schema for the brand.
  - `Product` schema for rich snippets (prices, ratings, stock) in search results.
- **Automated Sitemaps**: Dynamic `sitemap.xml` that updates with the product catalog.
- **Robots.txt**: Automated configuration following search engine best practices.

### 3. Smart ChatBot & Analytics
- **Context-Aware Assistance**: Chat interface with knowledge of the full product catalog.
- **Custom Analytics Engine**: 
  - Logs all chat interactions to `chat_logs/` as daily JSON files.
  - Tracks session IDs and product mentions for business intelligence.
  - *Note: In production, consider migrating the file-based logging to a database (e.g., Supabase or MongoDB).*

### 4. Artisan Design System
- Custom color palette: `#2C5530` (Forest Green), `#C9A961` (Artisan Gold), `#FAF7F2` (Cream).
- Semantic HTML5 structure for accessibility and SEO.

## 📂 Project Structure

- `src/app/`: App router routes (Server & Client pages).
- `src/components/`: Reusable UI components.
- `src/data/`: Static and dynamic data files (Products, Chatbot knowledge).
- `src/context/`: React context providers (Cart state).
- `src/utils/`: Utility functions (Analytics, Helper functions).
- `public/`: Static assets (Optimized product photography).
- `chat_logs/`: Local storage for chat interaction analytics.

## 🛠️ Development

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Building for Production
```bash
npm run build
```
Verify that all routes are correctly exported as static/dynamic.

## 📝 Developer Handoff Notes

- **Dynamic Params**: The project uses Next.js 15/16. In Server Components, `params` and `searchParams` are Promises and **must be awaited**.
- **Images**: All product images are stored in `public/images/products/`. They have been processed for a uniform e-commerce look.
- **Chat Logs**: The `chat_logs` directory is ignored by default in some environments. Ensure it is writable in your deployment environment if you continue using file-based logging.

---

*Part of the AGOC (Achariya Group of Companies) Ecosystem.*
