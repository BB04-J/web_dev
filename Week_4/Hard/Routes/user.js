const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
JWT_SECRET = 'AaBbCcDd1234';
const { User, Todo } = require("../database");
// User Routes
router.post('/signup',(req, res) => {
    // Implement user signup logic
    const { username, email, password } = req.body;
    const userexists = await User.findOne({ email });
    if (userexists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ username, email, password });
    res.status(201).json(user);
    res.json({ message: 'User signed up successfully' });
});

router.post('/login',userMiddleware, (req, res) => {
     // Implement user login logic
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = jwt.sign({ userId: user._id },JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

});

router.get('/todos', userMiddleware, (req, res) => {
    // Implement logic for getting todos for a user
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
});

router.post('/logout', userMiddleware, (req, res) => {
    // Implement logout logic
    res.json({ message: 'User logged out successfully' });

});

module.exports = router