// backend/models/Setting.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SettingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', SettingSchema);
export default Setting;
