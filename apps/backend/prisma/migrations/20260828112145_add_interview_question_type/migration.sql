-- CreateEnum
CREATE TYPE "InterviewQuestionType" AS ENUM ('MCQ', 'CODING', 'SUBJECTIVE', 'MIXED');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "questionType" "InterviewQuestionType" NOT NULL DEFAULT 'MIXED';
