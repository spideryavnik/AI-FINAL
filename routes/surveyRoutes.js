/**
 * @swagger
 * tags:
 *   name: Surveys
 *   description: Survey creation, validation, and summarization
 */

/**
 * @swagger
 * /surveys:
 *   post:
 *     summary: Create a new survey
 *     tags: [Surveys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - area
 *               - question
 *               - expiryDate
 *               - guidelines
 *             properties:
 *               area:
 *                 type: string
 *               question:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               guidelines:
 *                 type: string
 *               permittedDomains:
 *                 type: array
 *                 items:
 *                   type: string
 *               permittedResponses:
 *                 type: array
 *                 items:
 *                   type: string
 *               summaryInstructions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Survey created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /surveys/{id}/check-responses:
 *   get:
 *     summary: Validate survey responses using AI
 *     tags: [Surveys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Survey ID
 *     responses:
 *       200:
 *         description: List of invalid responses
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only the creator can validate responses
 */

/**
 * @swagger
 * /surveys/{id}/summary:
 *   post:
 *     summary: Generate AI-based summary of survey responses
 *     tags: [Surveys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Survey ID
 *     responses:
 *       200:
 *         description: Summary generated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only the creator can generate the summary
 */

const express = require('express');
const router = express.Router();

const { createSurvey, checkResponses, generateSummary } = require('../controllers/surveyController');
const authenticate = require('../middlewares/authMiddleware');

// Create a new survey
router.post('/', authenticate, createSurvey);

// Validate responses in a survey using AI
router.get('/:id/check-responses', authenticate, checkResponses);

// Generate AI summary for survey responses
router.post('/:id/summary', authenticate, generateSummary);

module.exports = router;
