const crypto = require("crypto");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// GET /users/me
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// helper to hash using scrypt + random salt
const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(`${salt}:${derivedKey.toString("hex")}`); // store as "salt:hash"
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

// POST /signup (wired in routes/index.js)
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

// POST /signin (wired in routes/index.js)
const login = (req, res) => {
  const { email, password } = req.body;
  const invalid = { message: "Incorrect email or password" };

  if (!email || !password) {
    return res.status(UNAUTHORIZED).send(invalid);
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
        return res.status(UNAUTHORIZED).send(invalid);
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// PATCH /users/me — update profile (name, avatar)
const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data passed to update user" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateCurrentUser,
};
