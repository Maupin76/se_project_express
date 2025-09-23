const crypto = require("crypto");

const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// GET /users/:userId
const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// POST /users
// helper to hash using scrypt + random salt
const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      // store as "salt:hash"
      return resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });

// HS256 JWT with exp using Node's crypto (no extra deps)
const b64url = (buf) =>
  Buffer.from(buf)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
const b64urlJSON = (obj) => b64url(JSON.stringify(obj));

const createJWT = (payload, secret) => {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = b64urlJSON(header);
  const payloadB64 = b64urlJSON(payload);
  const data = `${headerB64}.${payloadB64}`;
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64");
  const sigB64 = sig.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${data}.${sigB64}`;
};

// POST /users  (will move to /signup in a later step)
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  hashPassword(password)
    .then((hashed) => User.create({ name, avatar, email, password: hashed }))
    .then((user) =>
      res.status(201).send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email, // do NOT return password
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(CONFLICT)
          .send({ message: "User with this email already exists" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data passed to create user" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// POST /signin  (route will be added in Step 4)
const login = (req, res) => {
  const { email, password } = req.body;
  const invalid = { message: "Incorrect email or password" };

  if (!email || !password) {
    return res.status(401).send(invalid);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
      const token = createJWT({ _id: user._id, exp }, JWT_SECRET);
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError" || err.name === "AuthError") {
        return res.status(401).send(invalid);
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, getUserById, createUser, login };
