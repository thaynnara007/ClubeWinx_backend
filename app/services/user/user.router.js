const express = require('express');
const users = require('./user.controller');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());
router.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

router.post('/', users.create);
router.get('/', users.findAll);
router.get('/:id', users.findById);
router.put('/:id', users.update);
router.delete('/:id', users.delete);

module.exports = router;