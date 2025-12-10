🧥 WTWR (What to Wear?) — Backend
Sprint 15 — Full Stack Deployment

This is the backend portion of the WTWR full-stack application.
It provides API endpoints for user authentication, clothing item management, likes, and user profile updates.
The backend is fully deployed using Google Cloud VM, PM2, nginx, SSL (Certbot), and environment variables for secure production use.

🌐 Deployed API Domain

https://api.wtwr.weatherpixel.com

All API routes (sign up, sign in, CRUD operations, likes) are available under this domain.

Example:
GET https://api.wtwr.weatherpixel.com/items

🎨 Frontend Repository

The GitHub repository for the frontend:

👉 https://github.com/DouglasMaupin11/se_project_react

🌍 Deployed Frontend Domain

https://wtwr.weatherpixel.com

The deployed frontend communicates with the API through HTTPS using the api subdomain.

<!-- 🎥 Project Pitch Video (applied in the next correction)

(Fill this in with your YouTube or Google Drive link)

👉 Project Pitch Video: <insert your video link here>

This video demonstrates:

The deployed frontend

The deployed backend

Sign up / sign in

Adding / deleting items

Liking items

The crash-test endpoint

nginx HTTPS setup

PM2 auto-restart behavior -->

🚀 Technologies Used
Backend

Node.js

Express.js

MongoDB / Mongoose

Celebrate / Joi / Validator (validation middleware)

Winston (logging: request + error loggers)

Centralized error handling

Custom error classes

CORS

JSON Web Tokens (JWT)

Deployment

Google Cloud Compute Engine VM

PM2 (keeps server running + restarts on crash)

nginx reverse proxy

SSL certificates via Certbot

Environment variables (.env) for production secrets

🛠 Crash Test Endpoint

For code review purposes (⚠ remove after review):

GET /crash-test

This triggers an intentional server crash.
PM2 should automatically restart the app on the VM and restore functionality.

⚙️ Environment Variables

On the server only (.env file):

NODE_ENV=production
JWT_SECRET=your-strong-production-secret

The .env file is not included in GitHub by design.

📁 Project Structure
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
│ └── errors.js
├── .env (production only, not committed)
└── README.md

🧪 How to Run Locally

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
