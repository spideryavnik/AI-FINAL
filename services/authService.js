const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async ({ username, email, password, registrationCode }) => {
  if (registrationCode !== process.env.REGISTRATION_SECRET) {
    const err = new Error("Invalid registration code");
    err.statusCode = 403;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, passwordHash });
  await user.save();

  return { message: 'Registration successful' };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET);
  return { token };
};

module.exports = { register, login };
