import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, StatusBar, View, Text, TextInput, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from "react-native";

import { WelcomeScreen } from "./components/WelcomeScreen";
import { IntakePersonal } from "./components/IntakePersonal";
import { IntakeDemographics } from "./components/IntakeDemographics";
import { IntakeGoals } from "./components/IntakeGoals";
import { IntakeMovement } from "./components/IntakeMovement";
import { IntakeNutrition } from "./components/IntakeNutrition";
import { IntakeBreathingSleep } from "./components/IntakeBreathingSleep";
import { IntakeMindfulness } from "./components/IntakeMindfulness";
import { SafetyNotice } from "./components/SafetyNotice";
import { Dashboard } from "./components/Dashboard";
import { WorkoutList } from "./components/WorkoutList";
import { WorkoutDetail } from "./components/WorkoutDetail";

import { NutritionSummary } from "./components/NutritionSummary";
import { PillarsOverview } from "./components/PillarsOverview";
import { SupportScreen } from "./components/SupportScreen";
import { LegalScreen } from "./components/LegalScreen";
import { ChallengeProgress } from "./components/ChallengeProgress";
import { ChallengeDetail } from "./components/ChallengeDetail";
import { BookScreen } from "./components/BookScreen";
import { ChapterView } from "./components/ChapterView";
import { PaymentGate } from "./components/PaymentGate";
import { AssessmentResults } from "./components/AssessmentResults";
import { LandingPage } from "./components/LandingPage";
import { MeditationList } from "./components/MeditationList";
import { MeditationPlayer } from "./components/MeditationPlayer";
import { darkColors, lightColors } from "./styles/theme";
import { ThemeProvider } from "./styles/ThemeContext";
import { TWENTY_ONE_DAY_CHALLENGES, PILLARS } from "./constants";
import { initAnalytics, trackScreen } from "./lib/analytics";
import { injectWebStyles } from "./lib/webStyles";

import {
  migrateIfNeeded,
  getOrCreateUserId,
  loadAllData,
  evaluateDailyLogOnLoad,
  logToday,
  saveScreen,
  saveName,
  saveEmail,
  saveDemographics,
  saveGoals,
  savePillarScores,
  saveFocusPillar,
  saveIntakeCompleted,
  saveChallengeStates,
  saveReadChapters,
  advanceChallengeDay,
  bulkCompleteChallengeTasks,
  autoAdvanceChallengeDay,
  acknowledgeMilestones,
  clearAllData,
  softResetProgress,
  saveAllData,
  savePaidStatus,
  saveTheme,
  restoreUserData,
  setUserId,
} from "./lib/storage";

import {
  syncUserProfile,
  syncPillarScores as syncPillarScoresCloud,
  syncDailyLog,
  syncChallengeProgress,
  syncChallengeTasks,
  syncBookProgress,
  syncAllData as syncAllDataCloud,
  validateAccessCode,
  checkPaidStatus,
  deleteUserData,
  syncUserReset,
  findUserByEmail,
} from "./lib/sync";

const DEFAULT_SCORES = {
  breathing: 5,
  sleep: 5,
  hydration: 5,
  nutrition: 5,
  movement: 5,
  environment: 5,
  mindfulness: 5,
};

