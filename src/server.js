require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./config/database');
const startOfflineChecker = require('./jobs/offlineChecker.job');

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    startOfflineChecker();
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
