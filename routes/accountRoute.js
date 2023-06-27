const router = require('express').Router();
const ctrl = require('../controllers/accountControllers');
const { verifyToken, verifyAdmin } = require('../middlewares/verify');

router.get('/login', ctrl.renderLoginPage);
router.get('/logout', ctrl.logout);
router.get('/statistical', verifyToken, ctrl.renderStatistical);
router.get('/search', verifyToken, ctrl.search);
router.get('/', verifyToken, ctrl.renderHomePage);
router.get('/admin', [verifyToken, verifyAdmin], ctrl.renderAdminHomePage);
router.get(
  '/admin-create',
  [verifyToken, verifyAdmin],
  ctrl.renderAdminCreatePage
);
router.get(
  '/admin-update',
  [verifyToken, verifyAdmin],
  ctrl.renderAdminUpdatePage
);
router.get(
  '/admin-account',
  [verifyToken, verifyAdmin],
  ctrl.renderAdminAccountPage
);
router.post('/login', ctrl.login);
router.get('/getAll', verifyToken, ctrl.getAll);
router.post('/create', [verifyToken, verifyAdmin], ctrl.create);
router.delete('/:id', [verifyToken, verifyAdmin], ctrl.delete);
router.post('/:id', [verifyToken, verifyAdmin], ctrl.update);

module.exports = router;
