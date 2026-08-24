-- CreateIndex
CREATE INDEX "InterviewAttempt_interviewId_userId_idx" ON "InterviewAttempt"("interviewId", "userId");

-- CreateIndex
CREATE INDEX "InterviewAttempt_userId_completedAt_idx" ON "InterviewAttempt"("userId", "completedAt");
