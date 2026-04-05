# How to Re-enable the Payment Gate

The payment gate was disabled in changelog entry #88. This document explains exactly what was changed and how to revert it.

## What Was Changed (3 places in App.js, 1 in LandingPage.js)

### 1. App.js — Screen guard on load (around line 176)

**Current (free):**
```js
// Skip payment gate — app is free for now
setIsPaid(true);
if (data.screen) {
  if (data.screen === "PAYMENT_GATE" && data.intakeCompleted) {
    setCurrentScreen("DASHBOARD");
  } else {
    setCurrentScreen(data.screen);
  }
}
```

**Revert to (paid):**
```js
if (data.paid) setIsPaid(true);

// Screen guard: unpaid users with completed intake go to PAYMENT_GATE
if (data.screen) {
  if (!data.paid && data.intakeCompleted) {
    setCurrentScreen("PAYMENT_GATE");
  } else {
    setCurrentScreen(data.screen);
  }
}
```

### 2. App.js — finalizeAssessment (around line 420)

**Current (free):**
```js
// Skip payment gate — app is free for now
setIsPaid(true);
navigateTo("DASHBOARD");
```

**Revert to (paid):**
```js
navigateTo("PAYMENT_GATE");
```

### 3. App.js — Returning user modal (around line 1035)

**Current (free):** Modal says "We found your account! Your progress has been restored." with a "Continue" button that restores data and goes to DASHBOARD.

**Revert to (paid):** Modal says "An account with this email already exists. Please enter your access code to continue." with an "Enter Access Code" button that goes to PAYMENT_GATE:
```js
<Text style={overlayStyles.modalTitle}>Welcome Back!</Text>
<Text style={overlayStyles.modalBody}>
  An account with this email already exists. Please enter your access code to continue.
  {"\n\n"}
  If you've lost your code, reach out to Coach Al using the same email you registered with.
</Text>
<TouchableOpacity
  style={overlayStyles.modalButton}
  onPress={() => {
    setShowReturningUserModal(false);
    navigateTo("PAYMENT_GATE");
  }}
  activeOpacity={0.8}
>
  <Text style={overlayStyles.modalButtonText}>Enter Access Code</Text>
</TouchableOpacity>
```

### 4. LandingPage.js — Remove price display

Remove the two `priceRow` View blocks (one in hero section, one in final CTA section):
```jsx
<View style={styles.priceRow}>
  <Text style={styles.priceOld}>$50</Text>
  <Text style={styles.priceNew}>$0</Text>
  <View style={styles.priceBadge}>
    <Text style={styles.priceBadgeText}>FREE THIS MONTH</Text>
  </View>
</View>
```

Also remove the corresponding styles: `priceRow`, `priceOld`, `priceNew`, `priceBadge`, `priceBadgeText`.

### 5. App.js — Remove AssessmentResults screen route

When re-enabling the payment gate, the `ASSESSMENT_RESULTS` screen is no longer needed (PaymentGate has its own results phase). Remove:
- The `import { AssessmentResults }` line
- The `case "ASSESSMENT_RESULTS":` block in `renderScreen()`
- Change `navigateTo("ASSESSMENT_RESULTS")` back to `navigateTo("PAYMENT_GATE")` in `finalizeAssessment`

### 6. App.js — Revert email duplicate check (changelog #90)

**Current (loose):** Any existing email triggers returning user flow.

**Revert to (strict):** Only emails with `intakeCompleted` trigger returning user flow:
```js
if (existing && existing.intakeCompleted) {
```
(This was the original behavior because the payment gate handled incomplete accounts differently.)

## Files Involved

| File | What it does |
|------|-------------|
| `App.js` | Routes users through or past the payment gate |
| `components/PaymentGate.js` | The full payment gate UI (access code entry, Stan Store link) — untouched, still in codebase |
| `components/AssessmentResults.js` | Standalone results screen (added in #89) — can be deleted when reverting |
| `components/LandingPage.js` | Shows the $50/$0 pricing display |
| `lib/sync.js` | Contains `validateAccessCode` — untouched, still works |
| `constants.js` | Contains `STAN_STORE_URL` and `ASSESSMENT_RESULTS` screen constant |

## Email Verification (changelog #91)

The email verification system (`api/send-code.js`, `api/verify-code.js`, `api/_firebase.js`) is independent of the payment gate. When re-enabling the payment gate:

- **Keep email verification**: The verification modal in App.js would need to be updated so that after verification, users go to PAYMENT_GATE instead of DASHBOARD. The returning user modal would need the access code entry restored alongside the email verification.
- **Or remove it**: If reverting fully, remove the `api/` directory, the verification state/handlers in App.js, and the `/api/(.*)` route in vercel.json. The `verificationCodes` Firestore collection can be left as-is (no cleanup needed).

See `docs/email-verification.md` for full details on the email verification system.

## Access Codes

The access code system (`scripts/generate-codes.js`, `scripts/export-codes.js`, Firestore `accessCodes` collection) is fully intact. When re-enabling the payment gate, existing unused codes will still work. No cleanup needed.

## Quick Revert

Tell Claude: "Re-enable the payment gate. Revert the changes from changelog #88, #89, #90, and #91. See docs/revert-payment-gate.md and docs/email-verification.md for details."
