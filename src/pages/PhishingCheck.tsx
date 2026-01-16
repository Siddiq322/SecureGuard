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
import { apiService } from "@/lib/api";
import { toast } from "sonner";

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

  const handleScan = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to scan");
      return;
    }

    setIsScanning(true);
    setResult(null);
    setProgress(0);

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    const scanResult = analyzeURL(url.trim());
    setResult(scanResult);
    setProgress(scanResult.riskScore);
    setIsScanning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SAFE':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'PHISHING':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SAFE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PHISHING':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
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
            <h1 className="text-4xl font-bold text-gradient-cyber mb-4">
              URL Security Scanner
            </h1>
            <p className="text-muted-foreground text-lg">
              Analyze URLs for potential phishing threats using advanced security algorithms
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 mb-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder="Enter URL to scan (e.g., https://example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-lg"
                    disabled={isScanning}
                  />
                </div>
                <Button
                  onClick={handleScan}
                  disabled={isScanning || !url.trim()}
                  size="lg"
                  className="px-8"
                >
                  {isScanning ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Search className="w-5 h-5 mr-2" />
                  )}
                  {isScanning ? "Scanning..." : "Scan URL"}
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Progress Bar */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6"
              >
                <GlassCard className="p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Shield className="w-8 h-8 text-primary animate-pulse mr-3" />
                      <span className="text-xl font-semibold">Analyzing URL...</span>
                    </div>
                    <Progress value={progress} className="w-full mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Performing comprehensive security analysis
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard className="p-6">
                  {/* Status Header */}
                  <div className={`p-4 rounded-lg border mb-6 ${getStatusColor(result.status)}`}>
                    <div className="flex items-center">
                      {getStatusIcon(result.status)}
                      <div className="ml-3">
                        <h3 className="font-semibold text-lg">
                          {result.status === 'SAFE' ? 'URL Appears Safe' : 'Potential Security Risk'}
                        </h3>
                        <p className="text-sm opacity-90">
                          Risk Level: {result.riskLevel} ({result.riskScore}/100)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        URL Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Domain:</span> {result.analysis.domain}</p>
                        <p><span className="font-medium">Protocol:</span> {result.analysis.protocol}</p>
                        <p><span className="font-medium">HTTPS:</span> {result.analysis.hasHttps ? 'Yes' : 'No'}</p>
                      </div>
                    </div>

                    {/* Analysis Results */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Analysis Results
                      </h4>

                      {result.analysis.suspiciousPatterns.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-red-600 mb-2">Suspicious Patterns:</p>
                          <ul className="text-sm space-y-1">
                            {result.analysis.suspiciousPatterns.map((pattern, index) => (
                              <li key={index} className="flex items-start">
                                <XCircle className="w-3 h-3 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                                {pattern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.analysis.legitimateIndicators.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-green-600 mb-2">Legitimate Indicators:</p>
                          <ul className="text-sm space-y-1">
                            {result.analysis.legitimateIndicators.map((indicator, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                {indicator}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.analysis.recommendations.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-blue-600 mb-2">Recommendations:</p>
                          <ul className="text-sm space-y-1">
                            {result.analysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <AlertCircle className="w-3 h-3 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-6 border-t">
                    <Button
                      onClick={() => {
                        setUrl("");
                        setResult(null);
                        setProgress(0);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Scan Another URL
                    </Button>
                    <Button
                      onClick={() => navigate("/phishing-dashboard")}
                      className="flex-1"
                    >
                      View Dashboard
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </PageTransition>
  );
};

export default PhishingCheck;