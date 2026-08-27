"use client";

import { useParams } from "next/navigation";

export default function InterviewPage() {
  const params = useParams();

  const interviewId = params.interviewId as string;

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">
          Interview
        </h1>

        <p className="mt-2 text-gray-500">
          Interview ID: {interviewId}
        </p>

        <div className="mt-8 rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Ready to begin?
          </h2>

          <p className="mt-2 text-gray-500">
            Generate AI-powered interview questions and
            start your attempt.
          </p>
        </div>
      </div>
    </main>
  );
}