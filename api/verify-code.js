const { db } = require("./_firebase");
const {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  orderBy,
  limit,
} = require("firebase/firestore");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_REGEX = /^\d{6}$/;
const MAX_ATTEMPTS = 3;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, code } = req.body || {};
  const normalizedEmail = (email || "").trim().toLowerCase();

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({ error: "Valid email required." });
  }

  if (!code || !CODE_REGEX.test(code)) {
    return res.status(400).json({ error: "Valid 6-digit code required." });
  }

  try {
    // Find the latest unverified code for this email
    const codeQuery = query(
      collection(db, "verificationCodes"),
      where("email", "==", normalizedEmail),
      where("verified", "==", false),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const codeSnap = await getDocs(codeQuery);

    if (codeSnap.empty) {
      return res.status(400).json({ error: "No verification code found. Please request a new one." });
    }

    const codeDoc = codeSnap.docs[0];
    const codeData = codeDoc.data();

    // Check expiration
    const expiresAt = codeData.expiresAt.toDate ? codeData.expiresAt.toDate() : new Date(codeData.expiresAt);
    if (Date.now() > expiresAt.getTime()) {
      return res.status(400).json({ error: "Code expired. Please request a new one." });
    }

    // Check attempt limit
    if (codeData.attempts >= MAX_ATTEMPTS) {
      return res.status(400).json({ error: "Too many attempts. Please request a new code." });
    }

    // Increment attempts
    const newAttempts = codeData.attempts + 1;
    await updateDoc(codeDoc.ref, { attempts: newAttempts });

    // Check code match
    if (codeData.code !== code) {
      const remaining = MAX_ATTEMPTS - newAttempts;
      return res.status(400).json({
        error: remaining > 0
          ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Too many attempts. Please request a new code.",
      });
    }

    // Code is correct — mark verified
    await updateDoc(codeDoc.ref, { verified: true });

    // Look up user data
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", normalizedEmail),
      limit(1)
    );
    const userSnap = await getDocs(userQuery);

    if (userSnap.empty) {
      return res.status(400).json({ error: "Account not found." });
    }

    const userDoc = userSnap.docs[0];
    const userData = userDoc.data();

    return res.status(200).json({
      success: true,
      userData: {
        id: userDoc.id,
        name: userData.name || "",
        email: userData.email || "",
        age: userData.age || null,
        sex: userData.sex || null,
        weight: userData.weight || null,
        goalWeight: userData.goalWeight || null,
        goals: userData.goals || null,
        experience: userData.experience || null,
        injuries: userData.injuries || null,
        pillarScores: userData.pillarScores || null,
        focusPillar: userData.focusPillar || null,
        intakeCompleted: userData.intakeCompleted || false,
      },
    });
  } catch (error) {
    console.error("verify-code error:", error.message);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
