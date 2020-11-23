const express = require("express");
const qualityMeasureController = require("../controllers/qualityMeasureController");
const qualityMeasuresExportController = require("../controllers/qualityMeasuresExportController");
const authMiddleware = require('../middlewares/authentication');

const router = express.Router();

router.get("/list", [authMiddleware], qualityMeasureController.list);
router.get("/get/:qualityMeasureId", [authMiddleware], qualityMeasureController.get);
router.post("/apply", [authMiddleware], qualityMeasureController.apply);
router.post("/export-to-pdf", [authMiddleware], qualityMeasuresExportController.exportToPDF);
router.post("/export-to-csv", [authMiddleware], qualityMeasuresExportController.exportToCSV);

module.exports = router;
