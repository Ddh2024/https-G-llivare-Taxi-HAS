# Aurora Taxi Kiruna – website

A static website (HTML, CSS and plain JavaScript) for Aurora Taxi Kiruna. It needs no build step, framework, database or server code, so it can be hosted on Netlify, Cloudflare Pages, GitHub Pages or any Apache/Nginx host.

## Features
- **Hero section**: an animated northern-lights sky, with a slot for your own video clip (see below).
- **Quick booking**: pick-up and destination with suggestions for 28 places in and around Kiruna (airport, Kiruna C, hotels, ICEHOTEL, Abisko, Nikkaluokta, Riksgränsen, Esrange, Gällivare, Narvik and more). It also has date and time or "Now", passengers, luggage, flight or train number, child seat, skis, return trip and company invoice. The finished request is sent through **WhatsApp** or **e-mail**.
- **Popular rides**: one tap fills in the booking form, with an approximate distance and travel time.
- **Destinations directory**: can be filtered by Airport & train, Hotels, Sights, Nature & ski and Towns.
- **Live northern-lights Kp index**: data comes from NOAA SWPC. The panel hides itself if the data can't be loaded.
- **Languages**: English and Swedish. The site picks one from the browser language, and `?lang=sv` forces Swedish.
- Services, fleet, why-us, Google rating, FAQ and contact sections.
- **Mobile**: a fixed Call / WhatsApp / Book bar at the bottom of the screen.
- **SEO**: `TaxiService` structured data, Open Graph tags, a sitemap, robots.txt and hreflang tags.
- **Accessibility**: a skip link, labelled form fields, keyboard focus styles and support for reduced motion.

## Security
- A strict **Content-Security-Policy** with no inline JavaScript, no `eval` and no third-party scripts. The only external request goes to NOAA. You can switch it off with `auroraWidget: false` in `js/config.js`.
- HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy and COOP. These are set in `_headers` (Netlify/Cloudflare) and `.htaccess` (Apache).
- The site has **no backend and stores no personal data**, which leaves nothing to hack and no database to leak. It uses no cookies or trackers, so it needs no cookie banner.
- Booking input is cleaned and length-limited. The form also has a hidden honeypot field and timing checks against bots.
- All user text is rendered with `textContent`, never `innerHTML`.
- Includes `.well-known/security.txt`.

For Nginx, copy the headers from `_headers` into `add_header ... always;` lines.

## Hero video clip
Put your clip at:

```
assets/video/hero.mp4    (H.264, 1920×1080 or 1280×720, 8–15 s loop, no audio, under ~6 MB)
assets/video/hero.webm   (optional, smaller)
```

Film it yourself: your own driver at the wheel of your own car, recorded with their written consent. Don't use stock footage of a person presented as your driver. Visitors who have reduced motion turned on, or who use data-saver, see the animated sky instead.

Make a compressed web version:
```
ffmpeg -i raw.mov -vf "scale=1280:-2,fps=25" -an -c:v libx264 -crf 26 -preset slow -movflags +faststart assets/video/hero.mp4
ffmpeg -i raw.mov -vf "scale=1280:-2,fps=25" -an -c:v libvpx-vp9 -crf 36 -b:v 0 assets/video/hero.webm
```

## Editing
- Phone, WhatsApp, e-mail, address and rating: `js/config.js`.
- Fixed prices: add them under `fixedFares` in `js/config.js`, for example `"krn>icehotel": 600`. Without a fixed price, the site shows "Price on booking".
- Places and popular routes: `js/places.js`. Coordinates are approximate and only used for distance estimates.
- Swedish text: `js/i18n.js`. English text is in `index.html`.
- Photos: `assets/img/`. The current fleet photos are crops of phone screenshots. Replace them with the original full-resolution photos when you can.

## Run locally
```
python3 -m http.server 8000   # then open http://localhost:8000
```
