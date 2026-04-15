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
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    let totalUsers = 0;
    let activeUsers = 0;
    let paidUsers = 0;
    let totalStreak = 0;
    let totalDaysLogged = 0;
    let intakeCompleted = 0;
    const pillarDistribution = {};

    usersSnap.forEach((doc) => {
      const d = doc.data();
      totalUsers++;

      if (d.paid) paidUsers++;
      if (d.intakeCompleted) intakeCompleted++;

      const lastActive = toEpoch(d.lastActiveAt);
      if (lastActive && lastActive > sevenDaysAgo) activeUsers++;

      totalStreak += d.currentStreak || 0;
      totalDaysLogged += d.totalDaysLogged || 0;

      if (d.focusPillar) {
        pillarDistribution[d.focusPillar] = (pillarDistribution[d.focusPillar] || 0) + 1;
      }
    });

    // Access codes stats
    let totalCodes = 0;
    let usedCodes = 0;
    try {
      const codesSnap = await getDocs(collection(db, "accessCodes"));
      codesSnap.forEach((doc) => {
        totalCodes++;
        if (doc.data().used) usedCodes++;
      });
    } catch (e) {
      // accessCodes collection may not be readable
    }

    return res.status(200).json({
      totalUsers,
      activeUsers,
      paidUsers,
      unpaidUsers: totalUsers - paidUsers,
      averageStreak: totalUsers > 0 ? Math.round((totalStreak / totalUsers) * 10) / 10 : 0,
      averageDaysLogged: totalUsers > 0 ? Math.round((totalDaysLogged / totalUsers) * 10) / 10 : 0,
      completionRate: totalUsers > 0 ? Math.round((intakeCompleted / totalUsers) * 100) : 0,
      pillarDistribution,
      totalCodes,
      usedCodes,
      availableCodes: totalCodes - usedCodes,
    });
  } catch (error) {
    console.error("admin/stats error:", error.message);
    return res.status(500).json({ error: "Failed to load stats." });
  }
};
