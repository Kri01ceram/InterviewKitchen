"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { getAttempts, type Attempt } from "@/lib/attempts";
import { getApiErrorMessage } from "@/lib/api";

export default function AttemptsPage() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAttempts(interviewId).then((response) => setAttempts(response.data?.attempts ?? []))
      .catch((requestError: unknown) => setError(getApiErrorMessage(requestError, "Failed to load attempts.")))
      .finally(() => setLoading(false));
  }, [interviewId]);

    return <AppShell><main className="page-frame"><div className="content-column">
    <button className="back-link" onClick={() => router.push(`/interviews/${interviewId}`)}>Back to interview</button>
    <p className="eyebrow">Practice history</p><h1 className="page-title">Previous attempts</h1><p className="muted">Pick up an unfinished attempt or review a completed one.</p>
    {loading && <p className="muted">Loading attempts...</p>}
    {error && <div className="error-banner" role="alert">{error}</div>}
    {!loading && !error && attempts.length === 0 && <section className="panel empty-state"><h2>No attempts yet</h2><p className="muted">Start the interview when you are ready.</p></section>}
    <section className="history-list">{attempts.map((attempt, index) => <article className="history-item" key={attempt.id}><div><p className="eyebrow">Attempt {attempts.length - index}</p><strong>{attempt.completedAt ? `${Math.round(attempt.score ?? 0)}%` : "In progress"}</strong><p className="muted">{new Date(attempt.startedAt).toLocaleString()}</p></div><button className="button button-primary" onClick={() => router.push(attempt.completedAt ? `/interviews/${interviewId}/attempt/${attempt.id}/result` : `/interviews/${interviewId}/attempt/${attempt.id}`)}>{attempt.completedAt ? "View result" : "Continue"}</button></article>)}</section>
  </div></main></AppShell>;
}
