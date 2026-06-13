const express = require('express');
const Todorouter = express.Router();
const { Todo } = require('../db');
const userMiddleware = require('../middleware/user');

Todorouter.post('/', userMiddleware, async (req, res) => {
    const { title, completed, isImportant, day, date, timeSlot } = req.body;
    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }
    if (!day) {
        return res.status(400).json({
            message: "Scheduled day is required"
        });
    }
    try {
        const todo = await Todo.create({
            title,
            completed: completed || false,
            isImportant: isImportant || false,
            day: day || '',
            date: date || '',
            timeSlot: timeSlot || '',
            userId: req.userId
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

Todorouter.put('/', userMiddleware, async (req, res) => {
    const { id, title, completed, isImportant, day, date, timeSlot } = req.body;
    try {
        const todo = await Todo.findByIdAndUpdate(
            id,
            { title, completed, isImportant, day, date, timeSlot },
            { new: true }
        );
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Todorouter.delete('/', userMiddleware, async (req, res) => {
//     const { id } = req.body; 
//     try {
//         await Todo.findByIdAndDelete(id);
//         res.status(204).send();
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });
Todorouter.delete('/:id', userMiddleware, async (req, res) => {
    const { id } = req.params;  
    try {
        await Todo.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }   
});

Todorouter.get('/', userMiddleware, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.userId });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});       

module.exports = Todorouter;