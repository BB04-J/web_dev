import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    country: { type: String, trim: true, default: "" },
    coordinates: {
      lat: { type: Number },
      lon: { type: Number },
    },
    notes: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

// Prevent the same destination being wishlisted twice by the same user
wishlistSchema.index({ user: 1, name: 1, country: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
