
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isEmailVerificationRequired: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerificationRequired, setIsEmailVerificationRequired] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // For email_not_confirmed errors, allow login anyway for development purposes
        if (error.code === "email_not_confirmed") {
          // Try to get the user credentials to see if they exist
          const { data: signInData } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInData.user) {
            // Set email verification required flag but don't block login
            setIsEmailVerificationRequired(true);
            toast.warning("Your email is not verified, but you can proceed for development purposes");
            return;
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
      
      toast.success("Successfully logged in!");
    } catch (error: any) {
      const errorWithCode = {
        ...error,
        code: error.__isAuthError ? error.code : "unknown_error"
      };
      
      if (error.code === "email_not_confirmed") {
        setIsEmailVerificationRequired(true);
        toast.warning("Please verify your email before logging in");
      } else {
        toast.error(`Login error: ${error.message}`);
      }
      
      throw errorWithCode;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      
      // For development, consider the user as logged in even without email confirmation
      setIsEmailVerificationRequired(true);
      toast.success("Registration successful! In a production environment, you would need to verify your email.");
      console.log("Registration successful for:", email, "User data:", data);
    } catch (error: any) {
      const errorWithCode = {
        ...error,
        code: error.__isAuthError ? error.code : "unknown_error"
      };
      toast.error(`Registration error: ${error.message}`);
      throw errorWithCode;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(`Logout error: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      signIn, 
      signUp, 
      signOut, 
      loading,
      isEmailVerificationRequired 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
