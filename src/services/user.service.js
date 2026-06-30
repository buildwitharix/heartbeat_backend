const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Device = require('../models/device.model');

const PLACEHOLDER_VALUES = new Set([
  'enter your full name',
  'enter your email',
  'enter password'
]);

const normalizeText = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  const normalized = value.trim();
  return PLACEHOLDER_VALUES.has(normalized.toLowerCase()) ? '' : normalized;
};

const findUserByIdOrUuid = (userId) => {
  if (mongoose.Types.ObjectId.isValid(userId)) {
    return User.findById(userId);
  }

  return User.findOne({ uuid: userId });
};

const registerUser = async ({ name, full_name: fullName, email, phone, password }) => {
  const displayName = normalizeText(name) || normalizeText(fullName);
  const normalizedEmail = normalizeText(email).toLowerCase();
  const normalizedPhone = normalizeText(phone) || null;
  const normalizedPassword = normalizeText(password);

  if (!displayName || !normalizedEmail || !normalizedPassword) {
    const error = new Error('name, email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

  return User.create({
    name: displayName,
    email: normalizedEmail,
    phone: normalizedPhone,
    password: hashedPassword
  });
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = normalizeText(email).toLowerCase();
  const normalizedPassword = normalizeText(password);

  if (!normalizedEmail || !normalizedPassword) {
    const error = new Error('email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(normalizedPassword, user.password);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  return user;
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
  loginUser,
  getUserDetails
};
