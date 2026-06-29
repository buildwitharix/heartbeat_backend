const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: randomUUID,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: null
    },
    password: {
      type: String,
      required: true
    },
    emailVerifiedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('User', userSchema);
