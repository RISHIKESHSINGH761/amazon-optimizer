const express = require('express');
const router = express.Router();
const controller = require('../controllers/optimizationController');

router.post('/optimize', controller.optimizeByAsin);
router.get('/history/:asin', controller.getHistoryByAsin);
router.get('/optimizations', controller.getAll);

module.exports = router;
