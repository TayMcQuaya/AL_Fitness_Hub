# Onboarding Flow

## Overview

The onboarding flow collects user profile data across multiple screens, calculates pillar scores, determines the user's weakest pillar as their focus, and gates access behind a payment wall. Returning users who enter an existing email skip the entire questionnaire.

## Screen Sequence

```
LANDING → WELCOME → INTAKE_PERSONAL → (account check)
  ├─ Returning user (paid)     → DASHBOARD
  ├─ Returning user (unpaid)   → PAYMENT_GATE
  └─ New user                  → INTAKE_DEMOGRAPHICS
                                  → INTAKE_GOALS
                                  → INTAKE_MOVEMENT
                                  → INTAKE_NUTRITION
                                  → INTAKE_BREATHING_SLEEP
                                  → INTAKE_MINDFULNESS
                                  → SAFETY_NOTICE
                                  → PAYMENT_GATE
                                  → DASHBOARD
```

## Returning User Detection

When a user enters their name and email in `IntakePersonal` and taps Continue:

1. Name and email are saved locally (AsyncStorage)
2. A loading overlay shows ("Setting up your profile...")
3. `findUserByEmail(email)` queries Firestore for an existing user doc
4. **If found with `intakeCompleted: true`:**
   - Local userId is swapped back to the original (one doc per email)
   - The orphaned new userId doc is deleted from Firestore
   - All profile data is restored to AsyncStorage and React state
   - The user's new name is preserved (overwrites the old name)
   - Navigation skips to Dashboard (if paid) or Payment Gate (if unpaid)
5. **If not found, incomplete, or offline:**
   - Normal onboarding continues from Demographics
   - Cloud sync fires to the new userId doc

### Why This Exists

Without this, a user who clears localStorage, switches browsers, or reinstalls the app would:
- Get a brand new userId
- Have to redo the entire 7-screen questionnaire
- End up with a duplicate Firestore doc for the same email

### What Gets Restored

| Data | Restored? |
|------|-----------|
| Name | New name from current session wins |
| Email, age, sex, weight, goalWeight | Yes |
| Goals, experience, injuries | Yes |
| Pillar scores, focus pillar | Yes |
| Payment status + access code | Yes |
| Challenge progress (streaks, completed days) | No — fresh start |
| Daily log history | No — fresh start |
| Book reading progress | No — fresh start |

Challenge/streak data is intentionally not restored. This ensures returning users can't game the 21-day challenge for refund eligibility by restoring old progress.

### Dedup Behavior

- One Firestore doc per email address
- `setUserId()` overwrites the local userId in AsyncStorage
- `userIdRef.current` is updated so all future syncs (daily logs, challenges, book progress) write to the original doc
- The orphaned doc created during `getOrCreateUserId()` is cleaned up via `deleteUserData()`

## Data Collected Per Screen

### IntakePersonal
- **Name** (required)
- **Email** (required) — used for returning user detection and Firestore queries

### IntakeDemographics
- **Age** — number
- **Sex** — male/female/other
- **Weight** — pounds
- **Goal weight** — pounds

### IntakeGoals
- **Goals** — array of selected goal strings
- **Experience** — fitness experience level
- **Injuries** — free text

### IntakeMovement
- Calculates **movement pillar score** (1-10)

### IntakeNutrition
- Calculates **nutrition pillar score** (1-10)
- Also contributes to **hydration score**

### IntakeBreathingSleep
- Calculates **breathing pillar score** (1-10)
- Calculates **sleep pillar score** (1-10)

### IntakeMindfulness
- Calculates **mindfulness pillar score** (1-10)
- Calculates **environment pillar score** (1-10)
- Triggers `finalizeAssessment()` — finds weakest pillar, sets as focus

### SafetyNotice
- No data collected — informational screen
- Navigates to Payment Gate

## Assessment Finalization

After the last intake screen (`IntakeMindfulness`), `finalizeAssessment()` in App.js:

1. Merges all pillar scores into one object
2. Finds the pillar with the lowest score (weakest)
3. Sets it as the user's `focusPillar`
4. Saves scores + focus to AsyncStorage
5. Marks `intakeCompleted: true`
6. Syncs everything to Firestore
7. Navigates to Payment Gate

## Payment Gate

- Blocks access to Dashboard until user enters a valid access code
- Access codes are validated via Firestore transaction (`validateAccessCode`)
- Supports reinstall: if a code was already used by the same email, it transfers ownership
- Once paid, `isPaid` is saved locally and synced to Firestore

## Persistence

All onboarding data is persisted at each step:
- **Locally** via AsyncStorage (through `lib/storage.js` save functions)
- **Cloud** via Firestore (through `lib/sync.js` fire-and-forget writes)

If the app crashes mid-onboarding, the user resumes from their last saved screen.

## Key Files

| File | Role |
|------|------|
| `App.js` | All intake handlers (`handleSaveName`, `handleSaveDemographics`, etc.), `finalizeAssessment()`, loading overlay |
| `lib/storage.js` | `saveName`, `saveEmail`, `saveDemographics`, `saveGoals`, `savePillarScores`, `restoreUserData`, `setUserId` |
| `lib/sync.js` | `syncUserProfile`, `syncPillarScores`, `findUserByEmail`, `validateAccessCode` |
| `components/IntakePersonal.js` | Name + email form |
| `components/IntakeDemographics.js` | Age, sex, weight form |
| `components/IntakeGoals.js` | Goals, experience, injuries form |
| `components/IntakeMovement.js` | Movement assessment sliders |
| `components/IntakeNutrition.js` | Nutrition assessment sliders |
| `components/IntakeBreathingSleep.js` | Breathing + sleep assessment sliders |
| `components/IntakeMindfulness.js` | Mindfulness + environment assessment sliders |
| `components/SafetyNotice.js` | Informational disclaimer |
| `components/PaymentGate.js` | Access code entry + validation |
