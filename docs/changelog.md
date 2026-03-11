# Session Log — Mar 11, 2026

## 79. Fix Book Chapter Next/Previous Navigation

Chapter next/previous buttons were refreshing the same chapter instead of advancing. Root cause: `onNavigate("CHAPTER_VIEW", id)` passed the chapter ID as a second argument, but `navigateTo` only accepted the screen name and ignored it — so `selectedChapterId` never updated.

### Fix
- **`App.js`** — ChapterView's `onNavigate` prop now intercepts `CHAPTER_VIEW` calls and updates `selectedChapterId` with the new chapter ID before re-rendering.

---

## 78. Disable DEV_MODE for Production

Set `DEV_MODE = false` in Dashboard and ChallengeDetail. Dev panels (phase jump, simulate day, reset buttons) are hidden from users.

### Modified
- **`components/Dashboard.js`** — `DEV_MODE = false`
- **`components/ChallengeDetail.js`** — `DEV_MODE = false`

WelcomeScreen was already `false`. Flip back to `true` for testing.

---

## 77. Weakest Pillar Tiebreaker — Priority by Pillar Order

When multiple pillars tie for the lowest score, the app now picks the one with the lowest index in the PILLARS array (higher priority). Previously the winner was arbitrary (depended on JS object key order).

### Priority order (on tie)
1. Breathing → 2. Sleep → 3. Hydration → 4. Nutrition → 5. Movement → 6. Environment → 7. Mindfulness

### Changes
- **`App.js`** — `finalizeAssessment` now iterates through `PILLARS` array order instead of `Object.entries(pillarScores)`. Uses strict less-than (`<`) so the first pillar encountered at the lowest score wins. Added `PILLARS` import from constants.

---

## 76. Safety Notice — Larger Fonts, Required Checkbox, Firestore Sync

Improved the Safety Notice screen for mobile readability and enforced the disclaimer checkbox.

### Changes
- **`components/SafetyNotice.js`** — Increased font sizes across the page: title (24→28), subtitle (14→16), coach name (14→16), coach message (12→14), disclaimer text (12→14), checkbox label (14→15), button text (14→16). Continue button is now disabled (grayed out, not tappable) until the checkbox is checked.
- **`App.js`** — `finalizeAssessment` now syncs `disclaimerAcceptedAt` timestamp to the user's Firestore doc (fire-and-forget, alongside pillar scores).

### Firestore
The user doc now includes `disclaimerAcceptedAt` (ISO timestamp string) after completing onboarding. This provides a record that the user accepted the legal disclaimer.

---

## 75. Intake Questionnaire Updates (Steps 5 & 7)

Three changes to the onboarding assessment:

### Step 5 — Nutrition & Hydration
- **Ultra-processed meals**: Added "None" option (score: 10) at the top. Switched from 2-column grid to full-width stacked rows (label left, description right) for balanced layout with 5 options.
- **Water intake**: Added "12+" toggle button below the 12-glass grid. Tapping it sets water to 13 (above max), displays "12+" in the label. Hydration scoring already handles `>= 10` → score 10.

### Step 7 — Mindfulness
- **Mindfulness practice**: Changed from Yes/Sometimes binary to **days per week** (0, 1, 2, 3, 4+) selector — exact same design as cardio in Step 4 (segmented `freqContainer` row)
- **Scoring updated**: 3+ days/wk = +3, 2 days = +2, 0–1 days = +1

### Modified
- **`components/IntakeNutrition.js`** — Added "None" to processedOptions, switched to `optionsList` stacked layout, added 12+ button with styles
- **`components/IntakeMindfulness.js`** — Replaced yes/sometimes with 0–4+ day selector using `freqContainer`/`freqButton` styles matching IntakeMovement, updated scoring logic
- **`docs/pillar-scoring.md`** — Updated Nutrition (added None→10), Hydration (added 12+), and Mindfulness (days-per-week scoring with new examples)

---

## 74. Skip Results Phase for Returning Users

Returning users who validate their access code now skip the pillar score results page and go straight to Dashboard. Previously they'd see a results page with default scores (all 5s) since data hadn't been restored yet.

### Changes
- **`components/PaymentGate.js`** — Added `isReturningUser` prop. When `true`, successful code validation calls `onCodeValidated` directly instead of showing the results phase.
- **`App.js`** — Passes `isReturningUser={pendingRestoreRef.current != null}` to PaymentGate.

---

## 73. Returning User Requires Access Code Before Restore

Fixed security issue where someone could guess an existing email and skip straight to the Dashboard without an access code. Now returning users must validate their access code before any profile data is restored.

### Flow
1. User enters email → Firestore finds existing account
2. "Welcome Back!" modal appears → directs user to enter access code
3. Code validates → profile data is restored → Dashboard
4. Without valid code → no data restored, no access

### Changes
- **`App.js`** — `handleSaveName` no longer restores data or sets `isPaid` on match. Instead stores pending data in `pendingRestoreRef` and shows a modal. `handleCodeValidated` now checks for pending restore data and applies it after successful code validation. Added `showReturningUserModal` state and modal UI.

### Security
- No profile data leaks until code is validated
- Access code acts as proof of ownership
- Attacker guessing an email only sees "account exists" modal, can't proceed without the code

---

## 72. Reset Success Confirmation Modal

Added a success modal after the soft reset completes, confirming to the user that their progress was reset while their profile and payment info are intact.

### Changes
- **`components/Dashboard.js`** — Added `showResetSuccess` state and a new modal with green checkmark icon. Shows after `onReset()` resolves. Single "Got It" dismiss button.

---

## 71. Loading Overlay for Account Check

Added a loading overlay ("Setting up your profile...") that shows while Firestore is queried during onboarding. Prevents the UI from appearing frozen while the returning-user check runs.

### Changes
- **`App.js`** — Added `isCheckingAccount` state, `ActivityIndicator` overlay rendered on top of current screen. Uses neutral copy ("Setting up your profile...") that works for both new and returning users.

---

## 70. Restore Returning User from Firestore (Single Account per Email)

If a user clears localStorage or reinstalls, they no longer have to redo the entire questionnaire. When they enter their email in IntakePersonal, the app checks Firestore for an existing profile, restores it, and reuses the original userId — preventing duplicate accounts.

### Flow
- Email found + intake complete + paid → restore data → Dashboard
- Email found + intake complete + unpaid → restore data → Payment Gate
- Email not found / intake incomplete / offline → continue normal onboarding

### Changes
- **`lib/sync.js`** — Added `findUserByEmail(email)` query function. Searches `users` collection by email (`limit(1)`), returns `null` if offline or not found. Added `query`, `where`, `limit` imports.
- **`lib/storage.js`** — Added `restoreUserData(data)` to bulk-save a Firestore profile to AsyncStorage via `multiSet`. Added `setUserId(id)` to overwrite the local userId.
- **`App.js`** — Updated `handleSaveName` to check Firestore **before** any cloud sync. If returning user found: swaps local userId back to the original, deletes the orphaned new doc, restores profile to AsyncStorage + React state, re-saves the new name (so name updates are respected), then navigates based on payment status. Cloud sync to a new doc only fires if no existing user is found.

### Dedup behavior
- One Firestore doc per email — returning user reuses original userId
- Orphaned new userId doc is deleted (fire-and-forget)
- If user enters a different name, the new name wins everywhere (AsyncStorage, state, Firestore)

### Not restored
- Challenge progress, streaks, and daily logs — returning users start fresh on challenges (correct for refund tracking).

---

## 69. Reset Tracking for Refund Eligibility

Added Firestore tracking when a user resets their progress, so Coach Al can verify 21-day challenge eligibility (no resets, no skipped days).

