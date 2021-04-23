const express = require('express');
const auth = require('../middlewares/auth');
const controller = require('../controllers/poster.controller');

const router = express.Router({ mergeParams: true });

router.post('/', auth.verifyToken, controller.create);
router.get('/my', auth.verifyToken, controller.getMy);
router.get('/:posterId', auth.verifyToken, controller.getById);
router.get('/', auth.verifyToken, controller.getAll);
router.put('/my', auth.verifyToken, controller.edit);
router.delete('/my', auth.verifyToken, controller.delet);

module.exports = router;
