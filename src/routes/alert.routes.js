const express = require('express');
const alertController = require('../controllers/alert.controller');

const router = express.Router();

router.get('/', alertController.listAlerts);
router.post('/test-email', alertController.sendTestEmail);

module.exports = router;
