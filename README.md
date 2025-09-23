# WTWR (What to Wear?): Back End

The back-end project creates a server for the WTWR application. In Sprint 13, authentication and authorization are added on top of the Sprint 12 API.

## Prerequisites

- Node.js 18+ (or 20+)
- MongoDB running locally at `mongodb://127.0.0.1:27017/wtwr_db`

## Technologies

- Node.js, Express.js
- MongoDB, Mongoose
- `validator` (URL/email validation)
- **Auth:** JWT (HS256) with 7-day expiry, secret in `utils/config.js`
- **CORS:** `cors` middleware
- ESLint (Airbnb Base) + Prettier, EditorConfig
- nodemon (hot reload for dev)
- Postman test suite, GitHub Actions

## Running the Project

```bash
npm ci            # or: npm install
npm run dev       # start with nodemon on port 3001
# or
npm run start     # start with node
```
