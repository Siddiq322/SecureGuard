import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/effects/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import AuthForm from "@/components/forms/AuthForm";
import { GoogleUser } from "@/utils/googleAuth";

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

    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
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

    // Mock authentication - check against predefined accounts and registered users
    const validAccounts = [
      { email: "user@cyberguard.com", password: "user123", role: "user" },
      // Allow any email with password "demo123" for testing
      { email: data.email, password: "demo123", role: "user" }
    ];

    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const registeredUser = registeredUsers.find((user: any) =>
      user.email === data.email && user.password === data.password
    );

    const account = registeredUser || validAccounts.find(acc =>
      acc.email === data.email && acc.password === data.password
    );

    if (!account) {
      toast.error("Invalid email or password");
      setIsLoading(false);
      return;
    }

    try {
      // Store user in localStorage for persistence
      const mockUser = {
        uid: `user_${Date.now()}`,
        email: data.email,
        role: account.role,
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem('mockUser', JSON.stringify(mockUser));

      console.log("Login success:", mockUser.email);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Login error:", error);
      toast.error("Login failed");
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
