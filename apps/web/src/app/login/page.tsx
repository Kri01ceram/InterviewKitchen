"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { PublicOnlyRoute } from "@/components/route-guards";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({
        email,
        password,
      });

      router.push("/dashboard");
    } catch (err: unknown) {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err
  ) {
    const response = (
      err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    setError(
      response?.data?.message ||
        "Login failed."
    );
  } else {
    setError("Login failed.");
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <PublicOnlyRoute>
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-xl border p-8"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back
          </h1>
          <p className="mt-2 text-gray-500">
            Login to continue your interview practice.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-300 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          className="w-full rounded-md border p-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full rounded-md border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Do not have an account?{" "}
          <a
            href="/register"
            className="font-medium underline"
          >
            Register
          </a>
        </p>
      </form>
    </main>
    </PublicOnlyRoute>
  );
}