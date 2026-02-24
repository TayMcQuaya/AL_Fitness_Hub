# How Nutrition Targets Work

When you complete onboarding, the app calculates personalized daily nutrition targets based on your body stats and goals. These targets appear on the **Nutrition** and **Quick Meal Log** screens.

---

## What Data It Uses

The app collects these during onboarding (Steps 2 & 3):

| Field | Where Collected | Example |
|-------|----------------|---------|
| Weight | IntakeDemographics | 200 lbs |
| Age | IntakeDemographics | 30 |
| Sex | IntakeDemographics | Male / Female / Other |
| Goals | IntakeGoals | fat, muscle, energy, health |
| Experience | IntakeGoals | beg, int, adv |

**Height** is not collected. The app estimates from sex averages:
- Male: 5'9" (175.26 cm)
- Female / Other: 5'4" (162.56 cm)

---

## The Math (Step by Step)

### Step 1: BMR (Basal Metabolic Rate)

How many calories your body burns just existing — sleeping, breathing, keeping your heart beating. Uses the **Mifflin-St Jeor equation** (1990), considered the most accurate for general populations.

```
Male:    BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
Female:  BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
```

Weight is converted from lbs to kg internally (× 0.453592).

**Example** — Male, 200 lbs (90.7 kg), 30 years old:
```
BMR = (10 × 90.7) + (6.25 × 175.26) - (5 × 30) + 5
    = 907 + 1095.4 - 150 + 5
    = 1,857
```

### Step 2: TDEE (Total Daily Energy Expenditure)

Your BMR adjusted for how active you are. The app uses your **experience level** as a proxy for activity:

```
Experience Level    Multiplier    What It Means
──────────────────────────────────────────────────
Beginner (beg)      × 1.375      Light activity (1-3 days/week)
Intermediate (int)  × 1.55       Moderate activity (3-5 days/week)
Advanced (adv)      × 1.725      Heavy activity (6-7 days/week)
```

**Example** — BMR 1,857 × intermediate (1.55):
```
TDEE = 1,857 × 1.55 = 2,878
```

### Step 3: Calorie Target

Your TDEE adjusted for your primary goal:

```
Goal            Adjustment              Floor
───────────────────────────────────────────────
Weight Loss     TDEE - 500 kcal         1,500 (M) / 1,200 (F)
Muscle Building TDEE + 300 kcal         none
Energy / Health TDEE (maintenance)      none
```

The -500 deficit equals roughly 1 lb/week of fat loss. The floor prevents dangerously low calorie targets.

**Goal priority** (if you selected multiple): fat > muscle > energy > health. The first match wins.

**Example** — TDEE 2,878, goal "fat":
```
Calories = 2,878 - 500 = 2,378
```

### Step 4: Protein Target

Based on body weight and goal:

```
Goal              Formula              Source
──────────────────────────────────────────────────
Muscle Building   weight_kg × 1.8g     ISSN / Morton 2018
Weight Loss       weight_kg × 1.4g     ISSN (preserves muscle in deficit)
General           weight_kg × 1.2g     Active baseline
```

**Example** — 90.7 kg, goal "fat":
```
Protein = 90.7 × 1.4 = 127g
```

### Step 5: Fiber Target

Based on calorie target, per USDA Dietary Guidelines 2020-2025:

```
Fiber = (calories / 1,000) × 14g, clamped to 20–45g range
```

**Example** — 2,378 calories:
```
Fiber = (2,378 / 1,000) × 14 = 33g
```

### Step 6: Water Target

Based on body weight, per National Academy of Medicine:

```
Water (cups) = (weight_lbs × 0.5 oz) ÷ 8
```

**Example** — 200 lbs:
```
Water = (200 × 0.5) ÷ 8 = 12.5 → 13 cups
```

---

## Where the Numbers Show Up

### Nutrition Screen (NutritionSummary)

| Element | What It Shows |
|---------|---------------|
| Goal badge | "GOAL: WEIGHT LOSS" (or your primary goal) |
| Calorie card | Your daily calorie target |
| Protein card | Your daily protein target in grams |
| Fiber Focus tip | Your fiber target |
| Hydration tip | Your water target in cups |

---

## What Happens When Data Is Missing

If weight, age, or sex aren't available (e.g., user somehow skipped onboarding), `calculateNutritionTargets()` returns `null` and the screens show `--` placeholders instead of numbers. The app never crashes from missing data.

---

## Full Example: 5 User Profiles

```
Profile                         Calories   Protein   Fiber   Water
──────────────────────────────────────────────────────────────────────
Male, 30, 200lbs, fat, int      2,378      127g      33g     13 cups
Female, 25, 140lbs, muscle, adv 2,367      114g      33g     9 cups
Male, 45, 250lbs, health, beg   2,206      136g      31g     16 cups
Female, 35, 160lbs, fat, beg    1,528      99g       21g     10 cups
Other, 28, 180lbs, energy, int  2,112      98g       30g     11 cups
```

---

## Code Location

All calculation logic lives in `lib/nutrition.js`. It's a pure utility — no storage, no state, no side effects. The component files just call `calculateNutritionTargets()` with the user's data and display the result.
