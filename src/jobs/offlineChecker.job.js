const alertService = require('../services/alert.service');
const deviceService = require('../services/device.service');
const emailService = require('../services/email.service');

const startOfflineChecker = () => {
  const thresholdMinutes = Number(process.env.OFFLINE_THRESHOLD_MINUTES || 5);
  const intervalSeconds = Number(process.env.OFFLINE_CHECK_INTERVAL_SECONDS || 60);

  const checkOfflineDevices = async () => {
    const offlineDevices = await deviceService.markOfflineDevices(thresholdMinutes);

    for (const device of offlineDevices) {
      const lastSeen = device.lastSeen ? device.lastSeen.toISOString() : 'never';
      const message = `Device ${device.deviceName} is offline. Last seen: ${lastSeen}`;

      alertService.createAlert({
        deviceId: device.uuid,
        type: 'DEVICE_OFFLINE',
        message
      });

      await emailService.sendAlertEmail({
        subject: `Device offline: ${device.deviceName}`,
        text: message
      });
    }
  };

  setInterval(checkOfflineDevices, intervalSeconds * 1000);
  console.log(`Offline checker running every ${intervalSeconds}s`);
};

module.exports = startOfflineChecker;
