# MVP scope

* No-account use via **anonymous auth**; optional upgrade to email/Google/Apple.
* Create **Recipient Profile**: occasion, date (optional), age (or DOB), interests, owned items, constraints (budget, categories), demographics (optional & consented).
* **Gift feed** from Amazon PA-API v5 with affiliate tagging; actions: 👍 / 👎 / Add to Cart (deep link).
* Save multiple recipients per user; show **upcoming occasions**; basic push notifications.
* Lightweight **recommendations**: interest → category → product + early item-item similarity.
* Platforms: Web (Firebase Hosting) + mobile (Capacitor/React Native later).

# Firebase architecture

* **Auth**: anonymous + providers; link anon → real account to preserve data.
* **Firestore** (primary DB) + **Cloud Functions** (PA-API proxy, recs, schedulers).
* **Cloud Storage** (optional: profile images).
* **Cloud Messaging** (push).
* **Remote Config** (feature flags, thresholds).
* **App Check** (abuse protection).
* **Analytics** (+ BigQuery export) for recs and funnels.
* **Cloud Scheduler + Pub/Sub** for reminders and nightly recompute.

# Core data model (Firestore collections)

* `users/{userId}`

  * `createdAt`, `plan`, `settings` (currency, locale, notif prefs)
* `users/{userId}/recipients/{recipientId}`

  * `name`, `occasion` (“birthday”, “anniversary”, “holiday”, “other”)
  * `occasionDate` (optional ISO), `age` (computed), `dob` (optional), `budgetMin/Max`
  * `interests` \[string], `owns` \[ASIN or keyword], `constraints` (e.g., “no scented”, “eco”)
  * `demographics` (optional/consented): `gender`, `orientation`, etc.
  * `createdBy` (“anon”|“user”), `createdAt`, `updatedAt`
* `users/{userId}/events/{eventId}`

  * Snapshot of a planned gift: `recipientId`, `asin`, `status` (“saved”, “purchased”), `price`, `clickedAt`, `purchasedAt?`
* `signals/{yyyymmdd}/{signalId}` (append-only; for analytics)

  * `userId?`, `recipientId?`, `asin`, `action` (“view”, “impress”, “click”, “thumbs\_up”, “thumbs\_down”, “add\_to\_cart”, “purchase”), `ts`
* `recommendations/{recipientId}`

  * `items`: \[{`asin`, `score`, `reasons`}]
* `catalog/products/{asin}`

  * Cached Amazon data: title, images, price bands, categories, brand, rating, updatedAt

# Security & privacy

* Collect **sensitive fields** (e.g., sexual orientation) only with explicit consent; make optional and skippable. Explain use (“to improve suggestions”) and allow deletion.
* Firestore rules (high level): users read/write only their subcollections; `signals` write-only; `catalog` read-only; block writes to `recommendations` except via Functions.
* PII minimization: store minimal recipient info; hash emails/phone if ever added. Support “Forget” per recipient and global account deletion.

# Key Cloud Functions

1. **AmazonSearchFunction** (HTTPS callable)

   * Input: recipient profile + pagination
   * Maps interests → Amazon browse nodes/keywords; applies price filter and exclusions; fetches via **PA-API v5**; caches in `catalog/products`.
   * Appends affiliate tag to `Add to Cart`/detail URLs.
2. **SignalIngestFunction**

   * Receives client events; validates; writes to `signals/…`; updates lightweight counters (thumb score per product).
3. **RecommenderJob (scheduled)**

   * Builds a **bipartite graph** (profiles ↔ products) from `signals`.
   * Compute item-item similarity (cosine over interaction vectors with weights: view=0.1, 👍=1.0, add\_to\_cart=2.0, purchase=3.0; 👎 = negative weight).
   * Store top-N per recipient in `recommendations/{recipientId}` with `reasons` (e.g., “Similar to items you liked”, “Popular among users who liked X”).
4. **OccasionReminderJob (daily)**

   * For each recipient with `occasionDate`, compute next occurrence; if within N days (Remote Config), enqueue FCM notification.
5. **AccountLinkMerge**

   * When anon → registered, migrate subcollections and signals.

# Recommendation strategy

* **Cold start**: map `interests` → curated Amazon categories; seed with top-rated, high-conversion items (maintain allowlist per category in Remote Config).
* **Thumb graph**: treat 👍/cart/purchase as edges; use **FOAF-style** expansion: *users who liked A also liked B* → item-item.
* **Demographic-aware rerank** (opt-in): apply lightweight priors (age range, hobby tags).
* **Diversity & fatigue**: intra-list diversity (MMR), no repeats recently shown, decay old negatives.

# Client flows

* **Onboarding (no account)** → anonymous auth → create recipient → show feed → capture signals → prompt “Save this recipient?” after first add-to-cart.
* **Create account** to: sync across devices, manage multiple recipients, history, reminders, push.
* **Occasion helper**: For “Birthday/Anniversary”, if DOB/origin missing, offer “Remind me earlier each year (X days)”.

# Amazon integration notes

* Use **Product Advertising API v5** (associate tag required; signed requests with access/secret).
* Cache product results for 24h; backfill prices on click via signed redirect to ensure tag retention.
* Respect Amazon policies (no storing price beyond allowed windows; no email price alerts).

# Analytics & experimentation

* Funnel: profile\_created → search\_results → item\_view → add\_to\_cart → outbound → purchase (if available via PA-API reports or tracking IDs).
* Export events to **BigQuery** for model iteration.
* **Remote Config** flags: weights, diversity lambda, reminder lead-time, opt-in prompts.

# Firestore rule sketch (illustrative only)

```
// Pseudocode
match /users/{uid} {
  allow read, write: if request.auth.uid == uid;
  match /recipients/{rid} { allow read, write: if request.auth.uid == uid; }
  match /events/{eid}     { allow read, write: if request.auth.uid == uid; }
}

match /signals/{date}/{sid} {
  allow create: if request.time < date + 48h;  // write-only, no read
  allow read: if false;
}

match /catalog/products/{asin} { allow read: if true; allow write: if request.auth.token.admin == true; }

match /recommendations/{rid} { allow read: if resource.data.userId == request.auth.uid; allow write: if request.auth.token.admin == true; }
```

# Data handling for age

* If `dob` provided: compute `age` client-side and store `ageBucket` only (e.g., 18–24, 25–34) to reduce PII; keep raw `dob` only if reminders are enabled.

# Notifications

* **FCM topics per user**; per-recipient schedule windows (e.g., 30/14/7/3 days before).
* Quiet hours in settings; snooze per occasion.

# Offline & performance

* Firestore local cache; optimistic UI on thumbs.
* Precompute 50–100 items per recipient into `recommendations` to reduce PA-API calls.
* Image lazy-load; cdnize via Amazon images.

# Roadmap

1. **MVP**: Profiles, Amazon search, thumbs/cart, basic recs, reminders, anon→account linking.
2. **Phase 2**: Collaborative filtering v2, social import (contacts for shared gifting), budget planner, gift history insights.
3. **Phase 3**: Non-Amazon merchants, price tracking (policy-compliant), group gifting, gift-wrapping add-ons.

# Risks & mitigations

* **PA-API quotas**: warm cache, throttle; only fetch details on demand.
* **Affiliate compliance**: display required disclosures; ensure tag on all outbound links.
* **Sensitive data**: explicit consent + delete controls; default to “Prefer not to say.”
* **Spam/abuse**: App Check + server-side validation; rate-limit signals.
