const express = require('express');
const deviceController = require('../controllers/device.controller');

const router = express.Router();

router.post('/', deviceController.storeDevice);
router.get('/', deviceController.listDevices);
router.get('/:deviceId', deviceController.getDevice);

module.exports = router;
