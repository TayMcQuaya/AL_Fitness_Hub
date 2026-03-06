# How Pillar Scores Work

When you complete the onboarding questionnaire, each of the 7 pillars receives a score from **1 to 10** based on your answers. These scores appear on the **"My 7 Pillars"** screen and determine which pillar the app recommends you focus on first.

---

## How to Read This Document

Each pillar section below shows:
- **What questions determine the score**
- **A visual scale** showing what answers produce what score
- **Real examples** so you can check the math yourself

Every pillar uses a **1–10 scale** where:

| Score | What It Means | Label on Screen |
|:-----:|---------------|-----------------|
| 1–3 | This area needs the most attention | **Needs Focus** |
| 4–6 | You're making progress, keep building | **Building** |
| 7–8 | You're doing well, stay consistent | **On Track** |
| 9–10 | Excellent — this is a strength | **Going Strong** |

Your **Total Balance** is the average of all 7 scores. The app automatically identifies your weakest pillar and shows a hint like *"Focus on Nutrition to improve your overall balance."*

---

## 1. Breathing

**Question asked:** "Are you a nose breather during the day?"

This is a simple yes/no question, so the scoring is straightforward:

```
Your Answer        Score
─────────────────────────
Yes             →  8/10   On Track
No              →  3/10   Needs Focus
"I don't know"  →  5/10   Building
```

> Note: With only one binary question, this pillar can't use the full 1–10 range.
> A future update could add more breathing-related questions for finer scoring.

---

## 2. Sleep

**Questions asked:**
1. How many hours do you sleep on average? (slider: 4–10)
2. How energetic do you feel when you wake up? (slider: 1–10)

Both factors contribute equally to the final score (averaged). If you tap "I don't know" on either, that factor defaults to 5 (neutral midpoint).

### Sleep Hours Score (Coach Al's scale)

```
Hours of Sleep         Score (0–10)
──────────────────────────────────────
8 or more hours    →   10
7 hours            →   7.5
6 hours            →   5
5 hours            →   2.5
4 or less          →   0
"I don't know"     →   5  (neutral)
```

### Wake Energy Score

```
Energy Level (1–10)    Score (1–10)
──────────────────────────────────────
Uses the raw slider value directly.
"I don't know"     →   5  (neutral)
```

### Final Sleep Score = round( (Hours Score + Energy Score) / 2 ), clamped 1–10

### Examples

| Person | Sleep | Hours Score | Energy | Energy Score | Average | Final |
|--------|-------|-------------|--------|--------------|---------|-------|
| Great sleeper | 8 hrs | 10 | 9/10 | 9 | 9.5 | **10/10** |
| Good sleeper | 7 hrs | 7.5 | 7/10 | 7 | 7.25 | **7/10** |
| Average | 7 hrs | 7.5 | 5/10 | 5 | 6.25 | **6/10** |
| Struggling | 6 hrs | 5 | 3/10 | 3 | 4 | **4/10** |
| Poor sleep | 5 hrs | 2.5 | 2/10 | 2 | 2.25 | **2/10** |
| Worst case | 4 hrs | 0 | 1/10 | 1 | 0.5 | **1/10** |

---

## 3. Hydration

**Question asked:** How many glasses of water do you drink per day? (tap 1–12)

```
Glasses Per Day        Score
──────────────────────────────
10 or more         →   10/10   Going Strong
8–9 glasses        →   8/10    On Track
6–7 glasses        →   5/10    Building
4–5 glasses        →   3/10    Needs Focus
2–3 glasses        →   2/10    Needs Focus
0–1 glasses        →   1/10    Needs Focus
```

---

## 4. Nutrition

**Question asked:** How often do you eat ultra-processed meals? (Rarely / Sometimes / Often / Daily)

Less processed food = higher score:

```
How Often              Score
──────────────────────────────
Rarely             →   9/10    Going Strong
Sometimes          →   6/10    Building
Often              →   3/10    Needs Focus
Daily              →   1/10    Needs Focus
```

---

## 5. Movement

**Questions asked:**
1. Average daily steps (slider: 0–15,000)
2. Resistance training — how many days per week? (0, 1, 2, 3, 4+)
3. Cardio training — how many days per week? (0, 1, 2, 3, 4+)
4. Overall activity level (Low / Medium / High)

Each question contributes points. If you tap "I'm not sure" on any question, that question contributes 0 points.

### Steps Points

```
Daily Steps            Points Earned
──────────────────────────────────────
10,000+            →   +3
7,000–9,999        →   +2
4,000–6,999        →   +1
Under 4,000        →   +0
```

