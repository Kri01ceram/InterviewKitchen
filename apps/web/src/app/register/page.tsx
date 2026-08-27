"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
      });

      router.push("/login");
    }  catch (err: unknown) {
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
        "Registration failed."
    );
  } else {
    setError("Registration failed.");
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-xl border p-8"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Create account
          </h1>
          <p className="mt-2 text-gray-500">
            Start practicing interviews with InterviewKitchen.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-300 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          className="w-full rounded-md border p-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium underline"
          >
            Login
          </a>
        </p>
      </form>
    </main>
  );
}