"use strict";

const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authentication');

const JsonToXMLController = require("../controllers/JsonToXMLController");

router.post("/export-to-xml",  [authMiddleware], JsonToXMLController.post);

module.exports = router;
