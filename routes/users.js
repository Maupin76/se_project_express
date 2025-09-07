const router = require("express").Router();
const { getUsers, getUserById, createUser } = require("../controllers/users");

// GET /users
router.get("/", getUsers);

// GET /users/:userId
router.get("/:userId", getUserById);

// POST /users
router.post("/", createUser);

module.exports = router;