### Changes
- **`lib/sync.js`** — Added `syncUserReset()` that records `resetCount`, `resetHistory` (array of timestamps), and `lastResetAt` on the user doc. Preserves all existing Firestore data instead of deleting it.
- **`App.js`** — `handleReset` now calls `syncUserReset(userId)` instead of `deleteUserData(userId)`, keeping user history intact for review.
- **`scripts/export-users.js`** — Added "Resets" and "Last Reset" columns to the spreadsheet export so Al can check eligibility at a glance.

### How Al checks eligibility
- Export users → check **Resets** column (must be 0)
- Check **Days Logged** column (must be 21)

---

## 68. Task Text Review Doc for Coach Al

Generated a Word document (`exports/task-text-review.docx`) containing all 28 challenge tasks across 7 pillars for Coach Al to review and suggest text changes. Generator script at `scripts/generate-task-review.js`.

---

## 67. Declutter Zone — Wording Update

Updated task description from "your space" to "your living space" for clarity.

### Modified
- **`constants.js`** — Updated Declutter Zone description (1 instance)
- **`21-day-challenges.md`** — Updated all 3 phase references

---

## 66. Water Target — Hardcoded 12 Cups

Coach Al requested a flat 12 cups/day for all users instead of the weight-based formula.

### Modified
- **`lib/nutrition.js`** — `calculateWaterTarget()` now returns 12 instead of `(weightLbs * 0.5) / 8`

---

## 65. Nutrition Page — Estimates Disclaimer

Added a prominent notice below the calorie/protein cards clarifying that targets are estimates and users should consult Coach Al for precise numbers.

### Modified
- **`components/NutritionSummary.js`** — Added orange-themed disclaimer box with "Estimates Only" title between stats grid and Coach Al's Pillars section

---

## 64. "Burnout" → "Burnt Out" — Text Updates

Changed "burnout" to "burnt out" across user-facing copy per Coach Al's request.

### Modified
- **`components/LandingPage.js`** — 4 instances updated (hero subtitle, transition box, FAQ, about section)
- **`constants.js`** — Book chapter heading and intro text (2 instances)

---

## 63. LandingPage Avatar Circles Fix

Replaced broken `<Image>` avatars (external URLs failing on RN Web) with colored `<View>` circles matching the WelcomeScreen pattern.

### Modified
- **`components/LandingPage.js`** — Swapped `Image` elements with `View` circles using `colors.gray[400/500/600]`, renamed `avatarImage` style to `avatarCircle`

---

# Session Log — Mar 5, 2026

## 62. Sleep Scoring — Coach Al's Scale

Updated the sleep pillar scoring formula to use Coach Al's specified hours-to-score mapping. Wake energy remains as a secondary factor.

### New Hours Scale
| Hours | Score |
|-------|-------|
| 4 or less | 0 |
| 5 | 2.5 |
| 6 | 5 |
| 7 | 7.5 |
| 8+ | 10 |

### Formula Change
- **Before:** Additive point system — `1 + sleepPoints(0-4) + energyPoints(1-5)`, capped at 10
- **After:** Average of hours score (0-10) and energy score (raw 1-10 slider), rounded, clamped 1-10
- "I don't know" defaults to 5 (neutral midpoint) instead of +2 points

### Modified
- **`components/IntakeBreathingSleep.js`** — Rewrote `calculateSleepScore()` with Coach Al's hours scale and averaging formula
- **`docs/pillar-scoring.md`** — Updated Sleep section with new scale, formula, and examples table

---

## 61. Intake Movement — Weekly Frequency Labels

Coach Al requested the cardio and resistance training frequency questions explicitly state "Weekly" so users know the timeframe.

### Modified
- **`components/IntakeMovement.js`**:
  - "Resistance Training Frequency" → "Weekly Resistance Training"
  - "Cardio Training Frequency" → "Weekly Cardio Training"
  - Button labels remain "Days" (header provides the weekly context)

---

## 60. Live Stan Store + Calendly Links

Replaced all placeholder URLs with Coach Al's actual links.

### Stan Store → `https://stan.store/Althetrainer/p/the-50-accountability-challenge`
- **`constants.js`** — Updated `STAN_STORE_URL` (was `stan.store/coachal`)
- **`components/PaymentGate.js`** — Updated fallback error message to reference `stan.store/Althetrainer`
- Appears on: PaymentGate "Get Full Access" button (shown after completing the questionnaire)

### Calendly → `https://calendly.com/growyourmusclesstudio-info/30min`
- **`components/Dashboard.js`** — Updated 3 occurrences (Day 21 celebration, bottom CTA card, completion modal)
- **`components/ChallengeDetail.js`** — Updated 1 occurrence (completion modal)

---

## 59. Dev Controls — Time Simulation on ChallengeDetail

Added the same `-1 Day` / `+1 Day` / `Reset` time simulation controls from Dashboard to ChallengeDetail, so day advancement can be tested without switching screens.

### Modified
- **`App.js`** — Passes `onDevSimulate={handleDevSimulateDay}` to ChallengeDetail
- **`components/ChallengeDetail.js`** — Accepts `onDevSimulate` prop. Added time simulation button row and debug readout (`Start | Day | Done | Missed`) below existing phase jump buttons. Added `getMissedDays` import from storage, `completedDays`/`missedDays` derivation, and `devInfoText` style.

---

## 58. Fix: Modals Not Centering on Mobile Web

**Problem:** All modals (milestone triggers, video player, reset confirmation) were rendered inside the `ScrollView` in both Dashboard and ChallengeDetail. On mobile web, React Native's `<Modal transparent>` doesn't get proper full-viewport positioning inside a scroll container — the overlay gets constrained by the scroll content instead of covering the full screen, pushing the modal card down and cutting off the header.

**Fix:** Moved all modals outside the `ScrollView` to be siblings of it within the root `<View style={{flex: 1}}>` container, between `</ScrollView>` and `<BottomNav>`.

### Modified
- **`components/Dashboard.js`** — Moved 4 modals (Milestone, VideoPlayer, Completion, Reset) outside ScrollView
- **`components/ChallengeDetail.js`** — Moved 3 modals (Completion, Milestone, VideoPlayer) outside ScrollView

---

## 57. Challenge Completion Modal

Added a congratulatory modal that pops up when a user finishes their 21-day challenge, prompting them to book a free coaching call with Al.

### How it works
- Auto-triggers once when `currentDay` reaches 21 (via existing `useEffect` on day transitions)
- Confetti fires alongside it (existing behavior)
- Trophy icon + "Congratulations!" header
- Personalized message referencing their pillar challenge
- Green "Book Your Free Call with Al" CTA button (opens Calendly)
- "Maybe Later" dismiss link
- Won't re-trigger on subsequent visits — inline celebration cards handle that

### Modified
- **`components/Dashboard.js`** — Added `showCompletionModal` state, completion modal JSX with CTA, updated `useEffect` to show completion modal at Day 21 instead of milestone modal, added completion modal styles
- **`components/ChallengeDetail.js`** — Same: added `showCompletionModal` state, completion modal JSX, updated `useEffect`, added `Linking` import and completion modal styles

---

# Session Log — Mar 4, 2026

## Fix: VideoPlayerModal overflow on mobile web

**Problem:** After migrating to `expo-video`, the video modal overflowed the viewport on mobile web in portrait orientation. The video container was ~582px tall on a ~327px wide card, creating extra whitespace below the page and cutting off the video.

**Root cause:** Height calculation used `videoWidth * (16/9)` — a portrait ratio. The videos are **landscape** (16:9), so the multiplier should be the inverse: `9/16`.

### Changes (`components/VideoPlayerModal.js`)

1. **Fixed aspect ratio multiplier** (line 19)
   - Before: `videoWidth * (16 / 9)` → ~582px height (portrait ratio, wrong)
   - After: `videoWidth * (9 / 16)` → ~184px height (landscape ratio, correct)
   - Cap lowered from `screenHeight * 0.7` to `0.6` since the smaller height no longer needs the extra room

