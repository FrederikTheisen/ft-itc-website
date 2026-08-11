# FT-ITC Website Content Improvement

## Summary

Revise all four existing pages for a mixed scientific audience while preserving the current visual identity, navigation, typography, colors, spacing, imagery, and component style. 

## Content and Structure

### Homepage — “Better analysis. Deeper understanding.”

- Rewrite the introduction around flexible processing, multiple inputs, global fitting, uncertainty estimation, advanced thermodynamic analysis, and publication-ready output.
- Replace “Analyze anytime / View anywhere” with “Flexible processing / Global analysis / Free & open source.”
- Reframe difficult datasets as enabling alternative processing strategies and extracting useful information, without promising recoverable conclusions.
- Mention Experiment Designer in the capability overview.
- Keep one concise section about traceability; remove repeated visibility language elsewhere.
- Clarify that the web viewer opens FT-ITC project files for review while processing and analysis remain desktop functions.

### Desktop app — “Your data. Your analysis.”

- Reposition the page around user control, flexible processing, revisiting analytical stages, and to some extend local operation.
- Add a dedicated Experiment Designer card covering titration simulation and concentration/condition planning.
- Expand capabilities to name baseline modes, global/per-injection integration control, supported fitting models, resampling-based uncertainty, buffer subtraction, tandem merging, and figure/data export.
- Add specific installation pages for macOS, Windows, and Linux. The pages should contain information on required operation system and such.

### Workflow — “Flexible processing. Solid results.”

- Replace the rigid linear narrative with selectable stages: import from the available starting point, choose a baseline strategy, adjust injections globally or individually, correct/combine when needed, fit and assess uncertainty, then save/analyse/present.
- Make baseline flexibility concrete: spline, polynomial, segmented/local, editable and lockable spline points, and conversion to editable splines.
- Present the complete format set in three groups:
  - Raw/vendor: `.itc`, `.TA`, `.apj`
  - Integrated data: `.dat`, `.aff`, `.dh`
  - FT-ITC projects: `.ftxtc`

### Analysis — “Move beyond individual fits. Unravel the underlying thermodynamics.”

- Lead with global fitting rather than parameter averaging.
- Explain shared, independent, fixed, and experimentally constrained or temperature-dependent parameters.
- Add uncertainty estimation as part of evaluating fitted parameters, not merely producing error bars.
- Separate advanced-analysis cards for temperature-series analysis, ionic-strength dependence, counterion release, proton linkage, and conformational entropy/coupled structuring.
- Use conditional wording throughout: analyses estimate or support interpretation when the experiment series and model assumptions permit.

## Live Release Integration

- Use GitHub’s public `GET /repos/FrederikTheisen/FT-ITC-Analysis/releases/latest` endpoint to obtain the latest stable release, tag, publication date, release page, and `.dmg` asset. The endpoint excludes drafts and prereleases. See [GitHub Releases API](https://docs.github.com/en/rest/releases/releases?apiVersion=latest).
- Add semantic hooks for the release version, date, release-notes URL, and direct-download links. Populate text with `textContent` and validate returned URLs before assigning them.
- Make all download calls to action point directly to the `.dmg` asset after a successful response. Provide a separate “Release notes” link to the release page.
- Cache the normalized response in `sessionStorage` for 30 minutes to reduce requests across page navigation.
- Use a five-second request timeout. On network errors, rate limiting, malformed data, or a missing `.dmg`, retain meaningful fallback text and point download buttons to the general Releases page. This is important because unauthenticated GitHub API traffic is limited to 60 requests per hour per originating IP. See [GitHub rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).
- Show live version/date on the Desktop app page and a compact version label in the homepage macOS card. Do not expose errors or leave empty placeholders.
- Extend only the existing `script.js` configuration and data-attribute pattern; add minimal CSS solely where needed for release metadata or wrapping format tokens.
- Be prepared for this feature needing to distinguish between various operating system releases.

## Verification

- Review every page at desktop and mobile widths for overflow, hierarchy, text density, menu behavior, and unchanged visual character.
- Verify the exact headings, British-English spelling, complete file extensions, scientific terminology, DOI, macOS requirements, and conditional interpretation language.
- Confirm direct DMG links and release-notes links update correctly, session caching prevents repeated requests, and no-JavaScript behavior still provides working Releases links.
- Recheck the existing web-viewer availability indicator, navigation state, external links, image loading, console warnings, and accessibility-oriented heading/ARIA behavior.

## Assumptions

- The existing four-page information architecture remains unchanged; no new viewer or documentation page is introduced.
- Experiment Designer receives a homepage mention and a detailed Desktop app card, using existing card components without requiring a new screenshot.
- Existing research references remain
- No visual redesign, new design system, animation, framework, build tooling, analytics, or backend service is introduced.
