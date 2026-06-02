const express = require('express');
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy'
  });
});

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;
