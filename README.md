# Green Nails Spa — Static Site

A single-page, static website for **Green Nails Spa** in Concord, NC.
Deploys directly to GitHub Pages, no build step, no backend.

## Stack

- Plain HTML, CSS, and vanilla JavaScript
- Google Fonts: Cormorant Garamond + Inter
- Instagram oEmbed (loaded lazily, fallback link if blocked)
- FormSubmit.co for the contact form (no server)

## File structure

```
green-nails-spa/
├── index.html       # All markup, copy, and inline image data URIs
├── styles.css       # Design system + all section styles
├── script.js        # Nav, lightbox, services filter, form, embed bootstrap
└── README.md        # This file
```

The logo, map screenshot, and the entire gallery are **embedded** directly into `index.html` as base64 data URIs. The site loads without any external image hosting.

## Local preview

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 5500
# then visit http://localhost:5500
```

## Deploying to GitHub Pages

1. Create a new GitHub repository (public or private with Pages enabled).
2. Push these three files (`index.html`, `styles.css`, `script.js`) plus this README to the repo root.
3. In the repo, go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
5. Save. After a minute or two GitHub will give you a URL like `https://your-org.github.io/your-repo/`.

Custom domains: add a `CNAME` file with your domain, and point a CNAME DNS record at `<your-org>.github.io`.

## Replacement checklist

Before going live, search-and-replace these placeholders that remain in `index.html`:

| Placeholder | Replace with | Where it appears |
|---|---|---|
| `CONTACT_EMAIL_HERE` | The email Green Nails Spa wants form submissions sent to | Contact form `action`, mailto links, hiring link |
| `GITHUB_PAGES_URL_HERE` | The final public URL of the deployed site (e.g. `https://username.github.io/green-nails-spa/`) | `<link rel="canonical">`, Open Graph URL, JSON-LD `url`, form `_next` redirect |

**Already filled in** (no action required):

- `LOGO_IMAGE_HERE` — replaced with the embedded logo data URI
- `MAP_IMAGE_HERE` — replaced with the embedded map screenshot data URI
- `GALLERY_IMAGE_DATA_URI_HERE` — replaced with all 19 gallery items embedded inline
- `INSTAGRAM_EMBED_CODE_HERE` — replaced with the supplied Instagram embed (script source rewritten from `//www.instagram.com/embed.js` to `https://www.instagram.com/embed.js`)

### Activating the contact form

[FormSubmit](https://formsubmit.co) requires a one-time confirmation:

1. After deploying, submit the contact form once yourself.
2. FormSubmit will email a confirmation link to the address you provided. Click it.
3. From then on, real submissions will be delivered.

You can swap in any FormSubmit alias (e.g. the FormSubmit hash address you see after confirming) if you prefer not to expose the raw email in the page source. To do that, replace `CONTACT_EMAIL_HERE` in the form `action` with the alias (everywhere else it can stay as a real mailto link, or use a contact email like `hello@greennailsspa.com`).

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
- No third-party trackers, analytics, or fingerprinting
