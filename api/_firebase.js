const { initializeApp, getApps } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAqYaxp-v5GYWd6l3YtjleqT8dSWdMZRLo",
  authDomain: "al-fitness-hub.firebaseapp.com",
  projectId: "al-fitness-hub",
  storageBucket: "al-fitness-hub.firebasestorage.app",
  messagingSenderId: "711915218951",
  appId: "1:711915218951:web:36df1cfc96f662f98422a2",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };
