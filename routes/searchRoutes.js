/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Natural language search for surveys
 */

/**
 * @swagger
 * /search:
 *   post:
 *     summary: Search for surveys using natural language
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 example: "marketing"
 *     responses:
 *       200:
 *         description: Matching surveys returned
 *       400:
 *         description: Query is missing or invalid
 *       401:
 *         description: Unauthorized
 */

const express = require('express');
const router = express.Router();
const { search } = require('../controllers/searchController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, search);

module.exports = router;