function buildInitialChallengeStates() {
  const initial = {};
  Object.keys(TWENTY_ONE_DAY_CHALLENGES).forEach((pillarId) => {
    initial[pillarId] = {
      currentDay: 1,
      completedTasks: {},
      streakDays: 0,
      completedDays: 0,
      lastCompletionDate: null,
      startDate: null,
      acknowledgedMilestones: [],
      lastLoggedChallengeDay: null,
    };
  });
  return initial;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("LANDING");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedMeditation, setSelectedMeditation] = useState(null);

  // Daily logging state
  const [isLoggedToday, setIsLoggedToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalDaysLogged, setTotalDaysLogged] = useState(0);
  const [lastLogDate, setLastLogDate] = useState(null);
  const [logHistory, setLogHistory] = useState({});

  // Scoring state
  const [pillarScores, setPillarScores] = useState(DEFAULT_SCORES);

  const [isPaid, setIsPaid] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState(null);
  const [userSex, setUserSex] = useState(null);
  const [userWeight, setUserWeight] = useState(null);
  const [userGoalWeight, setUserGoalWeight] = useState(null);
  const [userGoals, setUserGoals] = useState(null);
  const [userExperience, setUserExperience] = useState(null);
  const [focusPillar, setFocusPillar] = useState("breathing");

  // 21-day challenge states
  const [selectedChallengePillar, setSelectedChallengePillar] = useState(null);

  // Book reading states
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [readChapters, setReadChapters] = useState({});
  const [challengeStates, setChallengeStates] = useState(
    buildInitialChallengeStates,
  );

  // Intake form data (persisted across back navigation)
  const [intakeData, setIntakeData] = useState({});
  const [isCheckingAccount, setIsCheckingAccount] = useState(false);
  const [showReturningUserModal, setShowReturningUserModal] = useState(false);
  const pendingRestoreRef = useRef(null);

  // Email verification state
  const [verificationStep, setVerificationStep] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Theme state
  const [isDark, setIsDark] = useState(true);

  // User ID ref (stable across renders, doesn't need to trigger re-renders)
  const userIdRef = useRef(null);

  useEffect(() => {
    initAnalytics();
    injectWebStyles();
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      // Run migration first (v1 flat keys → v2 @al_ keys)
      await migrateIfNeeded();

      // Ensure we have a userId
      userIdRef.current = await getOrCreateUserId();

      // Load all data in one batch
      const data = await loadAllData();

      if (data.theme) setIsDark(data.theme === 'dark');
      if (data.paid) setIsPaid(true);
      if (data.email) setUserEmail(data.email);

      // Skip payment gate — app is free for now
      setIsPaid(true);
      if (data.screen) {
        if ((data.screen === "PAYMENT_GATE" || data.screen === "ASSESSMENT_RESULTS") && data.intakeCompleted) {
          setCurrentScreen("DASHBOARD");
        } else {
          setCurrentScreen(data.screen);
        }
      }
      if (data.name) setUserName(data.name);
      if (data.age) setUserAge(data.age);
      if (data.sex) setUserSex(data.sex);
      if (data.weight) setUserWeight(data.weight);
      if (data.goalWeight) setUserGoalWeight(data.goalWeight);
      if (data.goals) setUserGoals(data.goals);
      if (data.experience) setUserExperience(data.experience);
      if (data.focusPillar) setFocusPillar(data.focusPillar);
      if (data.pillarScores) setPillarScores(data.pillarScores);
      if (data.challengeStates) {
        const advanced = {};
        let didAdvance = false;
        for (const pillarId of Object.keys(data.challengeStates)) {
          advanced[pillarId] = autoAdvanceChallengeDay(data.challengeStates[pillarId]);
          if (advanced[pillarId].currentDay !== data.challengeStates[pillarId].currentDay) {
            didAdvance = true;
          }
        }
        setChallengeStates(advanced);
        if (didAdvance) saveChallengeStates(advanced);
      }
      if (data.readChapters) setReadChapters(data.readChapters);
      setTotalDaysLogged(data.totalDaysLogged);
      setLogHistory(data.logHistory);
      setLastLogDate(data.lastLogDate);

      // Evaluate streak based on calendar dates
      const { isLoggedToday: logged, streak: evaluatedStreak } =
        evaluateDailyLogOnLoad(data.lastLogDate, data.streak);
      setIsLoggedToday(logged);
      setStreak(evaluatedStreak);
    } catch (error) {
      console.log("Error loading saved data:", error);
    }
  };

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await saveTheme(next ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const themeColors = isDark ? darkColors : lightColors;

  const navigateTo = async (screen) => {
    setCurrentScreen(screen);
    trackScreen(screen);
    try {
      await saveScreen(screen);
    } catch (error) {
      console.log("Error saving screen:", error);
    }
  };

  // --- Daily Check-In (date-aware, idempotent) ---

  const handleToggleLog = async () => {
    if (isLoggedToday) return; // Already logged today — do nothing

    try {
      const result = await logToday(streak, totalDaysLogged, logHistory);
      setIsLoggedToday(true);
      setStreak(result.streak);
      setTotalDaysLogged(result.totalDaysLogged);
      setLastLogDate(result.lastLogDate);
      setLogHistory(result.logHistory);

      // Fire-and-forget cloud sync
      if (userIdRef.current) {
        syncDailyLog(
          userIdRef.current,
          result.lastLogDate,
          result.streak,
          result.totalDaysLogged,
        );
      }
    } catch (error) {
      console.log("Error logging today:", error);
    }
  };

  // --- Dashboard Log (bulk-completes all challenge tasks) ---

  const handleDashboardLog = async () => {
    const pillarState = challengeStates[focusPillar];
    const updated = bulkCompleteChallengeTasks(
      pillarState,
      focusPillar,
      TWENTY_ONE_DAY_CHALLENGES,
    );

    // No change (already all done)
    if (updated === pillarState) return;

    const newChallengeStates = { ...challengeStates, [focusPillar]: updated };
    setChallengeStates(newChallengeStates);

    try {
      await saveChallengeStates(newChallengeStates);

      // Also keep generic streak in sync for ProgressSummary etc.
      if (!isLoggedToday) {
        const result = await logToday(streak, totalDaysLogged, logHistory);
        setIsLoggedToday(true);
        setStreak(result.streak);
        setTotalDaysLogged(result.totalDaysLogged);
        setLastLogDate(result.lastLogDate);
        setLogHistory(result.logHistory);
      }

      // Fire-and-forget cloud sync
      if (userIdRef.current) {
        const today = new Date().toISOString().split("T")[0];
        const todayTasks = updated.completedTasks[today] || [];
        syncChallengeProgress(userIdRef.current, focusPillar, updated);
        syncChallengeTasks(userIdRef.current, focusPillar, today, todayTasks);
        syncDailyLog(userIdRef.current, today, streak + 1, totalDaysLogged + 1);
      }
    } catch (error) {
      console.log("Error in dashboard log:", error);
    }
  };

  // --- Intake Handlers ---

  const handleSaveName = async (name, email) => {
    setUserName(name);
    if (email) setUserEmail(email);
    setIntakeData((prev) => ({ ...prev, personal: { name, email } }));
    try {
      await saveName(name);
      if (email) await saveEmail(email);

      // Check if returning user exists in Firestore before syncing
      if (email) {
        setIsCheckingAccount(true);
        try {
          const existing = await findUserByEmail(email);
          if (existing) {
            // Reuse the original userId
            const orphanId = userIdRef.current;
            if (existing.id !== orphanId) {
              userIdRef.current = existing.id;
              await setUserId(existing.id);
              deleteUserData(orphanId);
            }

            if (existing.intakeCompleted) {
              // EMAIL_VERIFICATION: set to true once Resend domain is verified
              const EMAIL_VERIFICATION_ENABLED = false;

              if (EMAIL_VERIFICATION_ENABLED) {
                // Require email verification to restore
                setVerificationEmail(email.trim().toLowerCase());
                setVerificationStep("prompt");
                setVerificationError(null);
                setVerificationCode("");
                setIsCheckingAccount(false);
                setShowReturningUserModal(true);
                return;
              }

              // No verification — restore directly
              await restoreUserData(existing);
              await saveName(existing.name);
              setUserName(existing.name);
              if (existing.age) setUserAge(existing.age);
              if (existing.sex) setUserSex(existing.sex);
              if (existing.weight) setUserWeight(existing.weight);
              if (existing.goalWeight) setUserGoalWeight(existing.goalWeight);
              if (existing.goals) setUserGoals(existing.goals);
              if (existing.experience) setUserExperience(existing.experience);
              if (existing.pillarScores) setPillarScores(existing.pillarScores);
              if (existing.focusPillar) setFocusPillar(existing.focusPillar);
              setIsPaid(true);
              setIsCheckingAccount(false);
              syncUserProfile(userIdRef.current, { name });
              navigateTo("DASHBOARD");
              return;
            }
            // Incomplete account — continue intake normally
          }
        } finally {
          setIsCheckingAccount(false);
        }
      }

      // No existing user found — sync to the new userId
      if (userIdRef.current) {
        syncUserProfile(userIdRef.current, { name, email: email || null });
      }
    } catch (error) {
      console.log("Error saving name:", error);
      setIsCheckingAccount(false);
    }
    navigateTo("INTAKE_DEMOGRAPHICS");
  };

  const handleSaveDemographics = async (demographics, formData) => {
    setIntakeData((prev) => ({ ...prev, demographics: formData || demographics }));
    if (demographics.age) setUserAge(demographics.age);
    if (demographics.sex) setUserSex(demographics.sex);
    if (demographics.weight) setUserWeight(demographics.weight);
    if (demographics.goalWeight) setUserGoalWeight(demographics.goalWeight);
    try {
      await saveDemographics(demographics);

      if (userIdRef.current) {
        syncUserProfile(userIdRef.current, demographics);
      }
    } catch (error) {
      console.log("Error saving demographics:", error);
    }
    navigateTo("INTAKE_GOALS");
  };

  const handleSaveGoals = async (goals, experience, injuries) => {
    setIntakeData((prev) => ({ ...prev, goals: { selectedGoals: goals, experience, injuries } }));
    setUserGoals(goals);
    setUserExperience(experience);
    try {
      await saveGoals(goals, experience, injuries);

      if (userIdRef.current) {
        syncUserProfile(userIdRef.current, { goals, experience, injuries });
      }
    } catch (error) {
      console.log("Error saving goals:", error);
    }
    navigateTo("INTAKE_MOVEMENT");
  };

  // --- Assessment Finalization ---

  const finalizeAssessment = async () => {
    // Find weakest pillar; on tie, pick the one with lower PILLARS index (higher priority)
    const pillarOrder = PILLARS.map((p) => p.id);
    const weakestPillar = pillarOrder.reduce((weakestId, id) => {
      const score = pillarScores[id] ?? 10;
      const weakestScore = pillarScores[weakestId] ?? 10;
      return score < weakestScore ? id : weakestId;
    }, pillarOrder[0]);
    setFocusPillar(weakestPillar);

    try {
      await savePillarScores(pillarScores);
      await saveFocusPillar(weakestPillar);
      await saveIntakeCompleted();

      // Fire-and-forget cloud sync
      if (userIdRef.current) {
        syncPillarScoresCloud(userIdRef.current, pillarScores, weakestPillar);
        syncUserProfile(userIdRef.current, {
          disclaimerAcceptedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.log("Error saving assessment:", error);
    }

    // Skip payment gate — app is free for now
    setIsPaid(true);
    navigateTo("ASSESSMENT_RESULTS");
  };

  // --- Challenge Handlers ---

  const handleSelectChallenge = (pillarId) => {
    setSelectedChallengePillar(pillarId);
    navigateTo("CHALLENGE_DETAIL");
  };

  const handleToggleChallengeTask = async (pillarId, taskId) => {
    let allDoneNow = false;

    setChallengeStates((prev) => {
      const pillarState = prev[pillarId];
      const updatedPillarState = advanceChallengeDay(
        pillarState,
        pillarId,
        taskId,
        TWENTY_ONE_DAY_CHALLENGES,
      );

      // Detect if this toggle completed all tasks for today
      const today = new Date().toISOString().split("T")[0];
      const prevCompletion = pillarState.lastCompletionDate;
      const newCompletion = updatedPillarState.lastCompletionDate;
      if (newCompletion === today && prevCompletion !== today) {
        allDoneNow = true;
      }

      const newState = {
        ...prev,
        [pillarId]: updatedPillarState,
      };

      // Save locally
      saveChallengeStates(newState).catch((error) =>
        console.log("Error saving challenge states:", error),
      );

      // Fire-and-forget cloud sync
      if (userIdRef.current) {
        const todayTasks = updatedPillarState.completedTasks[today] || [];
        syncChallengeProgress(
          userIdRef.current,
          pillarId,
          updatedPillarState,
        );
        syncChallengeTasks(userIdRef.current, pillarId, today, todayTasks);
      }

      return newState;
    });

    // If all tasks just completed, also update the global daily streak
    if (allDoneNow && !isLoggedToday) {
      try {
        const result = await logToday(streak, totalDaysLogged, logHistory);
        setIsLoggedToday(true);
        setStreak(result.streak);
        setTotalDaysLogged(result.totalDaysLogged);
        setLastLogDate(result.lastLogDate);
        setLogHistory(result.logHistory);

        if (userIdRef.current) {
          const today = new Date().toISOString().split("T")[0];
          syncDailyLog(userIdRef.current, today, result.streak, result.totalDaysLogged);
        }
      } catch (error) {
        console.log("Error updating daily streak from challenge:", error);
      }
    }
  };

  // Dev mode: Simulate time passing for challenge testing
  // startDate is FIXED — never modified. Only currentDay changes.
  const handleDevSimulateDay = async (pillarId, action) => {
    const pillarState = challengeStates[pillarId];
    const today = new Date().toISOString().split("T")[0];
    let updated;

    switch (action) {
      case "forward1": {
        const curDay = pillarState.currentDay || 1;
        if (curDay >= 21) return;
        // Clear today's tasks + lastCompletionDate so next log counts as new
        const { [today]: _removed, ...restTasks } = pillarState.completedTasks || {};
        // Acknowledge milestones from last logged day (same as autoAdvance)
        const newAck = acknowledgeMilestones(
          pillarState.lastLoggedChallengeDay,
          pillarState.acknowledgedMilestones,
        );
        updated = {
          ...pillarState,
          currentDay: curDay + 1,
          completedTasks: restTasks,
          lastCompletionDate: null,
          acknowledgedMilestones: newAck,
        };
        break;
      }
      case "back1": {
        const curDay = pillarState.currentDay || 1;
        if (curDay <= 1) return;
        const { [today]: _removed2, ...restTasks2 } = pillarState.completedTasks || {};
        updated = {
          ...pillarState,
          currentDay: curDay - 1,
          completedTasks: restTasks2,
          completedDays: Math.max(0, (pillarState.completedDays || 0) - 1),
          lastCompletionDate: null,
        };
        break;
      }
      case "reset":
        updated = {
          currentDay: 1,
          completedTasks: {},
          streakDays: 0,
          completedDays: 0,
          lastCompletionDate: null,
          startDate: today,
          acknowledgedMilestones: [],
          lastLoggedChallengeDay: null,
        };
        setIsLoggedToday(false);
        setStreak(0);
        setTotalDaysLogged(0);
        setLastLogDate(null);
        setLogHistory({});
        break;
      default:
        return;
    }

    const newStates = { ...challengeStates, [pillarId]: updated };
    setChallengeStates(newStates);
    saveChallengeStates(newStates).catch((error) =>
      console.log("Error saving challenge states:", error),
    );
  };

  // Dev mode: Set challenge day directly for testing
  const handleSetChallengeDay = async (pillarId, day) => {
    setChallengeStates((prev) => {
      const newState = {
        ...prev,
        [pillarId]: {
          ...prev[pillarId],
          currentDay: day,
        },
      };

      saveChallengeStates(newState).catch((error) =>
        console.log("Error saving challenge states:", error),
      );

      return newState;
    });
  };

  // --- Book Chapter Handlers ---

  const handleSelectChapter = (chapterId) => {
    setSelectedChapterId(chapterId);
    navigateTo("CHAPTER_VIEW");
  };

  const handleMarkChapterRead = async (chapterId, isRead) => {
    const newReadChapters = { ...readChapters, [chapterId]: isRead };
    setReadChapters(newReadChapters);
    try {
      await saveReadChapters(newReadChapters);

      // Fire-and-forget cloud sync
      if (userIdRef.current) {
        syncBookProgress(userIdRef.current, chapterId, isRead);
      }
    } catch (error) {
      console.log("Error saving read chapters:", error);
    }
  };

  // --- Payment Gate ---

  const handleCodeValidated = async (code) => {
    setIsPaid(true);
    try {
      await savePaidStatus(code);

      // Restore returning user data after code validates
      const pending = pendingRestoreRef.current;
      if (pending) {
        await restoreUserData(pending);
        await saveName(pending.name);

        if (pending.age) setUserAge(pending.age);
        if (pending.sex) setUserSex(pending.sex);
        if (pending.weight) setUserWeight(pending.weight);
        if (pending.goalWeight) setUserGoalWeight(pending.goalWeight);
        if (pending.goals) setUserGoals(pending.goals);
        if (pending.experience) setUserExperience(pending.experience);
        if (pending.pillarScores) setPillarScores(pending.pillarScores);
        if (pending.focusPillar) setFocusPillar(pending.focusPillar);

        syncUserProfile(userIdRef.current, { name: pending.name });
        pendingRestoreRef.current = null;
      }
    } catch (error) {
      console.log("Error saving paid status:", error);
    }
    navigateTo("DASHBOARD");
  };

  const handleValidateCode = async (code) => {
    if (!userIdRef.current) {
      userIdRef.current = await getOrCreateUserId();
    }
    return validateAccessCode(userIdRef.current, userEmail, code);
  };

  // --- Email Verification ---

  const handleSendVerificationCode = async () => {
    setVerificationStep("sending");
    setVerificationError(null);
    try {
      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verificationEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVerificationError(data.error || "Failed to send code.");
        setVerificationStep("prompt");
        return;
      }
      setVerificationStep("entering");
    } catch (error) {
      setVerificationError("Network error. Please try again.");
      setVerificationStep("prompt");
    }
  };

  const handleVerifyCode = async () => {
    setVerificationStep("verifying");
    setVerificationError(null);
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verificationEmail, code: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVerificationError(data.error || "Verification failed.");
        setVerificationStep("entering");
        return;
      }

      // Verified — restore account
      const userData = data.userData;
      if (userData.id) {
        const orphanId = userIdRef.current;
        userIdRef.current = userData.id;
        await setUserId(userData.id);
        if (orphanId && orphanId !== userData.id) {
          deleteUserData(orphanId);
        }
      }

      await restoreUserData(userData);
      await saveName(userData.name);
      setUserName(userData.name);
      if (userData.age) setUserAge(userData.age);
      if (userData.sex) setUserSex(userData.sex);
      if (userData.weight) setUserWeight(userData.weight);
      if (userData.goalWeight) setUserGoalWeight(userData.goalWeight);
      if (userData.goals) setUserGoals(userData.goals);
      if (userData.experience) setUserExperience(userData.experience);
      if (userData.pillarScores) setPillarScores(userData.pillarScores);
      if (userData.focusPillar) setFocusPillar(userData.focusPillar);
      setIsPaid(true);

      setShowReturningUserModal(false);
      setVerificationStep(null);
      navigateTo("DASHBOARD");
    } catch (error) {
      setVerificationError("Network error. Please try again.");
      setVerificationStep("entering");
    }
  };

  // --- Random Fill (Dev/Testing) ---

  const handleRandomFill = async () => {
    const names = [
      "Alex",
      "Jordan",
      "Sam",
      "Taylor",
      "Morgan",
      "Casey",
      "Riley",
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomEmail = `${randomName.toLowerCase()}@test.com`;

    const randomScores = {
      breathing: Math.floor(Math.random() * 10) + 1,
      sleep: Math.floor(Math.random() * 10) + 1,
      hydration: Math.floor(Math.random() * 10) + 1,
      nutrition: Math.floor(Math.random() * 10) + 1,
      movement: Math.floor(Math.random() * 10) + 1,
      environment: Math.floor(Math.random() * 10) + 1,
      mindfulness: Math.floor(Math.random() * 10) + 1,
    };

    const entries = Object.entries(randomScores);
    const weakest = entries.reduce((prev, curr) =>
      curr[1] < prev[1] ? curr : prev,
    );
    const randomStreak = Math.floor(Math.random() * 15);

    // Set all states
    setUserName(randomName);
    setPillarScores(randomScores);
    setFocusPillar(weakest[0]);
    setStreak(randomStreak);

    const randomAge = 25 + Math.floor(Math.random() * 30);
    const randomSex = ["Male", "Female", "Other"][Math.floor(Math.random() * 3)];
    const randomWeight = 140 + Math.floor(Math.random() * 80);
    const randomGoalWeight = 130 + Math.floor(Math.random() * 60);
    const randomGoals = ["fat", "energy"];
    const randomExperience = ["beg", "int", "adv"][Math.floor(Math.random() * 3)];

    setUserAge(randomAge);
    setUserSex(randomSex);
    setUserWeight(randomWeight);
    setUserGoalWeight(randomGoalWeight);
    setUserGoals(randomGoals);
    setUserExperience(randomExperience);

    setIsPaid(true);
    setUserEmail(randomEmail);

    const fillData = {
      name: randomName,
      email: randomEmail,
      age: randomAge,
      sex: randomSex,
      weight: randomWeight,
      goalWeight: randomGoalWeight,
      goals: randomGoals,
      experience: randomExperience,
      injuries: "",
      pillarScores: randomScores,
      focusPillar: weakest[0],
      streak: randomStreak,
      screen: "DASHBOARD",
      paid: true,
    };

    try {
      await saveAllData(fillData);

      // Ensure userId exists and sync
      if (!userIdRef.current) {
        userIdRef.current = await getOrCreateUserId();
      }
      syncAllDataCloud(userIdRef.current, {
        ...fillData,
        intakeCompleted: true,
      });
    } catch (error) {
      console.log("Error saving random data:", error);
    }

    navigateTo("DASHBOARD");
  };

  // --- Reset ---

  const handleReset = async () => {
    const userId = userIdRef.current;
    try {
      await softResetProgress();
    } catch (error) {
      console.log("Error resetting progress:", error);
    }
    if (userId) {
      syncUserReset(userId);
    }
    // Reset progress state only — keep profile, payment, userId
    setIsLoggedToday(false);
    setStreak(0);
    setTotalDaysLogged(0);
    setLastLogDate(null);
    setLogHistory({});
    setSelectedWorkout(null);
    setSelectedMeditation(null);
    setSelectedChallengePillar(null);
    setSelectedChapterId(null);
    setReadChapters({});
    setChallengeStates(buildInitialChallengeStates());
    navigateTo("DASHBOARD");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "LANDING":
        return <LandingPage onGetStarted={() => navigateTo("INTAKE_PERSONAL")} />;
      case "WELCOME":
        return (
          <WelcomeScreen
            onNext={() => navigateTo("INTAKE_PERSONAL")}
            onRandomFill={handleRandomFill}
          />
        );
      case "INTAKE_PERSONAL":
        return (
          <IntakePersonal
            initialData={intakeData.personal}
            onNext={handleSaveName}
            onBack={() => navigateTo("LANDING")}
          />
        );
      case "INTAKE_DEMOGRAPHICS":
        return (
          <IntakeDemographics
            initialData={intakeData.demographics}
            onNext={handleSaveDemographics}
            onBack={() => navigateTo("INTAKE_PERSONAL")}
          />
        );
      case "INTAKE_GOALS":
        return (
          <IntakeGoals
            initialData={intakeData.goals}
            onNext={handleSaveGoals}
            onBack={() => navigateTo("INTAKE_DEMOGRAPHICS")}
          />
        );
      case "INTAKE_MOVEMENT":
        return (
          <IntakeMovement
            initialData={intakeData.movement}
            onNext={(score, formData) => {
              setPillarScores((p) => ({ ...p, movement: score }));
              setIntakeData((prev) => ({ ...prev, movement: formData }));
              navigateTo("INTAKE_NUTRITION");
            }}
            onBack={() => navigateTo("INTAKE_GOALS")}
          />
        );
      case "INTAKE_NUTRITION":
        return (
          <IntakeNutrition
            initialData={intakeData.nutrition}
            onNext={(nScore, hScore, formData) => {
              setPillarScores((p) => ({
                ...p,
                nutrition: nScore,
                hydration: hScore,
              }));
              setIntakeData((prev) => ({ ...prev, nutrition: formData }));
              navigateTo("INTAKE_BREATHING_SLEEP");
            }}
            onBack={() => navigateTo("INTAKE_MOVEMENT")}
          />
        );
      case "INTAKE_BREATHING_SLEEP":
        return (
          <IntakeBreathingSleep
            initialData={intakeData.breathingSleep}
            onNext={(bScore, sScore, formData) => {
              setPillarScores((p) => ({
                ...p,
                breathing: bScore,
                sleep: sScore,
              }));
              setIntakeData((prev) => ({ ...prev, breathingSleep: formData }));
              navigateTo("INTAKE_MINDFULNESS");
            }}
            onBack={() => navigateTo("INTAKE_NUTRITION")}
          />
        );
      case "INTAKE_MINDFULNESS":
        return (
          <IntakeMindfulness
            initialData={intakeData.mindfulness}
            onNext={(mScore, eScore, formData) => {
              setPillarScores((p) => ({
                ...p,
                mindfulness: mScore,
                environment: eScore,
              }));
              setIntakeData((prev) => ({ ...prev, mindfulness: formData }));
              navigateTo("SAFETY_NOTICE");
            }}
            onBack={() => navigateTo("INTAKE_BREATHING_SLEEP")}
          />
        );
      case "SAFETY_NOTICE":
        return (
          <SafetyNotice
            onNext={finalizeAssessment}
            onBack={() => navigateTo("INTAKE_MINDFULNESS")}
          />
        );
      case "ASSESSMENT_RESULTS":
        return (
          <AssessmentResults
            userName={userName}
            pillarScores={pillarScores}
            focusPillar={focusPillar}
            onContinue={() => navigateTo("DASHBOARD")}
          />
        );
      case "PAYMENT_GATE":
        return (
          <PaymentGate
            userName={userName}
            pillarScores={pillarScores}
            focusPillar={focusPillar}
            userEmail={userEmail}
            onCodeValidated={handleCodeValidated}
            validateCode={handleValidateCode}
            isReturningUser={pendingRestoreRef.current != null}
          />
        );
      case "DASHBOARD":
        return (
          <Dashboard
            userName={userName}
            focusPillarId={focusPillar}
            challengeState={challengeStates[focusPillar]}
            onToggleLog={handleDashboardLog}
            onNavigate={navigateTo}
            onSelectWorkout={(w) => {
              setSelectedWorkout(w);
              navigateTo("WORKOUT_DETAIL");
            }}
            streak={streak}
            totalDaysLogged={totalDaysLogged}
            onSetDay={handleSetChallengeDay}
            onDevSimulate={handleDevSimulateDay}
            onReset={handleReset}
          />
        );
      case "WORKOUT_LIST":
        return (
          <WorkoutList
            onNavigate={navigateTo}
            onSelectWorkout={(w) => {
              setSelectedWorkout(w);
              navigateTo("WORKOUT_DETAIL");
            }}
          />
        );
      case "WORKOUT_DETAIL":
        return (
          <WorkoutDetail
            workout={selectedWorkout}
            onBack={() => navigateTo("WORKOUT_LIST")}
            onNavigate={navigateTo}
          />
        );
      case "NUTRITION_SUMMARY":
        return (
          <NutritionSummary
            onNavigate={navigateTo}
            weight={userWeight}
            age={userAge}
            sex={userSex}
            goals={userGoals}
            experience={userExperience}
          />
        );
      case "MEDITATION_LIST":
        return (
          <MeditationList
            onNavigate={navigateTo}
            onSelectMeditation={(m) => {
              setSelectedMeditation(m);
              navigateTo("MEDITATION_PLAYER");
            }}
          />
        );
      case "MEDITATION_PLAYER":
        return selectedMeditation ? (
          <MeditationPlayer
            meditation={selectedMeditation}
            onBack={() => navigateTo("MEDITATION_LIST")}
            onNavigate={navigateTo}
          />
        ) : (
          <MeditationList
            onNavigate={navigateTo}
            onSelectMeditation={(m) => {
              setSelectedMeditation(m);
              navigateTo("MEDITATION_PLAYER");
            }}
          />
        );
      case "PILLARS_OVERVIEW":
        return <PillarsOverview onNavigate={navigateTo} pillarScores={pillarScores} />;
      case "SUPPORT":
        return <SupportScreen onNavigate={navigateTo} />;
      case "LEGAL_DISCLAIMER":
        return <LegalScreen type="LEGAL_DISCLAIMER" onNavigate={navigateTo} />;
      case "PRIVACY_POLICY":
        return <LegalScreen type="PRIVACY_POLICY" onNavigate={navigateTo} />;
      case "HELP_SUPPORT":
        return <LegalScreen type="HELP_SUPPORT" onNavigate={navigateTo} />;
      case "BOOK":
        return (
          <BookScreen
            onNavigate={navigateTo}
            onSelectChapter={handleSelectChapter}
            readChapters={readChapters}
          />
        );
      case "CHAPTER_VIEW":
        return (
          <ChapterView
            chapterId={selectedChapterId}
            onNavigate={(screen, chapterId) => {
              if (screen === "CHAPTER_VIEW" && chapterId) {
                setSelectedChapterId(chapterId);
              } else {
                navigateTo(screen);
              }
            }}
            onMarkRead={handleMarkChapterRead}
            isRead={readChapters[selectedChapterId]}
          />
        );
      case "CHALLENGE_PROGRESS":
        return (
          <ChallengeProgress
            challengeStates={challengeStates}
            focusPillar={focusPillar}
            onSelectChallenge={handleSelectChallenge}
            onNavigate={navigateTo}
          />
        );
      case "CHALLENGE_DETAIL":
        return selectedChallengePillar ? (
          <ChallengeDetail
            pillarId={selectedChallengePillar}
            challengeState={challengeStates[selectedChallengePillar]}
            onToggleTask={handleToggleChallengeTask}
            onNavigate={navigateTo}
            onSetDay={handleSetChallengeDay}
            onDevSimulate={handleDevSimulateDay}
          />
        ) : (
          <ChallengeProgress
            challengeStates={challengeStates}
            focusPillar={focusPillar}
            onSelectChallenge={handleSelectChallenge}
            onNavigate={navigateTo}
          />
        );
      default:
        return <LandingPage onGetStarted={() => navigateTo("INTAKE_PERSONAL")} />;
    }
  };

  return (
    <ThemeProvider value={{ colors: themeColors, isDark, toggleTheme }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={themeColors.background}
        />
        {renderScreen()}
        {isCheckingAccount && (
          <View style={overlayStyles.container}>
            <View style={overlayStyles.box}>
              <ActivityIndicator size="large" color="#13ec13" />
              <Text style={overlayStyles.text}>Setting up your profile...</Text>
            </View>
          </View>
        )}
        <Modal
          visible={showReturningUserModal}
          transparent
          animationType="fade"
          onRequestClose={() => {}}
        >
          <View style={overlayStyles.container}>
            <View style={overlayStyles.modalBox}>
              {(verificationStep === "prompt" || verificationStep === "sending") && (
                <>
                  <Text style={overlayStyles.modalTitle}>Welcome Back!</Text>
                  <Text style={overlayStyles.modalBody}>
                    We found an account with this email. To restore your progress, we'll send a verification code to:
                    {"\n\n"}
                    <Text style={{ fontWeight: "700", color: "#13ec13" }}>{verificationEmail}</Text>
                  </Text>
                  {verificationError && (
                    <Text style={overlayStyles.errorText}>{verificationError}</Text>
                  )}
                  <TouchableOpacity
                    style={[overlayStyles.modalButton, verificationStep === "sending" && { opacity: 0.6 }]}
                    onPress={verificationStep !== "sending" ? handleSendVerificationCode : undefined}
                    activeOpacity={0.8}
                  >
                    {verificationStep === "sending" ? (
                      <ActivityIndicator size="small" color="#111" />
                    ) : (
                      <Text style={overlayStyles.modalButtonText}>Send Code</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}

              {(verificationStep === "entering" || verificationStep === "verifying") && (
                <>
                  <Text style={overlayStyles.modalTitle}>Enter Verification Code</Text>
                  <Text style={overlayStyles.modalBody}>
                    We sent a 6-digit code to{" "}
                    <Text style={{ fontWeight: "700", color: "#13ec13" }}>{verificationEmail}</Text>
                  </Text>
                  <TextInput
                    value={verificationCode}
                    onChangeText={(t) => setVerificationCode(t.replace(/[^0-9]/g, "").slice(0, 6))}
                    placeholder="000000"
                    placeholderTextColor="#555"
                    keyboardType="numeric"
                    maxLength={6}
                    style={overlayStyles.codeInput}
                    autoFocus
                  />
                  {verificationError && (
                    <Text style={overlayStyles.errorText}>{verificationError}</Text>
                  )}
                  <TouchableOpacity
                    style={[overlayStyles.modalButton, (verificationStep === "verifying" || verificationCode.length < 6) && { opacity: 0.6 }]}
                    onPress={verificationStep !== "verifying" && verificationCode.length === 6 ? handleVerifyCode : undefined}
                    activeOpacity={0.8}
                  >
                    {verificationStep === "verifying" ? (
                      <ActivityIndicator size="small" color="#111" />
                    ) : (
                      <Text style={overlayStyles.modalButtonText}>Verify</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSendVerificationCode}
                    style={{ marginTop: 12 }}
                  >
                    <Text style={overlayStyles.linkText}>Resend Code</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                onPress={() => {
                  setShowReturningUserModal(false);
                  setVerificationStep(null);
                  setVerificationError(null);
                  setVerificationCode("");
                }}
                style={{ marginTop: 16 }}
              >
                <Text style={overlayStyles.linkText}>Use a Different Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const overlayStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  box: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 16,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 28,
    marginHorizontal: 24,
    maxWidth: 360,
    width: "100%",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  modalBody: {
    color: "#cccccc",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: "#13ec13",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },
  codeInput: {
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#13ec13",
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 28,
    fontWeight: "900",
    color: "#13ec13",
    textAlign: "center",
    letterSpacing: 10,
    marginBottom: 16,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },
  linkText: {
    color: "#13ec13",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
