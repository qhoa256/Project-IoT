const express = require('express');
const SensorController = require('../controllers/SensorController');
const router = express.Router();

router.get('/status', SensorController.getRecentSensorData);
router.post('/datasensor', SensorController.insertSensorData);
router.get('/search', SensorController.searchSensorData);
router.get('/sort', SensorController.sortSensorData);

module.exports = router;
