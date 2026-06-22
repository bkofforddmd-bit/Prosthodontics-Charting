# Cary Prosthodontics — Odontogram & Treatment App

Single-file clinical charting, treatment planning, financial agreement, and archives app.
Deploys as a static site on Netlify with one serverless function that forwards AI requests.

## What's in here

```
index.html                          The whole app (open this in a browser)
netlify.toml                        Netlify config (no build step)
netlify/functions/claude-proxy.js   AI proxy — forwards each user's OWN API key to Anthropic
```

## Deploy (one time)

1. Put these files in a GitHub repo (private recommended).
2. In Netlify: **Add new site → Import from Git →** pick this repo.
   - Build command: *(leave blank)*
   - Publish directory: `.`
   - Functions directory is read from `netlify.toml` automatically.
3. Deploy. Your site is at `https://YOUR-SITE.netlify.app`
   and the AI proxy at `https://YOUR-SITE.netlify.app/.netlify/functions/claude-proxy`

## Each clinician uses their OWN API key

The app never stores a key in the file or on the server. Each user:

1. Gets a key at **console.anthropic.com → API Keys**
2. In the app, clicks **⚙ AI key**
3. Pastes their key + the proxy URL above, then **Test connection**

AI usage bills to **their own** Anthropic account. The proxy holds no key of its own —
it just forwards whatever key each request carries (`x-user-api-key` header).

## Important: patient data lives in the browser

Charts, plans, signed agreements, photos, radiographs, and documents are stored in each
device's **browser localStorage**, tied to the site URL — NOT in this file or on a server.

- New code versions start empty. Use **Export file / Import file** to carry a patient across
  versions, devices, or URL changes.
- If you migrate to a new URL, **Export patients from the old URL first**, then Import on the new one.

## Updating the app

Commit a new `index.html` to the repo → Netlify auto-deploys. Existing browser data is
preserved as long as the site URL stays the same.
