const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a task
router.post("/", async (req, res) => {
  console.log(req.body); // Log the incoming request body
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  const task = new Task({ title });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  const { title, completed } = req.body; // Destructure title and completed from req.body
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true, runValidators: true } // Ensure to run validators to enforce schema rules
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
