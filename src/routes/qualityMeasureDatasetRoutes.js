const express = require('express');
const qualityMeasureDatasetController = require('../controllers/qualityMeasureDatasetController');
const authMiddleware = require('../middlewares/authentication');

const router = express.Router();

router.post('/create',  [authMiddleware], qualityMeasureDatasetController.create);
router.get('/list',  [authMiddleware], qualityMeasureDatasetController.list);
router.get('/get/:qualityMeasureDatasetId',  [authMiddleware], qualityMeasureDatasetController.get);
router.put('/update/:qualityMeasureDatasetId',  [authMiddleware], qualityMeasureDatasetController.update);
router.delete('/remove/:qualityMeasureDatasetId',  [authMiddleware], qualityMeasureDatasetController.remove);

module.exports = router;
