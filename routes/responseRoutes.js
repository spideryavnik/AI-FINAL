const express = require('express');
const router = express.Router();
const { submitResponse } = require('../controllers/responseController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, submitResponse);

module.exports = router;
