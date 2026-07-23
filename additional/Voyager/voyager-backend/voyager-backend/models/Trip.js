import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    date: { type: Date },
    title: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, default: "" },
    time: { type: String, default: "" },
  },
  { _id: true }
);

const budgetItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["stay", "food", "transport", "activities", "shopping", "other"],
      default: "other",
    },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const packingItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    packed: { type: Boolean, default: false },
    category: { type: String, default: "general" },
  },
  { _id: true }
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    country: { type: String, trim: true, default: "" },
    coordinates: {
      lat: { type: Number },
      lon: { type: Number },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    coverImage: { type: String, default: "" },
    budgetLimit: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["planning", "upcoming", "ongoing", "completed"],
      default: "planning",
    },
    itinerary: [itineraryItemSchema],
    budgetItems: [budgetItemSchema],
    packingList: [packingItemSchema],
  },
  { timestamps: true }
);

tripSchema.virtual("totalSpent").get(function () {
  return this.budgetItems.reduce((sum, item) => sum + item.amount, 0);
});

tripSchema.set("toJSON", { virtuals: true });
tripSchema.set("toObject", { virtuals: true });

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
