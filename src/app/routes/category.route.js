const express = require('express');
const auth = require('../middlewares/auth');
const controller = require('../controllers/category.controller');

const router = express.Router();

router.post('/', auth.verifyToken, controller.create);
router.get('/',  auth.verifyToken, controller.getAll);
router.get('/:categoryId', auth.verifyToken, controller.getById);
router.put('/:categoryId', auth.verifyToken, controller.edit);

module.exports = router;
