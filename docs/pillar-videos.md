# Pillar Videos — Setup Guide

## Overview

Each pillar can have a Coach Al video that unlocks at **Day 10** of the 21-day challenge. The video plays in a full-screen modal via `expo-video`.

## Current Videos (6 of 7)

| Pillar       | Pillar ID      | Source File        | Asset Path                        |
|-------------|----------------|--------------------|-----------------------------------|
| Breathing    | `breathing`    | `breathing.mp4`    | `assets/videos/breathing.mp4`     |
| Hydration    | `hydration`    | `watering.mp4`     | `assets/videos/watering.mp4`      |
| Nutrition    | `nutrition`    | `food.mp4`         | `assets/videos/food.mp4`          |
| Movement     | `movement`     | `movement.mp4`     | `assets/videos/movement.mp4`      |
| Environment  | `environment`  | `environment.mp4`  | `assets/videos/environment.mp4`   |
| Mindfulness  | `mindfulness`  | `mindfulness.mp4`  | `assets/videos/mindfulness.mp4`   |
| **Sleep**    | `sleep`        | **MISSING**        | —                                 |

## How to Add the Sleep Video (or Any New Video)

### Step 1: Copy the video file

Place the `.mp4` file in `assets/videos/`. Name doesn't matter but keep it descriptive (e.g., `sleep.mp4`).

### Step 2: Add the require() mapping

Open `constants.js` and find the `PILLAR_VIDEOS` object. Add the new entry:

```js
export const PILLAR_VIDEOS = {
  breathing: require("./assets/videos/breathing.mp4"),
  hydration: require("./assets/videos/watering.mp4"),
  nutrition: require("./assets/videos/food.mp4"),
  movement: require("./assets/videos/movement.mp4"),
  environment: require("./assets/videos/environment.mp4"),
  mindfulness: require("./assets/videos/mindfulness.mp4"),
  sleep: require("./assets/videos/sleep.mp4"),       // <-- add this line
};
```

**That's it.** No other code changes needed. The Dashboard and ChallengeDetail components dynamically check `PILLAR_VIDEOS[pillarId]` — if a video exists for the pillar, the "Watch Video" button appears automatically.

## Architecture

### Files involved

| File | Role |
|------|------|
| `constants.js` | `PILLAR_VIDEOS` — mapping of pillar ID → `require()` asset |
| `components/VideoPlayerModal.js` | Reusable full-screen video player (expo-video `VideoView` component) |
| `components/Dashboard.js` | Day 10 milestone modal shows "Watch Video" button if video exists |
| `components/ChallengeDetail.js` | Same button in milestone modal + tappable Day 10 row in milestone timeline |

### How the trigger works

1. User reaches Day 10 of their challenge
2. Milestone modal pops up (auto or tap "Milestones Unlocked" banner)
3. Day 10 milestone checks `PILLAR_VIDEOS[pillarId]`
   - **Video exists** → shows text + green "Watch Video" button
   - **No video** → shows text only (graceful fallback)
4. Tapping "Watch Video" closes milestone modal, opens `VideoPlayerModal`
5. Video auto-plays with native controls (seek, pause, volume)
6. Close (X) stops video and returns to challenge screen

### VideoPlayerModal props

| Prop | Type | Description |
|------|------|-------------|
| `visible` | boolean | Controls modal visibility |
| `videoSource` | require() asset | The video to play |
| `pillarName` | string | Display name (e.g., "Breathing") shown as title |
| `onClose` | function | Called when user closes the player |

## Notes

- Videos are bundled with the app (not streamed) — keep file sizes reasonable (~3-5MB each)
- `require()` must be static (known at build time) — you cannot use dynamic paths
- The `sleep` pillar will work without a video — users just won't see the Watch Video button at Day 10
