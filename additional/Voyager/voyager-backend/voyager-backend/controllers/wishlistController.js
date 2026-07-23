import Wishlist from "../models/Wishlist.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// @route GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, count: items.length, data: items });
});

// @route POST /api/wishlist
export const addWishlistItem = asyncHandler(async (req, res) => {
  const item = await Wishlist.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, data: item });
});

// @route DELETE /api/wishlist/:id
export const deleteWishlistItem = asyncHandler(async (req, res) => {
  const item = await Wishlist.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!item) throw new ApiError(404, "Wishlist item not found");
  await item.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
