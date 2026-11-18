# Book My VIP · Pattaya

A mobile-first Pattaya VIP nightlife concierge website. Astro generates 13 content pages and a custom 404 page. The booking form composes a WhatsApp enquiry in the visitor’s browser. Guests review their message and choose whether to send it in WhatsApp.

## Run locally

Use a supported Node.js LTS release meeting the package engine requirement (22.23.4 or higher), npm and PowerShell.

```powershell
Set-Location -LiteralPath 'C:\Users\iamsu\Downloads\Websites\Book-My-VIP'
npm ci
npm run dev
```

Open the local URL printed by Astro. To check the production site, run the following from the same folder.

```powershell
npm run check
npm test
npm run build
npm run test:browser
npx wrangler deploy --dry-run
npm run preview
```

Browser tests use an installed Google Chrome. To use Playwright’s Chromium, install it with `npx playwright install chromium` and set `$env:PLAYWRIGHT_CHANNEL='chromium'`. Use `TEST_BASE_URL` to test an existing local Astro or Wrangler preview. The test form intercepts the WhatsApp handoff, and the consent test intercepts the analytics script.

## Project layout

```text
Logo.jpeg                  Original owner-supplied artwork
public/
  images/branding/         Transparent logo derived from Logo.jpeg
  images/hero/             Responsive desktop and mobile atmosphere images
  images/packages/         Three package illustrations
  favicon.ico              Multi-size icon derived from Logo.jpeg
  apple-touch-icon.png     Home-screen icon from the same artwork
src/
  components/              Shared navigation, cards, comparison, form, FAQ and gallery
  data/                    Business settings, packages, navigation, FAQs and draft policies
  layouts/Base.astro       Shared page structure, metadata and structured data
  lib/                     WhatsApp formatting, date validation and optional analytics
  pages/                   Home, concierge, contact, policy and error pages
    vip-packages/          Package collection and reusable detail route
  styles/global.css        Responsive layouts, typography and color settings
tests/
  whatsapp.test.ts         Package facts, date boundaries and WhatsApp message tests
  browser/                 Browser, accessibility interaction and layout checks
docs/                      Internal source, review checklist and deployment guide
astro.config.mjs           Static build, production origin and sitemap
wrangler.jsonc             Workers static asset routing and custom 404 response
.env.example               Build-time settings
package.json               Commands and dependencies
package-lock.json          Reproducible dependency versions
dist/                      Generated site for Cloudflare Workers
```

## Pages and routes

| Page | Route |
| --- | --- |
| Home | `/` |
| VIP package collection and comparison | `/vip-packages/` |
| VIP Package | `/vip-packages/vip-package/` |
| VIP Premium | `/vip-packages/vip-premium/` |
| VIP Gold | `/vip-packages/vip-gold/` |
| Pattaya VIP table booking | `/pattaya-vip-table-booking/` |
| Booking guide | `/how-it-works/` |
| About the concierge | `/about/` |
| Frequently asked questions | `/faq/` |
| Contacts and WhatsApp form | `/contact/` |
| Draft privacy policy | `/privacy-policy/` |
| Draft terms and conditions | `/terms-and-conditions/` |
| Draft booking policy | `/booking-policy/` |
| Custom 404 | `/404.html`, returned for unknown paths |

## Editing the website

