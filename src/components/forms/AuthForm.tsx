import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlassCard from "@/components/cards/GlassCard";
import { Link } from "react-router-dom";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { GoogleUser } from "@/utils/googleAuth";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
  onGoogleSignIn?: (user: GoogleUser) => void;
  isLoading?: boolean;
}

const AuthForm = ({ type, onSubmit, onGoogleSignIn, isLoading = false }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isLogin = type === "login";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <GlassCard className="w-full max-w-md p-8" hover={false}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gradient-cyber mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Sign in to access your security dashboard"
              : "Join SecureGuard and protect your digital life"}
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name field (register only) */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                  focused === "name" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                className="pl-11"
                required
              />
            </motion.div>
          )}

          {/* Email field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: isLogin ? 0.2 : 0.3 }}
            className="relative"
          >
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                focused === "email" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Mail className="w-5 h-5" />
            </div>
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className="pl-11"
              required
            />
          </motion.div>

          {/* Password field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: isLogin ? 0.3 : 0.4 }}
            className="relative"
          >
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                focused === "password" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Lock className="w-5 h-5" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className="pl-11 pr-11"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </motion.div>

          {/* Google Sign-In */}
          {onGoogleSignIn && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <GoogleSignInButton
                onSuccess={onGoogleSignIn}
                disabled={isLoading}
              />

              <p className="text-xs text-muted-foreground text-center mt-2">
                {isLogin
                  ? "Google sign-in requires an existing account"
                  : "Google sign-in will create a new account"}
              </p>
            </>
          )}

          {/* Submit button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isLogin ? 0.4 : 0.5 }}
          >
            <Button
              type="submit"
              variant="cyber"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs">
                <p className="font-medium mb-2">Demo Credentials:</p>
                <p>User: user@cyberguard.com / user123</p>
                <p>Or use password: demo123 (any email)</p>
              </div>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </>
          )}
        </motion.div>
      </GlassCard>
    </div>
  );
};

export default AuthForm;
