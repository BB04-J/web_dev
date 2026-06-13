const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/taskify")
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
});
 const todoSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    isImportant:{
        type: Boolean,
        default: false
    },
    day:{
        type: String,
        default: ''
    },
    date:{
        type: String,
        default: ''
    },
    timeSlot:{
        type: String,
        default: ''
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
 });

 const User = mongoose.model("User",userSchema);
 const Todo = mongoose.model("Todo",todoSchema);

    module.exports = {
        User,
        Todo
    };
    