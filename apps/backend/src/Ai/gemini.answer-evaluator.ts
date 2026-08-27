import { GoogleGenAI } from "@google/genai";
import type {
  AnswerEvaluator,
  AnswerEvaluation,
  EvaluateAnswerInput,
} from "./answer-evaluator.types.js";
import { evaluationSchema } from "./ai-evaluator.schema.js";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export class GeminiAnswerEvaluator
  implements AnswerEvaluator
{
  async evaluateAnswer(
    input: EvaluateAnswerInput
  ): Promise<AnswerEvaluation> {
    const response = await client.models.generateContent({
      model:
        process.env.GEMINI_MODEL ??
        "gemini-3.6-flash",

      contents: `
You are an expert technical interviewer evaluating a candidate's answer.

Question:
${input.question}

Expected answer / evaluation criteria:
${input.expectedAnswer ?? "No exact answer provided. Evaluate based on technical correctness."}

Candidate answer:
${input.userAnswer}

Question type:
${input.questionType}

Evaluate the candidate fairly.

Return ONLY valid JSON:

{
  "isCorrect": true,
  "score": 8,
  "feedback": "Clear explanation..."
}

Rules:
- score must be an integer from 0 to 10.
- isCorrect should be true when the answer is substantially correct.
- For partially correct answers, give an appropriate score below 10.
- feedback should briefly explain the evaluation.
- Do not include markdown.
- Do not include code fences.
      `,
    });

    const text = response.text;

    if (!text) {
      throw new Error(
        "Gemini returned an empty evaluation."
      );
    }

   const parsed = JSON.parse(text);

return evaluationSchema.parse(parsed);
  }
}

export const geminiAnswerEvaluator =
  new GeminiAnswerEvaluator();