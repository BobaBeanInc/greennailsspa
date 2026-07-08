# Green Nails Spa — Static Site

A single-page, static website for **Green Nails Spa** in Concord, NC.
Deploys directly to GitHub Pages, no build step, no backend.

## Stack

- Plain HTML, CSS, and vanilla JavaScript
- Google Fonts: Cormorant Garamond + Inter
- Instagram oEmbed (loaded lazily, fallback link if blocked)
- FormSubmit.co for the contact form (no server)
- Structured data: `NailSalon` / `BeautySalon` / `LocalBusiness` + `FAQPage` JSON-LD

## File structure

```
green-nails-spa/
├── index.html            # All markup, copy, inline gallery/logo/map data URIs
├── styles.css            # Design system + all section styles
├── script.js             # Nav, lightbox, services filter, form, embed bootstrap
├── social-preview.jpg    # 1200×630 image for Facebook/iMessage/etc. link previews
├── favicon.png           # 32×32 browser tab icon
├── apple-touch-icon.png  # 180×180 iOS home screen icon
├── site.webmanifest      # PWA manifest (Android home screen install support)
├── robots.txt            # Crawl guidance + sitemap pointer
├── sitemap.xml           # Search-engine discovery hint
└── README.md             # This file
```

All 10 files must be uploaded to the repo root for the site to work fully.

Most images (logo, map, all 19 gallery photos) are **embedded** into `index.html` as base64 data URIs so the site loads in a single request. The three separate image files (`social-preview.jpg`, `favicon.png`, `apple-touch-icon.png`) exist as standalone files because **social media crawlers and browser bookmark systems cannot read data URIs** — they need a real HTTPS URL to fetch.

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 5500
# then visit http://localhost:5500
```

## Deploying to GitHub Pages

1. Create a new GitHub repository (public or private with Pages enabled).
2. Push all 10 files to the repo root.
3. In the repo, go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
5. Save. After a minute or two GitHub will give you a URL like `https://your-org.github.io/your-repo/`.

Custom domains: add a `CNAME` file with your domain, and point a CNAME DNS record at `<your-org>.github.io`.

## Replacement checklist

Before going live, search-and-replace these placeholders in `index.html`, `sitemap.xml`, and `robots.txt`:

| Placeholder | Replace with | Occurrences (across all files) |
|---|---|---|
| `CONTACT_EMAIL_HERE` | The email Green Nails Spa wants form submissions sent to | 3 in `index.html` |
| `GITHUB_PAGES_URL_HERE` | Deployed URL **with trailing slash** (e.g. `https://username.github.io/green-nails-spa/`) | 13 total: 10 in `index.html`, 2 in `sitemap.xml`, 1 in `robots.txt` |

**The trailing slash matters** for `GITHUB_PAGES_URL_HERE`. URLs are constructed by concatenating base URL + filename (e.g. `GITHUB_PAGES_URL_HERE` + `social-preview.jpg`). With trailing slash you get a valid URL. Without it, the concatenation breaks.

One-line replacement using `sed` (macOS syntax; Linux drop the `''` after `-i`):

```sh
sed -i '' \
  -e 's|CONTACT_EMAIL_HERE|owner@greennailsspa.com|g' \
  -e 's|GITHUB_PAGES_URL_HERE|https://yourorg.github.io/green-nails-spa/|g' \
  index.html sitemap.xml robots.txt
```

After replacement, `grep -nE 'CONTACT_EMAIL_HERE|GITHUB_PAGES_URL_HERE' index.html sitemap.xml robots.txt` should return nothing.

## Activating the contact form

FormSubmit requires a one-time confirmation and needs a **native browser POST** (which is how `script.js` is wired):

1. Deploy the site with the real email in place of `CONTACT_EMAIL_HERE`.
2. Submit the contact form once yourself from the deployed URL (not `file://`, not localhost).
3. FormSubmit emails a confirmation link to the destination address — click it.
4. Real submissions now arrive.

You never sign up on formsubmit.co. If you want to hide the raw email from page source, sign up separately to get an alias string, then replace `CONTACT_EMAIL_HERE` on the form `action` line only with the alias (keep real mailto links elsewhere).

## Verifying the social preview

After deploying with the correct `GITHUB_PAGES_URL_HERE`, use these validators:

