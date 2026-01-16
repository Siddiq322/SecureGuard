import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/effects/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import AuthForm from "@/components/forms/AuthForm";
import { GoogleUser } from "@/utils/googleAuth";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Update the user profile with display name
      if (data.name) {
        await updateProfile(user, {
          displayName: data.name
        });
      }

      console.log("Register success:", user.email);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Register error:", error);
      let errorMessage = "Registration failed";
      
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/email-already-in-use') {
          errorMessage = "An account with this email already exists";
        } else if (firebaseError.code === 'auth/weak-password') {
          errorMessage = "Password is too weak";
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = "Invalid email address";
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
      // Check if the email is already registered
      const signInMethods = await fetchSignInMethodsForEmail(auth, googleUser.email);

      if (signInMethods.length > 0) {
        // Email is already registered
        toast.error("Account already exists. Please login.");
        setIsLoading(false);
        return;
      }

      // Email is not registered, proceed with Google sign-in
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        picture: user.photoURL,
        provider: 'google',
        role: 'user',
        createdAt: new Date().toISOString(),
        emailVerified: user.emailVerified
      });

      console.log("Google register success:", user.email);
      toast.success("Account created successfully! Welcome!");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Google register error:", error);
      let errorMessage = "Google registration failed";

      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/popup-closed-by-user') {
          errorMessage = "Sign-in cancelled";
        } else if (firebaseError.code === 'auth/popup-blocked') {
          errorMessage = "Popup blocked by browser";
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
      <AuthForm type="register" onSubmit={handleRegister} onGoogleSignIn={handleGoogleSignIn} isLoading={isLoading} />
    </PageTransition>
  );
};

export default Register;
