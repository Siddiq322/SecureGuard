import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ShieldCheck, AlertTriangle, KeyRound, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/effects/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import GlassCard from "@/components/cards/GlassCard";

const PasswordDashboard = () => {
  const navigate = useNavigate();

  const tips = [
    {
      icon: KeyRound,
      title: "Use Long Passwords",
      description: "Aim for at least 12 characters. Longer passwords are exponentially harder to crack.",
    },
    {
      icon: ShieldCheck,
      title: "Mix Character Types",
      description: "Combine uppercase, lowercase, numbers, and special characters.",
    },
    {
      icon: AlertTriangle,
      title: "Avoid Common Patterns",
      description: "Don't use dictionary words, personal info, or sequential characters.",
    },
  ];

  const stats = [
    { label: "Passwords Analyzed", value: "156", trend: "+12 today" },
    { label: "Weak Passwords Found", value: "23", trend: "-5 this week" },
    { label: "Average Strength", value: "78%", trend: "+3% improvement" },
  ];

  return (
    <PageTransition>
      <ParticleBackground />
<Navbar isAuthenticated />

      <main className="relative z-10 min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Password Strength Analyzer</h1>
              <p className="text-muted-foreground">
                Evaluate and improve your password security
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
              <GlassCard key={stat.label} className="p-6" delay={0.1 + index * 0.1}>
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-foreground font-medium">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.trend}</div>
              </GlassCard>
            ))}
          </div>

          {/* Tips Section */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold mb-4"
          >
            Password Security Tips
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {tips.map((tip, index) => (
              <GlassCard key={tip.title} className="p-6" delay={0.4 + index * 0.1}>
                <tip.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                <p className="text-muted-foreground text-sm">{tip.description}</p>
              </GlassCard>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Link to="/password-strength">
              <Button variant="cyber" size="xl">
                Start Password Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
};

export default PasswordDashboard;
