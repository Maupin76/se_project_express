# 🧥 WTWR (What to Wear?) — Backend

This repository contains the backend for the WTWR (What to Wear?) full-stack application.  
It provides API endpoints for user authentication, clothing item management, likes, and user profile updates.

The backend is deployed on a Google Cloud Compute Engine virtual machine using PM2 and nginx as a reverse proxy.

---

## 🌐 Deployed API Domain

**Backend API (production):**

http://api.recwtwr.jumpingcrab.com

All API routes (sign up, sign in, CRUD operations, likes, and user profile updates) are available under this domain.

**Example request:**

GET http://api.recwtwr.jumpingcrab.com/items

---

## 🎨 Frontend Repository

The GitHub repository for the frontend application:

https://github.com/DouglasMaupin11/se_project_react

---

## 🌍 Deployed Frontend Domain

**Frontend (production):**

http://recwtwr.jumpingcrab.com

The frontend communicates with the backend API through a dedicated API subdomain.

---

## 🎥 Project Pitch Video

👉 Project Pitch Video: https://youtu.be/nh7VEFq4lic

This video demonstrates:

- Deployed frontend
- Deployed backend
- User sign up and sign in
- Adding and deleting clothing items
- Liking and unliking items
- Crash-test endpoint
- nginx reverse proxy
- PM2 auto-restart behavior

---

## 🚀 Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB / Mongoose
- Celebrate / Joi / Validator
- Winston logging (request and error loggers)
- Centralized error handling
- Custom error classes
- CORS
- JSON Web Tokens (JWT)

### Deployment

- Google Cloud Compute Engine VM
- PM2 (process manager and auto-restart)
- nginx reverse proxy
- Environment variables for production secrets

---

## 🛠 Crash Test Endpoint

For code review purposes only:

GET /crash-test

This endpoint intentionally crashes the server.  
PM2 automatically restarts the application and restores functionality.

---

## ⚙️ Environment Variables

Used on the server only (.env file, not committed):

NODE_ENV=production  
JWT_SECRET=your-strong-production-secret

---

## 📁 Project Structure

se_project_express/
│
├── app.js
├── controllers/
├── middlewares/
│ ├── error-handler.js
│ ├── logger.js
│ └── validation.js
├── models/
├── routes/
├── utils/
│ └── errors/
│ ├── BadRequestError.js
│ ├── UnauthorizedError.js
│ ├── ForbiddenError.js
│ ├── NotFoundError.js
│ ├── ConflictError.js
│ ├── InternalServerError.js
│ └── index.js
├── .env (production only, not committed)
└── README.md

---

## 🧪 How to Run Locally

1. Install dependencies  
   npm install

2. Create a .env file  
   NODE_ENV=development  
   JWT_SECRET=dev-secret

3. Start MongoDB  
   Ensure MongoDB is running locally.

4. Run the server  
   npm run start

   or with nodemon:  
   npm run dev

---

## ✅ Notes for Reviewers

- All request validation is handled with Celebrate/Joi middleware
- All errors are thrown using custom error classes
- Controllers do not send error responses directly
- Centralized error handler processes all errors
- PM2 ensures automatic recovery after crashes
- nginx proxies client traffic to the Express application
