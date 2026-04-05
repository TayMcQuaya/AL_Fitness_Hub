# Client Discussion Points — Coach Al

## 1. Email Verification: Enable or Skip?

**What it is:** When a returning user enters their email, we can send a 6-digit verification code to prove they own that email before restoring their account.

**Current state:** Built but disabled. Requires verifying `burntout.app` as a domain in Resend (email service) — needs DNS records added in Namecheap.

**Decision needed from Coach Al:**

- **Option A: Enable it** — Prevents someone from typing another person's email and getting access to their data. More secure. Requires Namecheap DNS setup (one-time, ~10 minutes).
- **Option B: Skip it** — Simpler UX, fewer steps for returning users. Risk: anyone who knows someone's email could see their pillar scores and progress. Low risk for a wellness app but not zero.

**Recommendation:** Enable it. The setup is one-time and the security benefit is worth it.

---

## 2. Messaging Inconsistency: "Free" vs "$50 Refund"

**The problem:** The app currently shows two conflicting messages:

| Where | What it says |
|-------|-------------|
| **Landing page** (hero + CTA) | ~~$50~~ $0 — FREE THIS MONTH |
| **Legal Disclaimer** (Section 6) | "$50 CAD one-time payment", refund policy, challenge completion requirements |
| **Privacy Policy** (Section 14) | "Determine eligibility for refunds" |
| **Help & Support** (FAQ) | "How do I qualify for a refund?" — references $50 challenge |

**Decision needed from Coach Al:**

### If the app stays free indefinitely:
- Remove or update Section 6 in Legal Disclaimer (payment/refund policy)
- Remove refund references from Privacy Policy Section 14
- Remove refund FAQ from Help & Support
- Change "FREE THIS MONTH" to just "FREE" on landing page
- Consider removing the ~~$50~~ pricing display entirely

### If the app will go back to $50 eventually:
- Keep all legal/refund language as-is (it's correct for when payments return)
- Keep "FREE THIS MONTH" on landing page (creates urgency)
- Accept the temporary inconsistency — users won't read legal docs closely during free period

### If the pricing is changing to something else:
- Update the legal disclaimer with new pricing
- Update landing page accordingly

**Recommendation:** Ask Coach Al what the long-term pricing plan is, then update accordingly. For now the legal text is fine as a future-proof document, but "FREE THIS MONTH" on the landing page implies a time limit that doesn't exist.

---

## 3. "Free This Month" — Is There an End Date?

**Current state:** Landing page says "FREE THIS MONTH" but there's no actual cutoff date or mechanism to enforce it. It will say "FREE THIS MONTH" forever unless someone changes it.

**Decision needed from Coach Al:**

- Is there an actual date when the app goes back to $50?
- Should we add a real end date on the landing page (e.g., "Free until May 1st")?
- Or should it just say "FREE" without a time pressure?

---

## Summary of Decisions Needed

| # | Topic | Options |
|---|-------|---------|
| 1 | Email verification | Enable (secure) or skip (simpler) |
| 2 | Legal/refund language | Update for free model, keep for future paid, or new pricing |
| 3 | "Free this month" | Add real end date, remove time pressure, or keep as-is |
