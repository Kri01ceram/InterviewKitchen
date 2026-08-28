# InterviewKitchen Local Development Guide and Roadmap

## Prerequisites

Install the following before starting:

- Node.js compatible with the installed Next.js and TypeScript versions.
- npm.
- Docker Desktop with Docker Compose.
- A Gemini API key for AI question generation and answer evaluation.

The repository contains separate applications rather than root-level workspace scripts. Run backend commands from `apps/backend` and frontend commands from `apps/web`.

## Run Locally

### 1. Configure environment variables

Copy the root example file to the backend environment file:

```powershell
Copy-Item .env.example apps/backend/.env
```

Set real values in `apps/backend/.env`:

```dotenv
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://interview_kitchen:interview_kitchen_password@localhost:5432/interview_kitchen_db"
JWT_ACCESS_SECRET=replace_with_a_random_secret_at_least_32_characters
JWT_REFRESH_SECRET=replace_with_a_different_random_secret_at_least_32_characters
GEMINI_API_KEY=replace_with_your_gemini_key
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_API_KEY` is read by the Gemini provider. The current `.env.example` still contains the legacy `OPENAI_API_KEY` name, but that variable is not used by the implemented AI provider. Do not commit `.env` or expose API keys in the frontend.

### 2. Start PostgreSQL

From the repository root:

```powershell
docker compose up -d postgres
```

The database is available at `localhost:5432` with the credentials defined in `docker-compose.yml`.

### 3. Install backend dependencies and migrate

```powershell
Set-Location apps/backend
npm install
npx prisma migrate deploy
```

For local schema development, use Prisma's development migration command instead:

```powershell
npx prisma migrate dev --name describe_your_change
```

To inspect the database visually:

```powershell
npx prisma studio
```

### 4. Start the backend

In a terminal from `apps/backend`:

```powershell
npm run dev
```

The API runs at `http://localhost:5000`. Its base path is `http://localhost:5000/api/v1`.

### 5. Install and start the frontend

In a second terminal from the repository root:

```powershell
Set-Location apps/web
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify the Installation

Run the backend build:

```powershell
Set-Location apps/backend
npm run build
```

Run frontend linting and the production build:

```powershell
Set-Location apps/web
npm run lint
npm run build
```

Check the health endpoint:

```text
GET http://localhost:5000/api/v1/health
```

## Typical User Flow

1. Open the frontend and select **Get started**.
2. Register with a strong password.
3. Log in.
4. Create an interview from `/interviews/new` by choosing its title, category, question format, and difficulty.
5. Generate between 1 and 20 questions.
6. Review the questions and start an attempt.
7. Answer every question. MCQs are evaluated immediately; coding and subjective answers are evaluated through Gemini.
8. Submit the final answer and open the result page.
9. Review the overall score, each answer, correctness, and evaluator feedback.
10. Open attempt history to continue an unfinished attempt or revisit a completed result.
11. Update account details or change the password from `/profile`.
12. Log out when finished.

## Useful API Examples

Register:

```http
POST /api/v1/auth/register
Content-Type: application/json

{
	"name": "Example User",
	"email": "user@example.com",
	"password": "StrongPassword1!"
}
```

Create an interview:

```http
POST /api/v1/interviews
Authorization: Bearer <access-token>
Content-Type: application/json

{
	"title": "Backend fundamentals",
	"type": "TECHNICAL",
	"questionType": "MIXED",
	"difficulty": "MEDIUM"
}
```

Generate questions:

```http
POST /api/v1/interviews/<interview-id>/questions/generate
Authorization: Bearer <access-token>
Content-Type: application/json

{
	"count": 10
}
```

## Troubleshooting

### `JWTExpired` or `Invalid or expired access token`

Access tokens expire after 15 minutes. The frontend clears the stale token and redirects to `/login`. Log in again. The backend does not currently expose a refresh endpoint.

### Database connection errors

Confirm Docker is running and PostgreSQL is healthy:

```powershell
docker compose ps
docker compose logs postgres
```

Confirm that `DATABASE_URL` matches the credentials in `docker-compose.yml`, then run `npx prisma migrate deploy` from `apps/backend`.

### AI generation or evaluation errors

Confirm `GEMINI_API_KEY` is present in `apps/backend/.env` and restart the backend after changing it. Keep the key server-side. The configured model can be changed with `GEMINI_MODEL`.

### CORS errors

The current backend allows `http://localhost:3000` only. Use that frontend URL during local development, or update the backend CORS configuration before using another origin.

## Roadmap

### Next priorities

- Add an access-token refresh endpoint and automatic frontend token renewal.
- Move access-token handling away from `localStorage` toward a secure HttpOnly cookie strategy.
- Make frontend API URL and backend CORS origins environment-configurable.
- Add automated backend integration tests for auth, ownership, status transitions, and attempt completion.
- Add frontend tests for authentication redirects, answer submission, and result rendering.

### Product improvements

- Add dashboard statistics to the frontend.
- Allow manual question editing and deletion in the interview setup screen.
- Add answer editing support by extending the backend answer update contract.
- Add interview search, filtering, and pagination.
- Add an optional timer and automatic submission for timed interviews.
- Add richer scoring trends and feedback summaries across attempts.

### Deployment readiness

- Add production environment validation and secret management.
- Configure a production database and migration pipeline.
- Restrict CORS to deployed frontend origins.
- Add rate limiting, audit logging, and monitoring.
- Add CI checks for linting, type checking, builds, migrations, and tests.
