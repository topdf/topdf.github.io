<div align="center">

# 📄 ToPDF

### Free Offline JPG to PDF Converter (100% Client-Side)

[![Deploy to GitHub Pages](https://github.com/topdf/topdf.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/topdf/topdf.github.io/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-topdf.github.io-F2765E?style=for-the-badge&logo=googlechrome&logoColor=white)](https://topdf.github.io/)
[![Astro](https://img.shields.io/badge/Astro-4.x%20Islands-413333?style=for-the-badge&logo=astro&logoColor=F5EBDD)](https://astro.build/)
[![React](https://img.shields.io/badge/React-18-315B8C?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline%20Ready-2E7D32?style=for-the-badge&logo=pwa&logoColor=white)](https://topdf.github.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)
[![Support on Ko-fi](https://img.shields.io/badge/Support-Ko--fi-F2765E?style=for-the-badge&logo=kofi&logoColor=white)](https://ko-fi.com/kishara)

<p align="center">
  <b>Convert JPG, PNG, and WebP images into clean, print-ready PDF documents instantly inside your browser.</b><br>
  Zero server uploads. 100% private. Works offline anywhere.
</p>

[**Explore Live Demo »**](https://topdf.github.io/)

</div>

---

## 🌟 Overview

**ToPDF** ([topdf.github.io](https://topdf.github.io/)) is an ultra-minimal, high-performance Progressive Web App (PWA) engineered with **Astro Islands Architecture**, **React 18**, and **Tailwind CSS**. 

Unlike conventional PDF conversion tools that transmit sensitive personal photos, government IDs, invoices, and financial records to third-party remote servers, **ToPDF processes 100% of your images locally in device RAM using HTML5 Canvas and jsPDF**.

---

## ✨ Key Features

- 🔒 **100% Client-Side Privacy:** Images never leave your device. Zero API uploads, zero remote storage, zero data tracking.
- ⚡ **Instant In-Memory Conversion:** Compiles high-resolution PDFs using hardware-accelerated HTML5 Canvas and dynamic `jsPDF` binary generation.
- 📱 **Installable Offline PWA:** Full Service Worker caching and Web App Manifest allow you to install ToPDF as a native desktop or mobile app that works completely offline.
- 🔄 **Two-State Intuitive UI:**
  - **State 1 (Dropzone):** Clean drag-and-drop zone with instant multi-file selector supporting JPG, PNG, and WebP.
  - **State 2 (Interactive Workspace):** Thumbnail grid with drag-and-drop reordering, keyboard-accessible arrow reordering, 90° clockwise rotation, and real-time image dimension badges.
- ⚙️ **Comprehensive PDF Customization:**
  - **Page Orientation:** Portrait or Landscape.
  - **Page Size:** Standard A4 (297×210 mm), US Letter (215.9×279.4 mm), or Fit to Image.
  - **Margins:** None (0 mm), Small (10 mm), or Big (20 mm).
  - **Merge Options:** Merge all images into a single multi-page PDF or download individual PDFs per photo.
- 🌐 **8-Language Localization (i18n):** Complete native translations for English, Spanish, Portuguese, German, French, Japanese, Simplified Chinese, and Russian.
- 🌓 **Adaptive Light & Dark Themes:** Elegant Warm Linen (`#F5EBDD`) and Deep Espresso (`#413333`) color scheme with zero flash-of-unstyled-content (FOUC).
- 🏆 **100/100 Technical SEO & Accessibility:** Semantic landmarks, WCAG AAA contrast ratios, keyboard navigation, strict JSON-LD Schema graph (`WebApplication`, `BreadcrumbList`, `HowTo`, `FAQPage`), and automated XML sitemaps.

---

## 🎨 Design System & Palette

The design system is built around high-contrast, warm, accessible tones:

| Token | Hex | Light Mode Role | Dark Mode Role |
| :--- | :--- | :--- | :--- |
| **Warm Linen** | `#F5EBDD` | Main page background (`bg-linen`) | Primary typography & highlights |
| **Vibrant Coral** | `#F2765E` | Primary CTA buttons (`bg-coral`) | Primary CTA buttons & accent badges |
| **Slate Blue** | `#315B8C` | Active borders, country badges & focus rings | Lightened interactive borders (`#5B88BD`) |
| **Deep Espresso** | `#413333` | Primary headings, body copy & icon strokes | Elevated background (`dark:bg-espresso`) |
| **Elevated Card** | `#4E3E3E` | — | Dark mode surface card (`dark:bg-espresso-card`) |

---

## 🌍 Supported Languages (i18n)

Every language route is statically pre-rendered with self-referencing canonical URLs, reciprocal `hreflang` tags, and localized metadata:

| Language | Locale | Badge | Static Route | Canonical URL |
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

## 🚀 GitHub Pages Deployment Guide

This project is configured for automated zero-maintenance deployment to **GitHub Pages** using GitHub Actions.

### 1. Enable GitHub Actions for Pages
1. Navigate to your repository on GitHub: `https://github.com/topdf/topdf.github.io`.
2. Go to **Settings** > **Pages** (under the "Code and automation" sidebar section).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.

### 2. Automatic CI/CD Workflow
Whenever you push to the `main` or `master` branch, the workflow [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) automatically:
1. Checks out the repository.
2. Sets up Node.js 20 with package caching.
3. Installs dependencies cleanly with `npm ci`.
4. Runs `npm run build` to generate static pages, XML sitemaps, PWA assets, and Service Worker.
5. Deploys the `./dist` artifact to GitHub Pages.

### 3. Jekyll Bypass (`.nojekyll`)
A [`public/.nojekyll`](./public/.nojekyll) file is included to ensure GitHub Pages serves files in the `_astro/` asset directory without Jekyll filtration.

---

## 💻 Local Development

### Prerequisites
- **Node.js:** v18.17.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

### Installation & Execution

```bash
# 1. Clone the repository
git clone https://github.com/topdf/topdf.github.io.git
cd topdf.github.io

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
# Server running at http://localhost:4321/

# 4. Compile production static bundle + PWA service worker
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```text
topdf.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Actions deployment pipeline
├── public/
│   ├── .nojekyll                 # Bypasses Jekyll on GitHub Pages (preserves _astro/)
│   ├── favicon.svg               # Vector brand logo
│   ├── manifest.webmanifest      # PWA Web App Manifest
│   ├── og-image.png              # 1200x630 Open Graph social preview card
│   ├── pwa-192x192.png           # 192px maskable & standard PWA icon
│   ├── pwa-512x512.png           # 512px maskable & standard PWA icon
│   ├── robots.txt                # Search engine crawler directives
│   └── sw-fallback.js            # Offline development service worker
├── src/
│   ├── components/
│   │   ├── Breadcrumbs.astro     # Accessible semantic breadcrumb navigation
│   │   ├── Footer.astro          # Localized footer with language & Ko-fi links
│   │   ├── Navbar.astro          # Sticky responsive header with icon collapse & PWA prompt
│   │   ├── PdfConverterIsland.tsx# React Island: 2-state UI, Canvas engine, jsPDF generator
│   │   └── SeoContentSection.astro# HowTo steps, Privacy explanation & FAQ accordion
│   ├── i18n/
│   │   ├── config.ts             # Language definitions & dictionary loader
│   │   └── locales/              # 8 full localization dictionary files (.json)
│   ├── layouts/
│   │   └── Layout.astro          # Master HTML template, SEO, JSON-LD schema & GA4
│   ├── pages/
│   │   ├── 404.astro             # Branded 404 error page for GitHub Pages
│   │   ├── index.astro           # English root route (/)
│   │   └── [lang]/
│   │       └── index.astro       # Dynamic static localized routes (/es/, /pt/, etc.)
│   └── styles/
│       └── global.css            # Tailwind directives, theme variables & scrollbars
├── astro.config.mjs              # Astro, Sitemap, React & Vite PWA configuration
├── package.json                  # Scripts & dependencies
├── tailwind.config.mjs           # Design tokens (#F5EBDD, #F2765E, #315B8C, #413333)
└── tsconfig.json                 # TypeScript strict configuration
```

---

## 🛡️ Privacy & Security Architecture

- **No Remote Processing:** Documents never leave the client's web browser.
- **Immediate Memory Reclamation:** Image previews are generated via `URL.createObjectURL()` and revoked immediately upon card deletion, queue clear, or component unmount.
- **Zero Third-Party Telemetry of Files:** Google Analytics 4 (`G-JX2BDSJYBQ`) records basic pageview performance metrics only. Uploaded file names, sizes, counts, and binary payloads are never measured or transmitted.
- **Strict Content Security:** Zero inline evaluated strings or unsafe external scripts.

---

## 🤝 Contributing

Contributions, feedback, and feature requests are welcome!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## ☕ Support the Developer

If **ToPDF** saves you time or helps your workflow, please consider supporting independent open-web software:

[![Support on Ko-fi](https://img.shields.io/badge/Buy%20me%20a%20coffee-Ko--fi-F2765E?style=for-the-badge&logo=kofi&logoColor=white)](https://ko-fi.com/kishara)

---

## 📄 License

This project is open-source and distributed under the **[MIT License](./LICENSE)**.

<div align="center">
  <sub>Built with ❤️ for speed, privacy, and the open web.</sub>
</div>
