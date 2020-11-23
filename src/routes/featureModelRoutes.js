const express = require('express');
const featureModelController = require('../controllers/featureModelController');
const authMiddleware = require('../middlewares/authentication');

const router = express.Router();

router.post('/create', [authMiddleware], featureModelController.create);
router.get('/list', [authMiddleware], featureModelController.list);
router.get('/get/:featureModelId', [authMiddleware], featureModelController.get);
router.get('/get-by-user', [authMiddleware], featureModelController.listByUser);
router.put('/update/:featureModelId', [authMiddleware], featureModelController.update);
router.delete('/remove/:featureModelId', [authMiddleware], featureModelController.remove);

module.exports = router;
