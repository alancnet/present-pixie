# 📱 Product Description

## Overview

Our app is a **personalized gift discovery and reminder platform** that helps users find the perfect present for any occasion. By combining **user-provided recipient profiles** (interests, demographics, past gifts) with **Amazon’s product catalog**, the app delivers curated gift recommendations. Users can engage casually without an account, or unlock powerful features by creating one.

## 1. Key Features

* **Use Without an Account**: Jump right in, create a recipient profile, and get gift ideas instantly.
* **Smart Recipient Profiles**: Capture details like age, interests, owned items, budget, and optional occasions (birthday, anniversary, holidays).
* **Occasion Awareness**: Built-in recognition of common holidays; optional date tracking for birthdays and anniversaries with reminders.
* **Amazon Integration**: Browse real products via Amazon’s API. Deep-link to Amazon with our referral tag for affiliate revenue.
* **Engagement Loop**: Users thumbs up / thumbs down / add to cart; the system learns preferences and improves recommendations.
* **Collaborative Filtering**: Over time, user-product interactions build a graph that powers “friend-of-a-friend” style recommendations.
* **Account Upgrade Path**: Save recipient profiles, track purchase history, manage multiple recipients, and enable push notifications.
* **Notifications & Reminders**: Personalized nudges before important dates ensure users never miss an occasion.
* **Cross-Platform**: Firebase-powered backend, deployable on mobile (iOS/Android) and web.

### 1.1 Benefits

* **For Users**: Reduce stress, save time, and always give meaningful gifts.
* **For Us**: Affiliate commissions, recurring engagement through reminders, and valuable recommendation data for future expansion.
* **For Amazon**: Increased product discovery and conversions through targeted affiliate traffic.

## 2. Business Model

### 2.1 Revenue Source

* **Amazon Associates Program**: All sales flow through your affiliate tag.
* Commission is credited to your app’s account.

### 2.2 Creator Partnership Program

* **Mechanism**:

  * Creators receive a unique **referral code / link** (e.g., `?ref=creator123`).
  * When a user installs/opens the app with that referral, the app logs the creator ID.
  * All affiliate sales from that user are attributed to the creator.
* **Backend Handling**:

  * Firebase stores `creatorId` in the user profile (persistent across devices if logged in).
  * Commission data from Amazon is aggregated at your end.
  * Monthly payouts to creators handled by you (outside Amazon).

### 2.3 Incentives

* **For Creators**:

  * Earn a % share of commissions from all purchases made by referred users.
  * Transparent reporting dashboard (earnings, clicks, purchases).
* **For Users**:

  * Free use forever, no subscription.
* **For You**:

  * Single affiliate relationship with Amazon → compliance & reporting simplified.
  * Build an ecosystem of creators pushing traffic into your app.

---

## 3. Creator Partnership Features (Future Development)

### 3.1 Creator Onboarding

* Creators register (name, email, payout method, social handle).
* Admin verification to prevent abuse.

### 3.2 Referral Links

* Each creator gets a unique URL/QR code:

  * Example: `presentpixie.com/?ref=creator123`
  * App sets `creatorId = creator123` in Firebase at first open.

### 3.3 Attribution Logic

* First referral wins (sticky attribution).
* If anonymous user later creates account, attribution persists.
* Attribution stored securely in Firestore:

  * `users/{userId}/creatorAttribution: { creatorId, assignedAt }`.

### 3.4 Creator Dashboard (Phase 2)

* **Features**:

  * Lifetime referrals.
  * Monthly clicks → cart additions → purchases.
  * Estimated earnings (based on commission share %).
* **Access**: Web dashboard + Firebase Auth.

### 3.5 Payout System

* You handle payouts outside Amazon:

  * Export Amazon reports + match to creator attribution.
  * Payment methods: PayPal, ACH, etc.

---

## 4. Pages / Screens Update

### 4.1 User-Facing (same as before)

* Recipient creation, gift feed, notifications, history, etc.

### 4.2 Creator-Facing (new, later release)

* **Creator Dashboard** (web or in-app tab):

  * Metrics: referred users, impressions, thumbs, add-to-cart, Amazon click-throughs, purchases.
  * Earnings summary (non-binding, payouts confirmed monthly).
* **Account Settings**: payout method, contact info.

### 4.3 Admin-Facing (internal only)

* Manage creators (approve, block, set commission share).
* Reconciliation reports (Amazon → Firebase → payout).

---

## 5. Risks & Mitigations

* **Amazon Policy Compliance**: All affiliate traffic must flow through your tag. You’re responsible for ensuring creator disclosures.
* **Attribution Fraud**: Use App Check + Firebase rules to block fake referrals. Manual review of suspicious creator activity.
* **Payout Disputes**: Provide transparent reporting (based on Amazon’s official sales reports).

---

## 6. Roadmap

* **MVP**: Consumer app only (recipient profiles, Amazon integration).
* **Phase 2**: Add creator referral attribution (backend tracking only, no dashboard yet).
* **Phase 3**: Creator dashboard + payout system.
