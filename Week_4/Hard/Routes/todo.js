const { Router } = require("express");
const adminMiddleware = require("../middleware/user");
const router = Router();

// todo Routes
router.post('/', async (req, res) => {
    // Implement todo creation logic
    const todo = await Todo.create({
        title: req.body.title,
        completed: req.body.completed || false,
        userId: req.body.userId
    });
    res.status(201).json(todo);
});

router.put('/', userMiddleware, async (req, res) => {
    // Implement update todo  logic
    const { id, title, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(id, { title, completed },
         { new: true });
    res.json(todo);
});

router.delete('/', userMiddleware, async (req, res) => {
    // Implement delete todo logic
    const { id } = req.body;
    await Todo.findByIdAndDelete(id);
    res.status(204).send();
    res.json({ message: 'Todo deleted successfully' });
});

router.delete('/:id', userMiddleware, async (req, res) => {
    // Implement delete todo by id logic
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.status(204).send();
    res.json({ message: 'Todo deleted successfully' });
});


router.get('/', userMiddleware, async (req, res) => {
    // Implement fetching all todo logic
    const todos = await Todo.find({ userId: req.user._id });
    res.json(todos);
});

router.get('/:id', userMiddleware, async (req, res) => {
    // Implement fetching todo by id logic
    const { id } = req.params;
    const todo = await Todo.findById(id);
    res.json(todo);
});

module.exports = router;