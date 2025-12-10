const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { errors } = require("celebrate");
const { NotFoundError } = require("./utils/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");

const app = express();
const { PORT = 3001 } = process.env;

// ----------------------
// 🔹 Connect to MongoDB
// ----------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .catch((err) => console.error(err));

app.use(cors());
app.use(express.json());

// ----------------------
// 🔹 Log all requests
// ----------------------
app.use(requestLogger);

// --------------------------------------------------
// 🔥 Sprint 15 REQUIRED: Crash-Test Route
// (Must be BEFORE /signin and /signup routes)
// --------------------------------------------------
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// ----------------------
// 🔹 Main application routes
// ----------------------
app.use("/", mainRouter);

// ----------------------
// 🔹 Log all errors
// ----------------------
app.use(errorLogger);

// ----------------------
// 🔹 404 Handler
// ----------------------
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// ----------------------
// 🔹 Joi/Celebrate validation errors
// ----------------------
app.use(errors());

// ----------------------
// 🔹 Centralized error handler
// ----------------------
app.use(errorHandler);

// ----------------------
// 🔹 Start server
// ----------------------
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
