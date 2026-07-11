import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";

export default function VerifyEmail() {
  const search = useSearch();
  const token = new URLSearchParams(search).get("token") ?? "";
  const attempted = useRef(false);
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [error, setError] = useState("");

  const verifyMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => setStatus("success"),
    onError: (err) => {
      setStatus("error");
      setError(err.message || "Verification failed");
    },
  });

  useEffect(() => {
    if (!token || attempted.current) return;
    attempted.current = true;
    verifyMutation.mutate({ token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email verification</CardTitle>
          {!token && <CardDescription>This link is missing its verification token.</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          {token && status === "pending" && <p className="text-sm">Verifying your email...</p>}
          {status === "success" && (
            <p className="text-sm">
              Your email has been verified.{" "}
              <Link href="/dashboard" className="text-primary underline">
                Go to dashboard
              </Link>
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {!token && (
            <Button asChild className="w-full">
              <Link href="/login">Back to login</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
