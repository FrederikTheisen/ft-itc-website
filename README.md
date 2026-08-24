# FT-ITC website

Static test site for `ft-itc.org`. It is intentionally independent of the desktop and web-app repositories.

## Local preview

Open `index.html` directly in a browser, or serve this folder with any static HTTP server.

## Cloudflare Pages

Create a Pages project from this folder using either Git integration or Direct Upload. The output directory is the repository root. After deployment, add `ft-itc.org` under the Pages project's **Custom domains**.

The site keeps email separate: do not change the iCloud MX, SPF, DKIM, or domain-verification records.

## User manual

The authoritative editable manual is in the application repository at `Documentation/UserManual/`. This repository contains publication output only: `manual.html`, the eleven flat chapter files in `manual/`, and the public images those pages reference.

A publication agent must read the application repository's `Documentation/UserManual/manual.yml` in order, preserve the approved UI terminology and scientific claims, and update the corresponding static HTML files. The `index` slug maps to `/manual`; every other slug maps to `/manual/{slug}`, without a trailing slash. Display each page's title, summary, and verification date. Render source callouts using the manual's accessible HTML patterns; translate each equation in a Calculation block into centered, static MathML Core markup while preserving its notation and explanatory text. Never publish source manifests, `_verification` metadata, screenshot inventories, validation or PDF tools, or a duplicate Markdown tree.

PDF publication is deferred. If it is added later, build and validate it in the application repository, then copy only the finished publication file into this site.
