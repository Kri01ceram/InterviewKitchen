"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createInterview,
  getInterviews,
  type InterviewType,
  type Difficulty,
} from "@/lib/interviews";

type Interview = {
  id: string;
  title: string;
  type: InterviewType;
  difficulty: Difficulty;
  status: string;
  createdAt: string;
};



export default function DashboardPage() {
  const router = useRouter();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] =
    useState<InterviewType>("MIXED");
  const [difficulty, setDifficulty] =
    useState<Difficulty>("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadInterviews = async () => {
      try {
        const result = await getInterviews();

        if (!cancelled) {
          setInterviews(
            result.data?.interviews ?? []
          );
        }
      } catch (err: unknown) {
        if (!cancelled) {
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
                "Failed to load interviews."
            );
          } else {
            setError(
              "Failed to load interviews."
            );
          }
        }
      }
    };

    loadInterviews();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await createInterview({
        title,
        type,
        difficulty,
      });

      const interview =
        result.data?.interview;

      if (interview?.id) {
        router.push(
          `/interviews/${interview.id}`
        );
      }
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
            "Failed to create interview."
        );
      } else {
        setError(
          "Failed to create interview."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">
            InterviewKitchen
          </h1>

          <p className="mt-2 text-gray-500">
            Create and practice technical interviews.
          </p>
        </header>

        <section className="mb-10 rounded-xl border p-6">
          <h2 className="mb-5 text-xl font-semibold">
            Create Interview
          </h2>

          {error && (
            <div className="mb-4 rounded-md border border-red-300 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleCreate}
            className="grid gap-4 md:grid-cols-4"
          >
            <input
              className="rounded-md border p-3 md:col-span-2"
              placeholder="Interview title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

            <select
              className="rounded-md border p-3"
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as InterviewType
                )
              }
            >
              <option value="MIXED">Mixed</option>
              <option value="TECHNICAL">
                Technical
              </option>
              <option value="HR">HR</option>
            </select>

            <select
              className="rounded-md border p-3"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value as Difficulty
                )
              }
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-black p-3 text-white disabled:opacity-50 md:col-span-4"
            >
              {loading
                ? "Creating..."
                : "Create Interview"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-semibold">
            Your Interviews
          </h2>

          {interviews.length === 0 ? (
            <p className="text-gray-500">
              No interviews yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {interviews.map((interview) => (
                <button
                  key={interview.id}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/interviews/${interview.id}`
                    )
                  }
                  className="rounded-xl border p-5 text-left transition hover:shadow-md"
                >
                  <h3 className="font-semibold">
                    {interview.title}
                  </h3>

                  <div className="mt-3 flex gap-2 text-sm text-gray-500">
                    <span>{interview.type}</span>
                    <span>•</span>
                    <span>
                      {interview.difficulty}
                    </span>
                    <span>•</span>
                    <span>{interview.status}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}