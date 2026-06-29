const alertService = require('../services/alert.service');
const emailService = require('../services/email.service');
const { success, error } = require('../utils/response');

const listAlerts = (req, res) => {
  return success(res, 'Alerts fetched', alertService.getAlerts());
};

const sendTestEmail = async (req, res) => {
  try {
    const result = await emailService.sendAlertEmail({
      subject: 'Heartbeat Monitor Test Alert',
      text: 'This is a test alert from Heartbeat Monitor.'
    });

    return success(res, 'Test email processed', result);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  listAlerts,
  sendTestEmail
};
