import AsyncStorage from "@react-native-async-storage/async-storage";
import { TWENTY_ONE_DAY_CHALLENGES } from "../constants";

// --- Key Constants ---
const KEYS = {
  VERSION: "@al_version",
  USER_ID: "@al_user_id",
  SCREEN: "@al_screen",
  NAME: "@al_name",
  EMAIL: "@al_email",
  AGE: "@al_age",
  SEX: "@al_sex",
  WEIGHT: "@al_weight",
  GOAL_WEIGHT: "@al_goal_weight",
  GOALS: "@al_goals",
  EXPERIENCE: "@al_experience",
  INJURIES: "@al_injuries",
  INTAKE_COMPLETED: "@al_intake_completed",
  PILLAR_SCORES: "@al_pillar_scores",
  FOCUS_PILLAR: "@al_focus_pillar",
  STREAK: "@al_streak",
  LAST_LOG_DATE: "@al_last_log_date",
  TOTAL_DAYS_LOGGED: "@al_total_days_logged",
  LOG_HISTORY: "@al_log_history",
  CHALLENGE_STATES: "@al_challenge_states",
  READ_CHAPTERS: "@al_read_chapters",
  THEME: "@al_theme",
  PAID: "@al_paid",
  ACCESS_CODE: "@al_access_code",
  NEWSLETTER_OPT_IN: "@al_newsletter_opt_in",
};

const CURRENT_VERSION = "2";

// --- Date Helpers ---

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function daysBetween(dateStrA, dateStrB) {
  const a = new Date(dateStrA + "T00:00:00");
  const b = new Date(dateStrB + "T00:00:00");
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}

// --- User ID ---

export async function getOrCreateUserId() {
  let userId = await AsyncStorage.getItem(KEYS.USER_ID);
  if (!userId) {
    userId =
      "user_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 10);
    await AsyncStorage.setItem(KEYS.USER_ID, userId);
  }
  return userId;
}

export async function setUserId(userId) {
  await AsyncStorage.setItem(KEYS.USER_ID, userId);
}

// --- Migration ---

export async function migrateIfNeeded() {
  const version = await AsyncStorage.getItem(KEYS.VERSION);
  if (version === CURRENT_VERSION) return false;

  // Read old flat keys
  const oldScreen = await AsyncStorage.getItem("currentScreen");
  const oldName = await AsyncStorage.getItem("userName");
  const oldFocus = await AsyncStorage.getItem("focusPillar");
  const oldLogged = await AsyncStorage.getItem("isLoggedToday");
  const oldStreak = await AsyncStorage.getItem("streak");
  const oldChallenges = await AsyncStorage.getItem("challengeStates");
  const oldReadChapters = await AsyncStorage.getItem("readChapters");

  // Write to new keys
  if (oldScreen) await AsyncStorage.setItem(KEYS.SCREEN, oldScreen);
  if (oldName) await AsyncStorage.setItem(KEYS.NAME, oldName);
  if (oldFocus) await AsyncStorage.setItem(KEYS.FOCUS_PILLAR, oldFocus);
  if (oldStreak) await AsyncStorage.setItem(KEYS.STREAK, oldStreak);
  if (oldChallenges)
    await AsyncStorage.setItem(KEYS.CHALLENGE_STATES, oldChallenges);
  if (oldReadChapters)
    await AsyncStorage.setItem(KEYS.READ_CHAPTERS, oldReadChapters);

  // If they were "logged today" under old system, set lastLogDate to today
  if (oldLogged === "true") {
    await AsyncStorage.setItem(KEYS.LAST_LOG_DATE, getTodayStr());
    await AsyncStorage.setItem(KEYS.TOTAL_DAYS_LOGGED, "1");
    await AsyncStorage.setItem(
      KEYS.LOG_HISTORY,
      JSON.stringify({ [getTodayStr()]: true }),
    );
  }

  // Remove old keys
  const oldKeys = [
    "currentScreen",
    "userName",
    "focusPillar",
    "isLoggedToday",
    "streak",
    "challengeStates",
    "readChapters",
  ];
  await AsyncStorage.multiRemove(oldKeys);

  // Ensure userId exists
  await getOrCreateUserId();

  await AsyncStorage.setItem(KEYS.VERSION, CURRENT_VERSION);
  return true;
}

