"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api";
import { getAttemptResult } from "@/lib/attempts";
import AppShell from "@/components/app-shell";

type ResultQuestion = {
  questionId: string;
  question: string;
  type: string;
  answer: string;
  isCorrect: boolean | null;
  score: number | null;
  feedback: string | null;
};

type AttemptResult = {
  attempt: {
    id: string;
    completedAt: string | null;
    score: number | null;
  };
  questions: ResultQuestion[];
};

export default function AttemptResultPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.interviewId as string;
  const attemptId = params.attemptId as string;
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getAttemptResult(interviewId, attemptId)
      .then((response) => {
        if (!cancelled) setResult(response.data?.result ?? null);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            getApiErrorMessage(
              requestError,
              "We could not load this result."
            )
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attemptId, interviewId]);

  if (loading) {
    return <AppShell><main className="page-frame"><p className="muted">Loading your result...</p></main></AppShell>;
  }

  if (error || !result) {
    return (
      <AppShell><main className="page-frame">
        <section className="panel max-w-2xl">
          <p className="eyebrow">Attempt result</p>
          <h1 className="page-title">Result unavailable</h1>
          <p className="muted">{error || "This attempt result was not found."}</p>
          <button className="button button-primary mt-6" onClick={() => router.push(`/interviews/${interviewId}`)}>
            Return to interview
          </button>
        </section>
      </main></AppShell>
    );
  }

  const score = result.attempt.score ?? 0;

  return (
    <AppShell><main className="page-frame">
      <div className="content-column">
        <button className="back-link" onClick={() => router.push(`/interviews/${interviewId}`)}>
          Back to interview
        </button>
        <header className="result-header">
          <div>
            <p className="eyebrow">Attempt complete</p>
            <h1 className="page-title">Your interview review</h1>
            <p className="muted">A question-by-question breakdown of your performance.</p>
          </div>
          <div className="score-block">
            <strong>{Math.round(score)}%</strong>
            <span>overall score</span>
          </div>
        </header>

        <section className="result-list" aria-label="Question results">
          {result.questions.map((question, index) => (
            <article className="result-item" key={question.questionId}>
              <div className="result-item-topline">
                <span className="eyebrow">Question {index + 1} · {question.type}</span>
                <span className={`status ${question.isCorrect === true ? "status-success" : question.isCorrect === false ? "status-danger" : "status-neutral"}`}>
                  {question.isCorrect === true ? "Correct" : question.isCorrect === false ? "Needs work" : "Reviewed"}
                </span>
              </div>
              <h2>{question.question}</h2>
              <div className="answer-box">
                <span className="answer-label">Your answer</span>
                <p>{question.answer || "No answer provided"}</p>
              </div>
              {question.feedback && (
                <div className="feedback-box">
                  <span className="answer-label">Evaluator feedback</span>
                  <p>{question.feedback}</p>
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
    </main></AppShell>
  );
}