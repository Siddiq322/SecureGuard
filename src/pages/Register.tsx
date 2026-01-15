import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/effects/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import AuthForm from "@/components/forms/AuthForm";
import { GoogleUser } from "@/utils/googleAuth";

import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: { email: string; password: string; name?: string }) => {
    console.log("Register attempt for:", data.email);
    setIsLoading(true);

    // Basic validation
    if (!data.email || !data.password || !data.name) {
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

    // Check if user already exists (in localStorage for demo)
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = existingUsers.find((user: any) => user.email === data.email);

    if (userExists) {
      toast.error("An account with this email already exists");
      setIsLoading(false);
      return;
    }

    try {
      // Create new user account
      const newUser = {
        uid: `user_${Date.now()}`,
        email: data.email,
        name: data.name,
        password: data.password, // In real app, this would be hashed
        role: 'user',
        registeredAt: new Date().toISOString()
      };

      // Store in registered users (for demo purposes)
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      // Auto-login the user
      const mockUser = {
        uid: newUser.uid,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem('mockUser', JSON.stringify(mockUser));

      console.log("Register success:", mockUser.email);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Register error:", error);
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (googleUser: GoogleUser) => {
    console.log("Google sign-in for:", googleUser.email);
    setIsLoading(true);

    try {
      // Check if Google user already exists
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = existingUsers.find((user: any) => user.email === googleUser.email);

      if (userExists) {
        // User exists, just log them in
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
        toast.success(`Welcome back, ${googleUser.name}!`);
      } else {
        // Create new user account from Google data
        const newUser = {
          uid: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          provider: 'google',
          role: 'user',
          registeredAt: new Date().toISOString()
        };

        // Store in registered users
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

        // Auto-login the user
        const mockUser = {
          uid: newUser.uid,
          email: newUser.email,
          name: newUser.name,
          picture: newUser.picture,
          provider: 'google',
          role: newUser.role,
          loggedInAt: new Date().toISOString()
        };

        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        toast.success(`Account created successfully! Welcome, ${googleUser.name}!`);
      }

      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Google register error:", error);
      toast.error("Google registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <ParticleBackground />
      <Navbar />
      <AuthForm type="register" onSubmit={handleRegister} onGoogleSignIn={handleGoogleSignIn} isLoading={isLoading} />
    </PageTransition>
  );
};

export default Register;
