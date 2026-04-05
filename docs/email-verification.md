# Email Verification System

## Overview

When a returning user enters an email that already exists in Firestore **and has completed intake**, they must verify ownership via a 6-digit code sent to that email before their account data is restored. This prevents unauthorized access to someone else's account.

New users signing up for the first time are not affected. Users with incomplete intake (quit before finishing the assessment) simply reuse their Firestore doc and continue intake normally — no verification needed since there's no sensitive data to protect.

## Flow

```
User enters email on Step 1
  → findUserByEmail() finds match in Firestore
  → IF intakeCompleted:
      → Modal: "Welcome Back! We'll send a verification code to [email]"
      → User taps "Send Code"
  → POST /api/send-code → 6-digit code emailed via Resend
  → User enters code in modal
  → POST /api/verify-code → code validated against Firestore
  → Success: account data restored, navigate to Dashboard
  → Failure: error shown, user can retry or use a different email
  → IF NOT intakeCompleted:
      → Reuse existing Firestore doc, continue intake normally (no verification)
  → IF no match: new user, continue normally
```

## Architecture

### API Endpoints (Vercel Serverless Functions)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/send-code` | POST | Generate code, store in Firestore, email via Resend |
| `/api/verify-code` | POST | Validate code, return user data if correct |

Both endpoints use the Firebase client SDK initialized in `api/_firebase.js` (same config as `lib/firebase.js`).

### Firestore Collection: `verificationCodes`

```
{
  email: "user@example.com"     // lowercase, trimmed
  code: "482917"                // 6-digit numeric string
  createdAt: Timestamp          // when code was generated
  expiresAt: Timestamp          // createdAt + 10 minutes
  attempts: 0                   // incremented on each verify attempt
  verified: false               // set to true on successful verification
}
```

### Security

- **Rate limit**: Max 3 code sends per email per hour (enforced in `send-code.js`)
- **Attempt limit**: Max 3 verification attempts per code (enforced in `verify-code.js`)
- **Expiration**: Codes expire after 10 minutes
- **No data leakage**: User data is only returned after successful code verification
- **API key**: `RESEND_API_KEY` stored as Vercel environment variable, never in client code

## Files

| File | Purpose |
|------|---------|
| `api/_firebase.js` | Shared Firebase init for serverless functions |
| `api/send-code.js` | Send verification code endpoint |
| `api/verify-code.js` | Verify code endpoint |
| `vercel.json` | Routes `/api/*` to serverless functions |
| `App.js` | Client-side modal flow, send/verify handlers, account restoration |

## Current Status

**Email verification is currently DISABLED.** The toggle is in `App.js` inside `handleSaveName`:

```js
const EMAIL_VERIFICATION_ENABLED = false;
```

When `false`: returning users are restored directly without email verification.
When `true`: returning users must verify via 6-digit email code.

### To Enable

1. Verify `burntout.app` domain in Resend (see below)
2. Update from address in `api/send-code.js` to `noreply@burntout.app`
3. Set `EMAIL_VERIFICATION_ENABLED = true` in `App.js`
4. Deploy

### Why It's Disabled

Resend requires a verified domain to send emails to any address. Without it, emails can only be sent to the Resend account owner's email. Domain is `burntout.app`, registrar is Namecheap (Advanced DNS). Once DNS records are added and domain is verified in Resend, flip the flag to `true`.

## Email Service: Resend

- **Provider**: [resend.com](https://resend.com) (free tier: 100 emails/day)
- **Current sender**: `Coach Al's Wellness Studio <onboarding@resend.dev>` (change to `noreply@burntout.app` after domain verification)
- **Domain registrar**: Namecheap → Domain List → `burntout.app` → Manage → Advanced DNS
- **API key location**: Vercel dashboard → Settings → Environment Variables → `RESEND_API_KEY`

## Changing the From Address

To switch from `onboarding@resend.dev` to a branded address like `noreply@burntout.app`:

1. Go to Resend dashboard → **Domains** → **Add Domain** → enter `burntout.app`
2. Add the DNS records Resend provides to Namecheap (MX, TXT, DKIM)
3. Wait for verification (usually minutes)
4. Edit `api/send-code.js`, change the `from` field:
   ```js
   from: "Coach Al's Wellness Studio <noreply@burntout.app>",
   ```

## Client-Side Modal States

The modal in `App.js` is driven by `verificationStep`:

| Step | UI |
|------|-----|
| `"prompt"` | "Welcome Back!" message + "Send Code" button |
| `"sending"` | Button shows spinner |
| `"entering"` | Code input field + "Verify" button + "Resend Code" link |
| `"verifying"` | Verify button shows spinner |

All steps include a "Use a Different Email" link that closes the modal and returns to Step 1.

## Troubleshooting

**Emails not sending:**
- Check `RESEND_API_KEY` is set in Vercel environment variables
- Check Resend dashboard for sending logs
- Verify the API key has "Sending access" permission

**Codes not verifying:**
- Codes expire after 10 minutes
- Max 3 attempts per code — user must request a new one after that
- Check Firestore `verificationCodes` collection for the code document

**Rate limited:**
- Max 3 sends per email per hour
- Wait an hour or check Firestore `verificationCodes` for stale documents

**Firestore rules:**
- The `verificationCodes` collection requires explicit read/write/create rules
- Added in changelog #93: `match /verificationCodes/{docId} { allow read, write, create: if true; }`
- Without this rule, the API returns 500 "Missing or insufficient permissions"
- Also requires a **composite index** on `verificationCodes` for fields `email` (Ascending) + `createdAt` (Ascending). Firestore provides a direct link in the error message to create it. Index takes ~2 minutes to build.
- Tighten before production if needed
