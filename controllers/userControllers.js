const User = require('../models/user');
const asyncHandler = require('express-async-handler');

module.exports = userController = {
  getAll: asyncHandler(async (req, res) => {
    const response = await User.find();
    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : 'Có lỗi xảy ra!',
    });
  }),

  search: asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const response = await User.find({
      ten: { $regex: req.query.q, $options: 'i' },
    })
      .select('ten dienThoai ngaySinh diaChi')
      .limit(limit)
      .skip(skip);
    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : 'Có lỗi xảy ra!',
    });
  }),

  filter: asyncHandler(async (req, res) => {
    let query = {};

    if (req.query.ncc) query = { nguoiCoCong: req.query.ncc };
    if (req.query.btxh) query = { nhomHuong: req.query.btxh };
    if (req.query['btxh-ncc'] == 'true')
      query = {
        $and: [{ nguoiCoCong: { $ne: '' } }, { nhomHuong: { $ne: '' } }],
      };
    if (req.query['only-ncc'] === 'true')
      query = {
        $and: [{ nguoiCoCong: { $ne: '' } }, { nhomHuong: { $eq: '' } }],
      };
    if (req.query['only-btxh'] === 'true')
      query = {
        $and: [{ nguoiCoCong: { $eq: '' } }, { nhomHuong: { $ne: '' } }],
      };

    const response = await User.find(query).select(
      'ten dienThoai ngaySinh diaChi'
    );

    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : 'Có lỗi xảy ra!',
    });
  }),

  getUserById: asyncHandler(async (req, res) => {
    if (req.params.id) {
      const response = await User.findById(req.params.id);
      return res.status(200).json({
        success: response ? true : false,
        data: response ? response : 'Không tìm thấy người dùng!',
      });
    } else
      return res.status(200).json({
        success: false,
        message: 'Có lỗi xảy ra!',
      });
  }),

  create: asyncHandler(async (req, res) => {
    console.log(req.body);

    const { ten } = req.body;

    if (!ten) {
      return res.status(200).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ các trường bắt buộc!',
      });
    } else {
      if (req.body.ngaySinh) {
        const parts = req.body.ngaySinh.split('-');
        req.body.ngaySinh = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      const newUser = await User.create(req.body);
      return res.redirect('/admin');
    }
  }),

  delete: asyncHandler(async (req, res) => {
    if (req.params.id) {
      const response = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: response ? true : false,
        message: response ? 'Xóa user thành công!' : 'Có lỗi xảy ra!',
      });
    } else
      return res.status(200).json({
        success: false,
        message: 'Có lỗi xảy ra!',
      });
  }),

  update: asyncHandler(async (req, res) => {
    if (req.params.id) {
      const response = await User.findByIdAndUpdate(req.params.id, req.body);
      return res.status(200).json({
        success: response ? true : false,
        message: response ? 'Cập nhật user thành công!' : 'Có lỗi xảy ra!',
      });
    } else
      return res.status(200).json({
        success: false,
        message: 'Có lỗi xảy ra!',
      });
  }),
};
