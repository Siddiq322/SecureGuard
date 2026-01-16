import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Lock, Globe, FileWarning, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/effects/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";

const Index = () => {
  const features = [
    {
      icon: Lock,
      title: "Password Analyzer",
      description: "Evaluate password strength with real-time feedback and recommendations.",
    },
    {
      icon: Globe,
      title: "Phishing Detector",
      description: "Identify malicious URLs and protect against phishing attacks.",
    },
    {
      icon: FileWarning,
      title: "Malware Scanner",
      description: "Scan files for potential threats and malware signatures.",
    },
  ];

  return (
    <PageTransition>
      <ParticleBackground />
      <Navbar />
      
      <main className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4">
          <div className="container mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Advanced Security Suite</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-foreground">Protect Your</span>
              <br />
              <span className="text-gradient-cyber">Digital World</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Comprehensive security tools to analyze passwords, detect phishing attempts, 
              and scan for malware. Stay protected in an ever-evolving digital landscape.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <Button variant="cyber" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl">
                  Sign In
                </Button>
              </Link>
            </motion.div>

            {/* Shield animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative mt-20"
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 40px hsl(187 100% 50% / 0.2)",
                    "0 0 80px hsl(187 100% 50% / 0.4)",
                    "0 0 40px hsl(187 100% 50% / 0.2)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-card/50 backdrop-blur-xl border border-primary/30"
              >
                <Shield className="w-16 h-16 text-primary" />
              </motion.div>
              
              {/* Orbiting elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-2 h-2 bg-secondary rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-12"
            >
              Powerful <span className="text-gradient-cyber">Security Tools</span>
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl bg-card/30 backdrop-blur-xl border border-border/50 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(187_100%_50%/0.15)] transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border/50">
          <div className="container mx-auto text-center text-muted-foreground text-sm">
            <p>© 2024 SecureGuard. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </PageTransition>
  );
};

export default Index;
