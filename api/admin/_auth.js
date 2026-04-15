const crypto = require("crypto");

function validateToken(req) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+):(\d+)$/);
  if (!match) return false;

  const [, token, timestamp] = match;
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  // Check expiry (24 hours)
  const age = Date.now() - parseInt(timestamp);
  if (age > 24 * 60 * 60 * 1000 || age < 0) return false;

  // Verify HMAC
  const expected = crypto
    .createHmac("sha256", password)
    .update(timestamp)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

module.exports = { validateToken };
