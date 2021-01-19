const express = require('express');
const valeMethodController = require('../controllers/valeMethodController');
const authMiddleware = require('../middlewares/authentication');

const router = express.Router();

router.post('/run',  [authMiddleware], valeMethodController.run);
router.get('/thresholds',  [authMiddleware], valeMethodController.getThresholds);

module.exports = router;
