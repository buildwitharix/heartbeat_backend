const heartbeatService = require('../services/heartbeat.service');
const { success, error } = require('../utils/response');

const createHeartbeat = async (req, res) => {
  try {
    const systemStatus = req.body.systemStatus || req.body.system_status || {};
    const device = await heartbeatService.registerHeartbeat({
      ...req.body,
      system_status: {
        ...systemStatus,
        request_ip: req.ip
      }
    });
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
