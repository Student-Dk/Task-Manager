const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Task = require('../models/Task');

const sendValidationErrors = (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return false;
  }

  res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg
    }))
  });

  return true;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const userOwnsTask = (task, user) => task.createdBy.toString() === user._id.toString();

exports.getTasks = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const tasks = await Task.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    return next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    if (sendValidationErrors(req, res)) {
      return;
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    if (sendValidationErrors(req, res)) {
      return;
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task id'
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (req.user.role !== 'admin' && !userOwnsTask(task, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this task'
      });
    }

    const allowedUpdates = ['title', 'description', 'status'];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task id'
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
};