// --- Load All Data ---

export async function loadAllData() {
  const keys = [
    KEYS.SCREEN,
    KEYS.NAME,
    KEYS.EMAIL,
    KEYS.AGE,
    KEYS.SEX,
    KEYS.WEIGHT,
    KEYS.GOAL_WEIGHT,
    KEYS.GOALS,
    KEYS.EXPERIENCE,
    KEYS.INJURIES,
    KEYS.INTAKE_COMPLETED,
    KEYS.PILLAR_SCORES,
    KEYS.FOCUS_PILLAR,
    KEYS.STREAK,
    KEYS.LAST_LOG_DATE,
    KEYS.TOTAL_DAYS_LOGGED,
    KEYS.LOG_HISTORY,
    KEYS.CHALLENGE_STATES,
    KEYS.READ_CHAPTERS,
    KEYS.THEME,
    KEYS.PAID,
    KEYS.ACCESS_CODE,
    KEYS.NEWSLETTER_OPT_IN,
  ];

  const pairs = await AsyncStorage.multiGet(keys);
  const data = {};
  pairs.forEach(([key, value]) => {
    data[key] = value;
  });

  return {
    screen: data[KEYS.SCREEN] || null,
    name: data[KEYS.NAME] || null,
    email: data[KEYS.EMAIL] || null,
    age: data[KEYS.AGE] ? parseInt(data[KEYS.AGE]) : null,
    sex: data[KEYS.SEX] || null,
    weight: data[KEYS.WEIGHT] ? parseInt(data[KEYS.WEIGHT]) : null,
    goalWeight: data[KEYS.GOAL_WEIGHT]
      ? parseInt(data[KEYS.GOAL_WEIGHT])
      : null,
    goals: data[KEYS.GOALS] ? JSON.parse(data[KEYS.GOALS]) : null,
    experience: data[KEYS.EXPERIENCE] || null,
    injuries: data[KEYS.INJURIES] || null,
    intakeCompleted: data[KEYS.INTAKE_COMPLETED] === "true",
    pillarScores: data[KEYS.PILLAR_SCORES]
      ? JSON.parse(data[KEYS.PILLAR_SCORES])
      : null,
    focusPillar: data[KEYS.FOCUS_PILLAR] || null,
    streak: data[KEYS.STREAK] ? parseInt(data[KEYS.STREAK]) : 0,
    lastLogDate: data[KEYS.LAST_LOG_DATE] || null,
    totalDaysLogged: data[KEYS.TOTAL_DAYS_LOGGED]
      ? parseInt(data[KEYS.TOTAL_DAYS_LOGGED])
      : 0,
    logHistory: data[KEYS.LOG_HISTORY]
      ? JSON.parse(data[KEYS.LOG_HISTORY])
      : {},
    challengeStates: data[KEYS.CHALLENGE_STATES]
      ? JSON.parse(data[KEYS.CHALLENGE_STATES])
      : null,
    readChapters: data[KEYS.READ_CHAPTERS]
      ? JSON.parse(data[KEYS.READ_CHAPTERS])
      : {},
    theme: data[KEYS.THEME] || null,
    paid: data[KEYS.PAID] === "true",
    accessCode: data[KEYS.ACCESS_CODE] || null,
    newsletterOptIn: data[KEYS.NEWSLETTER_OPT_IN] === "true",
  };
}

// --- Daily Check-In Streak Logic ---

export function evaluateDailyLogOnLoad(lastLogDate, streak) {
  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  if (lastLogDate === today) {
    return { isLoggedToday: true, streak };
  }
  if (lastLogDate === yesterday) {
    return { isLoggedToday: false, streak };
  }
  // 2+ days ago or null — streak resets
  return { isLoggedToday: false, streak: 0 };
}

export async function logToday(currentStreak, totalDaysLogged, logHistory) {
  const today = getTodayStr();

  const newStreak = Math.min(21, currentStreak + 1);
  const newTotal = totalDaysLogged + 1;
  const newHistory = { ...logHistory, [today]: true };

  await AsyncStorage.setItem(KEYS.LAST_LOG_DATE, today);
  await AsyncStorage.setItem(KEYS.STREAK, newStreak.toString());
  await AsyncStorage.setItem(KEYS.TOTAL_DAYS_LOGGED, newTotal.toString());
  await AsyncStorage.setItem(KEYS.LOG_HISTORY, JSON.stringify(newHistory));

  return { lastLogDate: today, streak: newStreak, totalDaysLogged: newTotal, logHistory: newHistory };
}

