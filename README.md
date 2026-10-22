# FT-ITC website

Static test site for `ft-itc.org`. It is intentionally independent of the desktop and web-app repositories.

## Local preview

Open `index.html` directly in a browser, or serve this folder with any static HTTP server.

## Cloudflare Workers

The site is deployed from this repository through Cloudflare Workers Builds. `wrangler.jsonc` publishes the repository root as static assets and uses `_worker.js` as the Worker entry point.

The Worker proxies the registration and activation API routes to `app.ft-itc.org` while keeping browser requests same-origin. It also serves `/activate` and activation API responses with `no-store` and restrictive referrer headers so activation tokens stay out of requests, referrers, and caches. Its source and deployment configuration are excluded from the public asset collection through `.assetsignore`.

### Authenticated API forwarding

The four proxied API routes now require a production secret binding named
`FTITC_WEBSITE_PROXY_SECRET`, containing 64 lowercase hexadecimal characters
(32 random bytes). The Worker overwrites incoming assertions, sends the native
Cloudflare `CF-Connecting-IP` as a validated IPv4 or expanded IPv6 address, and uses
`Proxy-Authorization` for its origin credential. The matching Caddy configuration
validates and strips both assertions before Kestrel; direct API clients keep their
connection-peer identity. Missing/invalid Worker configuration returns a generic 503.

Deploy the matching Caddy change first. Cloudflare Pseudo IPv4 must be **Off** or
**Add Header**, not **Overwrite Headers**. The application repository's
`scripts/caddy/README.md` contains the review candidate, local Caddy tests, rollout,
rollback and rotation procedure. Deployed with approval on 2026-10-21; real-client
IPv4 forwarding was verified live from two networks. IPv6 remains unverified.
The code-only API deployment retained existing assets; include this currently
uncommitted Worker change in the next repository build to retain the fix.
Use a Cloudflare secret binding, never Wrangler vars, a committed environment file
or a browser asset. Local `.dev.vars*`/`.env*` files and tests are excluded from
published assets; local secret files are also ignored by Git.

Run `node --test tests/worker.test.mjs` with Node.js 22 or newer for the dependency-free
Worker regression suite. It preserves the existing cookie/CSRF and activation flows.

The site keeps email separate: do not change the iCloud MX, SPF, DKIM, or domain-verification records.

## User manual

The authoritative editable manual is in the application repository at `Documentation/UserManual/`. This repository contains publication output only: `manual.html`, the eleven flat chapter files in `manual/`, the published `manual.pdf`, and the public images those pages reference.

A publication agent must read the application repository's `Documentation/UserManual/manual.yml` in order, preserve the approved UI terminology and scientific claims, and update the corresponding static HTML files. The `index` slug maps to `/manual`; every other slug maps to `/manual/{slug}`, without a trailing slash. Display each page's title, summary, and verification date. Render source callouts using the manual's accessible HTML patterns; translate each equation in a Calculation block into centered, static MathML Core markup while preserving its notation and explanatory text. Never publish source manifests, `_verification` metadata, screenshot inventories, validation or PDF tools, or a duplicate Markdown tree.

The application manual source now contains the reviewed replacements for the retired placeholder images. Follow its `Documentation/UserManual/README.md` and `assets/assets.yml` when publishing. Copy source WebP assets unchanged. If a source image differs from the reviewed website screenshot, inspect it visually and resolve the source discrepancy before replacement; matching filenames, timestamps, or different dimensions do not establish that an image is current or correct. Use the published image's dimensions in the HTML.

The manual export links download the reviewed `/manual.pdf` artifact, which includes A4 pages, running titles, and page numbers. `/manual-print.html` assembles the current chapters for editorial print review. Replace `/manual.pdf` whenever the manual chapters or print styling change, and verify the rendered PDF before publishing.