2. **Added maxHeight safety on card container** (line 46)
   - `maxHeight: screenHeight - 80` prevents the card (header + video) from ever exceeding the viewport
   - 80px accounts for safe area / status bar breathing room on both ends

### Verification
- `npm run web` → DevTools mobile view (iPhone SE or similar narrow portrait)
- Trigger Day 10 milestone → tap "Watch Video"
- Modal centered, video fully visible, no overflow below page
- Video plays at correct landscape proportions with native controls
- Resize browser wider/narrower — adapts responsively

---

## 56. Added Sleep Pillar Video

Added the final missing pillar video. All 7 pillars now have Coach Al videos for the Day 10 milestone.

### Added
- **`assets/videos/sleep.mp4`** (3.4 MB) — Sleep pillar video

### Modified
- **`constants.js`** — Added `sleep: require("./assets/videos/sleep.mp4")` to `PILLAR_VIDEOS`

---

# Session Log — Feb 22, 2026

## 1. Data Persistence Layer + Firebase Cloud Sync

**The big one.** Fixed the fundamentally broken data layer.

### Created
- `lib/firebase.js` — Firebase config (connected to `al-fitness-hub` project)
- `lib/storage.js` — Local persistence with `@al_` keys, date-aware streaks, calendar-enforced challenges, migration from v1
- `lib/sync.js` — Fire-and-forget Firestore writes for all user events
- `docs/data-layer-setup.md` — Full setup documentation

### Modified
- `App.js` — Replaced all raw AsyncStorage with storage/sync modules. Added handlers for demographics, goals, pillar scores. Daily log is now idempotent + date-aware.
- `IntakePersonal.js` — Now passes email upstream
- `IntakeDemographics.js` — Now passes age/sex/weight/goalWeight upstream
- `IntakeGoals.js` — Added injuries state, wired TextInput, passes all data upstream

### Firebase Setup
- Created Firebase project `al-fitness-hub`
- Registered web app, got config keys
- Created Firestore database
- Deployed open security rules (MVP)

---

## 2. Bug Fix: Firebase Install (WSL/Windows)

Firebase installed from WSL corrupted `package.json` inside `node_modules/firebase`. Reinstalled from Windows PowerShell to fix.

Also removed `proto-loader-gen-types` symlink in `.bin` that caused EACCES permission error (gRPC CLI tool not needed at runtime).

---

## 3. Removed "Upgrade to Pro" from Dashboard

Removed the `Upgrade to Pro` link and lock icons from the pillars section on the home page. Renamed section to "Other Pillars".

---

## 4. Landing Page — Responsive Pillars

The 7 pillars grid used a fixed width from `Dimensions.get("window")` captured once at import. Didn't adapt on mobile.

**Fix:**
- Switched to `useWindowDimensions` (reactive)
- Changed pillars from 2-column grid to vertical stack (each pillar = horizontal row with icon + text)
- Made features grid responsive (1 col on narrow, 2 on wide)
- Book section stacks vertically on very narrow screens


## 5. Light/Dark Mode Toggle

Full theme system implementation. App was dark-mode-only; now supports both with dark as default.

### Created
- `styles/ThemeContext.js` — React Context with `ThemeProvider` and `useTheme()` hook returning `{ colors, isDark, toggleTheme }`

### Major Rewrite
- `styles/theme.js` — Defined dual palettes (`darkColors` / `lightColors`) with identical key structure. Added semantic tokens: `text`, `textSecondary`, `textMuted`, `textInverse`, `divider`, `overlay`, `overlayLight`, `overlayMedium`, `cardOverlay`, `scrim`. Light palette inverts the gray scale so existing `gray[400]`/`gray[500]` references auto-map correctly. Backward-compat aliases (`backgroundDark`, `surfaceDark`, `white`, `black`) kept.

### Modified
- `lib/storage.js` — Added `THEME` key, `saveTheme()` export, theme field in `loadAllData()`
- `App.js` — Added `isDark` state, `toggleTheme` function, `ThemeProvider` wrapper, dynamic `StatusBar` barStyle, persists preference via AsyncStorage
- **All 23 component files** — Migrated from static `import { colors }` to `useTheme()` hook + `useMemo(() => makeStyles(colors), [colors])` factory pattern. Replaced `backgroundDark` → `background`, `surfaceDark` → `surface`, `colors.white` (text) → `colors.text`, `colors.black` (button text) → `colors.textInverse`, hardcoded `rgba(255,255,255,...)` → semantic tokens

### Theme Toggle Placement
- **Dashboard** — Sun/moon icon replaces notification bell in header
- **Landing Page** — Toggle next to "Get Started" button in header
- **All 7 intake steps + Safety Notice** — Toggle in top-right header (replaces empty spacer)

### Design Decisions
- Decorative/pillar colors (`#60A5FA`, `#A78BFA`, etc.) kept as-is in both modes
- Meal category colors (`#f97316`, `#6366f1`, etc.) kept as-is
- Text on colored buttons (green primary, orange CTA) stays literal white — correct on both backgrounds
- Image overlay rgba values kept as-is (always on dark image scrim)
- `ProgressSummary.js` and `SettingsScreen.js` not migrated (dead code per plan)

---

## 6. Intake Form Data Persistence (Back Navigation)

Previously, going back during the questionnaire reset all form data. Now all intake answers are preserved when navigating back.

### How it works
- `App.js` — Added `intakeData` state object. Each intake handler saves raw form data on forward navigation.
- All 7 intake components — Accept `initialData` prop, initialize `useState` from it with `??` fallback to defaults. Steps 4-7 pass raw form data as additional last argument to `onNext`.

### Files Modified
- `App.js` — `intakeData` state, updated all intake handlers and `renderScreen` cases to pass `initialData`
- `IntakePersonal.js` — Accepts `initialData`, inits `name`/`email` from it
- `IntakeDemographics.js` — Accepts `initialData`, inits `sex`/`age`/`weight`/`goalWeight`, passes raw strings as second arg to `onNext`
- `IntakeGoals.js` — Accepts `initialData`, inits `selectedGoals`/`experience`/`injuries`
- `IntakeMovement.js` — Accepts `initialData`, inits all 8 state vars, passes form data object with score
- `IntakeNutrition.js` — Accepts `initialData`, inits `processedFreq`/`water`, passes form data with scores
- `IntakeBreathingSleep.js` — Accepts `initialData`, inits all 6 state vars, passes form data with scores
- `IntakeMindfulness.js` — Accepts `initialData`, inits all 6 state vars, passes form data with scores

---

## 7. Light Mode Fix: Water Drop Visibility

Inactive water drops on Step 5 (IntakeNutrition) used `colors.overlay` which was `rgba(0,0,0,0.06)` in light mode — nearly invisible.

**Fix:** Changed inactive drop color from `colors.overlay` to `colors.gray[600]` — visible in both modes.

---

## 8. Safety Notice: Legal Disclaimer Visibility

The "Legal Disclaimer" title blended into the card in both modes.

**Fix:** Increased font size 12→16, weight 700→800, changed color from `gray[500]` to `colors.warning` (orange), added gavel icon next to title with a `disclaimerTitleRow` flex container.

---

## 9. Intake Steps 4 & 6: Spacing Tightened

Steps 4 (Movement) and 6 (Breathing & Sleep) required scrolling to see all content.

### Spacing Reductions (both files)
- Section margin: 40→24px
- Section header margin: 16→12px
- Title margin: 32→20px (Movement), titleSection margin: 32→20px + marginTop 16→8px (BreathingSleep)
- Slider card padding: 24→16px
- Slider margin-top: 16→8px
- Steps value font: 48→36px (Movement), 40→32px (BreathingSleep)
- Footer and button size kept consistent with other steps (height 64, padding 24/32)