// --- Screen Persistence ---

export async function saveScreen(screen) {
  await AsyncStorage.setItem(KEYS.SCREEN, screen);
}

// --- Profile Persistence ---

export async function saveName(name) {
  await AsyncStorage.setItem(KEYS.NAME, name);
}

export async function saveEmail(email) {
  await AsyncStorage.setItem(KEYS.EMAIL, email);
}

export async function saveDemographics({ age, sex, weight, goalWeight }) {
  if (age != null) await AsyncStorage.setItem(KEYS.AGE, age.toString());
  if (sex) await AsyncStorage.setItem(KEYS.SEX, sex);
  if (weight != null)
    await AsyncStorage.setItem(KEYS.WEIGHT, weight.toString());
  if (goalWeight != null)
    await AsyncStorage.setItem(KEYS.GOAL_WEIGHT, goalWeight.toString());
}

export async function saveGoals(goals, experience, injuries) {
  if (goals) await AsyncStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  if (experience) await AsyncStorage.setItem(KEYS.EXPERIENCE, experience);
  if (injuries) await AsyncStorage.setItem(KEYS.INJURIES, injuries);
}

// --- Assessment ---

export async function savePillarScores(scores) {
  await AsyncStorage.setItem(KEYS.PILLAR_SCORES, JSON.stringify(scores));
}

export async function saveFocusPillar(pillarId) {
  await AsyncStorage.setItem(KEYS.FOCUS_PILLAR, pillarId);
}

export async function saveIntakeCompleted() {
  await AsyncStorage.setItem(KEYS.INTAKE_COMPLETED, "true");
}

// --- Challenge Persistence ---

export async function saveChallengeStates(states) {
  await AsyncStorage.setItem(KEYS.CHALLENGE_STATES, JSON.stringify(states));
}

// --- Book Persistence ---

export async function saveReadChapters(chapters) {
  await AsyncStorage.setItem(KEYS.READ_CHAPTERS, JSON.stringify(chapters));
}

// --- Payment Persistence ---

export async function savePaidStatus(code) {
  await AsyncStorage.setItem(KEYS.PAID, "true");
  if (code) await AsyncStorage.setItem(KEYS.ACCESS_CODE, code);
}

export async function saveNewsletterOptIn(optIn) {
  await AsyncStorage.setItem(KEYS.NEWSLETTER_OPT_IN, optIn ? "true" : "false");
}

// --- Theme Persistence ---

export async function saveTheme(value) {
  await AsyncStorage.setItem(KEYS.THEME, value);
}

// --- Milestone Acknowledgment ---

const TRIGGER_MILESTONES = [5, 10, 15];

export function acknowledgeMilestones(lastLoggedDay, existing) {
  if (!lastLoggedDay) return existing || [];
  const ack = existing || [];
  const newAck = TRIGGER_MILESTONES.filter((m) => lastLoggedDay >= m && !ack.includes(m));
  return newAck.length > 0 ? [...ack, ...newAck] : ack;
}

// --- Challenge Calendar Enforcement ---

