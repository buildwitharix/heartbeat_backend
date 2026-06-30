const alerts = [];

// Avoid creating duplicate alerts for the same device+type within a short window.
const DUPLICATE_WINDOW_MS = Number(process.env.ALERT_DUPLICATE_WINDOW_MS || 60 * 1000);

const createAlert = ({ deviceId, type, message }) => {
  const now = Date.now();

  const duplicate = alerts.find(
    (a) => a.deviceId === deviceId && a.type === type && now - a.createdAtMs <= DUPLICATE_WINDOW_MS
  );

  if (duplicate) {
    // Update message of existing alert but do not create a new one.
    duplicate.message = message;
    duplicate.createdAt = new Date();
    duplicate.createdAtMs = now;
    return duplicate;
  }

  const alert = {
    id: `${now}-${Math.random().toString(16).slice(2)}`,
    deviceId,
    type,
    message,
    createdAt: new Date(),
    // internal timestamp for fast duplicate checks
    createdAtMs: now
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
