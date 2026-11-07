const mongoose = require("mongoose");
const Task = require("../models/Task");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.createTask = catchAsync(async (req, res, next) => {
  const { title, description = "" } = req.body || {};

  if (typeof title !== "string" || !title.trim() || title.trim().length > 200) {
    return next(new AppError("Title is required and must be 200 characters or fewer.", 400));
  }
  if (typeof description !== "string" || description.length > 2000) {
    return next(new AppError("Description must be 2000 characters or fewer.", 400));
  }

  const task = await Task.create({
    title: title.trim(),
    description: description.trim(),
    owner: req.user.id,
  });

  res.status(201).json({ task });
});

exports.getTasks = catchAsync(async (req, res) => {
  const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json({ tasks });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new AppError("The supplied task identifier is invalid.", 400));
  }

  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    owner: req.user.id,
  });

  if (!task) {
    return next(new AppError("Task not found.", 404));
  }

  res.status(200).json({ message: "Task deleted." });
});