export function advanceChallengeDay(pillarState, pillarId, taskId, allChallenges) {
  const today = getTodayStr();
  const todayTasks = pillarState.completedTasks[today] || [];
  const isCompleted = todayTasks.includes(taskId);

  // Once a task is checked, it stays checked — no unchecking
  if (isCompleted) return pillarState;

  const newTodayTasks = [...todayTasks, taskId];

  // Check if all available tasks for today are completed
  const challenge = allChallenges[pillarId];
  const availableTasks = challenge.tasks.filter(
    (t) => t.unlockedDay <= pillarState.currentDay,
  );
  const allTasksDone = availableTasks.every((t) =>
    newTodayTasks.includes(t.id),
  );

  let newStreakDays = pillarState.streakDays;
  let newLastCompletionDate = pillarState.lastCompletionDate || null;
  let newCompletedDays = pillarState.completedDays || 0;
  let newLastLoggedChallengeDay = pillarState.lastLoggedChallengeDay || null;

  if (allTasksDone && newLastCompletionDate !== today) {
    newLastCompletionDate = today;
    newCompletedDays += 1;
    newLastLoggedChallengeDay = pillarState.currentDay;

    const yesterday = getYesterdayStr();
    if (
      pillarState.lastCompletionDate === yesterday ||
      pillarState.lastCompletionDate === null
    ) {
      newStreakDays += 1;
    } else if (pillarState.lastCompletionDate !== today) {
      newStreakDays = 1;
    }
  }

  return {
    ...pillarState,
    completedTasks: {
      ...pillarState.completedTasks,
      [today]: newTodayTasks,
    },
    streakDays: newStreakDays,
    lastCompletionDate: newLastCompletionDate,
    completedDays: newCompletedDays,
    lastLoggedChallengeDay: newLastLoggedChallengeDay,
    startDate: pillarState.startDate || today,
  };
}

// --- Bulk Complete All Tasks (Dashboard Log) ---

export function bulkCompleteChallengeTasks(pillarState, pillarId, allChallenges) {
  const today = getTodayStr();
  const todayTasks = pillarState.completedTasks[today] || [];
  const challenge = allChallenges[pillarId];
  const availableTasks = challenge.tasks.filter(
    (t) => t.unlockedDay <= pillarState.currentDay,
  );

  // Mark all available tasks as completed for today
  const allTaskIds = availableTasks.map((t) => t.id);
  const newTodayTasks = [...new Set([...todayTasks, ...allTaskIds])];

  // Check if all were already done (no-op)
  const alreadyAllDone = availableTasks.every((t) => todayTasks.includes(t.id));
  if (alreadyAllDone) return pillarState;

  let newStreakDays = pillarState.streakDays;
  let newLastCompletionDate = pillarState.lastCompletionDate || null;
  let newCompletedDays = pillarState.completedDays || 0;
  let newLastLoggedChallengeDay = pillarState.lastLoggedChallengeDay || null;

  if (newLastCompletionDate !== today) {
    newLastCompletionDate = today;
    newCompletedDays += 1;
    newLastLoggedChallengeDay = pillarState.currentDay;

    const yesterday = getYesterdayStr();
    if (
      pillarState.lastCompletionDate === yesterday ||
      pillarState.lastCompletionDate === null
    ) {
      newStreakDays += 1;
    } else if (pillarState.lastCompletionDate !== today) {
      newStreakDays = 1;
    }
  }

  return {
    ...pillarState,
    completedTasks: {
      ...pillarState.completedTasks,
      [today]: newTodayTasks,
    },
    streakDays: newStreakDays,
    lastCompletionDate: newLastCompletionDate,
    completedDays: newCompletedDays,
    lastLoggedChallengeDay: newLastLoggedChallengeDay,
    startDate: pillarState.startDate || today,
  };
}

// --- Calendar-Based Auto-Advance ---

export function autoAdvanceChallengeDay(pillarState) {
  if (!pillarState || !pillarState.startDate) return pillarState;

  const today = getTodayStr();
  const calendarDay = Math.min(21, daysBetween(pillarState.startDate, today) + 1);

  if (calendarDay <= pillarState.currentDay) return pillarState;

  // Day is advancing — acknowledge milestones from the day the user last logged
  const newAck = acknowledgeMilestones(
    pillarState.lastLoggedChallengeDay,
    pillarState.acknowledgedMilestones,
  );

  return {
    ...pillarState,
    currentDay: calendarDay,
    acknowledgedMilestones: newAck,
  };
}

export function getMissedDays(pillarState) {
  if (!pillarState || !pillarState.startDate) return 0;

  const today = getTodayStr();
  const calendarDay = Math.min(21, daysBetween(pillarState.startDate, today) + 1);
  // Use whichever is higher: stored currentDay (dev controls) or real calendar
  const effectiveDay = Math.max(pillarState.currentDay || 1, calendarDay);
  const completedDays = pillarState.completedDays || 0;
  const pastDays = effectiveDay - 1;
  return Math.max(0, pastDays - completedDays);
}

// --- Reset ---

export async function clearAllData() {
  const allKeys = Object.values(KEYS);
  await AsyncStorage.multiRemove(allKeys);
}

