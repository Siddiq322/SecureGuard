import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Check, X, ArrowLeft, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/effects/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import GlassCard from "@/components/cards/GlassCard";

interface PasswordCriteria {
  label: string;
  test: (password: string) => boolean;
}

const PasswordStrength = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const criteria: PasswordCriteria[] = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "At least 12 characters", test: (p) => p.length >= 12 },
    { label: "Contains uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "Contains lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "Contains number", test: (p) => /[0-9]/.test(p) },
    { label: "Contains special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
    { label: "No common patterns", test: (p) => !/(.)\1{2,}|123|abc|password/i.test(p) },
  ];

  useEffect(() => {
    const passedCount = criteria.filter((c) => c.test(password)).length;
    setStrength(Math.round((passedCount / criteria.length) * 100));
  }, [password]);

  const getStrengthColor = () => {
    if (strength < 30) return "bg-destructive";
    if (strength < 60) return "bg-warning";
    if (strength < 80) return "bg-primary";
    return "bg-success";
  };

  const getStrengthLabel = () => {
    if (strength < 30) return { text: "Weak", color: "text-destructive" };
    if (strength < 60) return { text: "Fair", color: "text-warning" };
    if (strength < 80) return { text: "Good", color: "text-primary" };
    return { text: "Strong", color: "text-success" };
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < 16; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  return (
    <PageTransition>
      <ParticleBackground />
      <Navbar isAuthenticated onLogout={() => { localStorage.removeItem('mockUser'); navigate("/login"); }} />

      <main className="relative z-10 min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link to="/password-dashboard">
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
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Password Strength Analyzer</h1>
            <p className="text-muted-foreground">
              Enter a password to analyze its strength in real-time
            </p>
          </motion.div>

          {/* Input Card */}
          <GlassCard className="p-8 mb-6" hover={false}>
            <div className="relative mb-6">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password to analyze..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-24 text-lg h-14 font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-10 w-10"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={generatePassword}
                  className="h-10 w-10"
                  title="Generate password"
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Strength Meter */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Password Strength</span>
                <motion.span
                  key={strength}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-lg font-bold ${getStrengthLabel().color}`}
                >
                  {password ? `${strength}% - ${getStrengthLabel().text}` : "0% - Enter password"}
                </motion.span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${strength}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full ${getStrengthColor()} transition-colors duration-300`}
                  style={{
                    boxShadow: strength > 0 ? `0 0 20px currentColor` : "none",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Criteria Checklist */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Security Criteria
              </h3>
              <AnimatePresence>
                {criteria.map((criterion, index) => {
                  const passed = password ? criterion.test(password) : null;
                  return (
                    <motion.div
                      key={criterion.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          backgroundColor:
                            passed === true
                              ? "hsl(142 71% 45%)"
                              : passed === false
                              ? "hsl(0 84% 60%)"
                              : "hsl(217 33% 17%)",
                          scale: passed !== null ? [1, 1.2, 1] : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                      >
                        {passed === true && <Check className="w-4 h-4 text-success-foreground" />}
                        {passed === false && <X className="w-4 h-4 text-destructive-foreground" />}
                      </motion.div>
                      <span
                        className={`text-sm transition-colors ${
                          passed === true
                            ? "text-success"
                            : passed === false
                            ? "text-muted-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {criterion.label}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
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

export default PasswordStrength;
