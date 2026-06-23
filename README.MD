#  Content Review & Feedback Platform

A full-stack web application that allows users to submit written content such as product descriptions and blog articles, then receive structured feedback including readability scores, clarity analysis, and improvement suggestions.

The system is built using **React**, **Node.js**, **Express.js**, and **MongoDB** with secure authentication and scalable backend architecture.

---

# Features

##  Authentication & Security

- User registration and login
- JWT-based authentication
- Protected API routes
- Password hashing using bcrypt
- Secure HTTP headers using Helmet
- API rate limiting

##  Content Management

- Submit content with:
  - Title
  - Category
  - Content body
  - Timestamp
- View previous submissions
- Rename submissions
- Delete individual submissions
- Delete all user submissions

##  Smart Feedback System

The application provides automated content analysis:

- Readability score
- Clarity score
- Content improvement suggestions
- AI-powered feedback using Groq API
- Rule-based fallback analysis

##  Dashboard

- Submission statistics
- Average score calculation
- Content history
- Trend visualization
- Recent submissions overview

##  File Upload Support

- Upload content files through the frontend
- Backend validates uploaded files
- Uploaded file information is processed securely
- File metadata can be stored with related submissions

## 📱 Responsive UI

The application works on:

- Desktop
- Tablet
- Mobile devices

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Yup Validation
- Recharts
- Heroicons

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Helmet
- express-rate-limit
- Compression

## External Services

- Groq API for AI feedback generation
- MongoDB Atlas for cloud database

## Deployment

Frontend:
- Vercel

Backend:
- Render

Database:
- MongoDB Atlas

---

=============== Installation & Setup=====================

## Prerequisites

Make sure you have installed:

- Node.js v18+
- MongoDB (local or Atlas)
- Git

---

# 1. Clone Repository

```bash
git clone <your-repository-url>

cd content-review-platform

2. Backend Setup

Navigate to backend folder:

cd backend

Install dependencies:

npm install

Create environment file:

cp .env.example .env

Start backend server:

Development:

npm run dev

Production:

npm start

Backend will run:

http://localhost:5000
3. Frontend Setup

Open a new terminal:

cd frontend

Install dependencies:

npm install

Create environment file:

cp .env.example .env

Start frontend:

npm run dev

Frontend will run:

http://localhost:3000
🔧 Environment Variables
Backend (.env)
Variable	Description	Example
PORT	Backend server port	5000
NODE_ENV	Environment	development
MONGODB_URI	Database connection	mongodb+srv://...
JWT_SECRET	JWT signing key	secret-key
JWT_EXPIRES_IN	Token expiration	7d
FEEDBACK_PROVIDER	Feedback engine	rule/groq
GROQ_API_KEY	Groq API key	gsk_xxx
FRONTEND_URL	Frontend URL	http://localhost:3000
Frontend (.env)
Variable	Description	Example
VITE_API_URL	Backend API URL	http://localhost:5000/api/v1

 Project Structure

content-review-platform/

├── backend/
│
│   ├── src/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
│
│   ├── server.js
│   └── package.json
│
├── frontend/
│
│   ├── src/
│   │
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── api/
│   ├── utils/
│   └── App.jsx
│
├── README.md
├── design-summary.md
└── architecture-diagram.md

   ========== System Architecture ===============

The application follows a three-layer architecture:

React Frontend
        |
        |
 REST API Requests
        |
        v
Express Backend
        |
        |
        v
MongoDB Database

Main components:

.React handles user interface and client-side logic
.Express provides REST APIs
.MongoDB stores users, submissions, and feedback data
.Authentication is handled using JWT

  Role-Based Access Control

The application implements authorization using user roles.

User Role

Users can:

Create content submissions
View their own submissions
Edit their own content
Delete their own content
Receive feedback
Admin Role (if enabled)

Administrators can:

Manage users
View system-level information
Perform administrative actions

Access control is enforced using backend middleware that verifies:

User identity through JWT
User permissions through role checks

------- File Upload Flow ---------

The file upload process works as follows:

React Frontend

      |
      |
      v

User selects file

      |
      |
      v

Express Backend

      |
      |
      v

File validation

      |
      |
      v

Store file information

      |
      |
      v

MongoDB Database

The backend validates:

File type
File size
User permission

Only valid uploads are accepted.

  Testing the Application

Fork repository
Create branch:
git checkout -b feature-name
Commit changes:
git commit -m "Add feature"
Push changes:
git push origin feature-name
Create Pull Requests

 

   Author

Your Zelalem ybabe

GitHub: zola880

Email: zelalemybabe77@gmail.com


