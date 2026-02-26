#!/usr/bin/env node

/**
 * Generate one-time access codes for Coach Al's Wellness Studio.
 *
 * Usage:
 *   node scripts/generate-codes.js <count>
 *   node scripts/generate-codes.js 50
 *
 * What it does:
 *   1. Generates N unique WELL-XXXX codes
 *   2. Checks for duplicates against existing codes in Firestore
 *   3. Writes new codes to Firestore `accessCodes` collection
 *   4. Saves codes to `generated-codes.txt` for Coach Al
 */

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} = require("firebase/firestore");
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

// No ambiguous characters (0/O, 1/I/L removed)
const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PREFIX = "WELL-";

function generateSuffix() {
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return suffix;
}

async function main() {
  const countArg = process.argv[2];
  const count = parseInt(countArg, 10);

  if (!count || count < 1 || count > 500) {
    console.error("Usage: node scripts/generate-codes.js <count>");
    console.error("  count must be between 1 and 500");
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log(`\nGenerating ${count} access codes...\n`);

  const batchId = new Date().toISOString().split("T")[0] + "_" + Date.now().toString(36);
  const codes = [];
  const maxRetries = count * 10;
  let retries = 0;

  while (codes.length < count && retries < maxRetries) {
    const code = PREFIX + generateSuffix();

    // Check local duplicates
    if (codes.includes(code)) {
      retries++;
      continue;
    }

    // Check Firestore duplicates
    const existing = await getDoc(doc(db, "accessCodes", code));
    if (existing.exists()) {
      console.log(`  Skipping duplicate: ${code}`);
      retries++;
      continue;
    }

    codes.push(code);
  }

  if (codes.length < count) {
    console.error(`Could only generate ${codes.length} of ${count} unique codes.`);
  }

  console.log(`Writing ${codes.length} codes to Firestore...\n`);

  for (const code of codes) {
    await setDoc(doc(db, "accessCodes", code), {
      code,
      used: false,
      usedBy: null,
      usedByEmail: null,
      usedAt: null,
      createdAt: serverTimestamp(),
      batch: batchId,
    });
    console.log(`  ${code}`);
  }

  // Save to local file
  const outPath = path.join(process.cwd(), "generated-codes.txt");
  const header = `\n--- Batch: ${batchId} (${codes.length} codes) ---\n`;
  const codeLines = codes.map((c) => `[ ] ${c}`).join("\n");
  fs.appendFileSync(outPath, header + codeLines + "\n");

  console.log(`\nDone! ${codes.length} codes written.`);
  console.log(`Saved to: ${outPath}`);
  console.log(`Batch ID: ${batchId}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
