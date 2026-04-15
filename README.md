# Coach Al's Wellness Studio

A mobile wellness app built around Coach Al Cummings' **7 Pillars of Health**: Breathing, Sleep, Hydration, Nutrition, Movement, Environment, and Mindfulness.

Built with React Native (Expo SDK 54). Targets iOS, Android, and Web.

## Features

- Onboarding assessment across all 7 pillars
- Personalized dashboard with daily check-ins and streak tracking
- 21-day challenges per pillar with progressive task unlocking
- Guided meditations
- Nutrition logging
- Workout library
- Full in-app book ("Burnt Out and Ready to Feel Great")
- Light/dark mode toggle
- Local persistence (AsyncStorage) + cloud sync (Firebase Firestore)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run

```bash
npm start          # Expo dev server
npm run web        # Web browser
npm run android    # Android emulator/device
npm run ios        # iOS simulator/device
vercel dev         # Local dev with API routes + admin dashboard
```

Use `vercel dev` when testing the admin dashboard (`/admin`) or API endpoints (`/api/*`). Requires the Vercel CLI (`npm i -g vercel`) and a `.env` file with `ADMIN_PASSWORD` and `RESEND_API_KEY`.

## Scripts

### Delete a user from Firebase

Removes all of a user's data from Firestore (profile, daily logs, challenge progress, book progress).

```bash
node scripts/delete-user.js user@example.com
```

The script will show matching user(s) and ask for confirmation before deleting.
