# SOCIONAVIK Website

A static digital marketing agency website for SOCIONAVIK with editable configuration and a domain-neutral local setup.

## Local development

```bash
python app.py
```

Open the site at <http://127.0.0.1:8000>.

## Configure before launch

Edit `config.js` when business details or a production domain are confirmed. Email, phone, WhatsApp, location and social links are centralized there. Keep `brand.siteUrl` and `brand.canonical` empty until a real public domain is available; the homepage also keeps its canonical, Open Graph URL and schema URL empty for the same reason.

The contact form currently uses the configured Web3Forms endpoint and access key in `config.js`. Do not change that configuration unless the form provider or verified recipient changes. The site intentionally does not claim success when the endpoint is unavailable; it falls back to the configured email client.

The current `robots.txt` blocks crawling because this project has no public production URL yet, and `sitemap.xml` contains no URLs. When a real domain is selected, update the domain settings, add the production URLs to the sitemap, and change `robots.txt` to allow crawling.

## Production note

This project is a static HTML/CSS/JS site with a pure-Python route wrapper for local preview. Beginner-friendly deployment options are Netlify, Cloudflare Pages, GitHub Pages, or any static hosting provider. Upload the project files, configure a real domain if one is available, update the domain-dependent SEO files, and keep the verified form provider configuration intact.

For local server hosting, run `python app.py`. Do not expose a development server directly to the public internet; use managed static hosting or a production web server.
