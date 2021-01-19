const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authentication');

const router = express.Router();

router.post('/register', userController.register);
router.post('/authenticate', userController.authenticate);
router.get('/list',  [authMiddleware], userController.list);
router.get('/get/:userId',  [authMiddleware], userController.get);
router.delete('/remove/:userId',  [authMiddleware], userController.remove);

module.exports = router;
