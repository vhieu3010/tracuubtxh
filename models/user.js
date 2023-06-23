const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    ten: {
      type: String,
      require: true,
    },
    diaChi: {
      type: String,
    },
    dienThoai: {
      type: String,
    },
    ngaySinh: {
      type: String,
    },
    toDanPho: {
      type: String,
    },
    diaChiDangKy: {
      type: String,
    },
    bhxh: {
      type: String,
    },
    cccd: {
      type: String,
    },
    cheDoHuong: {
      type: String,
    },
    nhomHuong: {
      type: String,
    },
    nguoiCoCong: {
      type: String,
    },
    mucBTXH: {
      type: [{ type: String }],
    },
    mucNCC: {
      type: [{ type: String }],
    },
    ghiChu: {
      type: [{ type: String }],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
