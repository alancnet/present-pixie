# Present Pixie – Web App

Personalized gift discovery with anonymous use, recipient profiles, and an Amazon-powered gift feed.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with Firebase and Amazon tag:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Amazon Associates
VITE_AMAZON_ASSOCIATE_TAG=yourtag-20
```

3. Run the dev server:

```bash
npm run dev
```

## Features

- Anonymous auth fallback; upgrade via Login.
- Create recipients with occasion, date, budget, interests.
- Gift feed with mock Amazon results and affiliate links.
- Thumbs up/down and add-to-cart logging to `signals`.
- Protected dashboard using Firebase Auth.

## Notes
- Tailwind CSS v4 via `@tailwindcss/vite`.
- HeroUI components with theme toggle (system/light/dark).
- Replace mock Amazon service with a secured Cloud Function for PA-API v5.