---

## 10. Pillar Scoring Overhaul + Live Pillar Display

Redesigned all 7 pillar scoring formulas and wired real scores to the Pillars screen. Previously the Pillars screen showed hardcoded fake numbers — now it displays your actual onboarding answers.

**What changed:**
- Fixed a bug where the Mindfulness score was **inverted** (stressed users scored high, peaceful users scored low)
- The "Do you practice mindfulness?" question was collected but never used — now it factors into the score
- Widened scoring ranges for all pillars (most were stuck in a 3-point range like 4–7, now use the full 1–10 scale)
- Pillars screen now shows dynamic scores, a real average balance, auto-detected weakest pillar hint, and status labels based on your actual score
- Removed hardcoded scores/statuses from the PILLARS constant

**Full scoring details:** See [`docs/pillar-scoring.md`](./pillar-scoring.md)

**Files modified:** `IntakeMovement.js`, `IntakeNutrition.js`, `IntakeBreathingSleep.js`, `IntakeMindfulness.js`, `constants.js`, `PillarsOverview.js`, `App.js`

---

## 11. Firebase User Deletion Script

Admin script to completely remove a user's data from Firestore by email address.

### Created
- `scripts/delete-user.js` — Queries Firestore for user documents matching an email, shows matches with confirmation prompt, then deletes the user document and all subcollections (`dailyLogs`, `challengeProgress`, `challengeTasks`, `bookProgress`)

### Usage
```bash
node scripts/delete-user.js user@example.com
```

---

## 12. README

Added `README.md` to project root with project overview, setup/run instructions, and script usage documentation.

---

## 13. Personalized Nutrition Targets

The Nutrition and Quick Meal Log screens were static mockups — every number was hardcoded ("2,100 kcal", "140g protein", "Goal: Weight Loss", "Fueling your day, Sarah!"). Now they show real personalized targets calculated from the user's onboarding data.

**How it works:** The app already collected weight, age, sex, goals, and experience during onboarding but `App.js` never loaded them back into state after a restart and never passed them to the nutrition screens. This change adds a calculation utility and wires everything together.

### Created
- `lib/nutrition.js` — Pure calculation utility using the Mifflin-St Jeor equation. Computes BMR → TDEE → calorie/protein/fiber/water targets based on the user's body stats, goals, and experience level. Handles goal priority (fat > muscle > maintenance), calorie floors (1,500M / 1,200F), and gracefully returns `null` when data is missing.
- `docs/nutrition-targets.md` — Full documentation with formulas, worked examples, and a 5-profile comparison table

### Modified
- `App.js` — Added 6 new state variables (`userAge`, `userSex`, `userWeight`, `userGoalWeight`, `userGoals`, `userExperience`). Wired into `loadSavedData()` (restore on mount), `handleSaveDemographics()`, `handleSaveGoals()`, `handleRandomFill()`, `handleReset()`. Passes props to both nutrition screens.
- `NutritionSummary.js` — Accepts new props, computes targets via `useMemo`, replaces hardcoded calories/protein/fiber/goal badge with real values. Added water target card. Progress bars show 0% with "Log meals to track progress" hint. Shows `--` when data is missing.
- `NutritionLog.js` — Accepts new props, fixes hardcoded "Sarah!" greeting to use `userName`, replaces fake meal entries with empty state UI ("No meals logged yet"), Coach Al's tip now shows personalized calorie/protein/water targets.

**Full calculation details:** See [`docs/nutrition-targets.md`](./nutrition-targets.md)

---

## 14. Discount Code Copy Button

The 15% off coaching discount code (`PILLAR15`) shown on challenge days 15–20 was plain text with no way to copy it. Added a copy-to-clipboard button.

### What changed
- `ChallengeDetail.js` — The code text is now bolded inline. Below it, a "Copy Code" button copies `PILLAR15` to the clipboard on tap, then shows a green checkmark + "Copied!" for 2 seconds before resetting.

### Added dependency
- `expo-clipboard` — Expo's cross-platform clipboard API (iOS, Android, Web)

---

## 15. Light/Dark Toggle on All Remaining Screens

Extended the theme toggle to every screen that was still missing it. The sun/moon icon now appears in the top-right header slot on all screens.

### Modified
- `MeditationList.js`, `BookScreen.js`, `ChallengeProgress.js`, `ChallengeDetail.js` — First batch: replaced empty `width: 40` spacer with theme toggle
- `NutritionSummary.js`, `NutritionLog.js`, `SupportScreen.js`, `PillarsOverview.js` — Second batch: same treatment
- `ChapterView.js` — Added toggle alongside the existing bookmark button in the header

---

## 16. Fix: Missing Bottom Navigation on Meditate Screen

The Meditate screen (`MeditationList.js`) never imported or rendered `BottomNav`, so the tab bar disappeared when navigating there.

**Fix:** Added `BottomNav` import and rendered it with `currentScreen="MEDITATION_LIST"`. Added `paddingBottom: 120` to content so it scrolls clear of the nav bar. The Meditate tab highlights correctly since it was already defined in `BottomNav.js`.

---

## 17. Nutrition: Commented Out Fake Progress Tracking

The Nutrition Summary stat cards (Daily Calories, Daily Protein) showed a progress bar stuck at 0% and a "Log meals to track progress" hint — but meal logging isn't implemented, so this was misleading.

**Fix:** Commented out the `progressBar`, `progressFill`, and `progressHint` elements in `NutritionSummary.js`. The stat cards now show targets only without implying tracking exists.

---

## 18. Meditation: "Coming Soon" Modal

Tapping any meditation card (Breath Awareness, Present Moment, Grounding & Space) previously tried to navigate to a meditation player that doesn't exist yet.

**Fix:** Added a "Coming Soon" modal in `MeditationList.js`. Tapping any card now shows a centered modal with a meditation icon, "Coming Soon" title, message about sessions being crafted by Coach Al, and a "Got It" dismiss button. Cards no longer call `onSelectMeditation`.

---

## 19. Unified Dashboard Check-in with 21-Day Challenge System

The Dashboard check-in and the 21-day challenge system were completely disconnected. The Dashboard showed one static action (e.g., "Nose Breathing") and incremented a generic streak counter unrelated to challenges. The real challenge progression only lived in ChallengeDetail. Now the Dashboard displays actual challenge tasks and the log button completes them all at once, syncing directly with the challenge system.

### `lib/storage.js`
- **`advanceChallengeDay`** — Prevented unchecking completed tasks. Once a task is checked for today, tapping it again is a no-op (returns `pillarState` unchanged). Removed the toggle-off branch.
- **`bulkCompleteChallengeTasks`** (new) — Marks all available tasks for `currentDay` as completed in one shot. Advances `currentDay` by 1 if eligible (same calendar-enforcement: max 1 per day, cap at 21). Updates streak, completedDays, lastCompletionDate. Returns updated pillarState. Used by Dashboard's log button.

### `App.js`
- **`handleDashboardLog`** (new) — Calls `bulkCompleteChallengeTasks`, updates `challengeStates`, persists to AsyncStorage, keeps generic streak in sync via `logToday()`, fire-and-forget syncs to Firebase (challengeProgress + challengeTasks + dailyLog).
- **Dashboard render** — Replaced `isLoggedToday`/`streak` props with `challengeState={challengeStates[focusPillar]}` and `onToggleLog={handleDashboardLog}`. Added `onSetDay` prop for dev controls.

