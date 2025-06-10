# AI-Powered Survey Server 🧠

A Node.js + Express backend that allows users to create surveys, submit responses, and perform AI-based validation, summarization, and natural language search.

## 🚀 Setup Instructions

### 1. Clone and Install

```bash
git clone <repo>
cd AI-FINAL
npm install
```

### 2. Environment Configuration

Create a `.env` file with the following:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ai-final
JWT_SECRET=your_jwt_secret
REGISTRATION_SECRET=testcode
USE_MOCK_LLM=true
```

You can also create a `.env.test` for test environment:

```env
JWT_SECRET=testsecret
REGISTRATION_SECRET=testcode
USE_MOCK_LLM=true
MONGO_URI=mongodb://localhost:27017/ai-test
```

---
### 3. Run Frontend 
```
cd client
npm install
npm run dev
```
The frontend should be available at:
```
http://localhost:5173/
```
Make sure the backend (PORT=3000) is also running and properly configured for CORS.
---

## 📋 API Overview

### 🔐 Authentication

- `POST /auth/register` – `{ username, email, password, registrationCode }`
- `POST /auth/login` – `{ email, password }` → returns `{ token }`

Use the token in headers: `Authorization: Bearer <token>`

---

### 📝 Surveys

- `POST /surveys` – Create survey (Authenticated)
- `POST /surveys/:id/summary` – Generate summary (Creator only)
- `GET /surveys/:id/check-responses` – Validate responses (Creator only)

### 💬 Responses

- `POST /responses` – Submit a response
- Edit/delete responses only while survey is open

### 🔍 Search

- `POST /search` – Natural language search across surveys

---

## 📘 API Documentation

API Docs available via Swagger at:

```
http://localhost:3000/api-docs
```

OpenAPI 3.0 spec used for full documentation.

---

## 🧪 Running Tests

```bash
npm test
```

This runs Jest-based unit and API tests using `mongodb-memory-server`.

### 📊 Test Coverage

To check test coverage:

```bash
npm test -- --coverage
```

Coverage should be ≥70% for statements, branches, functions, and lines.

---

## 🧠 AI Mocking

LLM calls (summarization, validation, search) are fully mocked during tests. No real API call is made when `USE_MOCK_LLM=true` is set.

Mocks are implemented in:

```
tests/__mocks__/llmService.js
```

---

## 📁 Project Structure

```
AI-FINAL/
├── app.js
├── server.js
├── controllers/
├── routes/
├── services/
├── models/
├── middlewares/
├── prompts/
├── utils/
├── client/                 
│   └── src/
├── tests/
│   └── __mocks__/
├── .env
├── .env.test
├── swagger.js

```

---

## ⚠️ Note

Although Chai is mentioned in the original specification, this project uses **only Jest** for testing and assertions.

---
