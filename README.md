# Present Pixie – Dev Setup

## Prereqs
- Node 20+
- Firebase CLI (`npm i -g firebase-tools`)

## 1) Environment
Copy `.env.example` to `.env.local` and set Vite vars:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Set Functions secrets for PA-API (optional until real integration):
```
firebase functions:secrets:set PA_API_ACCESS_KEY
firebase functions:secrets:set PA_API_SECRET_KEY
firebase functions:secrets:set PA_API_PARTNER_TAG
```

## 2) Install
```
npm install
pushd functions && npm install && popd
```

## 3) Run locally
```
npm run dev
```

## 4) Deploy
```
firebase deploy
```

## Notes
- Anonymous auth is used on the homepage. Upgrade path via Login page.
- Firestore structure and Functions match MVP in `PRESENT_PIXIE.MD`.
