const router = require("express").Router();

const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");
const itemRouter = require("./items");

// Public auth endpoints
router.post("/signin", login);
router.post("/signup", createUser);

// Other routers (will be protected in Step 5)
router.use("/users", userRouter);
router.use("/items", itemRouter);

module.exports = router;