### `components/Dashboard.js`
- **Props change** — Accepts `challengeState` and `onSetDay` instead of `isLoggedToday`/`streak`. Derives both internally from challenge data.
- **Task list** — Replaced single static action card with real task list from `TWENTY_ONE_DAY_CHALLENGES`. Shows each unlocked task with name, description, and check/circle status. Tasks are read-only (no individual tap) — the log button handles all at once.
- **Day counter** — Shows `Day {currentDay}/21` from challenge state instead of generic streak.
- **Progress bar** — Added thin progress bar + "{N} days logged" label inside the check-in card.
- **Completion state** — When `currentDay >= 21`, shows trophy + completion message instead of tasks.
- **Log button** — Now reads "Log Today's Tasks" / "All Tasks Logged". Disabled after logging.

### `components/ChallengeDetail.js`
- **Uncheck guard** — Completed tasks no longer respond to taps. `onPress` is a no-op when `completed === true`, `activeOpacity` set to 1 so they don't visually respond.

---

## 20. Dashboard Dev Panel (Phase Jump)

Added DEV_MODE controls to Dashboard matching ChallengeDetail's existing dev panel, so day advancement can be tested without navigating away.

- Red-tinted bar at top with P1/P2/P3/P4/D21 jump buttons
- Current phase button highlighted green
- Only renders when `DEV_MODE = true` and `onSetDay` prop is provided
- Calls `handleSetChallengeDay(focusPillarId, day)` for the user's focus pillar

---

## 21. Dashboard Milestone Triggers + Confetti

Ported all challenge milestone triggers from ChallengeDetail to Dashboard and added confetti animation for celebration.

### Trigger Cards (below check-in card)
- **Day 5–9**: Phase 1 encouragement — pillar-specific motivational message
- **Day 10–14**: Mid-Challenge Video — prompt to watch Coach Al's tips
- **Day 15–20**: 15% Off Coaching — shows `PILLAR15` code with copy-to-clipboard button (uses `expo-clipboard`)
- **Day 21+**: Full celebration card — cherry-on-top challenge name/description, rewards list, "Schedule Your Free Session" button linking to Calendly

### Confetti Overlay
- 24 animated pieces (mix of squares and circles) in brand colors (`#13ec13`, `#ec7f13`, `#FFD700`, `#FF6B6B`, `#4ECDC4`, `#A78BFA`)
- Falls from top with horizontal drift, rotation, and fade-out using React Native `Animated` API
- No extra dependencies
- Fires on two occasions:
  1. Tapping "Log Today's Tasks" (immediate reward feedback)
  2. When `currentDay` hits a milestone (5, 10, 15, 21) — e.g., via dev panel phase jumps

### New imports added to Dashboard
- `useState`, `useRef`, `useEffect` from React
- `Animated`, `Dimensions` from react-native
- `expo-clipboard` for discount code copy
- `DAY_21_CHALLENGES`, `DAY_21_REWARDS`, `PHASE_ENCOURAGEMENT` from constants

---

## 22. Other Pillars Visibility Fix

The "Other Pillars" grid on the Dashboard was too faded to read in both light and dark mode.

### Changes
- **Opacity**: `0.5` → `0.75`
- **Icon color**: `gray[500]` → `gray[400]` (brighter in both themes — the gray scale is inverted between dark/light modes so `gray[400]` maps to a more visible shade in each)
- **Label font size**: `8px` → `9px` for better readability

---

## 23. Removed "Coming Soon" Locked Tasks from ChallengeDetail

Removed the "Coming Soon" section that previewed locked/upcoming tasks in `ChallengeDetail.js`. Users now only see their currently available tasks — no spoilers for future phases. Also removed the unused `lockedTasks` variable and associated styles (`lockedTaskCard`, `lockedTaskCheckbox`, `lockedTaskName`, `lockedTaskDescription`, `unlockBadge`, `unlockBadgeText`).

---

## 24. Reset Intro Flow — Dev Only

Moved the "Reset Intro Flow" button on the Dashboard behind the `DEV_MODE` flag. Normal users no longer see it — only visible during development alongside the phase jump panel.

---

## 25. Hide "Skip with Random Data" Button

Set `DEV_MODE = false` in `WelcomeScreen.js`. The "Skip with Random Data (Dev)" button is now hidden from users. All underlying logic (`onRandomFill`, `handleRandomFill` in App.js) remains intact — flip `DEV_MODE` back to `true` to re-enable.

---

## 26. Coach Al Photo on Landing Page

Added Coach Al's actual photo to the Landing Page "Meet Your Coach" section. Reverted WelcomeScreen back to its original picsum placeholder + "High Intensity" badge.

### Changes
- `LandingPage.js` — Replaced gray circle placeholder in the "About Coach Al" section with `require("../assets/al-coach.png")`. Increased image container height from 160→220px for better photo display. Added `aboutImage` style with `resizeMode: "cover"`.
- `WelcomeScreen.js` — Reverted hero image back to `picsum.photos/400/360` placeholder and restored "High Intensity" badge with bolt icon.
- `assets/al-coach.png` — Already copied from Desktop in previous step.

---

## 27. Lock Non-Focus Pillars in 21-Day Challenges

Only the user's weakest pillar (determined by the onboarding questionnaire) is unlocked in the Challenge Progress screen. All other pillars are locked until the focus pillar's 21-day challenge is completed.

### Changes
- `App.js` — Passes `focusPillar` prop to both `ChallengeProgress` renders.
- `ChallengeProgress.js`:
  - Accepts new `focusPillar` prop
  - Non-focus pillars render as locked: 55% opacity, lock icon replacing pillar icon, "Complete your focus pillar first" subtitle, no stats row, progress bar shows "—"
  - Locked cards are not tappable (no-op `onPress`, `activeOpacity: 1`)
  - Already-completed pillars remain visible and tappable regardless of focus
  - Updated info card text to explain the sequential unlock flow
  - New styles: `challengeCardLocked`, `challengeIconLocked`, `lockedText`, `lockedSubtext`

---

## 28. Fix Dashboard Over-Scroll

Dashboard ScrollView had excessive bottom padding (100px) causing extra white space past the last content. Reduced `paddingBottom` from 100 to 70 in `contentContainer` style — still clears the BottomNav without the dead space.

---

## 29. Calendar-Based Auto-Advance + Missed Days Tracking

Challenge day no longer increments on task completion. Instead, `currentDay` is driven by the real calendar via `startDate`.

### `lib/storage.js`
- **`autoAdvanceChallengeDay()`** (new) — On app load, calculates `calendarDay = min(21, daysBetween(startDate, today) + 1)`. If `calendarDay > currentDay`, updates `currentDay`. Called for every pillar in `loadSavedData()`.
- **`getMissedDays()`** (new) — Returns `max(0, pastDays - completedDays)` where `pastDays = effectiveDay - 1`. Uses `Math.max(currentDay, calendarDay)` as `effectiveDay` so it works for both real calendar users and dev-simulated days.
- **`advanceChallengeDay`** — Removed `currentDay` increment. Task completion now only updates `completedTasks`, `completedDays`, `streakDays`, `lastCompletionDate`.
- **`bulkCompleteChallengeTasks`** — Same: removed `currentDay` increment.
- **`startDate`** — Set once on first task completion (`startDate: pillarState.startDate || today`), never modified after.

### `App.js`
- `loadSavedData()` — Runs `autoAdvanceChallengeDay()` for each pillar on mount. Persists if any day advanced.

### `components/Dashboard.js`
- Imports `getMissedDays` from storage
- Displays missed days count in progress row: `"X days logged  •  Y missed"`
- Warning banner when `missedDays > 0 && !isLoggedToday`: "You missed X day(s)." with encouragement text on a new line (hidden on Day 21)
- Banner uses `marginTop: 4`, warning-amber icon, orange tinted `missedBanner` style

**Full logic details:** See [`docs/challenge-day-logic.md`](./challenge-day-logic.md)

---

## 30. Dev Testing Controls — Time Simulation

Added in-app controls to simulate time passing for the 21-day challenge without waiting real calendar days.

