const alerts = [];

const createAlert = ({ deviceId, type, message }) => {
  const alert = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    deviceId,
    type,
    message,
    createdAt: new Date()
  };

  alerts.unshift(alert);
  return alert;
};

const getAlerts = () => {
  return alerts;
};

module.exports = {
  createAlert,
  getAlerts
};
