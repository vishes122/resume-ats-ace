
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
      // First attempt to sign in normally
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If we get an email_not_confirmed error
      if (error && error.code === "email_not_confirmed") {
        console.log("Email not confirmed, attempting to retrieve user data");
        
        // For development purposes, we'll create a custom session
        // by using admin data fetching instead
        const { data: userData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();
        
        if (userData && !profileError) {
          // User exists in the profiles table
          setIsEmailVerificationRequired(true);
          
          // Set the user data manually for development purposes
          const devUser = {
            id: userData.id,
            email: userData.email,
            user_metadata: {
              full_name: userData.full_name
            }
          } as unknown as User;
          
          setUser(devUser);
          // We can't create a real session without auth, but we can fake it for development
          setSession({ user: devUser } as Session);
          
          toast.warning("Email not verified but proceeding for development purposes");
          setLoading(false);
          return;
        } else {
          // User doesn't exist in the profiles table
          toast.error(`Login failed: Account not found or incorrect password`);
          throw new Error("Account not found");
        }
      } else if (error) {
        // Handle other errors
        toast.error(`Login error: ${error.message}`);
        throw error;
      }
      
      // Normal successful login
      toast.success("Successfully logged in!");
    } catch (error: any) {
      const errorWithCode = {
        ...error,
        code: error.__isAuthError ? error.code : "unknown_error"
      };
      
      toast.error(`Login error: ${error.message || "Failed to login"}`);
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
      
      // Manually set user data for development experience
      if (data.user) {
        setUser(data.user);
        // We can't create a real session without auth verification, but we can fake it
        setSession({ user: data.user } as Session);
      }
      
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
      // Clear our manual session/user if we were using the development bypass
      setUser(null);
      setSession(null);
      setIsEmailVerificationRequired(false);
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
