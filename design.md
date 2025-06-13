# Project Architecture & Design Overview

## Architecture Overview

### Routes

- **/auth/**
  - `POST /auth/register` — Register a new user
  - `POST /auth/login` — Login and receive JWT

- **/surveys/**
  - `POST /surveys` — Create a new survey (auth required)
  - `POST /surveys/:id/summary` — Generate AI summary for survey responses (creator only)
  - `GET /surveys/:id/check-responses` — Validate responses using AI (creator only)

- **/responses/**
  - `POST /responses` — Submit a response to a survey (auth required)

- **/search/**
  - `POST /search` — Natural language search for surveys (auth required)

### Services

- **authService.js** — Handles registration and login, password hashing, JWT creation.
- **llmService.js** — Abstracts all LLM (AI) operations: summarization, validation, search. Reads prompt templates from `/prompts`.
- **Other services** — (if present) would encapsulate business logic for surveys, responses, etc.

### Models

- **User** — `{ username, email, passwordHash }`
- **Survey** — `{ creator, area, question, expiryDate, guidelines, permittedDomains, permittedResponses, summaryInstructions, isClosed, summary }`
- **Response** — `{ survey, user, text }`

### Controllers

- **authController.js** — Handles registration and login requests.
- **surveyController.js** — Handles survey creation, AI summary, and validation endpoints.
- **responseController.js** — Handles survey response submission.
- **searchController.js** — Handles natural language search.

### Middlewares

- **authMiddleware.js** — JWT authentication for protected routes.

---

## Key Design Decisions and Trade-offs

- **Separation of Concerns:**  
  The project is organized by responsibility: routes, controllers, services, models, and middlewares are separated for maintainability and clarity.

- **JWT Authentication:**  
  Chosen for stateless, scalable authentication. All protected routes require a valid JWT.

- **Registration Code:**  
  Registration requires a secret code (`REGISTRATION_SECRET`) to prevent unauthorized signups. This is a simple but effective access control for closed systems.

- **Prompt-based LLM Integration:**  
  Prompts for AI tasks (summarization, validation, search) are stored as plain text files in `/prompts`, making it easy to update AI instructions without code changes.

- **Mocked LLM for Testing:**  
  When `USE_MOCK_LLM=true`, all LLM operations are mocked for fast, reliable, and cost-free testing. This avoids external API calls during development and CI.

- **Frontend Simplicity:**  
  The React client uses conditional rendering instead of a router for simplicity, showing forms and dashboards based on authentication state.

- **Swagger/OpenAPI:**  
  API documentation is auto-generated from route annotations, ensuring docs stay in sync with code.

- **Trade-offs:**
  - **No fine-grained permissions:** Only survey creators can summarize/validate, but there is no role system.
  - **No pagination or filtering:** Survey and response lists are not paginated, which may not scale for large datasets.
  - **No advanced error handling:** Errors are handled globally but not always with detailed messages.
  - **Frontend navigation:** Lacks multi-page navigation; all features are on a single dashboard.

---

## LLM Integration Abstraction

- **llmService.js** is the single point of integration for all AI/LLM features:
  - Reads prompt templates from `/prompts/validatePrompt.txt`, `/prompts/summaryPrompt.txt`, `/prompts/searchPrompt.txt`.
  - Exposes three async functions:
    - `summarizeSurvey({ survey, responses })`
    - `validateResponses({ survey, responses })`
    - `searchSurveys({ query, surveys })`
  - In production, these would call an external LLM API (e.g., OpenAI). In this project, they are mocked for local development and testing.
  - This abstraction allows swapping the LLM backend or prompt templates without changing business logic or controllers.

---

**Summary:**  
This architecture provides a clean separation between API, business logic, data models, and AI integration, making the project easy to maintain, extend, and test.