"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .catch(() => router.replace("/login"))
      .finally(() => setChecking(false));
  }, [router]);

  if (checking) return <main className="page-frame"><p className="muted">Checking your session...</p></main>;
  return children;
}

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage.getItem("accessToken")) {
      return;
    }

    getCurrentUser()
      .then(() => router.replace("/dashboard"))
      .catch(() => {
        window.localStorage.removeItem("accessToken");
      });
  }, [pathname, router]);

  return children;
}