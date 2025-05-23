# AI-Powered Survey Server

A Node.js + Express server that supports:
- Survey creation
- Response submission
- AI-based summarization and validation
- Natural language search over surveys

## 🧩 Features

- 🔒 JWT-based authentication
- 🧠 AI-driven summary and validation logic (mocked)
- 📊 MongoDB models for users, surveys, and responses
- ✅ RESTful API fully documented with Swagger
- 🧪 Full Jest test coverage

---

## 🚀 Setup Instructions

### 1. Clone the repository

```
git clone <your-repo-url>
cd AI-FINAL
```

### 2. Install dependencies

```
npm install
```

### 3. Environment configuration

Create a `.env` file based on the following template:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/ai-final
JWT_SECRET=your_jwt_secret
REGISTRATION_SECRET=testcode
```

### 4. Run the server (dev mode)

```
npm run dev
```

The server will run at: `http://localhost:3000`

---

## 🔐 Authentication

### Register (`POST /auth/register`)
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456",
  "registrationCode": "testcode"
}
```

### Login (`POST /auth/login`)
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

You will receive a JWT token. Use it as `Bearer <token>` in `Authorization` headers for all other routes.

---

## 📋 Survey Endpoints

- `POST /surveys` – Create survey
- `POST /responses` – Submit response
- `POST /surveys/:id/summary` – Generate AI summary
- `GET /surveys/:id/check-responses` – Validate responses
- `POST /search` – Search surveys by query

---

## 📘 API Documentation

Available at:  
```
http://localhost:3000/api-docs
```

Powered by Swagger.

---

## 🧪 Run Tests

To run all unit tests using Jest:

```
npm test
```

Includes tests for:
- Authentication
- Survey creation
- Responses
- Search

---

## 📁 Project Structure

```
.
├── controllers/
├── models/
├── routes/
├── services/
├── middlewares/
├── utils/
├── tests/
├── app.js
├── server.js
├── swagger.js
└── .env.example
```

---

## 📬 Notes

- AI functionality (summarization + validation) is mocked for demonstration.
- All routes require a valid JWT token except registration and login.
- Survey expiry is validated on each response submission.

---

## 🧑‍💻 Author

Developed by Daniel Yavnik  
Academic College of Tel Aviv-Yaffo