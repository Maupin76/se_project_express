const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must provide a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, // must be unique per spec
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // hide hash from all queries by default
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .orFail()
    .then(
      (user) =>
        new Promise((resolve, reject) => {
          const [salt, storedHash] = String(user.password).split(":");
          if (!salt || !storedHash) {
            const e = new Error("Incorrect email or password");
            e.name = "AuthError";
            reject(e); // <-- no 'return'
            return; // stop execution path
          }

          crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) {
              reject(err); // <-- no 'return'
              return;
            }

            const match = derivedKey.toString("hex") === storedHash;
            if (!match) {
              const e = new Error("Incorrect email or password");
              e.name = "AuthError";
              reject(e); // <-- no 'return'
              return;
            }

            resolve(user); // <-- no 'return'
          });
        })
    );
};

module.exports = mongoose.model("user", userSchema);