- **Facebook / iMessage / WhatsApp**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — paste your URL, hit **Scrape Again**. iMessage and WhatsApp use the same Open Graph tags.
- **Twitter / X**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- **All platforms at once**: [OpenGraph.xyz](https://www.opengraph.xyz)

Expected image: 1200×630 JPEG, ≈50 KB, sage-green logo on cream with editorial layout.

## SEO setup

### Baked into the site
- Semantic HTML with proper H1/H2/H3 hierarchy
- Descriptive alt text on every image
- Meta title (45 chars, target keyword + local qualifier) and description (162 chars)
- Explicit `<meta name="robots" content="index, follow, max-image-preview:large">`
- Canonical URL
- Open Graph + Twitter Card with real 1200×630 image
- **JSON-LD schema** covering `NailSalon` + `BeautySalon` + `LocalBusiness` with geo coordinates, `hasMap`, opening hours per weekday, `hasOfferCatalog` (Manicure/Pedicure/Enhancement/Waxing with prices), `areaServed` (Concord, Kannapolis, Harrisburg, Huntersville, Cabarrus County), payment methods, currencies, keywords, and `ReserveAction` pointing at the online booking URL
- **JSON-LD `FAQPage`** — 6 common questions (location, hours, services, booking, walk-ins, differentiation) that Google can surface as expandable rich results in search
- Geo meta tags (`geo.region`, `geo.position`, `ICBM`) for legacy crawlers
- `robots.txt` allowing all crawlers, pointing at the sitemap
- `sitemap.xml` with the homepage + image sitemap entry for the social preview

### What YOU need to do after deploying (external, high-impact)

Local SEO is 70% off-page. The biggest wins are external actions:

1. **Google Business Profile** (formerly Google My Business) — **the single most important local-SEO step**. Set one up at [business.google.com](https://business.google.com), verify ownership (postcard or phone), fill in every field: name, address, phone, hours, categories (Nail Salon primary; Beauty Salon secondary), services, photos (add 10+ from the gallery), and the website URL. This is what drives the "map pack" appearance for searches like "nail salon near me" and "manicure Concord NC."

2. **Submit the sitemap to Google Search Console**. Sign up at [search.google.com/search-console](https://search.google.com/search-console), add your domain, verify (usually via a DNS TXT record or an HTML file), then submit `GITHUB_PAGES_URL_HERE/sitemap.xml`. Google will index the page and start reporting search performance data. Do the same with [Bing Webmaster Tools](https://www.bing.com/webmasters).

3. **Test the structured data**. After deploying, run the URL through:
   - [Google Rich Results Test](https://search.google.com/test/rich-results) — should identify both `LocalBusiness` and `FAQPage` results, and confirm they're eligible for rich display in SERPs.
   - [Schema Markup Validator](https://validator.schema.org/) — catches any typos or invalid fields.

4. **Claim listings on directories** — Yelp, Facebook Pages, Apple Maps Connect, Bing Places, Nextdoor. Consistent NAP (name/address/phone) across these platforms is a ranking factor.

5. **Ask happy clients for Google reviews.** Reviews are one of the top three local-SEO signals. Even 10 authentic 5-star reviews can move the ranking substantially. Do NOT buy reviews — Google's spam filter is aggressive and can penalize.

6. **Verify the geo coordinates** in `index.html`. I estimated `35.4113, -80.6098` based on the Concord Commons shopping center location. To get exact coordinates: search "20 Concord Commons Pl SW Concord NC" on Google Maps, right-click the pin, click the coordinates that appear at the top of the context menu to copy them. Then update the numbers in the `<script type="application/ld+json">` block (2 places: `latitude` and `longitude`) and the 2 `geo.position` / `ICBM` meta tags. Approximate coordinates work; exact ones are better.

### Performance note

`index.html` is ~1.5 MB because logo, map, and 19 gallery images are embedded as base64. On modern connections (LTE/5G/broadband) this is fine — a single request usually beats 20 lazy-loaded ones. GitHub Pages does gzip HTML, but base64-encoded JPEGs don't compress much, so real transfer is close to file size. If Core Web Vitals become a concern (check via [PageSpeed Insights](https://pagespeed.web.dev/)):

- LCP (Largest Contentful Paint) will be dominated by parse-time of the huge HTML, not network. Should still land under 2.5s on desktop broadband.
- If LCP > 2.5s on real-world mobile: extract the gallery images into a `/gallery/` folder as real `.jpg` files, replace inline data URIs with `<img src="./gallery/1.jpg" loading="lazy">`. Adds 19 image requests but cuts initial HTML to ~200 KB.

### Content SEO — future opportunities

Not implemented (would require additional pages or content changes):
- **Blog / articles**: pieces like *"How to prep for your first gel manicure"* or *"Aftercare for dip powder nails"* would target long-tail search queries. Would require adding a `/blog/` directory and additional HTML pages.
- **Service pages**: separate landing pages for each major service (e.g. `/manicures/`, `/pedicures/`) could rank for more specific queries. Trade-off: multiplies content management burden.
- **Reviews / testimonials section**: real client quotes (with permission) could go inline and be marked up with `Review` schema. Requires collecting them first.

If any of these become priorities, they can be added incrementally without disturbing the current single-page structure.

## Notes on copy & claims

Wording throughout the site sticks to the deliberately careful phrasing brief:

- *"a calmer, cleaner nail spa experience"*
- *"lower-odor experience"*
- *"a calmer alternative to the typical strong nail-shop smell"*
- *"natural-feeling touches"*
- *"detail-focused service"*
- *"close attention to every finish"*

No absolute claims (*odorless, chemical-free, non-toxic, organic, medical grade, zero smell, all natural*) appear anywhere in the markup. If those become accurate and approved, edit them in directly.

## Accessibility & performance summary

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`)
- Skip link to main content
- Visible focus rings on all interactive elements
- All images carry meaningful `alt` text
- Form labels are associated with inputs
- Lightbox closes on Escape and traps focus on its close button
- `prefers-reduced-motion` disables animations and smooth scroll
- Instagram script is deferred and only loaded once
- Gallery images are aggressively compressed JPEGs (≤900 px on the long edge, quality 78)
- Social preview image is 50 KB (well below all platform limits: FB 8 MB, Twitter 5 MB, LinkedIn 5 MB)
- No third-party trackers, analytics, or fingerprinting
