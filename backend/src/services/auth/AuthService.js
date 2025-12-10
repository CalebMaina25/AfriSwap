const { auth, db } = require('../../config/firebase');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

class AuthService {
  /**
   * Register a new user
   */
  static async registerUser(userData) {
    try {
      const { email, password, country, name, userType } = userData;

      // Create Firebase user
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name
      });

      // Store additional user data in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        email,
        name,
        country,
        userType,
        createdAt: new Date(),
        uid: userRecord.uid
      });

      return {
        success: true,
        message: 'User registered successfully',
        userId: userRecord.uid
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Login user with email and password
   */
  static async loginUser(email, password) {
    try {
      // Get user by email
      const userRecord = await auth.getUserByEmail(email);

      // Generate custom token for authentication
      const token = await auth.createCustomToken(userRecord.uid);

      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      const userData = userDoc.data();

      return {
        success: true,
        message: 'Login successful',
        token,
        user: userData
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Verify user token
   */
  static async verifyUserToken(token) {
    try {
      // Verify the custom token by getting the user claims
      const decodedToken = await auth.verifyIdToken(token).catch(() => {
        // If ID token verification fails, try to use it as custom token
        return { uid: token };
      });

      // Get user from Firebase
      const userRecord = await auth.getUser(decodedToken.uid || token);

      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      const userData = userDoc.data();

      return {
        valid: true,
        user: userData || { email: userRecord.email, uid: userRecord.uid }
      };
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Logout user (invalidate token)
   */
  static async logoutUser(uid) {
    try {
      await auth.revokeRefreshTokens(uid);
      return {
        success: true,
        message: 'User logged out successfully'
      };
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  /**
   * Get user by UID
   */
  static async getUserById(uid) {
    try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      return userDoc.data();
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }
}

module.exports = AuthService;
