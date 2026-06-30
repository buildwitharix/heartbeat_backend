const deviceService = require('../services/device.service');
const { success, error } = require('../utils/response');

const storeDevice = async (req, res) => {
  try {
    const device = await deviceService.storeDevice({
      ...req.body,
      request_ip: req.ip
    });
    console.log(
      `[DEVICE] stored name="${device.deviceName}" uuid=${device.uuid} user=${device.user} status=${device.status}`
    );
    return success(res, 'Device stored', device, 201);
  } catch (err) {
    console.error(`[DEVICE] failed: ${err.message}`);
    return error(res, err.message, err.statusCode || 500);
  }
};

const listDevices = async (req, res) => {
  try {
    const devices = await deviceService.getDevices(req.query.user_id || req.query.userId);
    return success(res, 'Devices fetched', devices);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

const getDevice = async (req, res) => {
  try {
    const device = await deviceService.getDeviceById(req.params.deviceId);

    if (!device) {
      return error(res, 'Device not found', 404);
    }

    return success(res, 'Device fetched', device);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  storeDevice,
  listDevices,
  getDevice
};
