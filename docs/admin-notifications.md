# Admin Email Notifications — Plan

## Overview

Send Coach Al an email whenever a new user completes the intake assessment. This way he knows immediately when someone joins without needing to check the dashboard.

## Prerequisites

- Resend domain `burntout.app` must be verified (same requirement as email verification)
- `RESEND_API_KEY` already set in Vercel env vars
- Add `ADMIN_EMAIL` to Vercel env vars (Coach Al's email)

## How It Works

After a user completes the intake assessment and their data is synced to Firestore, a serverless function sends a notification email to Coach Al with the new user's details.

## Implementation

### Option A: Trigger from existing Firestore sync (simplest)

Add a new API endpoint `POST /api/admin/notify-signup` that the client calls after `finalizeAssessment` in `App.js`. The endpoint sends an email to Coach Al.

**File to create:** `api/admin/notify-signup.js`

```
POST /api/admin/notify-signup
Body: { name, email, focusPillar, pillarScores }
Response: { success: true }
```

**Logic:**
1. Validate the request has required fields
2. Send email via Resend to `process.env.ADMIN_EMAIL`
3. Email includes: user name, email, focus pillar, all 7 pillar scores
4. Fire-and-forget from the client (don't block the user's flow if email fails)

**File to modify:** `App.js` — add a `fetch` call in `finalizeAssessment` after syncing to Firestore

```js
// In finalizeAssessment, after navigateTo("ASSESSMENT_RESULTS"):
try {
  fetch("/api/admin/notify-signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: userName,
      email: userEmail,
      focusPillar: weakestPillar,
      pillarScores,
    }),
  });
} catch (e) {
  // fire-and-forget — don't block the user
}
```

### Email Template

Subject: `New User: [Name] just joined`

Body:
- User name and email
- Focus pillar (their weakest area)
- All 7 pillar scores in a visual format
- Link to the admin dashboard (`burntout.app/admin`)

### Security

- No auth token needed on this endpoint (it doesn't return sensitive data)
- But should validate that the request contains valid-looking data to prevent spam
- Rate limit: optional (Resend free tier is 100 emails/day, unlikely to hit)
- `ADMIN_EMAIL` stored as Vercel env var, never in client code

### Env Vars Needed

| Variable | Value | Where |
|----------|-------|-------|
| `RESEND_API_KEY` | Already set | Vercel env vars |
| `ADMIN_EMAIL` | Coach Al's email | Vercel env vars (new) |

### Files Summary

| File | Action |
|------|--------|
| `api/admin/notify-signup.js` | Create — sends email via Resend |
| `App.js` | Modify — fire-and-forget fetch after finalizeAssessment |
| `.env.example` | Modify — add `ADMIN_EMAIL` |

### Depends On

- Resend domain verification (`burntout.app` verified in Resend + DNS records in Namecheap)
- Same blocker as email verification — once the domain is verified, both features can be enabled at the same time
