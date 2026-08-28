"use client";

import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";

export default function CompletePage() {
  const { interviewId, attemptId } = useParams<{ interviewId: string; attemptId: string }>();
  const router = useRouter();
  return <AppShell><main className="page-frame"><section className="panel completion-panel"><p className="eyebrow">Attempt submitted</p><h1 className="page-title">Interview complete.</h1><p className="muted">Your answers have been submitted. Review the score and feedback whenever you are ready.</p><div className="completion-actions"><button className="button button-primary" onClick={() => router.push(`/interviews/${interviewId}/attempt/${attemptId}/result`)}>View results</button><button className="button button-secondary" onClick={() => router.push("/dashboard")}>Back to dashboard</button></div></section></main></AppShell>;
}