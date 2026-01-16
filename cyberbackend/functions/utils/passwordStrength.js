// Password Strength Calculator Utility
// This is a dummy implementation - all logic is simulated

const calculateStrength = (password) => {
  if (!password || typeof password !== "string") {
    return {
      strength: "Invalid",
      score: 0,
      criteria: {
        length8: false,
        length12: false,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
        noPatterns: false,
      },
      feedback: "Password is required"
    };
  }

  // Check criteria
  const criteria = {
    length8: password.length >= 8,
    length12: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
    noPatterns: !/(123|abc|qwerty|password|admin)/i.test(password), // Basic pattern check
  };

  // Calculate score
  let score = 0;
  if (criteria.length8) score += 15;
  if (criteria.length12) score += 15;
  if (criteria.uppercase) score += 15;
  if (criteria.lowercase) score += 15;
  if (criteria.numbers) score += 15;
  if (criteria.symbols) score += 15;
  if (criteria.noPatterns) score += 10;

  // Determine strength level
  let strength = "Weak";
  let feedback = "Consider adding more character types and length";

  if (score >= 80) {
    strength = "Strong";
    feedback = "Excellent password strength!";
  } else if (score >= 60) {
    strength = "Medium";
    feedback = "Good password, but could be stronger";
  }

  return {
    strength,
    score,
    criteria,
    feedback
  };
};

module.exports = {
  calculateStrength
};