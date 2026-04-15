# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Coach Al's Wellness Studio** — an Expo-managed React Native app (SDK 54) built around Coach Al Cummings' "7 Pillars of Health" (Breathing, Sleep, Hydration, Nutrition, Movement, Environment, Mindfulness). Includes onboarding assessment, daily check-ins, 21-day challenges per pillar, workouts, nutrition logging, guided meditations, progress tracking, and a full in-app book ("Burnt Out and Ready to Feel Great").

Targets iOS, Android, and Web. Light/dark theme toggle. Portrait-locked. Plain JavaScript (no TypeScript).

## Commands

```bash
npm start          # expo start (default)
npm run web        # expo start --web
npm run android    # expo start --android
npm run ios        # expo start --ios
vercel dev         # local dev with API routes (required for admin dashboard)
```

Use `vercel dev` instead of `npm run web` when testing the admin dashboard (`/admin`) or any API endpoints (`/api/*`). It runs both the Expo dev server and Vercel serverless functions together. Requires the Vercel CLI (`npm i -g vercel`) and a `.env` file with `ADMIN_PASSWORD` and `RESEND_API_KEY`.

No test runner, linter, or build scripts are configured.

## Architecture

### State & Routing (all in App.js)

All application state lives in `App.js` via `useState`. There is **no state management library** and **no navigation library** — routing is a manual `switch` on `currentScreen` string inside `renderScreen()`. Navigation happens through `navigateTo(screenName)` which updates state and persists to AsyncStorage.

Screen name constants are defined in `constants.js` under `SCREENS`.

### Data Flow

Top-down props only. `App.js` passes `onNavigate`, selection handlers, and scoring callbacks to all child components. Intake screens calculate pillar scores (1-10) internally and pass them up via `onNext`. After onboarding completes, `finalizeAssessment()` finds the weakest pillar and sets it as the user's focus.

### Persistence (Two-Layer)

**Local (AsyncStorage)** — `lib/storage.js` manages all keys with `@al_` prefix. Stores: screen, name, email, age, sex, weight, goalWeight, goals, experience, injuries, pillar scores, focus pillar, streak, lastLogDate, totalDaysLogged, log history, challenge states, read chapters. Loaded on mount via `migrateIfNeeded()` → `loadAllData()` → `evaluateDailyLogOnLoad()`.

**Cloud (Firebase Firestore)** — `lib/sync.js` does fire-and-forget writes on key events (signup, check-in, task toggle, chapter read). Never blocks UI. App works fully offline. Firebase project: `al-fitness-hub`. Config in `lib/firebase.js`.

Key local logic:
- **Daily streak**: date-aware — today=logged, yesterday=keep streak, 2+ days=reset to 0
- **Challenge advancement**: calendar-enforced — max 1 day advancement per calendar day
- **Migration**: `migrateIfNeeded()` converts old flat keys to `@al_` keys on first load

### Navigation Flow

```
LANDING → WELCOME → INTAKE_PERSONAL → INTAKE_DEMOGRAPHICS → INTAKE_GOALS
→ INTAKE_MOVEMENT → INTAKE_NUTRITION → INTAKE_BREATHING_SLEEP
→ INTAKE_MINDFULNESS → SAFETY_NOTICE → DASHBOARD

From DASHBOARD (via BottomNav or cards):
  WORKOUT_LIST → WORKOUT_DETAIL
  NUTRITION_SUMMARY
  PROGRESS_SUMMARY
  PILLARS_OVERVIEW
  MEDITATION_LIST → MEDITATION_PLAYER
  CHALLENGE_PROGRESS → CHALLENGE_DETAIL
  BOOK → CHAPTER_VIEW
  SUPPORT
```

`BottomNav` (5 tabs: Home, Meditate, Pillars, Nutrition, Progress) is rendered by individual screen components — onboarding screens don't include it.

### Key Files

- **`App.js`** — Root component. All state, routing logic, intake/challenge/book handlers. Imports from `lib/storage.js` and `lib/sync.js`.
- **`lib/storage.js`** — All AsyncStorage logic. Keys, migration, date-aware streak, calendar-enforced challenges, bulk save/clear.
- **`lib/sync.js`** — Fire-and-forget Firestore writes. `syncUserProfile`, `syncDailyLog`, `syncChallengeProgress`, `syncBookProgress`, etc.
- **`lib/firebase.js`** — Firebase app init + Firestore export. Config for `al-fitness-hub` project.
- **`constants.js`** — All static data: pillars, workouts, meals, 21-day challenges (with progressive task unlocking at days 1/8/15/22), full book chapter content (9 chapters), screen name constants, helper functions (`getWeekFromDay`, `getAvailableTasks`).
- **`styles/theme.js`** — Design tokens: colors (primary `#13ec13` green, secondary `#ec7f13` orange, background `#111111`), spacing, borderRadius, fontSize, fontWeight. Theme context in `styles/ThemeContext.js`.
- **`components/`** — One file per screen. Each uses `StyleSheet.create()` via `makeStyles(colors)` pattern with `useTheme()` hook.

### Dev Mode

`WelcomeScreen` and `ChallengeDetail` have `DEV_MODE` toggles (currently `true`). WelcomeScreen's "Skip with Random Data" calls `handleRandomFill()` in App.js to bypass onboarding.

### Dependencies of Note

- `@react-native-async-storage/async-storage` — local persistence (wrapped by `lib/storage.js`)
- `firebase` — Firestore cloud sync (wrapped by `lib/sync.js`)
- `@react-native-community/slider` — intake assessment sliders
- `@expo/vector-icons` (MaterialIcons) — all icons
- `expo-sharing`, `expo-file-system`, `expo-asset` — sharing features
- `expo-router` is installed but **not used** — routing is manual
- `react-native-web` + `react-dom` — web platform support

### Conventions

- All styling uses React Native `StyleSheet.create()` with theme tokens
- Images are placeholder URLs (picsum.photos, i.pravatar.cc)
- Book content is rendered from `BOOK_CHAPTERS` in constants.js, not from the PDF in assets
- Data persistence is abstracted into `lib/storage.js` (local) and `lib/sync.js` (cloud)
- All intake data (name, email, age, sex, weight, goals, injuries) is persisted locally AND synced to Firestore
- Components use `useTheme()` hook and `makeStyles(colors)` pattern for light/dark support
