# Payment Gate — Stan Store + Access Codes

> **Status**: Implemented
> **Decision**: Stan Store for payment, manual access codes for verification
> **Why not Stripe?** Coach Al chose Stan Store because it's already part of his workflow and a friend manages the account. See `docs/payment-gate-plan.md` for the original Stripe vs Stan Store comparison.

---

## How It Works (Big Picture)

Stan Store has **no API, no webhooks, no SDK** — just a browser link. So the app can't automatically know if someone paid. The solution: **one-time access codes** stored in Firestore, manually distributed by Coach Al after each sale.

```
User completes questionnaire → Payment Gate screen
  → User taps "Get Full Access" → opens Stan Store in browser
  → User pays on Stan Store
  → Coach Al sees the sale notification
  → Coach Al emails the buyer a unique access code
  → User returns to app, enters code
  → Code validated against Firestore (atomic transaction)
  → Unlocked → Results screen → Dashboard
```

This trades automation for simplicity — no Cloud Functions, no Blaze plan, no Stripe integration needed. The manual step is acceptable at Coach Al's current scale.

---

## The Access Code System

### How codes are created

Codes are **generated manually** by running a script. They do NOT auto-generate when users hit the payment wall. The wall just shows a code input — it expects a code that already exists in Firestore.

```bash
# Generate 50 codes
node scripts/generate-codes.js 50
```

This does three things:
1. Creates 50 unique `WELL-XXXX` codes
2. Writes each code to Firestore (`accessCodes/{code}` collection)
3. Appends codes to `generated-codes.txt` in the project root (for Coach Al to reference)

### Code format

```
WELL-XXXX
```

- Prefix: `WELL-` (always)
- Suffix: 4 characters from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`
- Ambiguous characters removed: no `0/O`, no `1/I/L` (prevents typos)
- ~810,000 possible combinations
- Each code is single-use

### What a code looks like in Firestore

Collection: `accessCodes`, Document ID = the code itself (e.g., `WELL-K7NP`)

```json
{
  "code": "WELL-K7NP",
  "used": false,
  "usedBy": null,
  "usedByEmail": null,
  "usedAt": null,
  "createdAt": "<server timestamp>",
  "batch": "2026-02-27_lq8x4m"
}
```

After redemption:

```json
{
  "code": "WELL-K7NP",
  "used": true,
  "usedBy": "user_lq8abc_x7km9p2f",
  "usedByEmail": "buyer@email.com",
  "usedAt": "<server timestamp>",
  "createdAt": "<server timestamp>",
  "batch": "2026-02-27_lq8x4m"
}
```

### How validation works

When a user enters a code, the app runs a **Firestore transaction** (atomic read + write to prevent race conditions):

| Scenario | Result |
|----------|--------|
| Code doesn't exist | "Invalid access code." |
| Code unused | Claim it — mark `used: true`, tie to userId + email |
| Code used by same userId | Allow (reinstall on same device) |
| Code used, but email matches | Allow + transfer userId (reinstall on new device) |
| Code used by different user | "This code has already been redeemed." |

The transaction prevents two people from redeeming the same code simultaneously.

### Rate limiting

Client-side: 5 failed attempts → 60-second cooldown timer. This is enforced in the PaymentGate component state (resets on app restart, which is fine — it's a deterrent, not a security boundary).

---

## User Flow (Detailed)

### First-time user (new install)

```
LANDING → WELCOME → 7 Intake Screens → SAFETY_NOTICE
  → finalizeAssessment() saves scores + sets intakeCompleted
  → Navigates to PAYMENT_GATE

PAYMENT_GATE (gate phase):
  - Lock icon, "You're almost there!"
  - "What You'll Get" feature list (scores are NOT shown yet)
  - "Get Full Access" button → opens Stan Store
  - "Already purchased?" → code input field

User enters valid code:
  → Firestore transaction validates + claims code
  → PAYMENT_GATE transitions to results phase

PAYMENT_GATE (results phase):
  - Trophy icon, "Welcome!"
  - 7 Pillar score bars revealed (the reward for paying)
  - Focus pillar highlighted
  - "Let's Go" button

User taps "Let's Go":
  → savePaidStatus(code) writes @al_paid + @al_access_code to AsyncStorage
  → User profile updated in Firestore (paid: true)
  → Navigates to DASHBOARD
```

### Returning user (already paid)

```
App launches → loadAllData()
  → @al_paid === "true" in AsyncStorage
  → Restores saved screen (Dashboard or wherever they left off)
  → No payment gate, no network check needed
```

### Returning user (intake done, not paid)

```
App launches → loadAllData()
  → intakeCompleted === true, paid === false
  → Screen guard forces PAYMENT_GATE regardless of saved screen
  → User must enter a code to proceed