// Soft reset: clears only challenge/streak/log data, keeps profile + payment
export async function softResetProgress() {
  const keysToReset = [
    KEYS.STREAK,
    KEYS.LAST_LOG_DATE,
    KEYS.TOTAL_DAYS_LOGGED,
    KEYS.LOG_HISTORY,
    KEYS.CHALLENGE_STATES,
    KEYS.READ_CHAPTERS,
  ];
  await AsyncStorage.multiRemove(keysToReset);
}

// --- Restore returning user from Firestore ---

export async function restoreUserData(data) {
  const pairs = [
    [KEYS.NAME, data.name || ""],
    [KEYS.EMAIL, data.email || ""],
    [KEYS.AGE, data.age != null ? String(data.age) : ""],
    [KEYS.SEX, data.sex || ""],
    [KEYS.WEIGHT, data.weight != null ? String(data.weight) : ""],
    [KEYS.GOAL_WEIGHT, data.goalWeight != null ? String(data.goalWeight) : ""],
    [KEYS.GOALS, data.goals ? JSON.stringify(data.goals) : ""],
    [KEYS.EXPERIENCE, data.experience || ""],
    [KEYS.INJURIES, data.injuries || ""],
    [KEYS.INTAKE_COMPLETED, data.intakeCompleted ? "true" : ""],
    [KEYS.PILLAR_SCORES, data.pillarScores ? JSON.stringify(data.pillarScores) : ""],
    [KEYS.FOCUS_PILLAR, data.focusPillar || ""],
    [KEYS.PAID, data.paid ? "true" : ""],
    [KEYS.ACCESS_CODE, data.accessCode || ""],
    [KEYS.NEWSLETTER_OPT_IN, data.newsletterOptIn ? "true" : ""],
  ];
  const validPairs = pairs.filter(([, v]) => v !== "");
  await AsyncStorage.multiSet(validPairs);
}

// --- Bulk save for random fill ---

export async function saveAllData({
  name,
  email,
  age,
  sex,
  weight,
  goalWeight,
  goals,
  experience,
  injuries,
  pillarScores,
  focusPillar,
  streak,
  lastLogDate,
  totalDaysLogged,
  logHistory,
  challengeStates,
  readChapters,
  screen,
  paid,
}) {
  const pairs = [];
  if (name) pairs.push([KEYS.NAME, name]);
  if (email) pairs.push([KEYS.EMAIL, email]);
  if (age != null) pairs.push([KEYS.AGE, age.toString()]);
  if (sex) pairs.push([KEYS.SEX, sex]);
  if (weight != null) pairs.push([KEYS.WEIGHT, weight.toString()]);
  if (goalWeight != null) pairs.push([KEYS.GOAL_WEIGHT, goalWeight.toString()]);
  if (goals) pairs.push([KEYS.GOALS, JSON.stringify(goals)]);
  if (experience) pairs.push([KEYS.EXPERIENCE, experience]);
  if (injuries) pairs.push([KEYS.INJURIES, injuries]);
  if (pillarScores)
    pairs.push([KEYS.PILLAR_SCORES, JSON.stringify(pillarScores)]);
  if (focusPillar) pairs.push([KEYS.FOCUS_PILLAR, focusPillar]);
  if (streak != null) pairs.push([KEYS.STREAK, streak.toString()]);
  if (lastLogDate) pairs.push([KEYS.LAST_LOG_DATE, lastLogDate]);
  if (totalDaysLogged != null)
    pairs.push([KEYS.TOTAL_DAYS_LOGGED, totalDaysLogged.toString()]);
  if (logHistory) pairs.push([KEYS.LOG_HISTORY, JSON.stringify(logHistory)]);
  if (challengeStates)
    pairs.push([KEYS.CHALLENGE_STATES, JSON.stringify(challengeStates)]);
  if (readChapters)
    pairs.push([KEYS.READ_CHAPTERS, JSON.stringify(readChapters)]);
  if (screen) pairs.push([KEYS.SCREEN, screen]);
  if (paid) pairs.push([KEYS.PAID, "true"]);
  pairs.push([KEYS.INTAKE_COMPLETED, "true"]);

  await AsyncStorage.multiSet(pairs);
}
