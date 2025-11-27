const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { NotFoundError } = require("./utils/errors"); // <-- FIXED
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .catch((err) => console.error(err));

app.use(cors());
app.use(express.json());

app.use("/", mainRouter);

// Fallback route — if no routes matched, throw a 404
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// Centralized error handler (must be the LAST middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