```

### Dev mode ("Skip with Random Data")

```
WelcomeScreen → "Skip with Random Data"
  → handleRandomFill() sets paid: true automatically
  → Bypasses payment gate entirely
  → Goes straight to Dashboard
```

### Reset flow

```
Settings → Reset → clearAllData()
  → Clears @al_paid, @al_access_code, and all other data
  → Returns to LANDING
  → Full onboarding + payment gate required again
```

---

## Coach Al's Workflow

### Setup (one-time)

1. Run `node scripts/generate-codes.js 50` to generate an initial batch
2. Open `generated-codes.txt` — codes are listed with checkboxes:
   ```
   --- Batch: 2026-02-27_lq8x4m (50 codes) ---
   [ ] WELL-K7NP
   [ ] WELL-R3TM
   [ ] WELL-G8YW
   ...
   ```
3. Keep this file handy (printed or on computer)

### When a sale comes in

1. Stan Store sends Coach Al a sale notification email
2. Pick the next unused code from `generated-codes.txt`
3. Email (or text) the code to the buyer
4. Cross it off the list: `[X] WELL-K7NP`

### When codes run low

```bash
node scripts/generate-codes.js 50
```

New codes are **appended** to the same `generated-codes.txt` file under a new batch header. The script checks Firestore for duplicates before writing.

### Checking code status

Open Firebase Console → Firestore → `accessCodes` collection. Each code shows `used: true/false`, who used it, and when.

---

## Stan Store Link Configuration

### Where the link lives

```
constants.js → STAN_STORE_URL
```

Currently set to a placeholder:

```javascript
export const STAN_STORE_URL = "https://stan.store/coachal";
```

### ⚠️ UPDATE THIS when the Stan Store product is ready

1. Create the product on Stan Store (Coach Al's account)
2. Get the direct product link (format: `https://stan.store/coachal/p/product-slug`)
3. Update `constants.js`:

```javascript
export const STAN_STORE_URL = "https://stan.store/coachal/p/your-product-slug-here";
```

That's the only change needed. The PaymentGate component reads this constant and opens it via `Linking.openURL()`.

---

## Files Involved

| File | Role |
|------|------|
| `components/PaymentGate.js` | The gate screen (two phases: gate + results) |
| `lib/storage.js` | `PAID` + `ACCESS_CODE` keys, `savePaidStatus()`, loads paid status in `loadAllData()` |
| `lib/sync.js` | `validateAccessCode()` (Firestore transaction), `checkPaidStatus()` (Firestore read) |
| `constants.js` | `SCREENS.PAYMENT_GATE`, `STAN_STORE_URL` |
| `App.js` | `isPaid` state, screen guard, `handleCodeValidated`, `handleValidateCode`, route case |
| `scripts/generate-codes.js` | CLI tool to generate + upload codes to Firestore |
| `.gitignore` | `generated-codes.txt` excluded from git |

---

## Firestore Security Rules

The `accessCodes` collection should have these rules:

```
match /accessCodes/{code} {
  // Anyone can read (app needs to check if code exists)
  allow read: if true;

  // Codes can only transition from unused → used (no create, no delete from client)
  allow update: if resource.data.used == false
                && request.resource.data.used == true;

  allow create, delete: if false;
}
```

The `generate-codes.js` script writes codes using the client SDK (which bypasses security rules when run locally during development). For production, codes should be created via Firebase Admin SDK or directly in the console.

---

## Edge Cases

| Scenario | What happens |
|----------|-------------|
| User pays, loses code | Contacts Coach Al, who sends a new unused code |
| Uninstall + reinstall (same device) | Enter code again — userId match allows it |
| Reinstall on new device | Enter code again — email match transfers ownership |
| Code sharing attempt | Second person gets "This code has already been redeemed" |
| Offline, already paid | `@al_paid` in AsyncStorage — full access, no network needed |
| Offline, entering code | Firestore transaction fails → "Network error. Please check your connection" |
| 5 wrong code attempts | 60-second cooldown timer (client-side) |
| Dev mode random fill | Auto-sets `paid: true`, skips gate entirely |
| Existing user before payment gate was added | Screen guard catches them → PAYMENT_GATE on next app open |

---

## Future Considerations

- **Scale**: If Coach Al gets too many sales to email codes manually, consider the Stripe integration from `docs/payment-gate-plan.md`
- **Bulk verification**: Could add a script to check how many codes are used vs unused
- **Code expiration**: Not currently implemented, but could add a `expiresAt` field if needed
- **Price display**: The payment gate doesn't show a price — that's on Stan Store's page. If we want to show it in-app, add a `PRODUCT_PRICE` constant to `constants.js`
