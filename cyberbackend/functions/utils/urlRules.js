module.exports = {
  calculateRiskScore: (url) => {
    let score = 0;

    // 1. HTTPS presence
    if (!/^https:\/\//.test(url)) score += 30;

    // 2. URL length
    if (url.length > 60) score += 20;

    // 3. Suspicious keywords
    const keywords = ["login", "secure", "update", "verify", "bank", "paypal"];
    keywords.forEach((kw) => {
      if (url.toLowerCase().includes(kw)) score += 10;
    });

    // 4. Special character count
    const specialChars = url.replace(/[a-zA-Z0-9]/g, "");
    if (specialChars.length > 10) score += 20;

    // Clamp score
    return Math.min(score, 100);
  },
};
