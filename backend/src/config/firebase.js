const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_KEY_JSON) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);
  } catch (err) {
    console.error('Failed to parse FIREBASE_KEY_JSON:', err);
    throw err;
  }
} else {
  try {
    serviceAccount = require('../../firebase-key.json');
  } catch (err) {
    // If no file and GOOGLE_APPLICATION_CREDENTIALS is set, use applicationDefault
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
    } else {
      throw new Error('No Firebase credentials found. Set FIREBASE_KEY_JSON or provide firebase-key.json');
    }
  }
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
  }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { admin, db, auth, storage };
