import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [user, setUser] = useState<{ uid: string; email: string; loggedInAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for logged-in user in localStorage
    const storedUser = localStorage.getItem('mockUser');

    if (storedUser) {
      const mockUser = JSON.parse(storedUser);
      setUser(mockUser);
      setLoading(false);
    } else {
      // No user logged in, redirect to login
      navigate("/login");
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export default AuthGuard;