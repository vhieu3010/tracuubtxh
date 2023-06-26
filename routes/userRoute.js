const router = require('express').Router();
const ctrl = require('../controllers/userControllers');
const { verifyToken, verifyAdmin } = require('../middlewares/verify');

router.get('/', ctrl.getAll);
router.get('/filter', ctrl.filter);
router.get('/search', ctrl.search);
router.get('/:id', ctrl.getUserById);
router.post('/create', [verifyToken, verifyAdmin], ctrl.create);
router.put('/:id', [verifyToken, verifyAdmin], ctrl.update);
router.delete('/:id', [verifyToken, verifyAdmin], ctrl.delete);

module.exports = router;
