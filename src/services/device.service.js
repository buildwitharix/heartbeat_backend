const mongoose = require('mongoose');
const Device = require('../models/device.model');
const userService = require('./user.service');

const removeUndefinedValues = (payload) => {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
};

const toCamelCaseDevicePayload = (payload) => {
  return removeUndefinedValues({
    deviceName: payload.deviceName || payload.device_name,
    hostname: payload.hostname,
    username: payload.username,
    operatingSystem: payload.operatingSystem || payload.operating_system,
    osVersion: payload.osVersion || payload.os_version,
    architecture: payload.architecture,
    processor: payload.processor,
    cpuCores: payload.cpuCores || payload.cpu_cores,
    totalRam: payload.totalRam || payload.total_ram,
    totalDisk: payload.totalDisk || payload.total_disk,
    macAddress: payload.macAddress || payload.mac_address,
    localIp: payload.localIp || payload.local_ip,
    publicIp: payload.publicIp || payload.public_ip || payload.requestIp || payload.request_ip,
    appVersion: payload.appVersion || payload.app_version,
    status: payload.status,
    lastSeen: payload.lastSeen || payload.last_seen
  });
};

const findDeviceByIdOrUuid = (deviceId) => {
  if (mongoose.Types.ObjectId.isValid(deviceId)) {
    return Device.findById(deviceId);
  }

  return Device.findOne({ uuid: deviceId });
};

const findExistingDevice = async (userId, payload, deviceData) => {
  const lookupId = payload.deviceId || payload.device_id || payload.uuid;

  if (lookupId) {
    const device = await findDeviceByIdOrUuid(lookupId);

    if (device && device.user.equals(userId)) {
      return device;
    }
  }

  if (deviceData.macAddress) {
    const device = await Device.findOne({
      user: userId,
      macAddress: deviceData.macAddress
    });

    if (device) {
      return device;
    }
  }

  if (deviceData.hostname && deviceData.username) {
    return Device.findOne({
      user: userId,
      hostname: deviceData.hostname,
      username: deviceData.username,
      operatingSystem: deviceData.operatingSystem || null
    });
  }

  return null;
};

const storeDevice = async (payload) => {
  const userId = payload.userId || payload.user_id;
  const deviceData = toCamelCaseDevicePayload(payload);

  if (!userId || !deviceData.deviceName) {
    const error = new Error('user_id and device_name are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await userService.findUserByIdOrUuid(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const existingDevice = await findExistingDevice(user._id, payload, deviceData);

  if (existingDevice) {
    Object.assign(existingDevice, deviceData, {
      user: user._id,
      status: deviceData.status || existingDevice.status,
      lastSeen: deviceData.status === 'online' ? new Date() : existingDevice.lastSeen
    });

    return existingDevice.save();
  }

  return Device.create({
    ...deviceData,
    user: user._id,
    status: deviceData.status || 'offline',
    lastSeen: deviceData.status === 'online' ? new Date() : deviceData.lastSeen
  });
};

const getDevices = async (userId) => {
  const query = {};

  if (userId) {
    const user = await userService.findUserByIdOrUuid(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    query.user = user._id;
  }

  return Device.find(query).sort({ createdAt: -1 });
};

const getDeviceById = async (deviceId) => {
  return findDeviceByIdOrUuid(deviceId);
};

const updateHeartbeat = async ({ deviceId, device_id: snakeDeviceId, uuid, status = 'online', systemStatus, system_status: snakeSystemStatus }) => {
  const lookupId = deviceId || snakeDeviceId || uuid;

  if (!lookupId) {
    const error = new Error('device_id is required');
    error.statusCode = 400;
    throw error;
  }

  const device = await findDeviceByIdOrUuid(lookupId);

  if (!device) {
    const error = new Error('Device not found');
    error.statusCode = 404;
    throw error;
  }

  if (!['online', 'offline'].includes(status)) {
    const error = new Error('status must be online or offline');
    error.statusCode = 400;
    throw error;
  }

  const payload = toCamelCaseDevicePayload(systemStatus || snakeSystemStatus || {});

  Object.assign(device, payload, {
    status,
    lastSeen: new Date()
  });

  return device.save();
};

const markOfflineDevices = async (thresholdMinutes) => {
  const cutoff = new Date(Date.now() - thresholdMinutes * 60 * 1000);

  const offlineDevices = await Device.find({
    status: 'online',
    lastSeen: { $lt: cutoff }
  });

  if (offlineDevices.length > 0) {
    await Device.updateMany(
      { _id: { $in: offlineDevices.map((device) => device._id) } },
      { $set: { status: 'offline' } }
    );
  }

  return offlineDevices;
};

module.exports = {
  storeDevice,
  getDevices,
  getDeviceById,
  updateHeartbeat,
  markOfflineDevices
};