### `App.js`
- **`handleDevSimulateDay(pillarId, action)`** (new) — Three actions:
  - `forward1`: Increments `currentDay` by 1, clears today's `completedTasks` and `lastCompletionDate` so tasks appear unchecked and next log counts fresh
  - `back1`: Decrements `currentDay` by 1, decrements `completedDays`, clears today's tasks
  - `reset`: Full reset to Day 1 — `startDate = today`, all counters zeroed, also resets global streak/totalDaysLogged/logHistory
- **Critical rule**: `startDate` is NEVER modified by `forward1`/`back1`. Only `reset` sets it.
- Dashboard receives `onDevSimulate`, `streak`, `totalDaysLogged` props

### `components/Dashboard.js`
- New "DEV: Time Simulation" section in dev panel with `-1 Day`, `+1 Day`, `Reset` buttons
- Debug readout below buttons: `Start: date | Day: X/21 | Done: X | Missed: X` and `Streak: X | Total Logged: X`
- Uses `devInfoText` style: monospace, 10px, red, centered

**Full details:** See [`docs/dev-mode.md`](./dev-mode.md)

---

## 31. Milestone Trigger Stacking + Delayed Dismissal

Reworked milestone triggers (Day 5/10/15) so they persist across missed days and stay visible for the entire day the user logs — only dismissed on the **next day transition**.

### `lib/storage.js`
- **`TRIGGER_MILESTONES = [5, 10, 15]`** — Constant for trigger day thresholds
- **`acknowledgeMilestones(lastLoggedDay, existing)`** (new, exported) — Returns updated `acknowledgedMilestones` array with all milestone days <= `lastLoggedDay` added. Has a null guard: returns existing array unchanged if `lastLoggedDay` is null.
- **`advanceChallengeDay` / `bulkCompleteChallengeTasks`** — No longer call `acknowledgeMilestones`. Instead, set `lastLoggedChallengeDay = currentDay` when all tasks are completed.
- **`autoAdvanceChallengeDay`** — Now runs `acknowledgeMilestones(lastLoggedChallengeDay, existing)` when `currentDay` advances. This is where triggers actually get dismissed.

### `App.js`
- **`buildInitialChallengeStates()`** — Added `acknowledgedMilestones: []` and `lastLoggedChallengeDay: null` to initial challenge state shape
- **`handleDevSimulateDay` `forward1`** — Runs `acknowledgeMilestones` on advance (mirrors `autoAdvanceChallengeDay`)
- **`handleDevSimulateDay` `reset`** — Clears `lastLoggedChallengeDay: null`
- Imports `acknowledgeMilestones` from `lib/storage.js`

### `components/Dashboard.js`
- Triggers use `!ackMilestones.includes(5/10/15)` instead of day-range checks
- If user misses multiple days, triggers **stack**: e.g., skipping from Day 4 to Day 11 shows both Day 5 and Day 10 triggers simultaneously
- Triggers stay visible for the day the user logs, dismissed next day
- Regular triggers hidden on Day 21 (`!isCompleted && ...`) — recap takes over

---

## 32. Day 21 Recap Section

On challenge completion (Day 21), three recap cards always appear below the "Schedule Your Free Session" button, regardless of acknowledgment status.

### Cards (in order)
1. **"Look How Far You've Come!"** — Generic motivational message: "21 days of showing up for yourself — that takes real commitment. You've built habits that can last a lifetime. Coach Al is proud of you!" (not pillar-specific)
2. **"Watch Your Motivation Video"** — Coach Al's message for continuing the journey beyond the challenge
3. **"Your Coaching Discount"** — `PILLAR15` code with copy-to-clipboard button

### Why generic text?
The Day 5 trigger uses `PHASE_ENCOURAGEMENT[pillarId]` which references specific habits ("5 days of consistent sleep habits"). This doesn't fit a Day 21 recap, so the completion version uses a universal message that works for all pillars.

### Duplicate prevention
Regular triggers (Days 5/10/15) add `!isCompleted &&` to their conditions, so they're hidden on Day 21. Only the recap versions render — no duplicates.

---

## 33. Day 5 Trigger Label Rename

Changed the Day 5 milestone trigger label from "Phase 1 Complete!" to **"You're Building Momentum!"** — more motivational, doesn't reference phase numbers.

---

## 34. Missed Days Banner — Line Break

Split the missed days warning banner text into two lines:
- Line 1: `"You missed X day(s)."`
- Line 2: `"No worries — check in today to keep going!"` (hidden on Day 21)

Uses `\n` in the template literal for the line break.

---

## 35. Documentation

### Created
- **`docs/dev-mode.md`** — Full reference for dev testing controls: activation, button behaviors, handler implementation, critical design rules, props, styles, testing workflow
- **`docs/challenge-day-logic.md`** — Comprehensive reference for the entire challenge system: state shape, calendar vs dev advancement, task completion flow, startDate immutability, missed days calculation, streak logic, milestone triggers, phase system, confetti, data flow, key invariants

---

## 36. Sync Missed Days + Milestone State to Firestore

Added three new fields to `syncChallengeProgress` in `lib/sync.js` so challenge milestone and missed day data is tracked in the cloud.

### New fields in `users/{userId}/challengeProgress/{pillarId}`
- **`missedDays`** — Calculated at sync time: `currentDay - 1 - completedDays`
- **`acknowledgedMilestones`** — Array of dismissed trigger days (e.g., `[5, 10, 15]`)
- **`lastLoggedChallengeDay`** — The `currentDay` value when user last completed all tasks (used for delayed trigger dismissal)

No Firestore config changes needed — Firestore is schemaless, new fields appear automatically.

---

## 37. Streak Logic Documentation

Created dedicated documentation for the two independent streak systems.

