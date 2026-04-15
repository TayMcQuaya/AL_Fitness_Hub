const { db } = require("../_firebase");
const { collection, getDocs } = require("firebase/firestore");
const { validateToken } = require("./_auth");

function toEpoch(ts) {
  if (!ts) return null;
  if (ts.seconds) return ts.seconds * 1000;
  if (ts.toDate) return ts.toDate().getTime();
  return new Date(ts).getTime();
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!validateToken(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const usersSnap = await getDocs(collection(db, "users"));
    const users = [];

    for (const userDoc of usersSnap.docs) {
      const d = userDoc.data();

      // Fetch challenge progress subcollection
      let challengeProgress = {};
      try {
        const challengeSnap = await getDocs(
          collection(db, "users", userDoc.id, "challengeProgress")
        );
        challengeSnap.forEach((cp) => {
          const cpData = cp.data();
          challengeProgress[cp.id] = {
            currentDay: cpData.currentDay || 0,
            completedDays: cpData.completedDays || 0,
            missedDays: cpData.missedDays || 0,
            streakDays: cpData.streakDays || 0,
          };
        });
      } catch (e) {
        // subcollection may not exist
      }

      // Count book chapters read
      let bookChaptersRead = 0;
      try {
        const bookSnap = await getDocs(
          collection(db, "users", userDoc.id, "bookProgress")
        );
        bookSnap.forEach((bp) => {
          if (bp.data().isRead) bookChaptersRead++;
        });
      } catch (e) {
        // subcollection may not exist
      }

      users.push({
        id: userDoc.id,
        name: d.name || "",
        email: d.email || "",
        age: d.age || null,
        sex: d.sex || null,
        weight: d.weight || null,
        goalWeight: d.goalWeight || null,
        goals: d.goals || null,
        experience: d.experience || null,
        injuries: d.injuries || null,
        focusPillar: d.focusPillar || null,
        pillarScores: d.pillarScores || null,
        currentStreak: d.currentStreak || 0,
        totalDaysLogged: d.totalDaysLogged || 0,
        lastLogDate: d.lastLogDate || null,
        paid: d.paid || false,
        accessCode: d.accessCode || null,
        intakeCompleted: d.intakeCompleted || false,
        resetCount: d.resetCount || 0,
        createdAt: toEpoch(d.createdAt),
        lastActiveAt: toEpoch(d.lastActiveAt),
        challengeProgress,
        bookChaptersRead,
      });
    }

    // Sort: paid first, then by name
    users.sort((a, b) => {
      if (a.paid !== b.paid) return a.paid ? -1 : 1;
      return (a.name || "").localeCompare(b.name || "");
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error("admin/users error:", error.message);
    return res.status(500).json({ error: "Failed to load users." });
  }
};
