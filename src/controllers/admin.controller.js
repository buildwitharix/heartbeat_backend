const adminService = require('../services/admin.service');
const { success, error } = require('../utils/response');

const getOverview = async (req, res) => {
  try {
    const overview = await adminService.getOverview();
    return success(res, 'Admin overview fetched', overview);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  getOverview
};
