const express = require('express');
const heartbeatController = require('../controllers/heartbeat.controller');

const router = express.Router();

router.post('/', heartbeatController.createHeartbeat);

module.exports = router;
