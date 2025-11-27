const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { errors } = require("celebrate");
const { NotFoundError } = require("./utils/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .catch((err) => console.error(err));

app.use(cors());
app.use(express.json());

// 🔹 Log all incoming requests
app.use(requestLogger);

// 🔹 Main routes
app.use("/", mainRouter);

// 🔹 Log all errors that occur in routes/controllers
app.use(errorLogger);

// 🔹 Fallback route — if no routes matched, throw a 404
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// 🔹 celebrate error handler (for Joi/celebrate validation errors)
app.use(errors());

// 🔹 Centralized error handler (for everything else)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
