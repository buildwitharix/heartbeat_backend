const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const deviceSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: randomUUID,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    deviceName: {
      type: String,
      required: true,
      trim: true
    },
    hostname: {
      type: String,
      trim: true,
      default: null
    },
    username: {
      type: String,
      trim: true,
      default: null
    },
    operatingSystem: {
      type: String,
      trim: true,
      default: null
    },
    osVersion: {
      type: String,
      trim: true,
      default: null
    },
    architecture: {
      type: String,
      trim: true,
      default: null
    },
    processor: {
      type: String,
      trim: true,
      default: null
    },
    cpuCores: {
      type: Number,
      default: null
    },
    totalRam: {
      type: Number,
      default: null
    },
    totalDisk: {
      type: Number,
      default: null
    },
    macAddress: {
      type: String,
      trim: true,
      default: null
    },
    localIp: {
      type: String,
      trim: true,
      default: null
    },
    publicIp: {
      type: String,
      trim: true,
      default: null
    },
    appVersion: {
      type: String,
      trim: true,
      default: null
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
      index: true
    },
    lastSeen: {
      type: Date,
      default: null,
      index: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.user_id = ret.user;
        delete ret._id;
        delete ret.__v;
        delete ret.user;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Device', deviceSchema);
