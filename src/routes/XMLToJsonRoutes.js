'use strict';

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication');

const XMLToJsonController = require('../controllers/XMLToJsonController');

router.post('/xml-to-json', [authMiddleware], XMLToJsonController.post);

module.exports = router;
