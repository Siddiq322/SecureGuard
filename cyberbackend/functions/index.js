const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Import utility functions
const passwordStrength = require("./utils/passwordStrength");
const submissionHandler = require("./utils/submissionHandler");

// ==========================================
// AUTHENTICATION & USER MANAGEMENT
// ==========================================

// Function to set user role (call this after user registration)
exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { role = "user" } = data; // Default to "user" role

  try {
    await admin.firestore().collection("users").doc(context.auth.uid).set({
      email: context.auth.token.email,
      role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return { success: true, role: role };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to set user role");
  }
});

// Function to get user profile
exports.getUserProfile = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  try {
    const userDoc = await admin.firestore().collection("users").doc(context.auth.uid).get();

    if (!userDoc.exists) {
      // Create default user profile
      await admin.firestore().collection("users").doc(context.auth.uid).set({
        email: context.auth.token.email,
        role: "user",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        email: context.auth.token.email,
        role: "user",
        createdAt: new Date(),
      };
    }

    return {
      ...userDoc.data(),
      uid: context.auth.uid,
    };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to get user profile");
  }
});

// ==========================================
// PASSWORD STRENGTH DETECTOR
// ==========================================

exports.checkPasswordStrength = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { password } = data;
  if (!password || typeof password !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "Password is required");
  }

  try {
    const result = passwordStrength.calculateStrength(password);

    // Log the check (optional)
    await admin.firestore().collection("password_checks").add({
      userId: context.auth.uid,
      strength: result.strength,
      score: result.score,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return result;
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to check password strength");
  }
});

// ==========================================
// PHISHING SUBMISSION SYSTEM
// ==========================================

// Submit URL for phishing check
exports.submitPhishingURL = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { url } = data;
  if (!url || typeof url !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "URL is required");
  }

  try {
    const submissionId = await submissionHandler.createPhishingSubmission(context.auth.uid, url);

    return {
      success: true,
      submissionId: submissionId,
      status: "pending",
      message: "URL submitted for review"
    };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to submit URL");
  }
});

// Get user's phishing submissions
exports.getUserPhishingSubmissions = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  try {
    const submissions = await submissionHandler.getUserPhishingSubmissions(context.auth.uid);
    return { submissions };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to get submissions");
  }
});

// ==========================================
// MALWARE SUBMISSION SYSTEM
// ==========================================

// Submit file/hash for malware check
exports.submitMalwareCheck = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { fileName, fileHash } = data;
  if (!fileName && !fileHash) {
    throw new functions.https.HttpsError("invalid-argument", "File name or hash is required");
  }

  try {
    const submissionId = await submissionHandler.createMalwareSubmission(context.auth.uid, {
      fileName: fileName || "unknown",
      fileHash: fileHash || "unknown"
    });

    return {
      success: true,
      submissionId: submissionId,
      status: "pending",
      message: "File submitted for malware check"
    };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to submit file");
  }
});

// Get user's malware submissions
exports.getUserMalwareSubmissions = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  try {
    const submissions = await submissionHandler.getUserMalwareSubmissions(context.auth.uid);
    return { submissions };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to get submissions");
  }
});

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

// Get all phishing submissions (Admin only)
exports.getAllPhishingSubmissions = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  // Check if user is admin
  const userDoc = await admin.firestore().collection("users").doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admin access required");
  }

  try {
    const submissions = await submissionHandler.getAllPhishingSubmissions();
    return { submissions };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to get submissions");
  }
});

// Update phishing submission verdict (Admin only)
exports.updatePhishingVerdict = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  // Check if user is admin
  const userDoc = await admin.firestore().collection("users").doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admin access required");
  }

  const { submissionId, verdict, adminNote } = data;
  if (!submissionId || !verdict) {
    throw new functions.https.HttpsError("invalid-argument", "Submission ID and verdict are required");
  }

  if (!["safe", "phishing"].includes(verdict)) {
    throw new functions.https.HttpsError("invalid-argument", "Verdict must be 'safe' or 'phishing'");
  }

  try {
    await submissionHandler.updatePhishingVerdict(submissionId, verdict, adminNote, context.auth.uid);
    return { success: true, message: "Verdict updated successfully" };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to update verdict");
  }
});

// Get all malware submissions (Admin only)
exports.getAllMalwareSubmissions = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  // Check if user is admin
  const userDoc = await admin.firestore().collection("users").doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admin access required");
  }

  try {
    const submissions = await submissionHandler.getAllMalwareSubmissions();
    return { submissions };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to get submissions");
  }
});

// Update malware submission verdict (Admin only)
exports.updateMalwareVerdict = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  // Check if user is admin
  const userDoc = await admin.firestore().collection("users").doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admin access required");
  }

  const { submissionId, verdict, adminNote } = data;
  if (!submissionId || !verdict) {
    throw new functions.https.HttpsError("invalid-argument", "Submission ID and verdict are required");
  }

  if (!["clean", "malware"].includes(verdict)) {
    throw new functions.https.HttpsError("invalid-argument", "Verdict must be 'clean' or 'malware'");
  }

  try {
    await submissionHandler.updateMalwareVerdict(submissionId, verdict, adminNote, context.auth.uid);
    return { success: true, message: "Verdict updated successfully" };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Failed to update verdict");
  }
});

// ==========================================
// LEGACY FUNCTIONS (for compatibility)
// ==========================================

const checkPhishing = require("./phishing/checkPhishing");

// HTTPS Callable Function for Phishing Detection (legacy)
exports.checkPhishingURL = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  return await checkPhishing(data, context);
});
