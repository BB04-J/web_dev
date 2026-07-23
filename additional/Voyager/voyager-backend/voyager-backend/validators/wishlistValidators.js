import { z } from "zod";

export const wishlistItemSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  country: z.string().trim().optional(),
  coordinates: z
    .object({
      lat: z.number().optional(),
      lon: z.number().optional(),
    })
    .optional(),
  notes: z.string().trim().optional(),
  image: z.string().trim().optional(),
});
