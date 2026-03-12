#!/usr/bin/env node

/**
 * Delete a user's entire Firebase data by email address.
 *
 * Usage:
 *   node scripts/delete-user.js user@example.com
 *
 * What it deletes (under users/{userId}):
 *   - dailyLogs subcollection
 *   - challengeProgress subcollection
 *   - challengeTasks subcollection
 *   - bookProgress subcollection
 *   - the user document itself
 */

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAqYaxp-v5GYWd6l3YtjleqT8dSWdMZRLo",
  authDomain: "al-fitness-hub.firebaseapp.com",
  projectId: "al-fitness-hub",
  storageBucket: "al-fitness-hub.firebasestorage.app",
  messagingSenderId: "711915218951",
  appId: "1:711915218951:web:36df1cfc96f662f98422a2",
};

const SUBCOLLECTIONS = [
  "dailyLogs",
  "challengeProgress",
  "challengeTasks",
  "bookProgress",
];

async function deleteSubcollection(db, userDocRef, name) {
  const snap = await getDocs(collection(userDocRef, name));
  let count = 0;
  for (const d of snap.docs) {
    await deleteDoc(d.ref);
    count++;
  }
  return count;
}

async function main() {
  const email = process.argv[2];

  if (!email || !email.includes("@")) {
    console.error("Usage: node scripts/delete-user.js user@example.com");
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log(`\nSearching for user with email: ${email} ...\n`);

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const snap = await getDocs(q);

  if (snap.empty) {
    console.log("No user found with that email.");
    process.exit(0);
  }

  console.log(`Found ${snap.size} user document(s):\n`);

  for (const userDoc of snap.docs) {
    const data = userDoc.data();
    console.log(`  ID:   ${userDoc.id}`);
    console.log(`  Name: ${data.name || "(none)"}`);
    console.log(`  Email: ${data.email}`);
    console.log("");
  }

  // Confirmation prompt
  const readline = require("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const answer = await new Promise((resolve) => {
    rl.question(
      `Delete ALL data for ${snap.size} user(s)? This cannot be undone. (yes/no): `,
      resolve,
    );
  });
  rl.close();

  if (answer.toLowerCase() !== "yes") {
    console.log("Aborted.");
    process.exit(0);
  }

  console.log("\nDeleting...\n");

  for (const userDoc of snap.docs) {
    const userData = userDoc.data();
    const userRef = doc(db, "users", userDoc.id);

    // Reset access code if one was used
    if (userData.accessCode) {
      try {
        const codeRef = doc(db, "accessCodes", userData.accessCode);
        await updateDoc(codeRef, {
          used: false,
          usedBy: null,
          usedByEmail: null,
          usedAt: null,
        });
        console.log(`  Reset access code: ${userData.accessCode}`);
      } catch (e) {
        console.log(`  Could not reset code ${userData.accessCode}: ${e.message}`);
      }
    }

    for (const sub of SUBCOLLECTIONS) {
      const deleted = await deleteSubcollection(db, userRef, sub);
      if (deleted > 0) {
        console.log(`  Deleted ${deleted} doc(s) from ${sub}`);
      }
    }

    await deleteDoc(userRef);
    console.log(`  Deleted user document: ${userDoc.id}`);
  }

  console.log("\nDone. All data removed.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
