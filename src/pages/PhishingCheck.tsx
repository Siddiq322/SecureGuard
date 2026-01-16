import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Globe, Search, ArrowLeft, Shield, AlertTriangle, ShieldCheck, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/effects/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import GlassCard from "@/components/cards/GlassCard";

interface ScanResult {
  status: "SAFE" | "PHISHING";
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
}

const PhishingCheck = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState(0);

  const analyzeURL = (url: string): ScanResult => {
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

      // Clamp risk score between 0 and 100
      riskScore = Math.max(0, Math.min(100, riskScore));

      // Determine risk level and status
      let riskLevel: ScanResult['riskLevel'];
      let status: "SAFE" | "PHISHING";

      if (riskScore <= 20) {
        riskLevel = 'Safe';
        status = 'SAFE';
      } else if (riskScore <= 40) {
        riskLevel = 'Low Risk';
        status = 'SAFE';
      } else if (riskScore <= 60) {
        riskLevel = 'Medium Risk';
        status = 'PHISHING';
      } else if (riskScore <= 80) {
        riskLevel = 'High Risk';
        status = 'PHISHING';
      } else {
        riskLevel = 'Very High Risk';
        status = 'PHISHING';
      }

      return {
        status,
        riskScore,
        riskLevel,
        analysis: {
          domain,
          protocol: urlObj.protocol,
          hasHttps: urlObj.protocol === 'https:',
          suspiciousPatterns,
          legitimateIndicators,
          recommendations
        }
      };

    } catch (error) {
      return {
        status: 'PHISHING',
        riskScore: 100,
        riskLevel: 'Very High Risk',
        analysis: {
          domain: 'Invalid',
          protocol: 'Invalid',
          hasHttps: false,
          suspiciousPatterns: ['Invalid URL format'],
          legitimateIndicators: [],
          recommendations: ['Please enter a valid URL']
        }
      };
    }
  };

  // Local phishing detection (frontend-only)
  async function checkPhishingLocally(url: string): Promise<ScanResult> {
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    return analyzeURL(url);
  }

  const handleScan = async () => {
    if (!url) return;

    setIsScanning(true);
    setResult(null);
    setProgress(0); // Reset progress to 0 when starting

    try {
      // Run local phishing detection (frontend-only)
      const scanResult = await checkPhishingLocally(url);
      setResult(scanResult);
      setProgress(scanResult.riskScore); // Set final progress
    } catch (error) {
      console.error("Scan failed:", error);
      setResult({
        status: 'PHISHING',
        riskScore: 100,
        riskLevel: 'Very High Risk',
        analysis: {
          domain: 'Error',
          protocol: 'Error',
          hasHttps: false,
          suspiciousPatterns: ['Analysis failed'],
          legitimateIndicators: [],
          recommendations: ['Please try again']
        }
      });
    }

    setIsScanning(false);
  };

  return (
    <PageTransition>
      <ParticleBackground />
      <Navbar isAuthenticated />

      <main className="relative z-10 min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link to="/phishing-dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">URL Security Scanner</h1>
            <p className="text-muted-foreground">
              Enter a URL to check if it's safe or potentially malicious
            </p>
          </motion.div>

          {/* Risk Score Progress Bar - Always visible */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Risk Score</span>
              <span className={`text-xl font-bold ${
                progress < 30 ? 'text-green-500' :
                progress < 50 ? 'text-yellow-500' :
                progress < 70 ? 'text-orange-500' :
                progress < 85 ? 'text-red-500' :
                'text-red-700'
              }`}>
                {progress}%
              </span>
            </div>
            <Progress
              value={progress}
              className="h-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Safe</span>
              <span>Very High Risk</span>
            </div>
          </div>

          {/* Scan Card */}
          <GlassCard className="p-8 mb-6" hover={false}>
            <div className="flex gap-3 mb-6">
              <Input
                type="url"
                placeholder="Enter URL to scan (e.g., example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                className="text-lg h-14 font-mono"
              />
              <Button
                variant="cyber"
                size="lg"
                onClick={handleScan}
                disabled={isScanning || !url}
                className="h-14 px-8"
              >
                {isScanning ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Scan
                  </>
                )}
              </Button>
            </div>

            {/* Scanning Animation */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-primary/30 border-t-primary"
                  />
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-muted-foreground"
                  >
                    Analyzing URL for threats...
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            <AnimatePresence>
              {result && !isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6"
                >
                  <GlassCard className="p-6">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          result.status === 'SAFE' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}
                      >
                        {result.status === 'SAFE' ? (
                          <CheckCircle className="w-10 h-10 text-green-500" />
                        ) : (
                          <XCircle className="w-10 h-10 text-red-500" />
                        )}
                      </motion.div>

                      <h3 className={`text-3xl font-bold mb-2 ${
                        result.status === 'SAFE' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {result.status === 'SAFE' ? 'SAFE' : 'SUSPICIOUS/FAKE'}
                      </h3>

                      <p className="text-xl text-muted-foreground font-semibold">
                        Risk Score: {result.riskScore}%
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          {/* Back to dashboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link to="/dashboard">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
};

export default PhishingCheck;
