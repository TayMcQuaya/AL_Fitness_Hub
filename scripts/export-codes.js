#!/usr/bin/env node

/**
 * Export all access codes to a formatted Excel spreadsheet.
 *
 * Usage:
 *   node scripts/export-codes.js
 *   node scripts/export-codes.js --output custom-name.xlsx
 *
 * Output: codes-export.xlsx (default) with columns:
 *   Code | Status | Used By | Email | Used At | Batch
 *
 * Re-running overwrites the file with fresh data — statuses are
 * updated but codes stay in their original creation order.
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

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
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function main() {
  const outputIdx = process.argv.indexOf("--output");
  const fileName =
    outputIdx !== -1 && process.argv[outputIdx + 1]
      ? process.argv[outputIdx + 1]
      : "codes-export.xlsx";
  const exportDir = path.resolve(process.cwd(), "exports");
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);
  const outPath = path.join(exportDir, fileName);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log("\nFetching access codes from Firestore...\n");

  const codesSnap = await getDocs(collection(db, "accessCodes"));

  if (codesSnap.empty) {
    console.log("No access codes found in Firestore.");
    process.exit(0);
  }

  // Build rows — keep original creation order (createdAt)
  const rows = [];

  for (const codeDoc of codesSnap.docs) {
    const d = codeDoc.data();
    rows.push({
      _createdAt: d.createdAt ? (d.createdAt.seconds || 0) : 0,
      "Code": d.code || codeDoc.id,
      "Status": d.used ? "Used" : "Available",
      "Used By": d.usedByEmail || "",
      "User ID": d.usedBy || "",
      "Used At": formatTimestamp(d.usedAt),
      "Created": formatTimestamp(d.createdAt),
      "Batch": d.batch || "",
    });
  }

  // Sort by creation time (oldest first) so order stays consistent across reruns
  rows.sort((a, b) => a._createdAt - b._createdAt);

  // Remove internal sort key before writing
  const cleanRows = rows.map(({ _createdAt, ...rest }) => rest);

  const totalCodes = cleanRows.length;
  const usedCodes = cleanRows.filter((r) => r["Status"] === "Used").length;
  const availableCodes = totalCodes - usedCodes;

  console.log(`Found ${totalCodes} code(s). Building spreadsheet...\n`);

  // --- Codes sheet ---
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(cleanRows);

  ws["!cols"] = [
    { wch: 14 }, // Code
    { wch: 12 }, // Status
    { wch: 28 }, // Used By (email)
    { wch: 24 }, // User ID
    { wch: 22 }, // Used At
    { wch: 22 }, // Created
    { wch: 24 }, // Batch
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Codes");

  // --- Summary sheet ---
  const summaryData = [
    { "Metric": "Total Codes", "Value": totalCodes },
    { "Metric": "Used", "Value": usedCodes },
    { "Metric": "Available", "Value": availableCodes },
    { "Metric": "", "Value": "" },
    { "Metric": "Last Updated", "Value": new Date().toLocaleString("en-US") },
  ];

  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  summaryWs["!cols"] = [
    { wch: 20 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

  // Write file
  XLSX.writeFile(wb, outPath);

  console.log(`  Total codes:    ${totalCodes}`);
  console.log(`  Used:           ${usedCodes}`);
  console.log(`  Available:      ${availableCodes}`);
  console.log(`\nSaved to: ${outPath}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
