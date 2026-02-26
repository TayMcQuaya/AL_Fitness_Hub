# Admin Scripts

All scripts live in `scripts/` and run directly with Node.js. They use the Firebase client SDK with the same config as the app — no Admin SDK or service account needed.

```bash
# All scripts run from the project root
node scripts/<script-name>.js [arguments]
```

---

## 1. generate-codes.js — Create Access Codes

Generates one-time `WELL-XXXX` access codes for the payment gate system. Codes are written to Firestore and saved to a local text file for Coach Al to distribute.

### Usage

```bash
node scripts/generate-codes.js <count>
```

- `count` — Number of codes to generate (1–500)

### Examples

```bash
node scripts/generate-codes.js 10     # Generate 10 codes
node scripts/generate-codes.js 50     # Generate 50 codes
node scripts/generate-codes.js 200    # Generate 200 codes
```

### What it does

1. Generates N unique codes with format `WELL-XXXX`
   - Uses charset `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no ambiguous 0/O/1/I/L)
   - ~810,000 possible combinations
2. Checks each code against Firestore to prevent duplicates
3. Writes each code to Firestore `accessCodes/{code}`:
   ```json
   {
     "code": "WELL-K7NP",
     "used": false,
     "usedBy": null,
     "usedByEmail": null,
     "usedAt": null,
     "createdAt": "<timestamp>",
     "batch": "2026-02-27_lq8x4m"
   }
   ```
4. Appends codes to `generated-codes.txt` in the project root:
   ```
   --- Batch: 2026-02-27_lq8x4m (50 codes) ---
   [ ] WELL-K7NP
   [ ] WELL-R3TM
   [ ] WELL-G8YW
   ```

### Output file

`generated-codes.txt` — This is Coach Al's working list. He picks the next unused code, emails it to the buyer, and crosses it off. Running the script again appends a new batch under a new header — no overwriting.

This file is in `.gitignore` and should never be committed.

### Why it exists

Stan Store has no API or webhooks, so there's no automated payment verification. Codes bridge the gap: Coach Al generates them in advance, hands them out after seeing sales, and the app validates them against Firestore.

---

## 2. export-users.js — Export Users to Excel

Fetches all users from Firestore and creates a formatted Excel spreadsheet with their data, payment status, and access codes.

### Usage

```bash
node scripts/export-users.js                         # Default: users-export.xlsx
node scripts/export-users.js --output my-report.xlsx  # Custom filename
```

### What it does

1. Reads all documents from the Firestore `users` collection
2. Reads the `accessCodes` collection for summary stats (gracefully skips if permissions block it)
3. Creates an Excel file with two sheets:

**Sheet 1: "Users"**

| Column | Source |
|--------|--------|
| Name | `users/{id}.name` |
| Email | `users/{id}.email` |
| Status | "Paid" or "Unpaid" (from `users/{id}.paid`) |
| Access Code | `users/{id}.accessCode` |
| Signed Up | `users/{id}.createdAt` (formatted date) |
| Last Active | `users/{id}.lastActiveAt` (formatted date) |
| Focus Pillar | `users/{id}.focusPillar` (capitalized) |
| Streak | `users/{id}.currentStreak` |
| Days Logged | `users/{id}.totalDaysLogged` |

Sorted: Paid users first, then alphabetical by name.

**Sheet 2: "Summary"**

| Metric | Value |
|--------|-------|
| Total Users | count |
| Paid Users | count |
| Unpaid Users | count |
| Total Codes Generated | count |
| Codes Used | count |
| Codes Available | count |
| Last Updated | timestamp |

### Re-running

The script **overwrites** the Excel file with fresh Firestore data each time. No duplicate rows — it always reflects the current state.

### Output file

`users-export.xlsx` (or custom name via `--output`). This file is in `.gitignore` (`*.xlsx` pattern).

### Why it exists

Gives Coach Al a quick overview of all users, who has paid, and what codes are in use — without needing to navigate the Firebase Console.

---

## 3. export-codes.js — Export Access Codes to Excel

Fetches all access codes from Firestore and creates a formatted Excel spreadsheet showing each code's status (Available or Used).

### Usage

```bash
node scripts/export-codes.js                          # Default: codes-export.xlsx
node scripts/export-codes.js --output my-codes.xlsx   # Custom filename
```

### What it does

1. Reads all documents from the Firestore `accessCodes` collection
2. Creates an Excel file with two sheets:

**Sheet 1: "Codes"**

| Column | Source |
|--------|--------|
| Code | `accessCodes/{id}.code` |
| Status | "Used" or "Available" (from `used` field) |
| Used By | `usedByEmail` (email of the person who redeemed it) |
| User ID | `usedBy` (internal user ID) |
| Used At | `usedAt` (formatted date) |
| Created | `createdAt` (formatted date) |
| Batch | `batch` (which generation batch) |

Sorted by creation date (oldest first) — order stays the same across reruns.

**Sheet 2: "Summary"**

| Metric | Value |
|--------|-------|
| Total Codes | count |
| Used | count |
| Available | count |
| Last Updated | timestamp |

### Re-running

The script **overwrites** the file with fresh Firestore data each time. Statuses update (e.g., a code that was "Available" last time may now be "Used"), but codes stay in their original creation order.

### Output file

`codes-export.xlsx` (or custom name via `--output`). This file is in `.gitignore` (`*.xlsx` pattern).

### Why it exists

Gives Coach Al a quick view of all access codes and their status — who used which code and when — without navigating the Firebase Console.

---

## 4. delete-user.js — Delete a User by Email

Completely removes a user's entire Firebase data by email address. Deletes the user document and all subcollections.

### Usage

```bash
node scripts/delete-user.js user@example.com
```

### What it does

1. Queries Firestore `users` collection for documents where `email == <input>`
2. Shows matching user(s) with their ID, name, and email
3. Asks for confirmation: `Delete ALL data for X user(s)? This cannot be undone. (yes/no):`
4. On "yes", deletes for each matched user:
   - `users/{userId}/dailyLogs` (all documents)
   - `users/{userId}/challengeProgress` (all documents)
   - `users/{userId}/challengeTasks` (all documents)
   - `users/{userId}/bookProgress` (all documents)
   - `users/{userId}` (the user document itself)

### Safety

- Requires exact email match (not partial)
- Shows what will be deleted before proceeding
- Requires explicit "yes" confirmation — anything else aborts
- Cannot be undone

### Why it exists

For removing test accounts, handling user data deletion requests, or cleaning up during development. Also useful if a user wants to start completely fresh — delete their cloud data so the app treats them as a new user.

---

## Quick Reference

| Script | Command | What |
|--------|---------|------|
| Generate codes | `node scripts/generate-codes.js 50` | Create 50 access codes → Firestore + text file |
| Export users | `node scripts/export-users.js` | All users → Excel spreadsheet |
| Export codes | `node scripts/export-codes.js` | All access codes + status → Excel spreadsheet |
| Delete user | `node scripts/delete-user.js email@example.com` | Remove user + all subcollections from Firestore |

### Prerequisites

All scripts require:
- Node.js installed
- `npm install` completed (scripts use `firebase` and `xlsx` packages from `node_modules`)
- Internet connection (scripts read/write Firestore directly)

### File outputs

| File | Created by | In .gitignore? |
|------|-----------|----------------|
| `generated-codes.txt` | generate-codes.js | Yes |
| `users-export.xlsx` | export-users.js | Yes (`*.xlsx`) |
| `codes-export.xlsx` | export-codes.js | Yes (`*.xlsx`) |
