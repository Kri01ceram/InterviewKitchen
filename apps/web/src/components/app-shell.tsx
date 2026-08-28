"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { ProtectedRoute } from "./route-guards";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout().catch(() => undefined);
    router.replace("/login");
  };

  return (
    <ProtectedRoute>
      <header className="app-header">
        <button className="brand" onClick={() => router.push("/dashboard")}>
          <span className="brand-mark">IK</span>
          <span>InterviewKitchen</span>
        </button>
        <nav className="app-nav" aria-label="Main navigation">
          <button onClick={() => router.push("/dashboard")}>Dashboard</button>
          <button onClick={() => router.push("/profile")}>Profile</button>
          <button className="nav-logout" onClick={handleLogout}>Log out</button>
        </nav>
      </header>
      {children}
    </ProtectedRoute>
  );
}