const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');

router.post('/', residentController.register);

module.exports = router;
