"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api";
import { getQuestions, type InterviewQuestion } from "@/lib/interviews";
import { completeAttempt } from "@/lib/attempts";
import { createAnswer, getAnswers, type Answer } from "@/lib/answers";
import AppShell from "@/components/app-shell";

type AnswerMap = Record<string, string>;

export default function AttemptPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.interviewId as string;
  const attemptId = params.attemptId as string;
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [savedAnswerIds, setSavedAnswerIds] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([getQuestions(interviewId), getAnswers(interviewId, attemptId)])
      .then(([questionResponse, answerResponse]) => {
        if (cancelled) return;
        setQuestions(questionResponse.data?.questions ?? []);
        const savedAnswers = (answerResponse.data?.answers ?? []) as Answer[];
        setAnswers(Object.fromEntries(savedAnswers.map((item) => [item.questionId, item.answer])));
        setSavedAnswerIds(Object.fromEntries(savedAnswers.map((item) => [item.questionId, item.id])));
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(getApiErrorMessage(requestError, "Failed to load this attempt."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [attemptId, interviewId]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (Object.keys(answers).length < questions.length) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers, questions.length]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] ?? "" : "";
  const answeredCount = questions.filter((question) => Boolean(answers[question.id]?.trim())).length;

  const updateAnswer = (value: string) => {
    if (currentQuestion) setAnswers((previous) => ({ ...previous, [currentQuestion.id]: value }));
  };

  const submitCurrentAnswer = async () => {
    if (!currentQuestion || !currentAnswer.trim() || submitting) {
      setError("Please provide an answer before continuing.");
      return false;
    }
    try {
      setSubmitting(true);
      setError("");
      if (savedAnswerIds[currentQuestion.id]) return true;
      await createAnswer(interviewId, attemptId, { questionId: currentQuestion.id, answer: currentAnswer.trim() });
      return true;
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError, "Failed to save this answer."));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = async () => {
    if (!(await submitCurrentAnswer())) return;
    if (currentIndex < questions.length - 1) setCurrentIndex((index) => index + 1);
  };

  const finish = async () => {
    if (answeredCount < questions.length) {
      setError("Answer every question before completing the interview.");
      return;
    }
    if (!window.confirm("Submit this attempt and view your results?")) return;
    if (!(await submitCurrentAnswer())) return;
    try {
      setSubmitting(true);
      await completeAttempt(interviewId, attemptId);
      router.push(`/interviews/${interviewId}/attempt/${attemptId}/complete`);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError, "Failed to complete this attempt."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AppShell><main className="page-frame"><p className="muted">Loading interview...</p></main></AppShell>;
  if (!currentQuestion) return <AppShell><main className="page-frame"><section className="panel"><h1 className="page-title">No questions found</h1><button className="button button-primary" onClick={() => router.push(`/interviews/${interviewId}`)}>Back to interview</button></section></main></AppShell>;

  return <AppShell><main className="page-frame"><div className="content-column">
    <button className="back-link" onClick={() => { if (window.confirm("Leave this attempt? Your saved answers will remain available.")) router.push(`/interviews/${interviewId}`); }}>Back to interview</button>
    <header className="attempt-header"><div><p className="eyebrow">Active attempt</p><h1 className="page-title">Question {currentIndex + 1} of {questions.length}</h1></div><span className="status status-neutral">{answeredCount}/{questions.length} answered</span></header>
    <div className="attempt-progress"><span style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} /></div>
    {error && <div className="error-banner" role="alert">{error}</div>}
    <div className="attempt-layout"><aside className="question-nav" aria-label="Question navigation">{questions.map((question, index) => <button key={question.id} className={index === currentIndex ? "current" : ""} onClick={() => setCurrentIndex(index)} aria-label={`Go to question ${index + 1}`}>{index + 1}<span className={answers[question.id]?.trim() ? "answered" : ""} /></button>)}</aside>
      <section className="panel attempt-panel"><div className="result-item-topline"><span className="eyebrow">{currentQuestion.type}</span><span className="muted">Saved answers are restored automatically</span></div><h2 className="attempt-question">{currentQuestion.question}</h2>
        {currentQuestion.type === "MCQ" && currentQuestion.options?.map((option, index) => <button disabled={Boolean(savedAnswerIds[currentQuestion.id])} key={option} className={`answer-option ${currentAnswer === option ? "selected" : ""}`} onClick={() => updateAnswer(option)}><strong>{String.fromCharCode(65 + index)}</strong>{option}</button>)}
        {(currentQuestion.type === "SUBJECTIVE" || currentQuestion.type === "CODING") && <textarea disabled={Boolean(savedAnswerIds[currentQuestion.id])} value={currentAnswer} onChange={(event) => updateAnswer(event.target.value)} rows={currentQuestion.type === "CODING" ? 16 : 9} placeholder={currentQuestion.type === "CODING" ? "Write your solution..." : "Write your answer..."} className={currentQuestion.type === "CODING" ? "answer-editor" : "answer-textarea"} />}
        <div className="attempt-actions"><button className="button button-secondary" disabled={currentIndex === 0 || submitting} onClick={() => setCurrentIndex((index) => index - 1)}>Previous</button>{currentIndex === questions.length - 1 ? <button className="button button-primary" disabled={submitting} onClick={finish}>{submitting ? "Submitting..." : "Submit & finish"}</button> : <button className="button button-primary" disabled={submitting} onClick={goNext}>{submitting ? "Saving..." : "Save & next"}</button>}</div>
      </section>
    </div>
  </div></main></AppShell>;
}
