const mongoose = require("mongoose");

const dessertSchema = new mongoose.Schema(
    {
        id: String,

        name: String,

        image: String,

        ingredients: [String],

        instructions: String,

        video: String,

        youtube: String,

        status: {
            type: String,
            enum: ["wishlist", "tried"],
            default: "wishlist",
        },

        rating: Number,

        review: String,

        dateTried: Date,

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Dessert", dessertSchema);