import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/effects/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import AuthForm from "@/components/forms/AuthForm";
import { GoogleUser } from "@/utils/googleAuth";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, fetchSignInMethodsForEmail } from "firebase/auth";
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
    } catch (error: unknown) {
      console.error("Login error:", error);
      let errorMessage = "Login failed";
      
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/user-not-found') {
          errorMessage = "No account found with this email";
        } else if (firebaseError.code === 'auth/wrong-password') {
          errorMessage = "Invalid password";
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = "Invalid email address";
        } else if (firebaseError.code === 'auth/user-disabled') {
          errorMessage = "This account has been disabled";
        } else if (firebaseError.code === 'auth/too-many-requests') {
          errorMessage = "Too many failed login attempts. Please try again later";
        }
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
      // Check if the email is registered
      const signInMethods = await fetchSignInMethodsForEmail(auth, googleUser.email);

      if (signInMethods.length === 0) {
        // Email is not registered
        toast.error("Account not registered. Please sign up first.");
        setIsLoading(false);
        return;
      }

      // Email is registered, proceed with Google sign-in
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google login success:", user.email);
      toast.success(`Welcome back, ${user.displayName || user.email}!`);
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Google login error:", error);
      let errorMessage = "Google login failed";

      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/popup-closed-by-user') {
          errorMessage = "Sign-in cancelled";
        } else if (firebaseError.code === 'auth/popup-blocked') {
          errorMessage = "Popup blocked by browser";
        } else if (firebaseError.code === 'auth/user-disabled') {
          errorMessage = "This account has been disabled";
        }
      }

      toast.error(errorMessage);
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