### Resistance Training Points

```
Days Per Week          Points Earned
──────────────────────────────────────
3 or more          →   +2
1–2 days           →   +1
0 days             →   +0
```

### Cardio Training Points

```
Days Per Week          Points Earned
──────────────────────────────────────
3 or more          →   +2
1–2 days           →   +1
0 days             →   +0
```

### Activity Level Points

```
Level                  Points Earned
──────────────────────────────────────
High               →   +2
Medium             →   +1
Low                →   +0
```

### Final Movement Score = 1 + Steps + Resistance + Cardio + Level (capped at 10)

### Examples

| Person | Steps | Resistance | Cardio | Level | Calculation | Score |
|--------|-------|-----------|--------|-------|-------------|-------|
| Very active | 12,000 | 4x/wk | 3x/wk | High | 1+3+2+2+2 | **10/10** |
| Moderately active | 7,000 | 2x/wk | 1x/wk | Medium | 1+2+1+1+1 | **6/10** |
| Lightly active | 5,000 | 0 | 1x/wk | Low | 1+1+0+1+0 | **3/10** |
| Sedentary | 2,000 | 0 | 0 | Low | 1+0+0+0+0 | **1/10** |

---

## 6. Environment

**Question asked:** How many hours do you spend outdoors per day? (0, 1, 2, 3+)

```
Hours Outdoors         Score
──────────────────────────────
3 or more          →   9/10    Going Strong
2 hours            →   7/10    On Track
1 hour             →   4/10    Building
0 hours            →   1/10    Needs Focus
"I don't know"     →   5/10    Building
```

---

## 7. Mindfulness

**Questions asked:**
1. Current stress level (slider: 1 = very stressed, 10 = very peaceful)
2. Do you practice daily mindfulness? (Yes / Sometimes)

Both factors contribute to the score. The stress slider uses a "peace scale" — higher number means more at peace, which means a higher score.

### Stress Level Points

```
Stress Slider (1–10)        Points Earned
──────────────────────────────────────────
9–10  (very peaceful)   →   +6
7–8   (calm)            →   +5
5–6   (moderate)        →   +3
3–4   (stressed)        →   +2
1–2   (very stressed)   →   +1
"I don't know"          →   +3  (neutral)
```

### Mindfulness Practice Points

```
Practice Mindfulness?       Points Earned
──────────────────────────────────────────
Yes                     →   +3
Sometimes               →   +1
"I don't know"          →   +1
```

### Final Mindfulness Score = 1 + Stress Points + Practice Points (capped at 10)

### Examples

| Person | Stress | Practice | Calculation | Score |
|--------|--------|----------|-------------|-------|
| Peaceful + daily practice | 9 | Yes | 1 + 6 + 3 | **10/10** |
| Calm + sometimes | 7 | Sometimes | 1 + 5 + 1 | **7/10** |
| Moderate stress + no practice | 5 | Sometimes | 1 + 3 + 1 | **5/10** |
| Very stressed + sometimes | 2 | Sometimes | 1 + 1 + 1 | **3/10** |
| Very stressed + unsure | 1 | Unsure | 1 + 1 + 1 | **3/10** |

---

## What Happens With Your Scores

Once you finish onboarding, the app:

1. **Saves all 7 scores** to your device (and syncs to the cloud)
2. **Finds your weakest pillar** — the one with the lowest score
3. **Sets it as your focus** — shown on the Dashboard as your recommended area to work on
4. **Displays all scores on the Pillars screen** — with color-coded bars and status labels

```
Example: What the Pillars Screen Shows
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total Balance: 5.7/10

  Breathing     8/10   ████████░░  On Track
  Sleep         6/10   ██████░░░░  Building
  Hydration     5/10   █████░░░░░  Building
  Nutrition     3/10   ███░░░░░░░  Needs Focus     ← lowest!
  Movement      7/10   ███████░░░  On Track
  Environment   4/10   ████░░░░░░  Building
  Mindfulness   7/10   ███████░░░  On Track

  "Focus on Nutrition to improve your overall balance."
```

Scores below 5 appear in **red** to draw attention. Scores 5 and above appear in **green**.

---

## The "I Don't Know" Option

Most questions have an "I'm not sure" or "I don't know" toggle. When selected:

- **Sleep & Mindfulness:** You receive a **neutral midpoint** value (not penalized, not rewarded)
- **Movement:** That question contributes **0 points** (slightly penalizing since we can't assess)
- **Breathing & Environment:** You get a flat **5/10** (dead center)

This means users who aren't sure about their habits still get reasonable baseline scores rather than being pushed to extremes.
