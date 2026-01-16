import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/effects/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import AuthForm from "@/components/forms/AuthForm";
import { GoogleUser } from "@/utils/googleAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    console.log("Login attempt for:", data.email);
    setIsLoading(true);

    // Basic validation
    if (!data.email || !data.password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      // Sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, data.email, data.password);

      console.log("Login success:", data.email);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Login failed";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Invalid password";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (googleUser: GoogleUser) => {
    console.log("Google sign-in for:", googleUser.email);
    setIsLoading(true);

    try {
      // Check if Google user already exists in registered users
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = existingUsers.find((user: any) => user.email === googleUser.email);

      // Also check valid demo accounts
      const validAccounts = [
        { email: "user@cyberguard.com", password: "user123", role: "user" },
        { email: googleUser.email, password: "demo123", role: "user" }
      ];
      const accountExists = validAccounts.find(acc => acc.email === googleUser.email);

      if (!userExists && !accountExists) {
        toast.error("No account found with this Google email. Please register first or use email/password login.");
        setIsLoading(false);
        return;
      }

      // Store Google user in localStorage for persistence
      const mockUser = {
        uid: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        provider: 'google',
        role: 'user',
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem('mockUser', JSON.stringify(mockUser));

      console.log("Google login success:", mockUser.email);
      toast.success(`Welcome back, ${googleUser.name}!`);
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Google login error:", error);
      toast.error("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <ParticleBackground />
      <Navbar />
      <AuthForm type="login" onSubmit={handleLogin} onGoogleSignIn={handleGoogleSignIn} isLoading={isLoading} />
    </PageTransition>
  );
};

export default Login;