| Change | Where to edit |
| --- | --- |
| Price, listed group size, package name, image or approved inclusions | `src/data/packages.ts`. Set Gold capacity to `null` until verified. Review the short highlights and full list together. |
| WhatsApp number, displayed number, official Instagram, currency or timezone | `src/data/siteConfig.ts` |
| Questions and answers | `src/data/faqs.ts` |
| Navigation | `src/data/navigation.ts` |
| Policy drafts | `src/data/policies.ts` and the draft label in `src/pages/[policy].astro` |
| Homepage copy | `src/pages/index.astro` and `src/components/Hero.astro` |
| Logo and favicon | `public/images/branding/logo.png`, `public/favicon.ico` and `public/apple-touch-icon.png`; keep the original JPEG for future exports |
| Atmosphere artwork | Replace the WebP files in `public/images/hero/` and `public/images/packages/`; update their alt text. Keep the wide and mobile hero crops. |
| Approved guest photos | Pass consented images and descriptive alt text to `GuestGallery` on the homepage. An empty gallery produces no public section. |
| Page titles and descriptions | The relevant page in `src/pages/`. Package metadata lives in `src/data/packages.ts`. |
| Shared social metadata, JSON-LD and fallback sharing image | `src/layouts/Base.astro` |
| Brand colors, fonts and spacing | `src/styles/global.css` |

The supplied prices are ฿20,000 for four guests, ฿30,000 for six, and ฿50,000 with group size to confirm. Guests can request another group size. Reviewed package summaries include the four listed platters and a big-screen group photo. Premium and Gold also list one preferred song request. The team must confirm the full offer and any cover before payment.

Original illustrations depict nightlife atmosphere. They do not identify a partner venue or document a guest experience. For venue-specific use, the owner should supply rights-cleared interior, table and atmosphere photos. CSS background treatments support the imagery. The legal policy text remains in draft pending owner and local legal approval.

## SEO, analytics and deployment

Copy `.env.example` to `.env` for local production-mode checks. Set `PUBLIC_SITE_URL` to the verified HTTPS production origin. A build without it intentionally blocks indexing and omits production canonicals and the sitemap. Setting it generates absolute URLs, sharing metadata and the XML sitemap. Rebuild after changing it.

GA4 is optional. Set `PUBLIC_GA_MEASUREMENT_ID` only after approving the privacy notice and the property's settings. Disable GA4 enhanced measurement, automatic form interactions and outbound-link capture in that stream to keep measurement limited to the site's explicit events. Accepting analytics loads the tag. Declining leaves it unloaded. Visitors can revisit their choice through Analytics preferences. Explicit events cover page views, package views and choices, booking form starts, Instagram clicks and WhatsApp contact or inquiry initiation. The form contributes no guest details to analytics events.

For GitHub setup, Workers Builds, the production branch, approved domain, and release checks, follow [the PowerShell deployment guide](docs/deployment-guide.md). Only `dist/` is served by the Worker. Review [the business and legal checklist](docs/content-review.md) and [the original package transcription](docs/original-package-details.md) privately before publication.

## Verification on 18 November 2026

- Clean npm installation from the lockfile, Astro type checking, the static production build and Wrangler's deployment dry run succeeded.
- Six unit tests passed for source pricing, capacity, calendar dates, optional fields and URL encoding. Eleven browser checks passed in Chrome, including widths of 360, 390, 768, 1024, 1440 and 1920 pixels. The page crawl found unique titles and descriptions, working internal destinations and assets, and no browser console errors.
- Local Cloudflare routing returned the custom HTML with HTTP 404 for an unknown URL. A separate build with a test origin generated 13 canonical page URLs and a matching sitemap. HTML and client assets were scanned for withheld source terminology.
- A mobile Lighthouse run against the local Cloudflare homepage with production SEO settings measured 98 performance, 100 accessibility, 100 best practices and 100 SEO. These measurements describe the tested homepage and local environment. The undomained preview intentionally blocks indexing.
- Analytics opt-in, decline and withdrawal were exercised with a local test ID and the Google script intercepted. The WhatsApp handoff was checked using the exact destination and message. Live analytics reporting, WhatsApp message delivery, production DNS and remote hosting still require authorized live verification.
- npm's audit reported 12 high-severity development-tool dependency findings tracing to the same picomatch advisory, GHSA-fc5q-39xc-vjpf. The latest available picomatch release at verification was 4.0.7, within the reported range. Recheck the advisory and update the lockfile when a compatible fix is available. Cloudflare serves the generated static files.
