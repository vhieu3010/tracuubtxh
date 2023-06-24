const Account = require('../models/account');
const asyncHandler = require('express-async-handler');
const generateAccessToken = require('../middlewares/jwt');
const bcrypt = require('bcrypt');

module.exports = accountController = {
  renderLoginPage: (req, res) => {
    res.render('login', { message: '' });
  },

  renderStatistical: (req, res) => {
    res.render('statistical');
  },

  renderHomePage: (req, res) => {
    res.render('homepage');
  },

  renderAdminHomePage: (req, res) => {
    res.render('adminHome');
  },

  renderAdminCreatePage: (req, res) => {
    res.render('adminCreate');
  },

  renderAdminUpdatePage: (req, res) => {
    res.render('adminUpdate');
  },

  renderAdminAccountPage: (req, res) => {
    res.render('adminAccount', { message: '' });
  },

  getAll: asyncHandler(async (req, res) => {
    const response = await Account.find({});
    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : 'Có lỗi xảy ra!',
    });
  }),

  search: asyncHandler(async (req, res) => {
    const response = await Account.find({
      email: { $regex: req.query.q, $options: 'i' },
    });

    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : 'Có lỗi xảy ra!',
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render('login', {
        message: 'Vui lòng nhập đủ thông tin đăng nhập!',
      });
    }

    const account = await Account.findOne({ email });
    if (!account)
      return res.render('login', { message: 'Tài khoản này không tồn tại!' });
    else {
      const validPassword = await bcrypt.compare(password, account.password);
      if (validPassword) {
        const { isAdmin } = account.toObject();
        const accessToken = await generateAccessToken(account._id, isAdmin);
        res.cookie('accessToken', accessToken, {
          maxAge: 60 * 60 * 1000,
        });
        if (isAdmin === true) return res.redirect('/admin');
        return res.redirect('/');
      } else return res.render('login', { message: 'Mật khẩu không đúng!' });
    }
  }),

  logout: asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie && !cookie.accessToken) throw new Error("You haven't login!");
    res.clearCookie('accessToken', { httpOnly: true });
    return res.redirect('/login');
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (id) {
      const { password } = req.body;
      if (password) {
        const salt = await new bcrypt.genSalt(10);
        const hashed = await new bcrypt.hash(password, salt);
        req.body.password = hashed;
      }
      const account = await Account.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json({
        success: account ? true : false,
        message: account ? 'Update successfully!' : 'Something went wrong!',
        response: account ? account : 'User not found',
      });
    } else
      return res.status(401).json({
        success: false,
        message: 'Require id account!',
      });
  }),

  create: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin!',
      });
    }

    const account = await Account.findOne({ email });

    if (account)
      return res.status(400).json({
        success: false,
        message: 'Email đã được dùng trước đây!',
      });

    const salt = await new bcrypt.genSalt(10);
    const hashed = await new bcrypt.hash(password, salt);

    req.body.password = hashed;
    const newAccount = await Account.create(req.body);

    return res.status(200).json({
      success: true,
      message: 'Tạo tài khoản thành công!',
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const response = await Account.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: response ? true : false,
      message: response ? 'Xóa tài khoản thành công!' : 'Có lỗi xảy ra!',
    });
  }),
};
