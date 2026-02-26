#!/usr/bin/env node

/**
 * Export all users to a formatted Excel spreadsheet.
 *
 * Usage:
 *   node scripts/export-users.js
 *   node scripts/export-users.js --output custom-name.xlsx
 *
 * Output: users-export.xlsx (default) with columns:
 *   Name | Email | Status | Access Code | Signed Up | Last Active | Focus Pillar
 *
 * Re-running updates the same file — no duplicates. Existing data is
 * replaced with the latest from Firestore.
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const firebaseConfig = {
  apiKey: "AIzaSyAqYaxp-v5GYWd6l3YtjleqT8dSWdMZRLo",
  authDomain: "al-fitness-hub.firebaseapp.com",
  projectId: "al-fitness-hub",
  storageBucket: "al-fitness-hub.firebasestorage.app",
  messagingSenderId: "711915218951",
  appId: "1:711915218951:web:36df1cfc96f662f98422a2",
};

function formatTimestamp(ts) {
  if (!ts) return "";
  // Firestore timestamps have .seconds, plain strings pass through
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function main() {
  // Parse --output flag
  const outputIdx = process.argv.indexOf("--output");
  const fileName = outputIdx !== -1 && process.argv[outputIdx + 1]
    ? process.argv[outputIdx + 1]
    : "users-export.xlsx";
  const outPath = path.resolve(process.cwd(), fileName);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log("\nFetching users from Firestore...\n");

  const usersSnap = await getDocs(collection(db, "users"));

  if (usersSnap.empty) {
    console.log("No users found in Firestore.");
    process.exit(0);
  }

  // Build rows
  const rows = [];

  for (const userDoc of usersSnap.docs) {
    const d = userDoc.data();

    rows.push({
      "Name": d.name || "",
      "Email": d.email || "",
      "Status": d.paid ? "Paid" : "Unpaid",
      "Access Code": d.accessCode || "",
      "Signed Up": formatTimestamp(d.createdAt),
      "Last Active": formatTimestamp(d.lastActiveAt),
      "Focus Pillar": d.focusPillar ? d.focusPillar.charAt(0).toUpperCase() + d.focusPillar.slice(1) : "",
      "Streak": d.currentStreak ?? "",
      "Days Logged": d.totalDaysLogged ?? "",
    });
  }

  // Sort: Paid first, then by name
  rows.sort((a, b) => {
    if (a["Status"] !== b["Status"]) return a["Status"] === "Paid" ? -1 : 1;
    return (a["Name"] || "").localeCompare(b["Name"] || "");
  });

  console.log(`Found ${rows.length} user(s). Building spreadsheet...\n`);

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths for readability
  ws["!cols"] = [
    { wch: 18 },  // Name
    { wch: 28 },  // Email
    { wch: 10 },  // Status
    { wch: 14 },  // Access Code
    { wch: 16 },  // Signed Up
    { wch: 16 },  // Last Active
    { wch: 14 },  // Focus Pillar
    { wch: 8 },   // Streak
    { wch: 12 },  // Days Logged
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Users");

  // --- Summary sheet ---
  const totalUsers = rows.length;
  const paidUsers = rows.filter((r) => r["Status"] === "Paid").length;
  const unpaidUsers = totalUsers - paidUsers;

  // Fetch code stats (may fail if security rules block collection listing)
  let totalCodes = 0;
  let usedCodes = 0;
  let unusedCodes = 0;
  let codesAccessible = true;

  try {
    const codesSnap = await getDocs(collection(db, "accessCodes"));
    codesSnap.forEach((codeDoc) => {
      totalCodes++;
      if (codeDoc.data().used) usedCodes++;
      else unusedCodes++;
    });
  } catch (e) {
    codesAccessible = false;
    console.log("  (Could not read accessCodes collection — check Firestore rules)");
  }

  const summaryData = [
    { "Metric": "Total Users", "Value": totalUsers },
    { "Metric": "Paid Users", "Value": paidUsers },
    { "Metric": "Unpaid Users", "Value": unpaidUsers },
    { "Metric": "", "Value": "" },
    { "Metric": "Total Codes Generated", "Value": codesAccessible ? totalCodes : "N/A" },
    { "Metric": "Codes Used", "Value": codesAccessible ? usedCodes : "N/A" },
    { "Metric": "Codes Available", "Value": codesAccessible ? unusedCodes : "N/A" },
    { "Metric": "", "Value": "" },
    { "Metric": "Last Updated", "Value": new Date().toLocaleString("en-US") },
  ];

  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  summaryWs["!cols"] = [
    { wch: 24 },  // Metric
    { wch: 20 },  // Value
  ];

  XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

  // Write file (overwrites existing — no duplicates)
  XLSX.writeFile(wb, outPath);

  console.log(`  Total users:    ${totalUsers}`);
  console.log(`  Paid:           ${paidUsers}`);
  console.log(`  Unpaid:         ${unpaidUsers}`);
  if (codesAccessible) console.log(`  Codes left:     ${unusedCodes}`);
  console.log(`\nSaved to: ${outPath}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
