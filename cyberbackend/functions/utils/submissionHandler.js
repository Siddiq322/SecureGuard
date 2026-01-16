const admin = require("firebase-admin");

// ==========================================
// PHISHING SUBMISSION HANDLER
// ==========================================

// Create a new phishing submission
const createPhishingSubmission = async (userId, url) => {
  try {
    const submissionRef = await admin.firestore().collection("phishing_submissions").add({
      userId,
      url,
      status: "pending",
      verdict: "not_checked",
      adminNote: "",
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null,
    });

    return submissionRef.id;
  } catch (error) {
    throw new Error("Failed to create phishing submission");
  }
};

// Get user's phishing submissions
const getUserPhishingSubmissions = async (userId) => {
  try {
    const snapshot = await admin.firestore()
      .collection("phishing_submissions")
      .where("userId", "==", userId)
      .orderBy("submittedAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.() || doc.data().submittedAt,
      reviewedAt: doc.data().reviewedAt?.toDate?.() || doc.data().reviewedAt,
    }));
  } catch (error) {
    throw new Error("Failed to get user phishing submissions");
  }
};

// Get all phishing submissions (admin only)
const getAllPhishingSubmissions = async () => {
  try {
    const snapshot = await admin.firestore()
      .collection("phishing_submissions")
      .orderBy("submittedAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.() || doc.data().submittedAt,
      reviewedAt: doc.data().reviewedAt?.toDate?.() || doc.data().reviewedAt,
    }));
  } catch (error) {
    throw new Error("Failed to get all phishing submissions");
  }
};

// Update phishing verdict (admin only)
const updatePhishingVerdict = async (submissionId, verdict, adminNote = "", adminId) => {
  try {
    await admin.firestore().collection("phishing_submissions").doc(submissionId).update({
      status: "checked",
      verdict,
      adminNote,
      reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
      reviewedBy: adminId,
    });
  } catch (error) {
    throw new Error("Failed to update phishing verdict");
  }
};

// ==========================================
// MALWARE SUBMISSION HANDLER
// ==========================================

// Create a new malware submission
const createMalwareSubmission = async (userId, fileData) => {
  try {
    const submissionRef = await admin.firestore().collection("malware_submissions").add({
      userId,
      fileName: fileData.fileName,
      fileHash: fileData.fileHash,
      status: "pending",
      verdict: "not_checked",
      adminNote: "",
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null,
    });

    return submissionRef.id;
  } catch (error) {
    throw new Error("Failed to create malware submission");
  }
};

// Get user's malware submissions
const getUserMalwareSubmissions = async (userId) => {
  try {
    const snapshot = await admin.firestore()
      .collection("malware_submissions")
      .where("userId", "==", userId)
      .orderBy("submittedAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.() || doc.data().submittedAt,
      reviewedAt: doc.data().reviewedAt?.toDate?.() || doc.data().reviewedAt,
    }));
  } catch (error) {
    throw new Error("Failed to get user malware submissions");
  }
};

// Get all malware submissions (admin only)
const getAllMalwareSubmissions = async () => {
  try {
    const snapshot = await admin.firestore()
      .collection("malware_submissions")
      .orderBy("submittedAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.() || doc.data().submittedAt,
      reviewedAt: doc.data().reviewedAt?.toDate?.() || doc.data().reviewedAt,
    }));
  } catch (error) {
    throw new Error("Failed to get all malware submissions");
  }
};

// Update malware verdict (admin only)
const updateMalwareVerdict = async (submissionId, verdict, adminNote = "", adminId) => {
  try {
    await admin.firestore().collection("malware_submissions").doc(submissionId).update({
      status: "checked",
      verdict,
      adminNote,
      reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
      reviewedBy: adminId,
    });
  } catch (error) {
    throw new Error("Failed to update malware verdict");
  }
};

module.exports = {
  createPhishingSubmission,
  getUserPhishingSubmissions,
  getAllPhishingSubmissions,
  updatePhishingVerdict,
  createMalwareSubmission,
  getUserMalwareSubmissions,
  getAllMalwareSubmissions,
  updateMalwareVerdict,
};