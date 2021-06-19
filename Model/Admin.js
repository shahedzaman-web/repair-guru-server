const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});
const bcrypt = require("bcrypt");
let SALT = 10;

adminSchema.pre("save", function (next) {
  var admin = this;
  if (admin.isModified("password")) {
    bcrypt.genSalt(SALT, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(admin.password, salt, function (err, hash) {
        if (err) return next(err);
        admin.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});
adminSchema.methods.comparePassword = function (
  candidatePassword,
  checkPassword
) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return checkPassword(err);
    checkPassword(null, isMatch);
  });
};
const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin };
