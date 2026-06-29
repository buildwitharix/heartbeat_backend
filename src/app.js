const express = require('express');
const cors = require('cors');

const heartbeatRoutes = require('./routes/heartbeat.routes');
const deviceRoutes = require('./routes/device.routes');
const alertRoutes = require('./routes/alert.routes');
const userRoutes = require('./routes/user.routes');
const { error } = require('./utils/response');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Heartbeat backend is running'
  });
});

app.use('/api/heartbeats', heartbeatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/alerts', alertRoutes);

app.use((req, res) => {
  return error(res, 'Route not found', 404);
});

module.exports = app;
