"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Logo } from "../logo";
import { verifyPasswordResetToken, updateUserPassword } from "@/lib/actions/auth-actions";
import { useRouter } from "next/navigation";

export function PasswordResetForm({ token }: { token: string | undefined }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleTokenVerification = async () => {
    if (!token) {
      setMessage({ type: "error", text: "Invalid or missing token" });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Verification failed');
      }

      setEmail(result.email);
      setEmailVerified(true);
      setMessage({
        type: "success",
        text: "Token verified. You can now reset your password."
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Invalid token"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Password update failed');
      }

      setMessage({
        type: "success",
        text: "Password updated successfully! You can now log in.",
      });

      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-6 text-center pb-6">
          <div className="flex justify-center pt-2">
            <Logo />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
            <CardDescription>Invalid or missing reset token</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              No reset token provided. Please use the link from your email or request a new password reset.
            </p>
          </div>
          <CardFooter className="flex flex-col gap-4">
            <Link href="/forgot-password" className="w-full">
              <Button className="w-full">Request New Reset Link</Button>
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-6 text-center pb-6">
        <div className="flex justify-center pt-2">
          <Logo />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
          {!emailVerified ? (
            <CardDescription>Verifying your reset token</CardDescription>
          ) : (
            <CardDescription>Enter your new password</CardDescription>
          )}
        </div>
      </CardHeader>
      {!emailVerified ? (
        <CardContent>
          <div className="text-center py-4">
            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
              >
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-muted-foreground">
              Verifying your reset token...
            </p>
          </div>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={handleTokenVerification}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Token"
              )}
            </Button>
          </CardFooter>
        </CardContent>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <CardContent className="space-y-4">
            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
              >
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}