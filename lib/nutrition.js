/**
 * Nutrition target calculations using Mifflin-St Jeor equation.
 * Pure functions — no side effects, no storage, no state.
 */

const GOAL_LABELS = {
  fat: 'Weight Loss',
  muscle: 'Muscle Building',
  energy: 'Energy Boost',
  health: 'General Health',
};

// CDC average heights
const HEIGHT_CM = {
  Male: 175.26,    // 5'9"
  Female: 162.56,  // 5'4"
  Other: 162.56,
};

// Harris-Benedict activity multipliers (experience as proxy)
const ACTIVITY_MULTIPLIERS = {
  beg: 1.375,
  int: 1.55,
  adv: 1.725,
};

function lbsToKg(lbs) {
  return lbs * 0.453592;
}

export function getPrimaryGoalLabel(goals) {
  if (!goals || !Array.isArray(goals) || goals.length === 0) return 'General Health';
  if (goals.includes('fat')) return GOAL_LABELS.fat;
  if (goals.includes('muscle')) return GOAL_LABELS.muscle;
  if (goals.includes('energy')) return GOAL_LABELS.energy;
  if (goals.includes('health')) return GOAL_LABELS.health;
  return 'General Health';
}

export function calculateBMR(weightKg, heightCm, age, sex) {
  const base = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  return sex === 'Male' ? base + 5 : base - 161;
}

export function calculateTDEE(bmr, experience) {
  const multiplier = ACTIVITY_MULTIPLIERS[experience] || 1.55;
  return bmr * multiplier;
}

export function calculateCalorieTarget(tdee, goals, sex) {
  const primaryGoal = getPrimaryGoal(goals);
  const isMale = sex === 'Male';

  if (primaryGoal === 'fat') {
    const deficit = tdee - 500;
    return Math.round(Math.max(deficit, isMale ? 1500 : 1200));
  }
  if (primaryGoal === 'muscle') {
    return Math.round(tdee + 300);
  }
  return Math.round(tdee);
}

export function calculateProteinTarget(weightKg, goals) {
  const primaryGoal = getPrimaryGoal(goals);

  if (primaryGoal === 'muscle') return Math.round(weightKg * 1.8);
  if (primaryGoal === 'fat') return Math.round(weightKg * 1.4);
  return Math.round(weightKg * 1.2);
}

export function calculateFiberTarget(calories) {
  const raw = (calories / 1000) * 14;
  return Math.round(Math.min(Math.max(raw, 20), 45));
}

export function calculateWaterTarget() {
  return 12;
}

function getPrimaryGoal(goals) {
  if (!goals || !Array.isArray(goals) || goals.length === 0) return 'health';
  if (goals.includes('fat')) return 'fat';
  if (goals.includes('muscle')) return 'muscle';
  if (goals.includes('energy')) return 'energy';
  return 'health';
}

export function calculateNutritionTargets({ weight, age, sex, goals, experience }) {
  if (!weight || !age || !sex) return null;

  const weightKg = lbsToKg(weight);
  const heightCm = HEIGHT_CM[sex] || HEIGHT_CM.Other;

  const bmr = calculateBMR(weightKg, heightCm, age, sex);
  const tdee = calculateTDEE(bmr, experience);
  const calories = calculateCalorieTarget(tdee, goals, sex);
  const protein = calculateProteinTarget(weightKg, goals);
  const fiber = calculateFiberTarget(calories);
  const waterCups = calculateWaterTarget(weight);
  const goalLabel = getPrimaryGoalLabel(goals);

  return { bmr: Math.round(bmr), tdee: Math.round(tdee), calories, protein, fiber, waterCups, goalLabel };
}
