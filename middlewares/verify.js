const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
      if (err) return res.redirect('/login');
      req.user = decode;
      next();
    });
  } else return res.redirect('/login');
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const { isAdmin } = req.user;
  if (isAdmin) {
    next();
  } else return res.redirect('/login');
});

module.exports = { verifyToken, verifyAdmin };
