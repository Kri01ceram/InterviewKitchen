"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import {
  createInterview,
  getInterviews,
  type InterviewType,
  type QuestionType,
  type Difficulty,
} from "@/lib/interviews";

type Interview = {
  id: string;
  title: string;
  type: InterviewType;
  questionType: QuestionType;
  difficulty: Difficulty;
  status: string;
  createdAt: string;
  _count?: { questions: number; attempts: number };
  attempts?: { id: string; score: number | null; completedAt: string | null }[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [interviews, setInterviews] =
    useState<Interview[]>([]);

  const [title, setTitle] = useState("");

  const [type, setType] =
    useState<InterviewType>("MIXED");

  const [questionType, setQuestionType] =
    useState<QuestionType>("MIXED");

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
        if (cancelled) return;

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
    };

    loadInterviews();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await createInterview({
        title,
        type,
        questionType,
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
    <AppShell>
      <main className="page-frame">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div><p className="eyebrow">Your practice kitchen</p><h1 className="page-title">Build your next edge.</h1></div>
            <button className="button button-primary" onClick={() => router.push("/interviews/new")}>Create interview</button>
          </div>

          <p className="mt-2 text-gray-500">
            Create and practice technical
            interviews.
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
            {/* Interview title */}
            <input
              className="rounded-md border p-3 md:col-span-2"
              placeholder="Interview title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

            {/* Interview category */}
            <select
              className="rounded-md border p-3"
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as InterviewType
                )
              }
            >
              <option value="MIXED">
                Mixed
              </option>

              <option value="TECHNICAL">
                Technical
              </option>

              <option value="HR">
                HR
              </option>
            </select>

            {/* Question type */}
            <select
              className="rounded-md border p-3"
              value={questionType}
              onChange={(e) =>
                setQuestionType(
                  e.target.value as QuestionType
                )
              }
            >
              <option value="MIXED">
                Mixed Questions
              </option>

              <option value="MCQ">
                MCQ
              </option>

              <option value="SUBJECTIVE">
                Subjective
              </option>

              <option value="CODING">
                Coding
              </option>
            </select>

            {/* Difficulty */}
            <select
              className="rounded-md border p-3"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value as Difficulty
                )
              }
            >
              <option value="EASY">
                Easy
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HARD">
                Hard
              </option>
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
              {interviews.map(
                (interview) => (
                  <button
                    key={interview.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        interview.attempts?.[0]?.completedAt
                          ? `/interviews/${interview.id}/attempt/${interview.attempts[0].id}/result`
                          : interview.attempts?.[0]
                            ? `/interviews/${interview.id}/attempt/${interview.attempts[0].id}`
                            : `/interviews/${interview.id}`
                      )
                    }
                    className="rounded-xl border p-5 text-left transition hover:shadow-md"
                  >
                    <h3 className="font-semibold">
                      {interview.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-500">
                      <span>
                        {interview.type}
                      </span>

                      <span>•</span>

                      <span>
                        {interview.questionType}
                      </span>

                      <span>•</span>

                      <span>
                        {interview.difficulty}
                      </span>

                      <span>•</span>

                      <span>
                        {interview.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">{interview._count?.questions ?? 0} questions · {new Date(interview.createdAt).toLocaleDateString()}</div>
                    <div className="mt-4 text-sm font-medium text-gray-700">{interview.status === "IN_PROGRESS" ? "Continue interview" : interview.status === "COMPLETED" ? "View completed interview" : "Prepare interview"} →</div>
                  </button>
                )
              )}
            </div>
          )}
        </section>
      </div>
      </main>
    </AppShell>
  );
}