const crypto = require("crypto");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  InternalServerError,
} = require("../utils/errors");

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

// base64url helpers
const b64url = (buf) =>
  Buffer.from(buf)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const b64urlJSON = (obj) => b64url(JSON.stringify(obj));

// HS256 JWT with exp using Node's crypto (no extra deps)
const createJWT = (payload, secret) => {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = b64urlJSON(header);
  const payloadB64 = b64urlJSON(payload);
  const data = `${headerB64}.${payloadB64}`;
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64");
  const sigB64 = sig.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${data}.${sigB64}`;
};

// GET /users/me
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      return next(
        new InternalServerError("An error has occurred on the server")
      );
    });
};

// POST /signup
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  hashPassword(password)
    .then((hashed) => User.create({ name, avatar, email, password: hashed }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("User with this email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data passed to create user"));
      }
      return next(
        new InternalServerError("An error has occurred on the server")
      );
    });
};

// POST /signin
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
      const token = createJWT({ _id: user._id, exp }, JWT_SECRET);
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError" || err.name === "AuthError") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(
        new InternalServerError("An error has occurred on the server")
      );
    });
};

// PATCH /users/me
const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data passed to update user"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      return next(
        new InternalServerError("An error has occurred on the server")
      );
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateCurrentUser,
};
