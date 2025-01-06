import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import "./login.css"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import callApi from "@/utils/utils"
import { z } from "zod"
import { useState } from "react"
import { LoadingSpinner } from "../common/loadingSpinner"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/authContext"

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_ID!
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI!
// Define the schema for login form
// Schema for login
const loginSchema = z.object({
  userIdentifier: z.string().min(1, "Email or Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const resetPasswordSchema = z.object({
  userIdentifier: z
    .string()
    .min(1, "Username or Email is required")
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.trim().length > 0,
      "Must be a valid email or username"
    ),
});


// Type definitions
type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [authState, setAuthState] = useState({ isLogin: true, isSignup: false, isResetPassword: false });
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation();
  const { login } = useAuth()

  // Login form hook
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Signup form hook
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });


  const resetForm = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema)
  })
  // Handlers for login and signup submissions
  const handleLoginSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {

      console.log("login clicked")
      setLoading(true)

      const response = await callApi<{ token: string }>({
        endpoint: "/auth/login",
        method: "POST",
        body: data,
      });

      toast({ title: "Success", description: "Login Successful", duration: 2000 });
      login(response.token)
      loginForm.reset();

      // Redirect:
      const { from } = location.state || { from: { pathname: "/" } };
      localStorage.removeItem('redirectTo');

      navigate(from)

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  };

  const handleSignupSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      setLoading(true)
      const response = await callApi<{ message: string }>({
        endpoint: "/auth/signup",
        method: "POST",
        body: data,
      });
      toast({ title: "Success", description: response.message });
      signupForm.reset();
    } catch (err: any) {
      console.log("erro ", err)
      toast({
        title: "Error",
        description: err.message || "Signup failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  };

  const SendPasswordResetLink: SubmitHandler<ResetPasswordData> = async (data) => {
    try {
      setLoading(true)
      await callApi<{ message: string }>({
        endpoint: "/auth/forgot-password",
        method: "POST",
        body: { userIdentifier: data.userIdentifier }
      });
      toast({ title: "Password reset link sent to your email" })
    }
    catch (error: any) {
      toast({ title: "Error occured", description: error.message })
    } finally {
      setLoading(false)
    }
  }

  // GitHub login handler
  const handleGithubLogin = () => {
    const redirectUri = encodeURIComponent(`${REDIRECT_URI}auth/github-callback`);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{authState ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {authState
              ? "Enter your email or username and password to login"
              : "Enter your details to create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-sm:min-w-[30rem] sm:w-full">
          {authState.isLogin && (
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} autoComplete="off">
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="userIdentifier">Email or Username</Label>
                  <Input
                    id="userIdentifier"
                    {...loginForm.register("userIdentifier")}
                    placeholder="Email or Username"
                  />
                  {loginForm.formState.errors.userIdentifier && (
                    <p className="text-red-500">
                      {loginForm.formState.errors.userIdentifier.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...loginForm.register("password")}
                    placeholder="Enter your password"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button className="w-full" type="button" onClick={handleGithubLogin}>
                  Login with Github
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthState({ isLogin: false, isSignup: true, isResetPassword: false })}
                  className="underline underline-offset-4"
                >
                  Sign up
                </button>
              </div>
              <div className="mt-4 text-center text-sm">
                Forgot Password?{" "}
                <button
                  type="button"
                  onClick={() => setAuthState({ isLogin: false, isSignup: false, isResetPassword: true })}
                  className="underline underline-offset-4"
                >
                  Reset
                </button>
              </div>
            </form>
          )}

          {authState.isSignup && (
            <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} autoComplete="off">
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    {...signupForm.register("username")}
                    placeholder="Enter your username"
                  />
                  {signupForm.formState.errors.username && (
                    <p className="text-red-500">{signupForm.formState.errors.username.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...signupForm.register("email")}
                    placeholder="Enter your email"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-red-500">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...signupForm.register("password")}
                    placeholder="Create a password"
                  />
                  {signupForm.formState.errors.password && (
                    <p className="text-red-500">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button disabled={loading} type="submit" className="w-full">
                  Sign Up
                </Button>
                <Button disabled={loading} type="button" className="w-full" onClick={handleGithubLogin}>
                  Sign Up with Github
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthState({ isLogin: true, isResetPassword: false, isSignup: false })}
                  className="underline underline-offset-4"
                >
                  Login
                </button>
              </div>
              <div className="h-[24px] flex justify-center items-center w-full">
                {loading && <LoadingSpinner />}
              </div>
            </form>
          )}

          {authState.isResetPassword && (
            <form onSubmit={resetForm.handleSubmit(SendPasswordResetLink)} autoComplete="off">
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="identifier">Username or Email</Label>
                  <Input
                    id="identifier"
                    {...resetForm.register("userIdentifier")}
                    placeholder="Enter your username or email"
                  />
                  {resetForm.formState.errors.userIdentifier && (
                    <p className="text-red-500">{resetForm.formState.errors.userIdentifier.message}</p>
                  )}
                </div>
                <Button disabled={loading} type="submit" className="w-full">
                  Reset Password
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() =>
                    setAuthState({ isLogin: true, isResetPassword: false, isSignup: false })
                  }
                  className="underline underline-offset-4"
                >
                  Login
                </button>
              </div>
              <div className="h-[24px] flex justify-center items-center w-full">
                {loading && <LoadingSpinner />}
              </div>
            </form>
          )
          }
        </CardContent>
      </Card>
    </div>
  );
}