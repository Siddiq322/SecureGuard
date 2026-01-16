import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { googleAuthService, GoogleUser } from "@/utils/googleAuth";
import { toast } from "sonner";

interface GoogleSignInButtonProps {
  onSuccess: (user: GoogleUser) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
}

const GoogleSignInButton = ({ onSuccess, onError, disabled = false }: GoogleSignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Google Identity Services
    const initGoogle = async () => {
      try {
        await googleAuthService.initGoogleSignIn();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    };

    if (window.google && window.google.accounts && window.google.accounts.id) {
      initGoogle();
    } else {
      // Wait for Google Identity Services to load
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          clearInterval(checkGoogle);
          initGoogle();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogle);
        console.error('Google Identity Services failed to load');
      }, 10000);
    }
  }, [onError]);

  const handleGoogleSignIn = async () => {
    if (!isInitialized) {
      toast.error("Google Sign-In is not ready yet. Please wait.");
      return;
    }

    setIsLoading(true);
    try {
      const user = await googleAuthService.signInWithGoogle();
      onSuccess(user);
      toast.success(`Welcome, ${user.name}!`);
    } catch (error) {
      console.error('Google sign-in failed:', error);
      toast.error("Google sign-in failed. Please try again.");
      if (onError) {
        onError(error as Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative"
    >
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={handleGoogleSignIn}
        disabled={disabled || isLoading || !isInitialized}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {isLoading ? "Signing in..." : "Continue with Google"}
      </Button>

      {!isInitialized && !disabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-md">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading Google Sign-In...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GoogleSignInButton;