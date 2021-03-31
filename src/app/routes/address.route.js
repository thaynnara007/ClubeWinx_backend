const express = require('express');
const controller = require('../controllers/address.controller');

const router = express.Router();

router.post('/user/:userId', controller.create);
router.get('/', controller.getAll);
router.get('/user/:userId/', controller.getByUserId);
router.put('/user/:userId', controller.edit);
router.delete('/user/:userId', controller .delet);

module.exports = router;
