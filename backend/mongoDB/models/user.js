const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.hashedPassword.toString());
};

userSchema.methods.toSafeObject = function () {
  const { id, firstName, lastName, username, email } = this; // context will be the User instance
  return { id, firstName, lastName, username, email };
};

userSchema.methods.getCurrentUserById = function (id) {
  // need to get user by id with mongoose
};

userSchema.methods.login = async function ({ credential, password }) {
  // need to get user where email is credential and password
};

userSchema.methods.signup = async function ({
  firstName,
  lastName,
  username,
  email,
  password,
}) {
  const user =  new User({
    firstName,
    lastName,
    username,
    email,
    hashedPassword: bcrypt.hashSync(password),
    });
    try {
        const newUser = await user.save();
        return newUser;
    } catch (error) {
        console.log(error)
    }
};

modules.exports = mongoose.model("User", userSchema);