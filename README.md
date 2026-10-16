# RishtaSutra — updated deployable demo

This package updates the uploaded RishtaSutra website with a member portal, biodata form and attachment, a two-profile free view/download limit, demo paid-access prompt, admin panel, event publishing, and sponsored ad placements.

## Included demo features

- Register and log in to a demo member account.
- Create and edit basic biodata and attach a small PDF/DOC/DOCX file.
- Browse fictional sample profiles and registered demo-member profiles.
- View/download quota: two distinct member records per account in this demo. After the limit, a paid-access prompt appears.
- Admin can publish/delete event cards with image, date, status and description.
- Admin can publish/pause/delete brand ads and choose top, left/right rail, or all placements.
- Events and ads appear on the public page without manually editing HTML.
- Responsive layouts for mobile and desktop.
- Admin can view registered demo accounts in this browser.

## Demo administrator login

- **Login ID:** `admin@rishtasutra.demo`
- **Password:** `Admin@123`

Open **Log in**, enter the credentials, and then choose **My Portal → Open admin panel**. There is also an “Admin demo login” shortcut near the footer to prefill the credentials.

For a member demo, create an account using any email address and a password of at least 8 characters. The credentials are saved only in the current browser.

## Deploy to GitHub and Vercel

1. Extract this ZIP.
2. Create a GitHub repository (for example `rishtasutra-matrimonial`) and upload the contents of this folder, including `index.html`, `styles.css`, `script.js`, `portal.js`, and `vercel.json`.
3. In Vercel, choose **Add New → Project**, import that repository, and deploy. No build command is required; this is a static HTML/CSS/JS demo.
4. Open the Vercel deployment URL and test registration, login, biodata, events, ads and the admin panel.

`vercel.json` routes all paths to `index.html` for this single-page demo.

## Important production limitations

**This is a functional browser-local demo, not a production matrimonial platform.** It uses `localStorage` and `sessionStorage`; records are not shared across browsers/devices and may be cleared by the user. Demo passwords are stored in browser storage and must never be used for real accounts. The admin demo credentials are intentionally public and must never protect a live admin panel.

The paid-access button activates demo access locally without charging money. No real payment gateway, subscription verification, invoices or refunds are connected. The file attachments and admin-uploaded images are stored as browser data URLs and are not private cloud files. Avoid uploading real personal, financial, identity, or sensitive biodata to this demo.

Before accepting real users, connect a backend such as Supabase or another managed database with:
- verified authentication, email/OTP verification, password reset and server-side role checks;
- database policies that restrict each member to their own profile and allow admins only through server-enforced roles;
- private object storage and signed URLs for biodata/photo access;
- server-side view/download quota enforcement (never trust browser-only counters);
- a real payment gateway with server-created orders, verified signatures/webhooks, idempotency, receipts and refund rules;
- abuse reporting, block controls, moderation, audit logs, backup/restore, rate limits and account deletion;
- reviewed privacy policy, terms, membership price/renewal/refund terms, support contacts and consent.

The displayed profiles are fictional samples. Do not present them as real members. Review and replace policy and business placeholders before launch.

## Project files

- `index.html` — original site plus portal, event section, ad rails and admin panel
- `styles.css` — original styling plus responsive portal/admin styling
- `script.js` — original website interactions
- `portal.js` — demo authentication, member biodata, quota, events, ads and admin interactions
- `vercel.json` — static Vercel routing
