const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

app.use(express.json());

// 🔸 TEMP AUTH (put this BEFORE routes)
app.use((req, res, next) => {
  req.user = {
    _id: "68b76f631439b0c22c1ae817",
  };
  next();
});

app.use("/", mainRouter);

// optional: catch-all 404
app.use((req, res) => res.status(404).send({ message: "Route not found" }));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
