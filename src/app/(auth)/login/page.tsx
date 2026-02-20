"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();

  const getSafeCallbackUrl = () => {
    const raw = searchParams.get("callbackUrl") || "/";

    // Keep relative callback URLs as-is.
    if (raw.startsWith("/")) {
      return raw;
    }

    try {
      const parsed = new URL(raw);
      const isLocal =
        parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";

      if (isLocal) {
        return `${window.location.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }

      // Only allow callback URLs for the current origin.
      if (parsed.origin === window.location.origin) {
        return raw;
      }
    } catch {
      return "/";
    }

    return "/";
  };

  return (
    <Card className="border shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to access your dashboard, cart, and order history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => signIn("google", { callbackUrl: getSafeCallbackUrl() })}
          variant="outline"
          size="lg"
          className="w-full gap-3 hover:bg-muted"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-primary">Swag</span>
            <span className="text-foreground">Chain</span>
          </span>
        </Link>

        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to SwagChain? Sign in with Google to create an account
        </p>
      </div>
    </div>
  );
}
