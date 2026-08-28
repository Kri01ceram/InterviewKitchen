"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { createInterview, type Difficulty, type InterviewType, type QuestionType } from "@/lib/interviews";
import { getApiErrorMessage } from "@/lib/api";

export default function NewInterviewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<InterviewType>("MIXED");
  const [questionType, setQuestionType] = useState<QuestionType>("MIXED");
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim().length < 2) { setError("Title must be at least 2 characters."); return; }
    setLoading(true); setError("");
    try {
      const response = await createInterview({ title: title.trim(), type, questionType, difficulty });
      const id = response.data?.interview?.id;
      if (id) router.push(`/interviews/${id}`);
      else setError("The interview could not be created.");
    } catch (requestError: unknown) { setError(getApiErrorMessage(requestError, "Failed to create interview.")); }
    finally { setLoading(false); }
  };

  return <AppShell><main className="page-frame"><div className="content-column narrow-column">
    <button className="back-link" onClick={() => router.push("/dashboard")}>Back to dashboard</button>
    <p className="eyebrow">New practice session</p><h1 className="page-title">Set the conditions.</h1><p className="muted">Choose a focus and we will shape the questions around it.</p>
    <form className="panel form-stack" onSubmit={submit}>
      {error && <div className="error-banner" role="alert">{error}</div>}
      <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Senior backend fundamentals" maxLength={100} required /></label>
      <label>Interview type<select value={type} onChange={(event) => setType(event.target.value as InterviewType)}><option value="TECHNICAL">Technical</option><option value="HR">HR</option><option value="MIXED">Mixed</option></select></label>
      <label>Question type<select value={questionType} onChange={(event) => setQuestionType(event.target.value as QuestionType)}><option value="MCQ">MCQ</option><option value="CODING">Coding</option><option value="SUBJECTIVE">Subjective</option><option value="MIXED">Mixed</option></select></label>
      <label>Difficulty<select value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)}><option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option></select></label>
      <button className="button button-primary" disabled={loading}>{loading ? "Creating..." : "Create interview"}</button>
    </form>
  </div></main></AppShell>;
}
