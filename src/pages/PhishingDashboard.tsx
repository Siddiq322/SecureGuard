import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, ShieldAlert, AlertTriangle, ShieldCheck, ArrowRight, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/effects/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import GlassCard from "@/components/cards/GlassCard";

interface AnalysisResult {
  riskScore: number;
  riskLevel: 'Safe' | 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Very High Risk';
  analysis: {
    domain: string;
    protocol: string;
    hasHttps: boolean;
    suspiciousPatterns: string[];
    legitimateIndicators: string[];
    recommendations: string[];
  };
  textRepresentation: string;
}

const PhishingDashboard = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);

  const analyzeURL = (url: string): AnalysisResult => {
    let riskScore = 0;
    const suspiciousPatterns: string[] = [];
    const legitimateIndicators: string[] = [];
    const recommendations: string[] = [];

    try {
      const urlObj = new URL(url);

      // Protocol Analysis
      if (urlObj.protocol === 'https:') {
        legitimateIndicators.push('Uses HTTPS encryption');
        riskScore += 10; // Positive score for HTTPS
      } else {
        suspiciousPatterns.push('Uses HTTP instead of HTTPS');
        riskScore += 30;
        recommendations.push('Avoid HTTP websites for sensitive activities');
      }

      // Domain Analysis
      const domain = urlObj.hostname.toLowerCase();

      // Check for suspicious TLDs
      const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club', '.online', '.site'];
      const tld = domain.substring(domain.lastIndexOf('.'));
      if (suspiciousTlds.includes(tld)) {
        suspiciousPatterns.push(`Suspicious TLD: ${tld}`);
        riskScore += 15;
        recommendations.push('Be cautious with uncommon domain extensions');
      }

      // Check for numbers in domain (often used in phishing)
      if (/\d/.test(domain.replace(/\./g, ''))) {
        suspiciousPatterns.push('Contains numbers in domain name');
        riskScore += 10;
      }

      // Check for excessive subdomains
      const subdomainCount = domain.split('.').length - 2; // Subtract TLD and main domain
      if (subdomainCount > 2) {
        suspiciousPatterns.push('Excessive subdomains');
        riskScore += 15;
        recommendations.push('Multiple subdomains can indicate suspicious activity');
      }

      // Check for URL shorteners
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'ow.ly'];
      if (shorteners.some(shortener => domain.includes(shortener))) {
        suspiciousPatterns.push('URL shortener detected');
        riskScore += 25;
        recommendations.push('URL shorteners can hide malicious destinations');
      }

      // Check for suspicious keywords in domain
      const suspiciousKeywords = ['login', 'bank', 'secure', 'account', 'verify', 'update', 'confirm', 'paypal', 'amazon', 'facebook', 'google'];
      if (suspiciousKeywords.some(keyword => domain.includes(keyword))) {
        suspiciousPatterns.push('Contains sensitive keywords in domain');
        riskScore += 20;
        recommendations.push('Domains mimicking trusted services are common in phishing');
      }

      // Path Analysis
      const path = urlObj.pathname.toLowerCase();
      if (path.includes('login') || path.includes('signin') || path.includes('auth')) {
        suspiciousPatterns.push('Login-related path detected');
        riskScore += 15;
      }

      // Query Parameters Analysis
      const searchParams = urlObj.searchParams;
      if (searchParams.toString().length > 100) {
        suspiciousPatterns.push('Excessive query parameters');
        riskScore += 10;
      }

      // Check for common phishing patterns
      if (url.includes('%20') || url.includes('%22') || url.includes('%27')) {
        suspiciousPatterns.push('Contains encoded characters');
        riskScore += 10;
      }

      // Length Analysis
      if (url.length > 200) {
        suspiciousPatterns.push('Unusually long URL');
        riskScore += 5;
      }

      // IP Address Check
      const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
      if (ipRegex.test(domain)) {
        suspiciousPatterns.push('Uses IP address instead of domain name');
        riskScore += 30;
        recommendations.push('Legitimate websites rarely use IP addresses');
      }

      // Age simulation (we can't actually check domain age, but we can note this)
      legitimateIndicators.push('Domain age should be verified manually');

      // Clamp risk score between 0 and 100
      riskScore = Math.max(0, Math.min(100, riskScore));

      // Determine risk level
      let riskLevel: AnalysisResult['riskLevel'];
      if (riskScore < 20) riskLevel = 'Safe';
      else if (riskScore < 40) riskLevel = 'Low Risk';
      else if (riskScore < 60) riskLevel = 'Medium Risk';
      else if (riskScore < 80) riskLevel = 'High Risk';
      else riskLevel = 'Very High Risk';

      // Add general recommendations
      if (riskScore > 50) {
        recommendations.push('Do not enter personal information on this site');
        recommendations.push('Verify the URL manually by typing it yourself');
        recommendations.push('Check for official contact information');
      }

      const textRepresentation = `URL Analysis Report:
===============================
URL: ${url}
Risk Score: ${riskScore}/100 (${riskLevel})

Domain Information:
- Domain: ${domain}
- Protocol: ${urlObj.protocol.replace(':', '')}
- HTTPS: ${urlObj.protocol === 'https:' ? 'Yes' : 'No'}

Risk Factors Found:
${suspiciousPatterns.length > 0 ? suspiciousPatterns.map(p => `- ${p}`).join('\n') : 'None detected'}

Positive Indicators:
${legitimateIndicators.length > 0 ? legitimateIndicators.map(p => `- ${p}`).join('\n') : 'None detected'}

Recommendations:
${recommendations.length > 0 ? recommendations.map(r => `- ${r}`).join('\n') : 'No specific recommendations'}

Final Assessment: ${riskLevel} (${riskScore}% risk)`;

      return {
        riskScore,
        riskLevel,
        analysis: {
          domain,
          protocol: urlObj.protocol,
          hasHttps: urlObj.protocol === 'https:',
          suspiciousPatterns,
          legitimateIndicators,
          recommendations
        },
        textRepresentation
      };

    } catch (error) {
      return {
        riskScore: 100,
        riskLevel: 'Very High Risk',
        analysis: {
          domain: 'Invalid',
          protocol: 'Invalid',
          hasHttps: false,
          suspiciousPatterns: ['Invalid URL format'],
          legitimateIndicators: [],
          recommendations: ['Please enter a valid URL']
        },
        textRepresentation: `Invalid URL Format: ${url}\n\nPlease enter a properly formatted URL starting with http:// or https://`
      };
    }
  };

  const handleSubmit = async () => {
    if (!url.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setProgress(0); // Reset progress to 0 when starting
    // Simulate analysis time for better UX
    setTimeout(() => {
      const analysisResult = analyzeURL(url.trim());
      setResult(analysisResult);
      setProgress(analysisResult.riskScore); // Set final progress
      setUrl("");
      setIsAnalyzing(false);
    }, 1500);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Safe': return 'text-green-500';
      case 'Low Risk': return 'text-yellow-500';
      case 'Medium Risk': return 'text-orange-500';
      case 'High Risk': return 'text-red-500';
      case 'Very High Risk': return 'text-red-700';
      default: return 'text-gray-500';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Safe': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'Low Risk': return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'Medium Risk': return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      case 'High Risk': return <XCircle className="w-6 h-6 text-red-500" />;
      case 'Very High Risk': return <XCircle className="w-6 h-6 text-red-700" />;
      default: return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const tips = [
    {
      icon: ShieldAlert,
      title: "Check URL Carefully",
      description: "Look for misspellings and suspicious domains that mimic legitimate sites.",
    },
    {
      icon: AlertTriangle,
      title: "Beware of Urgency",
      description: "Phishing sites often create false urgency to rush your decisions.",
    },
    {
      icon: ShieldCheck,
      title: "Verify HTTPS",
      description: "Ensure the site uses HTTPS, but remember it's not a guarantee of safety.",
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar isAuthenticated={true} onLogout={() => navigate("/login")} />
        <ParticleBackground />

        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h1 className="text-4xl font-bold mb-2">
                Phishing <span className="text-gradient-cyber">URL Analyzer</span>
              </h1>
              <p className="text-muted-foreground">
                Advanced URL analysis with risk assessment and detailed breakdown.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* URL Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Globe className="w-6 h-6" />
                    URL Risk Analysis
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Enter URL to Analyze</label>
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/suspicious-page"
                        className="w-full"
                      />
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={isAnalyzing || !url.trim()}
                      className="w-full"
                      size="lg"
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze URL"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Our advanced algorithm analyzes multiple factors to determine phishing risk.
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Risk Score Progress Bar - Always visible */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Risk Score</span>
                    <span className={`text-xl font-bold ${
                      progress < 20 ? 'text-green-500' :
                      progress < 40 ? 'text-yellow-500' :
                      progress < 60 ? 'text-orange-500' :
                      progress < 80 ? 'text-red-500' :
                      'text-red-700'
                    }`}>
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Safe</span>
                    <span>Very High Risk</span>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Analysis Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
                  <div className="space-y-6">
                    {result ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          {getRiskIcon(result.riskLevel)}
                          <span className={`text-3xl font-bold ${getRiskColor(result.riskLevel)}`}>
                            {result.riskLevel === 'Safe' || result.riskLevel === 'Low Risk' ? 'SAFE' : 'SUSPICIOUS/FAKE'}
                          </span>
                        </div>
                        <p className="text-xl text-muted-foreground font-semibold">
                          Risk Score: {result.riskScore}%
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Ready for Analysis</h3>
                        <p className="text-muted-foreground">
                          Enter a URL above to see risk assessment.
                        </p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Text Representation */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Detailed Report</h2>
                  <Textarea
                    value={result.textRepresentation}
                    readOnly
                    className="w-full h-80 resize-none font-mono text-sm"
                  />
                </GlassCard>
              </motion.div>
            )}

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold mb-6">Phishing Prevention Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tips.map((tip, index) => (
                    <div key={index} className="text-center">
                      <tip.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h3 className="font-semibold mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tip.description}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default PhishingDashboard;
