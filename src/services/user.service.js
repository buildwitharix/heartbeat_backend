const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Device = require('../models/device.model');

const findUserByIdOrUuid = (userId) => {
  if (mongoose.Types.ObjectId.isValid(userId)) {
    return User.findById(userId);
  }

  return User.findOne({ uuid: userId });
};

const registerUser = async ({ name, full_name: fullName, email, phone, password }) => {
  const displayName = name || fullName;

  if (!displayName || !email || !password) {
    const error = new Error('name, email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return User.create({
    name: displayName,
    email,
    phone,
    password: hashedPassword
  });
};

const getUserDetails = async (userId) => {
  const user = await findUserByIdOrUuid(userId).select('-password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const devices = await Device.find({ user: user._id }).sort({ createdAt: -1 });

  return {
    user,
    devices
  };
};

module.exports = {
  findUserByIdOrUuid,
  registerUser,
  getUserDetails
};
