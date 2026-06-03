const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('Mongo_URL');

// Define schemas

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: { type: String, required: true },
    email: { type: String, required: true , unique: true },
    password: { type: String, required: true }
});

const TodoSchema = new mongoose.Schema({
    // Schema definition here
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const User = mongoose.model('User', UserSchema);
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = {
    User,
    Todo
}