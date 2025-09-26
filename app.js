const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { NOT_FOUND } = require("./utils/errors");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .catch((err) => console.error(err));

app.use(cors());
app.use(express.json());

app.use("/", mainRouter);

// Spec-required 404 text
app.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Requested resource not found" })
);

app.listen(PORT);
