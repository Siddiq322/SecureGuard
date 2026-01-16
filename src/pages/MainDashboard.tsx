import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Lock, Globe, FileWarning, Shield, Activity, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/effects/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import DashboardCard from "@/components/cards/DashboardCard";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const MainDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("User authenticated:", firebaseUser.email);
        setUser(firebaseUser);
      } else {
        console.log("No authenticated user, redirecting to login");
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const stats = [
    { label: "Scans Today", value: "24", icon: Activity },
    { label: "Threats Blocked", value: "3", icon: Shield },
    { label: "Security Score", value: "94%", icon: CheckCircle },
  ];

  return (
    <PageTransition>
      <ParticleBackground />
      <Navbar isAuthenticated onLogout={handleLogout} />

      <main className="relative z-10 min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-2">
              Welcome to <span className="text-gradient-cyber">SecureGuard</span>
            </h1>
            <p className="text-muted-foreground">
              Your comprehensive security dashboard. Choose a tool to get started.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-6 rounded-xl bg-card/30 backdrop-blur-xl border border-border/50 text-center"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tool Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <DashboardCard
              title="Password Strength Analyzer"
              description="Evaluate your password security with real-time analysis and get recommendations for stronger passwords."
              icon={Lock}
              to="/password-dashboard"
              color="cyan"
              delay={0.3}
            />
            <DashboardCard
              title="Phishing Website Detector"
              description="Check URLs for potential phishing threats and malicious content before you click."
              icon={Globe}
              to="/phishing-dashboard"
              color="purple"
              delay={0.4}
            />
            <DashboardCard
              title="Malware Detection Tool"
              description="Upload and scan files for malware, viruses, and other security threats."
              icon={FileWarning}
              to="/malware-dashboard"
              color="green"
              delay={0.5}
            />
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default MainDashboard;
