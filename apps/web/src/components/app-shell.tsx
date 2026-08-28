"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

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
    <>
      <header className="app-header">
        <button className="brand" onClick={() => router.push("/dashboard")}>
          <span className="brand-mark">IK</span>
          <span>InterviewKitchen</span>
        </button>
        <nav className="app-nav" aria-label="Main navigation">
          <button onClick={() => router.push("/dashboard")}>Dashboard</button>
          <button className="nav-logout" onClick={handleLogout}>Log out</button>
        </nav>
      </header>
      {children}
    </>
  );
}