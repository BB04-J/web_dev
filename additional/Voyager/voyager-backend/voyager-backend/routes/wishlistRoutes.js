import { Router } from "express";
import protect from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  getWishlist,
  addWishlistItem,
  deleteWishlistItem,
} from "../controllers/wishlistController.js";
import { wishlistItemSchema } from "../validators/wishlistValidators.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getWishlist)
  .post(validate(wishlistItemSchema), addWishlistItem);

router.route("/:id").delete(deleteWishlistItem);

export default router;
