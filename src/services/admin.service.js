const User = require('../models/user.model');
const Device = require('../models/device.model');

const getOverview = async () => {
  const [users, devices] = await Promise.all([
    User.find().select('-password').sort({ createdAt: -1 }),
    Device.find().populate('user', 'uuid name email status').sort({ lastSeen: -1, createdAt: -1 })
  ]);

  const totalUsers = users.length;
  const totalDevices = devices.length;
  const onlineDevices = devices.filter((device) => device.status === 'online').length;
  const offlineDevices = devices.filter((device) => device.status === 'offline').length;

  const devicesByUser = devices.reduce((result, device) => {
    const userId = device.user?._id?.toString() || device.user?.toString();

    if (!userId) {
      return result;
    }

    result[userId] = result[userId] || [];
    result[userId].push(device);
    return result;
  }, {});

  const userRows = users.map((user) => {
    const userDevices = devicesByUser[user._id.toString()] || [];

    return {
      ...user.toJSON(),
      deviceCount: userDevices.length,
      onlineDeviceCount: userDevices.filter((device) => device.status === 'online').length,
      offlineDeviceCount: userDevices.filter((device) => device.status === 'offline').length,
      lastSeen: userDevices[0]?.lastSeen || null
    };
  });

  return {
    summary: {
      totalUsers,
      totalDevices,
      onlineDevices,
      offlineDevices
    },
    users: userRows,
    devices
  };
};

module.exports = {
  getOverview
};
