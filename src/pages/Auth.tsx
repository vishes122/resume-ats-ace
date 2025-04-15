
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, AlertCircle } from "lucide-react";

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
  const { signIn, signUp, loading } = useAuth();
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
    setEmailNeedsVerification(false);
    try {
      await signIn(values.email, values.password);
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle the email not confirmed error specifically
      if (error.code === "email_not_confirmed") {
        setEmailNeedsVerification(true);
        setVerificationEmail(values.email);
        toast.error("Please verify your email before logging in");
      } else {
        toast.error(error.message || "Failed to login");
      }
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      await signUp(values.email, values.password, values.fullName);
      setVerificationEmail(values.email);
      setEmailNeedsVerification(true);
      toast.success("Account created successfully! Please check your email for verification.");
      setActiveTab("login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">ATS-Resume Builder</h1>
          <p className="text-slate-600 mt-2">Create professional, ATS-friendly resumes</p>
        </div>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            
              {emailNeedsVerification ? (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-amber-800">Email verification required</h3>
                      <p className="mt-1 text-sm text-amber-700">
                        We sent a verification link to <strong>{verificationEmail}</strong>.
                        Please check your inbox and click the link to verify your email address.
                      </p>
                      <p className="mt-3 text-xs text-amber-600">
                        Note: For development purposes, you can disable email verification in the Supabase dashboard 
                        under Authentication → Email Templates → Confirm signup → Enable Email Confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <TabsContent value="login" className="mt-4">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="name@example.com" {...field} />
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
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
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

                  <TabsContent value="register" className="mt-4">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
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
                                <Input placeholder="name@example.com" {...field} />
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
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
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
        
        <div className="text-center mt-6 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} <a href="https://www.visheshsanghvi.me" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vishesh Sanghvi</a></p>
        </div>
      </div>
    </div>
  );
}
