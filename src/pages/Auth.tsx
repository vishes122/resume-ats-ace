import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, AlertCircle, Mail, Lock, User } from "lucide-react";
import { AnimatedGradient } from "@/components/ui/animated-gradient";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [emailNeedsVerification, setEmailNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const { signIn, signUp, loading, isEmailVerificationRequired } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      await signIn(values.email, values.password);
      
      // For development purposes, redirect even if email needs verification
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle the email not confirmed error specifically
      if (error.code === "email_not_confirmed") {
        setEmailNeedsVerification(true);
        setVerificationEmail(values.email);
      } else {
        toast.error(error.message || "Failed to login");
      }
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      await signUp(values.email, values.password, values.fullName);
      
      // For development purposes, redirect to login or home after registration
      setVerificationEmail(values.email);
      setEmailNeedsVerification(true);
      setActiveTab("login");
      
      // For development, optionally go directly to homepage
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register");
    }
  };

  const verificationMessage = (
    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-amber-800">Email verification required</h3>
          <p className="mt-1 text-sm text-amber-700">
            We sent a verification link to <strong>{verificationEmail}</strong>.
            Please check your inbox and click the link to verify your email address.
          </p>
          <div className="mt-3 p-3 bg-amber-100 rounded-md text-xs text-amber-800 border border-amber-200">
            <strong>Development Notice:</strong> You can disable email verification in the Supabase dashboard 
            under Authentication → Email Templates → Confirm signup → Enable Email Confirmation.
          </div>
          <div className="mt-3">
            <Button 
              variant="outline" 
              className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
              onClick={() => navigate("/")}
            >
              Continue to app anyway (Development only)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <AnimatedGradient />
      
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ATS-Resume Builder
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Create professional, ATS-friendly resumes
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-white/20 shadow-xl">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/50 dark:bg-gray-800/50">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            
              {emailNeedsVerification && verificationMessage}
              
              {!emailNeedsVerification && (
                <>
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                  <Input placeholder="name@example.com" {...field} className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                  <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" disabled={loading}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Logging in...
                            </>
                          ) : (
                            "Log in"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                  <Input placeholder="John Doe" {...field} className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                  <Input placeholder="name@example.com" {...field} className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                  <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" disabled={loading}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Create account"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-2 pt-2">
            <div className="text-sm text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service & Privacy Policy.
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} <a href="https://www.visheshsanghvi.me" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vishesh Sanghvi</a></p>
        </div>
      </div>
    </div>
  );
}
