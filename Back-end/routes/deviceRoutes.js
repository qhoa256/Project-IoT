const express = require('express');
const DeviceController = require('../controllers/DeviceController');
const router = express.Router();

router.get('/actiondata', DeviceController.controlDevice);

module.exports = router;
