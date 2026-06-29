const heartbeatService = require('../services/heartbeat.service');
const { success, error } = require('../utils/response');

const createHeartbeat = async (req, res) => {
  try {
    const device = await heartbeatService.registerHeartbeat(req.body);
    console.log(
      `[HEARTBEAT] received device="${device.deviceName}" uuid=${device.uuid} status=${device.status} lastSeen=${device.lastSeen?.toISOString()}`
    );
    return success(res, 'Heartbeat received', device, 201);
  } catch (err) {
    console.error(`[HEARTBEAT] failed: ${err.message}`);
    return error(res, err.message, err.statusCode || 500);
  }
};

module.exports = {
  createHeartbeat
};
