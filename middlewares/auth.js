const crypto = require("crypto");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

// base64url > Buffer
const b64urlToBuffer = (str) => {
  const pad = 4 - (str.length % 4 || 4);
  const base64 = (str + "=".repeat(pad)).replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64");
};

// Verify HS256 JWT "header.payload.signature"
const verifyJWT = (token, secret) => {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token");
  const [headerB64, payloadB64, sigB64] = parts;

  const data = `${headerB64}.${payloadB64}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  if (expected !== sigB64) throw new Error("Bad signature");

  const payloadJson = b64urlToBuffer(payloadB64).toString("utf8");
  const payload = JSON.parse(payloadJson);

  if (
    typeof payload.exp === "number" &&
    Math.floor(Date.now() / 1000) >= payload.exp
  ) {
    throw new Error("Token expired");
  }

  return payload; // { _id, exp }
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // No header or wrong format → 401 via central error handler
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = verifyJWT(token, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    console.error(err.message); // allowed by ESLint rule
    return next(new UnauthorizedError("Authorization Required"));
  }

  return next();
};
