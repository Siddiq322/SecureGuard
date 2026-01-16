const admin = require("firebase-admin");
const urlRules = require("../utils/urlRules");

module.exports = async function (data, context) {
  const { url } = data;
  if (!url || typeof url !== "string") {
    throw new Error("Invalid URL");
  }

  // Validate URL format
  const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
  if (!urlPattern.test(url)) {
    return { status: "PHISHING", riskScore: 100 };
  }

  // Rule-based analysis
  const riskScore = urlRules.calculateRiskScore(url);
  const status = riskScore < 50 ? "SAFE" : "PHISHING";

  // Log to Firestore
  const logRef = admin.firestore().collection("phishing_logs").doc();
  await logRef.set({
    userId: context.auth.uid,
    url,
    riskScore,
    result: status,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { status, riskScore };
};
