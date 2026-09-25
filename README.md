# FT-ITC website

Static test site for `ft-itc.org`. It is intentionally independent of the desktop and web-app repositories.

## Local preview

Open `index.html` directly in a browser, or serve this folder with any static HTTP server.

## Cloudflare Workers

The site is deployed from this repository through Cloudflare Workers Builds. `wrangler.jsonc` publishes the repository root as static assets and uses `_worker.js` as the Worker entry point.

The Worker proxies the registration and activation API routes to `app.ft-itc.org` while keeping browser requests same-origin. It also serves `/activate` and activation API responses with `no-store` and restrictive referrer headers so activation tokens stay out of requests, referrers, and caches. Its source and deployment configuration are excluded from the public asset collection through `.assetsignore`.

The site keeps email separate: do not change the iCloud MX, SPF, DKIM, or domain-verification records.

## User manual

The authoritative editable manual is in the application repository at `Documentation/UserManual/`. This repository contains publication output only: `manual.html`, the eleven flat chapter files in `manual/`, the published `manual.pdf`, and the public images those pages reference.

A publication agent must read the application repository's `Documentation/UserManual/manual.yml` in order, preserve the approved UI terminology and scientific claims, and update the corresponding static HTML files. The `index` slug maps to `/manual`; every other slug maps to `/manual/{slug}`, without a trailing slash. Display each page's title, summary, and verification date. Render source callouts using the manual's accessible HTML patterns; translate each equation in a Calculation block into centered, static MathML Core markup while preserving its notation and explanatory text. Never publish source manifests, `_verification` metadata, screenshot inventories, validation or PDF tools, or a duplicate Markdown tree.

The manual export links download the reviewed `/manual.pdf` artifact, which includes A4 pages, running titles, and page numbers. `/manual-print.html` assembles the current chapters for editorial print review. Replace `/manual.pdf` whenever the manual chapters or print styling change, and verify the rendered PDF before publishing.
