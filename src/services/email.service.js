const nodemailer = require('nodemailer');

const hasSmtpConfig = () => {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendAlertEmail = async ({ subject, text }) => {
  if (!hasSmtpConfig()) {
    console.warn('SMTP is not configured. Skipping email alert.');
    return { skipped: true };
  }

  const transporter = createTransporter();

  return transporter.sendMail({
    from: process.env.ALERT_FROM,
    to: process.env.ALERT_TO,
    subject,
    text
  });
};

module.exports = {
  sendAlertEmail
};
