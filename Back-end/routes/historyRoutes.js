const express = require('express');
const ActionHistoryController = require('../controllers/ActionHistoryController');
const router = express.Router();

router.get('/getdata', ActionHistoryController.getActionHistory);
router.get('/search', ActionHistoryController.searchActionHistory);
router.get('/sort', ActionHistoryController.sortActionHistory);

module.exports = router;