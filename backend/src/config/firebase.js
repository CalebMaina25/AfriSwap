const admin = require('firebase-admin');

let serviceAccount;
let initialized = false;

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
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault()
        });
        initialized = true;
      } catch (err2) {
        // Silently fail for testing environments
        if (process.env.NODE_ENV === 'test') {
          console.warn('Firebase not initialized (test mode)');
        } else {
          throw err2;
        }
      }
    } else if (process.env.NODE_ENV !== 'test') {
      throw new Error('No Firebase credentials found. Set FIREBASE_KEY_JSON or provide firebase-key.json');
    } else {
      console.warn('Firebase not initialized (test mode)');
    }
  }
}

if (!initialized && !admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
  }
}

const db = admin.apps.length ? admin.firestore() : null;
const auth = admin.apps.length ? admin.auth() : null;
const storage = admin.apps.length ? admin.storage() : null;

module.exports = { admin, db, auth, storage };