### Created
- **`docs/streak-logic.md`** — Comprehensive reference covering both streak counters: challenge `streakDays` (per-pillar, resets to 1 on gap, no passive reset on load) and global `streak` (whole app, resets to 0 on load, capped at 21, Dashboard-only). Includes comparison table, trigger tables, example flows, the ChallengeDetail gap (doesn't update global streak), and related state fields.

---

## 38. Meditation Audio Player

Replaced the "Coming Soon" modal on the Meditation List with a fully functional audio player. Users can now listen to Coach Al's three guided meditation recordings directly in the app.

### Assets Added
- `assets/meditation-1.mp3` (~4.9 MB) — Breath Awareness recording
- `assets/meditation-2.mp3` (~6.7 MB) — Present Moment recording
- `assets/meditation-3.mp3` (~6.0 MB) — Grounding & Space recording
- `assets/al-med.png` (~2.7 MB) — Album art (illustrated Coach Al meditating)

### New Dependency
- **`expo-av`** — Expo's audio module for `Audio.Sound` playback

### Created
- **`components/MeditationPlayer.js`** — Full audio player screen with:
  - Album art display (240x340 portrait, rounded corners, shadow)
  - Title, pillar label, and description
  - Play/pause/replay button (green circle, icon swaps per state)
  - Skip forward/back 15 seconds
  - Seek slider with `isSeekingRef` to prevent position jumps during drag
  - `mm:ss` time labels for position and duration
  - Loading spinner while audio loads
  - `useEffect` cleanup unloads sound on navigate away
  - Light/dark theme via `makeStyles(colors)` pattern
- **`docs/meditation-player.md`** — Full feature documentation

### Modified
- **`components/MeditationList.js`** — Removed `useState`/`Modal` imports, `showComingSoon` state, the entire Coming Soon `<Modal>` block and its styles. Added `audioFile` key (`'meditation-1'`, `'meditation-2'`, `'meditation-3'`) to each meditation in the `MEDITATIONS` array. Changed card `onPress` from `setShowComingSoon(true)` to `onSelectMeditation(meditation)`.
- **`App.js`** — Added `MeditationPlayer` import. Added `selectedMeditation` state (near `selectedWorkout`). Updated `MEDITATION_LIST` case to set state + navigate on selection. Added `MEDITATION_PLAYER` routing case with fallback to list if no selection. Added `setSelectedMeditation(null)` in `handleReset()`.

---

## 39. Removed NutritionLog (Non-Functional)

Removed the Quick Meal Log screen. It had scaffolded UI (meal type buttons, favorite meals grid) but no actual functionality — `todaysMeals` was hardcoded as an empty array and nothing saved or tracked meals.

### Deleted
- **`components/NutritionLog.js`** — Entire file removed

### Modified
- **`App.js`** — Removed `NutritionLog` import and `NUTRITION_LOG` route case
- **`constants.js`** — Removed `NUTRITION_LOG` from `SCREENS` object
- **`docs/nutrition-targets.md`** — Removed "Quick Meal Log Screen" section referencing the deleted component

---

## 40. Daily Tasks UI — Larger Fonts & Heading

Made challenge tasks more prominent and readable on both Dashboard and ChallengeDetail.

### Modified
- **`components/Dashboard.js`** — Added centered "DAILY TASKS" heading (fontSize 26, fontWeight 900, letterSpacing 2). Task name fontSize increased to 20 (fontWeight 800). Task description fontSize increased to 18 (fontWeight 500, color changed from muted gray to `colors.text`). Checkbox increased to 32px.
- **`components/ChallengeDetail.js`** — Same changes: "DAILY TASK(S)" heading (dynamic plural), task name fontSize 20, task description fontSize 18, checkbox 32px with borderRadius 10.

---

## 41. Milestone Triggers — Converted to Modal

Replaced the inline trigger cards (Day 5 encouragement, Day 10 video, Day 15 discount) with a prominent modal window on both Dashboard and ChallengeDetail.

### What Changed
- **Inline cards removed** — The 3 conditional trigger card blocks that sat in the scroll content are gone
- **Milestone indicator pill** — A gold-accented touchable row ("X Milestone(s) Unlocked") appears in the scroll content. Tapping it reopens the modal
- **Modal window** — Full-screen overlay with centered card containing:
  - "Milestone(s) Unlocked!" header with star icon
  - All active milestones stacked vertically (each in its own rounded card with icon, label, description)
  - Day 15 discount includes the "Copy Code" button for PILLAR15 inside the modal
  - Green "Got It!" dismiss button
- **Auto-show** — Modal automatically opens when the user reaches milestone days (5, 10, 15)
- **Modal sizing** — `maxHeight: 95%` so all 3 stacked milestones fit without scrolling
- **Day 21 recap cards** on Dashboard remain as inline cards (permanent recap, not dismissable)

### Modified
- **`components/Dashboard.js`** — Added `Modal` import, `showMilestoneModal` state, `activeMilestones` array builder, auto-show useEffect, milestone indicator + modal JSX, and all modal styles
- **`components/ChallengeDetail.js`** — Same: added `Modal` import, `useRef`/`useEffect` imports, `showMilestoneModal` state, `activeMilestones` array, auto-show logic, replaced inline triggers with indicator + modal, added modal styles

---

## 42. Clearer Log Button Labels

Renamed the daily check-in button on Dashboard for clarity.

### Modified
- **`components/Dashboard.js`** — Changed button text from "Log Today's Tasks" → "Tap to Complete Daily Tasks" and "All Tasks Logged" → "Daily Tasks Complete!"

---

## 43. Replaced Meditation Audio Files

Swapped all 3 meditation recordings with updated versions from Coach Al.

### Assets Replaced
- `assets/meditation-1.mp3` — 2.8 MB → 5.6 MB
- `assets/meditation-2.mp3` — 3.9 MB → 6.7 MB
- `assets/meditation-3.mp3` — 3.7 MB → 6.7 MB

No code changes needed — filenames unchanged so existing `require()` paths still work.

---

## 44. Payment Gate — Stan Store + Access Codes

Added a payment wall after onboarding. Users complete the questionnaire, hit the gate, pay via Stan Store, and enter a manually-distributed access code to unlock the app. Scores are hidden until after payment as the reward for purchasing.

### Decision Context
Originally explored Stripe (see `docs/payment-gate-plan.md`). Coach Al chose Stan Store because it's already in his workflow. Stan Store has no API/webhooks/SDK, so verification uses one-time access codes stored in Firestore, manually emailed by Coach Al after each sale.

### Created
- **`components/PaymentGate.js`** — Two-phase gate screen:
  - **Gate phase**: Lock icon, "You're almost there" greeting, "What You'll Get" feature list, "Get Full Access" button (opens Stan Store via `Linking.openURL`), code entry section with `WELL-` prefix, auto-uppercase input, error/success states, 5-attempt rate limiting with 60s cooldown
  - **Results phase** (after valid code): Trophy icon, "Welcome!" greeting, 7 pillar score bars revealed with focus pillar highlighted, "Let's Go" button → Dashboard
  - No BottomNav, no back button — hard gate
- **`scripts/generate-codes.js`** — Node CLI script: `node scripts/generate-codes.js <count>`. Generates N unique `WELL-XXXX` codes using unambiguous charset, checks Firestore for duplicates, writes codes to `accessCodes` collection, appends to `generated-codes.txt` with checkboxes for Coach Al
- **`scripts/export-users.js`** — Node CLI script: `node scripts/export-users.js`. Exports all users to `users-export.xlsx` with two sheets: Users (name, email, paid status, access code, signup date, last active, focus pillar, streak, days logged) and Summary (totals + code stats). Re-running overwrites with fresh data — no duplicates
- **`docs/payment-gate.md`** — Comprehensive documentation: full flow, code system mechanics, Firestore structure, Coach Al's workflow, Stan Store link config, edge cases, security rules

### Modified
- **`constants.js`** — Added `SCREENS.PAYMENT_GATE` and `STAN_STORE_URL` (placeholder: `stan.store/coachal` — update when product is live)
- **`lib/storage.js`** — Added `PAID` and `ACCESS_CODE` to KEYS. Added `savePaidStatus(code)`. Updated `loadAllData()` to return `paid` and `accessCode`. Updated `saveAllData()` to accept `paid` param. `clearAllData()` auto-includes new keys via `Object.values(KEYS)`.
- **`lib/sync.js`** — Added `getDoc`, `runTransaction` imports. Added `validateAccessCode(userId, userEmail, code)` — Firestore transaction that handles unused codes, same-user reinstalls, email-match transfers, and already-redeemed rejection. Added `checkPaidStatus(userId)` — reads `paid` field from user doc (first-ever Firestore read in the app). Both wrapped in try/catch for offline resilience.
- **`App.js`** — Added `isPaid` and `userEmail` state. Screen guard in `loadSavedData()`: unpaid + intakeCompleted → PAYMENT_GATE. `finalizeAssessment()` now navigates to PAYMENT_GATE instead of DASHBOARD. Added `handleCodeValidated(code)` (saves paid status, navigates to Dashboard) and `handleValidateCode(code)` (calls Firestore transaction). Added PAYMENT_GATE case in `renderScreen()`. `handleRandomFill()` sets `paid: true` (dev bypass). `handleReset()` clears paid state. `handleSaveName()` now tracks email in state.
- **`.gitignore`** — Added `generated-codes.txt` and `*.xlsx`

### New Dependency
- **`xlsx`** — Excel file generation for user export script

### Firestore Changes
- New collection: `accessCodes/{code}` — Document ID is the code itself for O(1) lookup. Fields: `code`, `used`, `usedBy`, `usedByEmail`, `usedAt`, `createdAt`, `batch`
- New fields on `users/{userId}`: `paid`, `accessCode`, `paidAt`

### Security Rules Needed
```
match /accessCodes/{code} {
  allow read: if true;
  allow update: if resource.data.used == false && request.resource.data.used == true;
  allow create, delete: if false;
}
```

**Full details:** See [`docs/payment-gate.md`](./payment-gate.md)

---

## 45. Reset Button — Always Visible + Database Deletion

The reset button on the Dashboard was previously hidden behind `DEV_MODE`. Now it's always visible and deletes both local and cloud data.

### Modified
- **`lib/sync.js`** — Added `deleteUserData(userId)` function. Deletes the user's Firestore document and all subcollections (dailyLogs, challengeProgress, challengeTasks, bookProgress). Added `getDocs`, `deleteDoc`, `collection` imports.
- **`App.js`** — `handleReset()` now captures the userId before clearing local storage, then fires `deleteUserData(userId)` as fire-and-forget to wipe cloud data. Imported `deleteUserData`.
- **`components/Dashboard.js`** — Reset button moved outside `DEV_MODE` guard (always visible). Shows as "Reset All Progress" with red trash icon. Confirmation dialog before executing (native Alert on mobile, `window.confirm` on web). Added `Alert` and `Platform` imports.

### What reset clears
- All AsyncStorage data (scores, streaks, challenges, paid status)
- All in-memory state (back to defaults)
- All Firestore data (user document + all subcollections)
- Sends user back to the landing page

### What reset does NOT clear
- The `accessCodes` collection — user's code stays marked as `used: true`, so they can re-enter it after re-onboarding

---

## 46. Disabled DEV_MODE

Turned off `DEV_MODE` in both Dashboard and ChallengeDetail. Dev panels (phase jump buttons, simulate day, etc.) no longer show.

### Modified
- **`components/Dashboard.js`** — `DEV_MODE = false`
- **`components/ChallengeDetail.js`** — `DEV_MODE = false`

---

## 47. Focus Pillar First in Challenge List

The focus pillar (weakest/unlocked) now appears at the top of the challenge progress list instead of its fixed position among all pillars.

### Modified
- **`components/ChallengeProgress.js`** — Sorted `pillars` array so `focusPillar` comes first, rest stay in original order.

---

## 48. Firestore Rules Documentation

Added full copy-paste-ready Firestore security rules to `docs/payment-gate.md`. Rules are safe to document publicly — they're server-side enforcement, not secrets.

### Modified
- **`docs/payment-gate.md`** — Expanded Firestore Security Rules section with complete `rules_version = '2'` ruleset covering both `users` and `accessCodes` collections. Added development-only permissive rules for code generation. Clarified why documenting rules in a public repo is safe.

---

## 49. Reset Confirmation — Modal Instead of Alert

Replaced the browser `window.confirm` / native `Alert` with a proper in-app Modal for the reset confirmation dialog. Matches the existing milestone modal styling.

### Modified
- **`components/Dashboard.js`** — Added `showResetModal` state. Reset button now opens a Modal with warning icon, descriptive text, red "Reset Everything" button, and "Cancel" below. Removed unused `Alert` and `Platform` imports.

---

## 50. Export Access Codes Script

New script to export all access codes from Firestore to an Excel spreadsheet with their used/available status.

### Created
- **`scripts/export-codes.js`** — Node CLI script: `node scripts/export-codes.js`. Fetches all codes from `accessCodes` collection, creates `codes-export.xlsx` with two sheets: Codes (code, status, used by email, user ID, used at, created, batch) and Summary (total/used/available counts). Codes sorted by creation date — order stays consistent across reruns. Supports `--output` flag for custom filename. Re-running overwrites with fresh statuses.

### Modified
- **`docs/scripts.md`** — Added section 3 documenting export-codes.js usage, output format, and purpose. Updated Quick Reference table and File outputs.

---

## 51. Export Scripts — Output to `exports/` Folder

Both export scripts now save to an `exports/` directory instead of the project root. The folder is auto-created if it doesn't exist.

### Modified
- **`scripts/export-codes.js`** — Output path changed to `exports/codes-export.xlsx`. Added `fs` import for directory creation.
- **`scripts/export-users.js`** — Output path changed to `exports/users-export.xlsx`.
- **`.gitignore`** — Replaced `*.xlsx` with `exports/` directory ignore.

---

## 52. Fix Missing `createdAt` on Normal Onboarding

Users who went through normal onboarding (not "Skip with Random Data") had no `createdAt` timestamp in Firestore because `syncUserProfile()` never set it — only `syncAllData()` (dev mode) did.

### Modified
- **`lib/sync.js`** — `syncUserProfile()` now checks if the user doc already has a `createdAt` field. If not, it sets `createdAt: serverTimestamp()` on that write. Existing users get backfilled on their next profile sync.

---

## 53. Dashboard & Challenge Sync Fixes

Fixed two sync bugs between Dashboard and ChallengeDetail found during audit.

### Bug 1: Global streak not updating from ChallengeDetail
When a user completed all tasks individually in ChallengeDetail, the per-challenge `streakDays` incremented correctly but the global daily streak (`logToday()`) never fired. Only the Dashboard's bulk log button called it.

**Fix:** `handleToggleChallengeTask` in App.js now detects when the last task toggle completes all tasks for today (compares `lastCompletionDate` before/after). When that happens, it calls `logToday()` to increment the global streak, updates `isLoggedToday`, and syncs to Firestore.

### Bug 2: Milestones re-appearing on ChallengeDetail
Dashboard checked `acknowledgedMilestones` before showing milestone modals. ChallengeDetail did not — so milestones dismissed on Dashboard would re-appear on ChallengeDetail.

**Fix:** ChallengeDetail now reads `acknowledgedMilestones` from `challengeState` and filters with `!ackMilestones.includes(day)` — matching Dashboard's logic exactly.

### Modified
- **`App.js`** — `handleToggleChallengeTask` now fires `logToday()` + `syncDailyLog()` when all tasks complete for the day.
- **`components/ChallengeDetail.js`** — Milestone building logic now checks `acknowledgedMilestones` to skip already-dismissed milestones.

---

## 54. Re-enable DEV_MODE for Testing

Turned `DEV_MODE` back on in Dashboard and ChallengeDetail while the app is in active testing. Dev panels (phase jump, simulate day, etc.) are visible again. Set back to `false` before production release.

### Modified
- **`components/Dashboard.js`** — `DEV_MODE = true`
- **`components/ChallengeDetail.js`** — `DEV_MODE = true`

## 55. Pillar Videos — Day 10 Milestone Triggers

Added Coach Al's pillar-specific videos to the Day 10 "Mid-Challenge Video" milestone. When a user reaches Day 10 of their 21-day challenge, the milestone modal now shows a "Watch Video" button that opens a full-screen video player. The milestone timeline in ChallengeDetail also becomes tappable at Day 10 to replay the video.

**Videos** (6 of 7 pillars covered — no sleep video):
- `breathing.mp4` → Breathing pillar
- `watering.mp4` → Hydration pillar
- `food.mp4` → Nutrition pillar
- `movement.mp4` → Movement pillar
- `environment.mp4` → Environment pillar
- `mindfulness.mp4` → Mindfulness pillar

### Created
- **`components/VideoPlayerModal.js`** — Full-screen video player using expo-av with play/pause, native controls, loading indicator, and replay button
- **`assets/videos/`** — 6 pillar video files (~22MB total)

### Modified
- **`constants.js`** — Added `PILLAR_VIDEOS` mapping (pillar ID → require() asset)
- **`components/Dashboard.js`** — Day 10 milestone now has "Watch Video" button, imports VideoPlayerModal + PILLAR_VIDEOS
- **`components/ChallengeDetail.js`** — Day 10 milestone now has "Watch Video" button, milestone timeline Day 10 row is tappable to play video, imports VideoPlayerModal + PILLAR_VIDEOS