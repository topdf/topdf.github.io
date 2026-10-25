# ToPDF — Free Offline JPG to PDF Converter (100% Client-Side)

[![Live Demo](https://img.shields.io/badge/Live_Demo-topdf.github.io-F2765E?style=for-the-badge&logo=googlechrome&logoColor=white)](https://topdf.github.io/)
[![Astro](https://img.shields.io/badge/Astro-Islands_Architecture-413333?style=for-the-badge&logo=astro&logoColor=F5EBDD)](https://astro.build/)
[![React](https://img.shields.io/badge/React_18-Interactive_UI-315B8C?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![PWA Offline](https://img.shields.io/badge/PWA-100%25_Offline_Ready-2E7D32?style=for-the-badge&logo=pwa&logoColor=white)](https://topdf.github.io/)
[![Support on Ko-fi](https://img.shields.io/badge/Support_Developer-Ko--fi-F2765E?style=for-the-badge&logo=kofi&logoColor=white)](https://ko-fi.com/kishara)

**ToPDF** ([https://topdf.github.io/](https://topdf.github.io/)) is an ultra-minimal, 100% client-side Progressive Web App (PWA) built with **Astro** and **React** (Islands Architecture). It converts one or multiple **JPG, PNG, and WebP** images into a single print-ready **PDF** document instantaneously inside the browser using **HTML5 Canvas** and **jsPDF**—with zero server uploads.

---

## Core Privacy & Technical Architecture

1. **100% Client-Side Execution (Zero Server Uploads)**
   - Selected images are read locally via `URL.createObjectURL()` and decoded directly in browser memory.
   - Image rotation (`0°`, `90°`, `180°`, `270°`), white-background alpha compositing for transparent PNG/WebP files, and aspect-ratio-preserving page layout are computed on an offscreen HTML5 `<canvas>`.
   - PDF binary compilation runs entirely on the client via dynamically loaded `jsPDF`, and all object URLs are revoked immediately upon image removal or component unmount to guarantee zero memory leaks.
2. **Two-State Minimal Workflow**
   - **State 1 (Initial Dropzone):** Centered, distraction-free dropzone with drag-and-drop and multi-file picker.
   - **State 2 (Interactive Workspace & Sidebar):** Triggered as soon as 1+ images are selected. Features a sortable thumbnail grid (drag-and-drop + accessible left/right buttons, 90° rotation, remove, and `+` add more) paired with the **Image to PDF options** `<aside>` sidebar:
     - **Page Orientation:** `Portrait` / `Landscape`
     - **Page Size:** `A4 (297x210 mm)`, `US Letter (215.9x279.4 mm)`, `Fit to Image`
     - **Margins:** `No margin` (`0 mm`), `Small` (`10 mm`), `Big` (`20 mm`)
     - **Merge Mode:** Merge all images into a single PDF or export separate PDFs per image.
3. **Installable Offline PWA**
   - Powered by `@vite-pwa/astro` and Workbox service worker precaching.
   - Includes a native **Add to Home Screen** (`beforeinstallprompt`) button in the top navigation bar with an accessible fallback modal for iOS/Safari.
4. **Responsive Icon-Collapsing Navbar**
   - **Desktop (`>= 768px`):** Displays full text labels + icons in the sticky top navbar and side-by-side workspace layout.
   - **Mobile & Tablet (`< 768px`):** Strictly collapses navbar controls to **icons only** to prevent horizontal overflow and maximize vertical workspace.

---

## Design System & Color Palette

| Token | Hex | Light Mode Usage (Default) | Dark Mode Usage (`darkMode: 'class'`) |
| :--- | :--- | :--- | :--- |
| **Warm Linen** | `#F5EBDD` | Primary page background | Primary typography & icon foreground |
| **Vibrant Coral** | `#F2765E` | Primary CTA buttons (`Select JPG images`, `Convert to PDF ->`) with white text | Primary CTA buttons with high-contrast white text |
| **Slate Blue** | `#315B8C` | Active option card borders, country/page badges, focus rings | Lightened interactive accents (`#5B88BD`) & focus rings |
| **Deep Espresso** | `#413333` | Primary typography, headings, and icon strokes | Primary background with elevated card surfaces (`#4E3E3E`) |

---

## 8-Language Localization (i18n)

Static subpath routing translates 100% of UI controls, ARIA labels, dropzone prompts, sidebar options, breadcrumbs, below-the-fold semantic guides, FAQ accordions, and SEO/Open Graph meta tags:

| Language | Code | Badge | Static Route | Canonical URL |
| :--- | :---: | :---: | :--- | :--- |
| **English** | `en` | `US` | `/` | `https://topdf.github.io/` |
| **Español** | `es` | `ES` | `/es/` | `https://topdf.github.io/es/` |
| **Português** | `pt` | `BR` | `/pt/` | `https://topdf.github.io/pt/` |
| **Deutsch** | `de` | `DE` | `/de/` | `https://topdf.github.io/de/` |
| **Français** | `fr` | `FR` | `/fr/` | `https://topdf.github.io/fr/` |
| **日本語** | `ja` | `JP` | `/ja/` | `https://topdf.github.io/ja/` |
| **简体中文** | `zh` | `CN` | `/zh/` | `https://topdf.github.io/zh/` |
| **Русский** | `ru` | `RU` | `/ru/` | `https://topdf.github.io/ru/` |

---

## Technical SEO & Structured Data Compliance

- **Self-Referencing Canonicals & Reciprocal `hreflang`:** Every locale outputs its own canonical URL alongside all 8 language `hreflang` links and `hreflang="x-default"`.
- **Strict JSON-LD `@graph`:** Includes `WebApplication`, `BreadcrumbList`, `HowTo`, and `FAQPage` schemas. Contains **zero** fabricated `AggregateRating` or review schemas.
- **Automated Sitemap & Robots:** Generates `sitemap-index.xml`, `sitemap-0.xml`, and `robots.txt` at build time.
- **Google Analytics 4:** Asynchronous `gtag.js` (`G-JX2BDSJYBQ`) snippet injected in `<head>` with zero render-blocking impact on LCP or TBT.

---

## Local Development & Build Commands

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (http://localhost:4321)
npm run dev

# 3. Build production static site + PWA service worker + XML sitemaps into dist/
npm run build

# 4. Preview production build locally
npm run preview
```

---

## Support the Developer

If you find **ToPDF** helpful, consider supporting ongoing open-source web utility development:

👉 **[Support on Ko-fi (https://ko-fi.com/kishara)](https://ko-fi.com/kishara)**

---

## License

Released under the [MIT License](./LICENSE).
