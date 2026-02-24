# Payment Gate Plan — Coach Al's Wellness Studio

## The Goal

Only paid users can access the app. After completing onboarding, users hit a payment screen. If they pay, they get into the Dashboard. If not, they stay locked out.

---

## The Three Options

### Option A: Stan Store Link-Out

**How it works:** User taps "Buy" → opens Stan Store in browser → pays → manually reopens app.

**The problem:** Stan Store has no API, no webhooks, no SDK. There is literally no way for your app to know if someone paid. You'd be relying on the honor system.

The only workaround is Zapier ("New Customer" trigger → Firebase), but:
- 15-minute delay before it fires
- Matches by email only (user might use a different email on Stan Store)
- Unreliable for real-time access gating

**Verdict: Can't enforce paid-only access. Not viable as the gate.**

---

### Option B: Direct Stripe Integration

**How it works:** User taps "Unlock" → app creates a Stripe Checkout session via Firebase Cloud Function → opens Stripe's hosted payment page in browser → user pays → Stripe sends webhook to your Cloud Function → writes `paid: true` to Firestore → app checks and grants access.

**What you need:**
- Coach Al's own Stripe account (already exists)
- Firebase Blaze plan (for Cloud Functions)
- 2 Cloud Functions (create checkout + receive webhook)
- Deep linking to return user to app after payment
- A new `PAYMENT_GATE` screen

**Verdict: Reliable, secure, works on all platforms. This is the real solution.**

---

### Option C: Stan Store + Zapier + Firebase (Hybrid)

**How it works:** User taps "Buy" → opens Stan Store product in browser → pays on Stan Store (which uses Stripe internally) → Zapier detects "New Customer" → fires webhook to Firebase → writes `paid: true` to Firestore → app checks on next open.

**Better than Option A**, but still has problems:
- 15-minute delay (Zapier polls, doesn't get instant webhooks)
- Email matching is fragile (app email ≠ Stan Store email)
- No deep link back to app (Stan Store doesn't support custom redirects)
- User pays, reopens app, but Zapier hasn't fired yet → "still locked" for up to 15 mins
- Requires Zapier paid plan for reliable volume

**Verdict: Works in theory, bad user experience in practice.**

---

## Side-by-Side Comparison

| | Stan Store (A) | Stripe Direct (B) | Stan + Zapier (C) |
|---|:---:|:---:|:---:|
| Knows user paid? | No | Yes (instant) | Yes (15 min delay) |
| User returns to app? | No (manual) | Yes (deep link) | No (manual) |
| Reliable gating? | No | Yes | Fragile |
| Backend work | None | 2 Cloud Functions | 1 Cloud Function + Zapier setup |
| Cost | Free | 2.9% + $0.30/tx | Zapier plan ($20+/mo) |
| Revenue to | Stan Store account | Stripe account | Stan Store account |
| Refund control | Stan Store dashboard | Stripe dashboard | Stan Store dashboard |
| Works on Web | Yes | Yes | Yes |
| Works on iOS/Android | Yes | Yes | Yes |

---

## Recommendation: Option B — Direct Stripe

**Why:**

1. **Only option that actually gates access.** Webhook fires in seconds, writes to Firestore, app knows instantly.

2. **Coach Al already has a Stripe account.** No new accounts needed.

3. **Better UX.** User pays → auto-redirected back to app → lands on Dashboard. No "reopen the app and hope it works."

4. **You already use Firebase.** Adding 2 Cloud Functions is a natural extension of your existing stack.

5. **Full control.** Pricing, refunds, customer data — all in Coach Al's Stripe dashboard.

**Stan Store still has a role** — use it for selling standalone products (coaching sessions, merch, ebooks) via a "Shop" link in the app. But for the core app access gate, Stripe is the only option that works.

---

## How It Would Work

### User Flow

```
Complete onboarding (7 screens + Safety Notice)
         ↓
   PAYMENT GATE SCREEN
   "Your personalized program is ready!"
   Shows: pillar scores summary, what's included
   [Unlock Full Access — $XX]
         ↓
   Opens Stripe Checkout in browser
   (card, Apple Pay, Google Pay all supported)
         ↓
   User pays → Stripe webhook fires → Firebase: paid = true
         ↓
   Browser redirects back to app via deep link
         ↓
   App checks Firestore → paid = true → DASHBOARD
```

### On Every Future App Open

```
App launches → checks @al_paid in AsyncStorage (instant, offline)
  → If true → go to Dashboard
  → If false → check Firestore (online)
    → If paid in Firestore → cache locally, go to Dashboard
    → If not paid → go to Payment Gate
```

### What Gets Built

| File | What |
|---|---|
| `functions/index.js` | 2 Cloud Functions: createCheckoutSession + stripeWebhook |
| `components/PaymentGate.js` | New screen — assessment summary + purchase CTA |
| `App.js` | Add PAYMENT_GATE route, paid status state, startup check |
| `lib/storage.js` | Add `@al_paid` key, savePaidStatus/loadPaidStatus |
| `lib/sync.js` | Read `paid` field from Firestore on load |
| `app.json` | Add `scheme` for deep linking (e.g., `alwellness`) |

### What's Needed Before Starting

1. Coach Al's Stripe account API keys (test keys first, production later)
2. Firebase project upgraded to Blaze plan (pay-as-you-go, required for Cloud Functions)
3. Decision on price point (one-time purchase amount)

---

## What About the "Restart Questionnaire" Idea?

The original idea was: if user doesn't pay, restart the questionnaire. This isn't ideal because:

- Screens 1-3 already saved their data to Firebase (name, email, demographics, goals)
- Forcing them to redo the entire questionnaire is punishing, not motivating
- They'd enter the same answers anyway

**Better approach:** Keep them on the Payment Gate screen. They can see their results (the value they just built) but can't access the full app. This creates motivation to pay rather than frustration from repeating work.
