import { z } from "zod";

export const donationCreateSchema = z
  .object({
    title: z.string().trim().min(3).max(120),
    foodCategory: z.enum([
      "prepared_meal",
      "produce",
      "bakery",
      "packaged_food",
      "beverage",
      "other",
    ]),
    estimatedServings: z.coerce.number().int().positive().max(100_000),
    preparedAt: z.coerce.date(),
    pickupBy: z.coerce.date(),
    pickupAddress: z.string().trim().min(10).max(500),
    handlingNotes: z.string().trim().max(1_000).optional(),
  })
  .superRefine(({ preparedAt, pickupBy }, context) => {
    if (pickupBy <= preparedAt) {
      context.addIssue({
        code: "custom",
        path: ["pickupBy"],
        message: "Pickup deadline must be after the preparation time.",
      });
    }
  });

export type DonationCreateInput = z.infer<typeof donationCreateSchema>;
