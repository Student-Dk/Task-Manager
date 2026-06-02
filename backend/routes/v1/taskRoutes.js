const express = require('express');
const { body } = require('express-validator');
const taskController = require('../../controllers/taskController');
const auth = require('../../middleware/auth');
const restrictTo = require('../../middleware/role');

const router = express.Router();

const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2 })
    .withMessage('Title must be at least 2 characters'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done')
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 2 })
    .withMessage('Title must be at least 2 characters'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done')
];

router.use(auth);

router
  .route('/')
  .get(taskController.getTasks)
  .post(createTaskValidation, taskController.createTask);

router
  .route('/:id')
  .put(updateTaskValidation, taskController.updateTask)
  .delete(restrictTo('admin'), taskController.deleteTask);

module.exports = router;
