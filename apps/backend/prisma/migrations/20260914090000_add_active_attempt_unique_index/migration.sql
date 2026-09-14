CREATE UNIQUE INDEX "InterviewAttempt_one_active_per_user_interview_idx"
ON "InterviewAttempt" ("interviewId", "userId")
WHERE "completedAt" IS NULL;