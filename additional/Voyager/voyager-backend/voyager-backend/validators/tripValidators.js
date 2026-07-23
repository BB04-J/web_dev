import { z } from "zod";

const coordinatesSchema = z
  .object({
    lat: z.number().optional(),
    lon: z.number().optional(),
  })
  .optional();

export const itineraryItemSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  day: z.number().int().min(1),
  date: z.coerce.date().optional(),
  title: z.string().trim().min(1, "Title is required"),
  notes: z.string().trim().optional(),
  time: z.string().trim().optional(),
});

export const budgetItemSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  label: z.string().trim().min(1, "Label is required"),
  category: z
    .enum(["stay", "food", "transport", "activities", "shopping", "other"])
    .optional(),
  amount: z.number().min(0, "Amount cannot be negative"),
});

export const packingItemSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  label: z.string().trim().min(1, "Label is required"),
  packed: z.boolean().optional(),
  category: z.string().trim().optional(),
});

export const createTripSchema = z
  .object({
    title: z.string().trim().min(2, "Title is required"),
    destination: z.string().trim().min(2, "Destination is required"),
    country: z.string().trim().optional(),
    coordinates: coordinatesSchema,
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    coverImage: z.string().trim().optional(),
    budgetLimit: z.number().min(0).optional(),
    currency: z.string().trim().optional(),
    status: z.enum(["planning", "upcoming", "ongoing", "completed"]).optional(),
    itinerary: z.array(itineraryItemSchema).optional(),
    budgetItems: z.array(budgetItemSchema).optional(),
    packingList: z.array(packingItemSchema).optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export const updateTripSchema = createTripSchema.innerType().partial();
