# RDC Locksmiths (Inverness): website

A 5-page professional website on the "Corporate" template, in charcoal and gold, for RDC Locksmiths: a locksmith and door specialist based in North Kessock and serving Inverness and the Highlands.

Sources: Yell (https://www.yell.com/biz/rdc-locksmiths-inverness-11032179/), the Facebook page (https://www.facebook.com/p/RDC-Locksmiths-100090196368464/) as described in search results, and Top Scot Trades (5.0 rating from 5 reviews, plus a real customer review). The phone and email were supplied by the client.

| Detail | Value |
|---|---|
| Business | RDC Locksmiths (run by Robert) |
| Based in | North Kessock, Inverness IV1 |
| Phone | 07777 165148 (call and WhatsApp) |
| Email | rdclocksmiths@rdclocksmiths.co.uk |
| Facebook | https://www.facebook.com/p/RDC-Locksmiths-100090196368464/ |
| Services | Emergency entry, lock changes and repairs, door repairs, door installation, glass replacement, security upgrades |

## ✅ How to put it live

Upload the **contents of `public/`**, so that `index.html` sits at the top level. The zip **`rdc-locksmiths-UPLOAD-THIS.zip`** already has this layout. For example, put it on the rdclocksmiths.co.uk hosting (into `public_html/`), or drag it onto https://app.netlify.com/drop.

## 📸 Real photos (added)

Five of the business's own photos were enhanced and added. Each was upscaled 2×, denoised, given a shadow lift, and had its contrast and sharpness gently improved, with colours kept natural:
- `job-lockout-entry.webp`: Emergency Entry, plus the Home and Gallery pages
- `job-mortice-lock-kit.webp`: Lock Changes & Repairs, plus Gallery
- `job-door-frame-repair.webp`: Door Repairs, plus Gallery
- `job-upvc-door-fitted.webp`: Door Installation, About, plus Gallery
- `rdc-van-kessock.webp`: Home "Meet Robert", About, plus Gallery

The Gallery has an "Our jobs" filter that shows just these. To add more photos, follow the steps below.

## 📸 Adding more photos from Facebook

Facebook requires a login, so its photos couldn't be downloaded automatically. Professional, royalty-free photos are used for now. To use the business's own photos:

1. On Facebook, open each photo and choose **Download**.
2. Rename each file to match the image it should replace, then put it in `public/assets/img/`. Keep the `.webp` names, or tell your developer the new names.

| Replace this file | Where it appears | Suggested Facebook photo |
|---|---|---|
| `logo-mark.svg` | Logo (header and footer) | Profile picture / logo |
| `highlands.webp` | Home and About banner | Cover photo |
| `lock-picks.webp` | Emergency Entry | Lockout job / tools |
| `keys-lamp.webp` | Lock Changes | New lock fitted |
| `porch-house.webp` | Door Repairs | Door repair job |
| `modern-front.webp` | Door Installation | New door fitted |
| `bright-windows.webp` | Glass Replacement | Glass job |
| `keypad-lock.webp` | Security, Home "Meet Robert" | Security work / Robert at work |

Or send the photos to your developer, who can optimise and add them in a few minutes.

## Folder structure

- `public/`: the finished website.
- `src/site.config.js`: business details. Add hours or a street address here if wanted.
- `src/services-data.js`: the 6 services. Add `price: 'From £60'` to show a price.
- `src/pages/*.html`: the content for each page.
- `build.js`: run `npm run build` to rebuild `public/`.
- `server.js`: an optional local preview server, plus live AI chat if `ANTHROPIC_API_KEY` is set.

## Enquiries

The Home and Contact forms, and the chat assistant's quote requests, are emailed to **rdclocksmiths@rdclocksmiths.co.uk** through FormSubmit. The **first submission sends a one-time activation email**; click its link once. Locked-out visitors are told to call instead.

## ⚠️ Check these before launch

1. **Click the FormSubmit activation email.**
2. **Owner name.** "Robert" comes from a public customer review. Confirm the name and how he'd like to be introduced.
3. **Address.** Listings show 2 Drumsmittal Rd, North Kessock IV1 3JU. The site only shows "North Kessock, Inverness IV1" because it may be a home address. Add the full address if wanted.
4. **DBS / insurance.** Listings mention "fully DBS checked" and "fully insured", but inconsistently, so the site doesn't claim either. Add them once confirmed.
5. **Wording to confirm:** "non-destructive entry wherever possible", the "what's included" lists, and the areas named (Culloden, Nairn, Dingwall).
6. **Hours.** Not listed, so not shown. Add them in `site.config.js` if wanted.
7. **WhatsApp.** Confirm 07777 165148 is on WhatsApp.
8. **Photo credits.** Stock images are from Unsplash, and three CC0 images are from Wikimedia Commons ("Key code lock", "Light bulb and keys on table", "Trousseau de clefs"). No attribution is required for either, but it's listed here for the record.
