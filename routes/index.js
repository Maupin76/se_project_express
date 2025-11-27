const router = require("express").Router();

const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

const {
  validateUserBody,
  validateLoginBody,
} = require("../middlewares/validation");

const userRouter = require("./users");
const itemRouter = require("./items");

// Public endpoints
router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);
router.get("/items", getItems);

// Everything below this line requires a valid JWT
router.use(auth);

router.use("/users", userRouter);
router.use("/items", itemRouter);

module.exports = router;
