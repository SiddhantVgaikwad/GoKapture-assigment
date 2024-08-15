const express = require('express');
const Task = require('../models/task');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required.');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send('Invalid token.');
        req.userId = decoded.id;
        next();
    });
};

router.use(verifyToken);

// Create Task
router.post('/tasks', async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            user: req.userId,
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create task' });
    }
});

// Get Tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Update Task
router.put('/tasks/:taskId', async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, user: req.userId },
            { ...req.body, updated_at: Date.now() },
            { new: true }
        );
        if (!task) return res.status(404).send('Task not found');
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task' });
    }
});

// Delete Task
router.delete('/tasks/:taskId', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.taskId, user: req.userId });
        if (!task) return res.status(404).send('Task not found');
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});


router.get('/tasks', async (req, res) => {
    const { status, priority, due_date } = req.query;
    const filter = { user: req.userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (due_date) filter.due_date = { $lte: new Date(due_date) };

    try {
        const tasks = await Task.find(filter);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});


router.get('/tasks', async (req, res) => {
    const { search } = req.query;
    const filter = { user: req.userId };

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    try {
        const tasks = await Task.find(filter);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});


module.exports = router;
