"use client";

import {
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";

import {
  generateQuestions,
  getInterview,
  getQuestions,
  type Interview,
  type InterviewQuestion,
} from "@/lib/interviews";
import { createAttempt } from "@/lib/attempts";

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();

  const interviewId =
    params.interviewId as string;

  const [interview, setInterview] =
    useState<Interview | null>(null);
    const [starting, setStarting] = useState(false);

  const [questions, setQuestions] =
    useState<InterviewQuestion[]>([]);

  const [count, setCount] = useState(10);

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadInterview = async () => {
      try {
        setLoading(true);

        const [
          interviewResult,
          questionsResult,
        ] = await Promise.all([
          getInterview(interviewId),
          getQuestions(interviewId),
        ]);

        setInterview(
          interviewResult.data?.interview ?? null
        );

        setQuestions(
          questionsResult.data?.questions ?? []
        );
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
            response?.data?.message ??
              "Failed to load interview."
          );
        } else {
          setError(
            "Failed to load interview."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [interviewId]);

  const handleGenerate = async () => {
    try {
      setError("");
      setGenerating(true);

      const result =
        await generateQuestions(
          interviewId,
          count
        );

      setQuestions(
        result.data?.questions ?? []
      );
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
          response?.data?.message ??
            "Failed to generate questions."
        );
      } else {
        setError(
          "Failed to generate questions."
        );
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-gray-500">
            Loading interview...
          </p>
        </div>
      </main>
    );
  }

  if (!interview) {
    return (
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border p-6">
            <h1 className="text-xl font-semibold">
              Interview not found
            </h1>

            <button
              onClick={() =>
                router.push("/dashboard")
              }
              className="mt-4 rounded-md bg-black px-4 py-2 text-white"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }
  const handleStart = async () => {
  try {
    setError("");
    setStarting(true);

    const result =
      await createAttempt(interviewId);

    const attempt =
      result.data?.attempt;

    if (!attempt?.id) {
      throw new Error(
        "Failed to create interview attempt."
      );
    }

    router.push(
      `/interviews/${interviewId}/attempt/${attempt.id}`
    );
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
        response?.data?.message ??
          "Failed to start interview."
      );
    } else {
      setError(
        "Failed to start interview."
      );
    }
  } finally {
    setStarting(false);
  }
};

  const canModify =
    interview.status === "CREATED";

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}

        <header className="mb-8">
          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="mb-4 text-sm text-gray-500 hover:text-black"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {interview.title}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full border px-3 py-1">
                  {interview.type}
                </span>

                <span className="rounded-full border px-3 py-1">
                  {interview.questionType}
                </span>

                <span className="rounded-full border px-3 py-1">
                  {interview.difficulty}
                </span>

                <span className="rounded-full border px-3 py-1">
                  {interview.status}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Generate */}

        {canModify && (
          <section className="mb-8 rounded-xl border p-6">
            <h2 className="text-xl font-semibold">
              Generate Questions
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Generate AI-powered{" "}
              {interview.questionType ===
              "MIXED"
                ? "mixed"
                : interview.questionType.toLowerCase()}{" "}
              questions for this interview.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <select
                value={count}
                onChange={(e) =>
                  setCount(
                    Number(e.target.value)
                  )
                }
                className="rounded-md border p-3"
              >
                <option value={5}>
                  5 questions
                </option>

                <option value={10}>
                  10 questions
                </option>

                <option value={15}>
                  15 questions
                </option>

                <option value={20}>
                  20 questions
                </option>
              </select>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="rounded-md bg-black px-6 py-3 text-white disabled:opacity-50"
              >
                {generating
                  ? "Generating..."
                  : questions.length > 0
                    ? "Regenerate Questions"
                    : "Generate Questions"}
              </button>
            </div>
          </section>
        )}

        {/* Questions */}

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Questions
            </h2>

            <span className="text-sm text-gray-500">
              {questions.length} questions
            </span>
          </div>

          {questions.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <h3 className="font-semibold">
                No questions yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Generate questions to prepare
                this interview.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map(
                (question, index) => (
                  <div
                    key={question.id}
                    className="rounded-xl border p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Question {index + 1}
                      </span>

                      <span className="rounded-full border px-3 py-1 text-xs">
                        {question.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium">
                      {question.question}
                    </h3>

                    {question.type ===
                      "MCQ" &&
                      question.options && (
                        <div className="mt-5 space-y-2">
                          {question.options.map(
                            (
                              option,
                              optionIndex
                            ) => (
                              <div
                                key={optionIndex}
                                className="rounded-md border p-3"
                              >
                                <span className="mr-2 font-medium">
                                  {String.fromCharCode(
                                    65 +
                                      optionIndex
                                  )}
                                  .
                                </span>

                                {option}
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {question.explanation && (
                      <div className="mt-5 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
                        <span className="font-medium">
                          Explanation:
                        </span>{" "}
                        {question.explanation}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* Start */}

        {questions.length > 0 &&
          interview.status === "CREATED" && (
            <div className="mt-8 flex justify-end">
              <button
  type="button"
  onClick={handleStart}
  disabled={starting}
  className="rounded-md bg-black px-8 py-3 font-medium text-white disabled:opacity-50"
>
  {starting ? "Starting..." : "Start Interview →"}
</button>
            </div>
          )}

      </div>
    </main>
  );
}