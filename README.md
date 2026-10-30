# Wedding invitation

A single-page wedding invitation built with Next.js: hero, celebrations with directions and
add-to-calendar, an RSVP form, and a countdown.

## Make it yours

- **Names, dates, venues:** edit `src/content/wedding.ts`. Every page section reads from it.
- **Artwork:** replace the files in `public/images/` (keep the names, or update the paths in
  `wedding.ts`). PNG or WebP paintings work too. Light backgrounds blend into the paper colour.
- **Colours and type:** the tokens at the top of `src/app/globals.css`.


## RSVPs

The form posts to `/api/rsvp`, which validates the response and forwards one flat row to a
webhook. The simplest store is a Google Sheet:

1. Follow the steps at the top of `scripts/rsvp-google-sheet.gs`.
2. Copy `.env.example` to `.env.local` and fill in `RSVP_WEBHOOK_URL` and `RSVP_WEBHOOK_SECRET`.
   On Vercel, add the same two variables under Project Settings → Environment Variables.

Without a webhook, RSVPs are logged to the console in development and rejected (503) in
production, so guests never see a false "Thank you".

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

Deploy by importing the repo on Vercel; no other configuration is needed.
