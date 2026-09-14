import assert from "node:assert/strict";
import test from "node:test";
import { createInterviewSchema } from "./create-interview.dto.js";
import { generateQuestionsSchema } from "./generate-questions.dto.js";

test("create interview schema accepts supported interview settings", () => {
  const result = createInterviewSchema.safeParse({
    title: "Backend fundamentals",
    type: "TECHNICAL",
    questionType: "MIXED",
    difficulty: "MEDIUM",
  });

  assert.equal(result.success, true);
});

test("question generation count is limited to 20", () => {
  assert.equal(generateQuestionsSchema.safeParse({ count: 20 }).success, true);
  assert.equal(generateQuestionsSchema.safeParse({ count: 21 }).success, false);
});