# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Prerequisites

- Node.js 18+ (or 20+)
- MongoDB running locally at `mongodb://127.0.0.1:27017/wtwr_db`

## Technologies

- Node.js, Express.js
- MongoDB, Mongoose
- validator (URL validation)
- ESLint (Airbnb Base) + Prettier
- Postman (test suite), GitHub Actions
- EditorConfig
- nodemon (hot reload for dev)

## Running the Project

```bash
npm ci           # or: npm install
npm run dev      # start with hot reload (nodemon) on port 3001
# or
npm run start    # start with node


### Testing
Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
```
