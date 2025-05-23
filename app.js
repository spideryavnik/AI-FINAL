const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('./utils/logger');

const authRoutes = require('./routes/authRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const responseRoutes = require('./routes/responseRoutes');
const searchRoutes = require('./routes/searchRoutes');
const setupSwagger = require('./swagger'); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use('/auth', authRoutes);
app.use('/surveys', surveyRoutes);
app.use('/responses', responseRoutes);
app.use('/search', searchRoutes);

setupSwagger(app); 

// 404 handler 
app.use((req, res) => {
  res.status(404).json({ error: { code: 404, message: "Route not found" } });
});

// Global error handler
app.use((err, req, res, next) => {
  winston.error(err.message, err);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: {
      code: status,
      message: err.message || "Internal server error"
    }
  });
});

module.exports = app;
