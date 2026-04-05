const crypto = require("crypto");
const { db } = require("./_firebase");
const {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} = require("firebase/firestore");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SENDS_PER_HOUR = 3;
const CODE_TTL_MINUTES = 10;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};
  const normalizedEmail = (email || "").trim().toLowerCase();

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({ error: "Valid email required." });
  }

  try {
    // Rate limit: max 3 codes per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const rateQuery = query(
      collection(db, "verificationCodes"),
      where("email", "==", normalizedEmail),
      where("createdAt", ">=", Timestamp.fromDate(oneHourAgo))
    );
    const rateSnap = await getDocs(rateQuery);

    if (rateSnap.size >= MAX_SENDS_PER_HOUR) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    // Generate 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CODE_TTL_MINUTES * 60 * 1000);

    // Store in Firestore
    await addDoc(collection(db, "verificationCodes"), {
      email: normalizedEmail,
      code,
      createdAt: Timestamp.fromDate(now),
      expiresAt: Timestamp.fromDate(expiresAt),
      attempts: 0,
      verified: false,
    });

    // Send email via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Coach Al's Wellness Studio <onboarding@resend.dev>",
        to: normalizedEmail,
        subject: "Your Verification Code",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 400px; margin: 0 auto; padding: 32px; text-align: center;">
            <h2 style="color: #13ec13; margin-bottom: 8px;">Coach Al's Wellness Studio</h2>
            <p style="color: #666; margin-bottom: 24px;">Your verification code is:</p>
            <div style="background: #111; color: #13ec13; font-size: 36px; font-weight: 900; letter-spacing: 8px; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
              ${code}
            </div>
            <p style="color: #999; font-size: 13px;">This code expires in ${CODE_TTL_MINUTES} minutes.</p>
            <p style="color: #999; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error("Resend error:", errBody);
      return res.status(500).json({ error: "Failed to send email. Please try again." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("send-code error:", error.message);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
