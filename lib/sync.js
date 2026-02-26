import { db } from "./firebase";
import { doc, setDoc, getDoc, getDocs, deleteDoc, collection, runTransaction, serverTimestamp } from "firebase/firestore";

// Fire-and-forget: all sync functions are wrapped in try/catch.
// If offline or Firebase is down, the app works normally via AsyncStorage.

export async function syncUserProfile(userId, profile) {
  try {
    const userRef = doc(db, "users", userId);
    const existing = await getDoc(userRef);
    const data = {
      ...profile,
      lastActiveAt: serverTimestamp(),
    };
    if (!existing.exists() || !existing.data().createdAt) {
      data.createdAt = serverTimestamp();
    }
    await setDoc(userRef, data, { merge: true });
  } catch (e) {
    console.log("Sync: profile failed (offline?)", e.message);
  }
}

export async function syncPillarScores(userId, scores, focusPillar) {
  try {
    await setDoc(
      doc(db, "users", userId),
      {
        pillarScores: scores,
        focusPillar,
        intakeCompleted: true,
        lastActiveAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (e) {
    console.log("Sync: pillar scores failed (offline?)", e.message);
  }
}

export async function syncDailyLog(userId, date, streak, totalDaysLogged) {
  try {
    // Update user summary
    await setDoc(
      doc(db, "users", userId),
      {
        currentStreak: streak,
        lastLogDate: date,
        totalDaysLogged,
        lastActiveAt: serverTimestamp(),
      },
      { merge: true },
    );

    // Write daily log entry
    await setDoc(doc(db, "users", userId, "dailyLogs", date), {
      logged: true,
      loggedAt: serverTimestamp(),
    });
  } catch (e) {
    console.log("Sync: daily log failed (offline?)", e.message);
  }
}

export async function syncChallengeProgress(userId, pillarId, state) {
  try {
    await setDoc(
      doc(db, "users", userId, "challengeProgress", pillarId),
      {
        currentDay: state.currentDay,
        startDate: state.startDate,
        lastCompletionDate: state.lastCompletionDate || null,
        streakDays: state.streakDays,
        completedDays: state.completedDays || 0,
        missedDays: Math.max(0, (state.currentDay || 1) - 1 - (state.completedDays || 0)),
        acknowledgedMilestones: state.acknowledgedMilestones || [],
        lastLoggedChallengeDay: state.lastLoggedChallengeDay || null,
        updatedAt: serverTimestamp(),
      },
    );
  } catch (e) {
    console.log("Sync: challenge progress failed (offline?)", e.message);
  }
}

export async function syncChallengeTasks(userId, pillarId, date, tasks) {
  try {
    const docId = `${pillarId}_${date}`;
    await setDoc(doc(db, "users", userId, "challengeTasks", docId), {
      pillarId,
      date,
      tasks,
      allCompleted: tasks.length > 0,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.log("Sync: challenge tasks failed (offline?)", e.message);
  }
}

export async function syncBookProgress(userId, chapterId, isRead) {
  try {
    await setDoc(doc(db, "users", userId, "bookProgress", chapterId), {
      isRead,
      readAt: isRead ? serverTimestamp() : null,
    });
  } catch (e) {
    console.log("Sync: book progress failed (offline?)", e.message);
  }
}

// --- Access Code Validation (Firestore transaction) ---

export async function validateAccessCode(userId, userEmail, code) {
  const codeRef = doc(db, "accessCodes", code);

  try {
    const result = await runTransaction(db, async (transaction) => {
      const codeDoc = await transaction.get(codeRef);

      if (!codeDoc.exists()) {
        return { success: false, error: "Invalid access code." };
      }

      const data = codeDoc.data();

      // Already used by this same user (reinstall) — allow
      if (data.used && data.usedBy === userId) {
        return { success: true, alreadyOwned: true };
      }

      // Already used but email matches (reinstall with new userId) — transfer
      if (data.used && data.usedByEmail && data.usedByEmail === userEmail) {
        transaction.update(codeRef, {
          usedBy: userId,
          transferredAt: serverTimestamp(),
        });
        return { success: true, transferred: true };
      }

      // Already used by someone else
      if (data.used) {
        return { success: false, error: "This code has already been redeemed." };
      }

      // Unused — claim it
      transaction.update(codeRef, {
        used: true,
        usedBy: userId,
        usedByEmail: userEmail || null,
        usedAt: serverTimestamp(),
      });

      return { success: true };
    });

    // Mark user as paid in their profile doc
    if (result.success) {
      await setDoc(
        doc(db, "users", userId),
        {
          paid: true,
          accessCode: code,
          paidAt: serverTimestamp(),
          lastActiveAt: serverTimestamp(),
        },
        { merge: true },
      );
    }

    return result;
  } catch (e) {
    console.log("Sync: code validation failed", e.message);
    return { success: false, error: "Network error. Please check your connection and try again." };
  }
}

// Check paid status from Firestore (for cross-device verification)
export async function checkPaidStatus(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists() && userDoc.data().paid) {
      return { paid: true, accessCode: userDoc.data().accessCode || null };
    }
    return { paid: false };
  } catch (e) {
    console.log("Sync: paid check failed (offline?)", e.message);
    return { paid: false, offline: true };
  }
}

// Delete all user data from Firestore (user doc + subcollections)
export async function deleteUserData(userId) {
  if (!userId) return;

  const subcollections = ["dailyLogs", "challengeProgress", "challengeTasks", "bookProgress"];

  try {
    const userRef = doc(db, "users", userId);

    for (const sub of subcollections) {
      const snap = await getDocs(collection(userRef, sub));
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    }

    await deleteDoc(userRef);
  } catch (e) {
    console.log("Sync: delete user data failed (offline?)", e.message);
  }
}

// Sync all data at once (used by random fill and migration)
export async function syncAllData(userId, data) {
  try {
    await setDoc(
      doc(db, "users", userId),
      {
        name: data.name || null,
        email: data.email || null,
        age: data.age || null,
        sex: data.sex || null,
        weight: data.weight || null,
        goalWeight: data.goalWeight || null,
        goals: data.goals || null,
        experience: data.experience || null,
        injuries: data.injuries || null,
        intakeCompleted: data.intakeCompleted || false,
        pillarScores: data.pillarScores || null,
        focusPillar: data.focusPillar || null,
        currentStreak: data.streak || 0,
        lastLogDate: data.lastLogDate || null,
        totalDaysLogged: data.totalDaysLogged || 0,
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (e) {
    console.log("Sync: bulk sync failed (offline?)", e.message);
  }
}
