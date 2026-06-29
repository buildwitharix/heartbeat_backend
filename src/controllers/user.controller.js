const userService = require('../services/user.service');
const { success, error } = require('../utils/response');

const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    return success(res, 'User registered', user, 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await userService.loginUser(req.body);
    return success(res, 'User logged in', user);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const details = await userService.getUserDetails(req.params.userId);
    return success(res, 'User details fetched', details);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserDetails
};
