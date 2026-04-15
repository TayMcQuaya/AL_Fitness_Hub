const crypto = require("crypto");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ error: "Password required." });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: "Admin not configured." });
  }

  // Constant-time comparison
  const inputBuf = Buffer.from(password);
  const expectedBuf = Buffer.from(adminPassword);
  if (inputBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(inputBuf, expectedBuf)) {
    return res.status(401).json({ error: "Invalid password." });
  }

  // Generate token
  const timestamp = Date.now().toString();
  const token = crypto
    .createHmac("sha256", adminPassword)
    .update(timestamp)
    .digest("hex");

  return res.status(200).json({ success: true, token, timestamp });
};
