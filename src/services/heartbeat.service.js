const deviceService = require('./device.service');

const registerHeartbeat = async (payload) => {
  return deviceService.updateHeartbeat(payload);
};

module.exports = {
  registerHeartbeat
};
