const express = require('express');
const controller = require('../controllers/user.controller');

const router = express.Router();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:userId', controller.getById);
router.put('/:userId', controller.edit);
router.delete('/:userId', controller.delet);

module.exports = router;
