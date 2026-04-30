import { z } from 'zod';

export const createOrderSchema = z.object({
  customer: z
    .object({
      name: z.string().min(1).max(200).optional(),
      email: z.string().email().max(200).optional()
    })
    .optional(),
  items: z
    .array(
      z.object({
        productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'productId must be a Mongo ObjectId'),
        quantity: z.number().int().min(1).max(999)
      })
    )
    .min(1)
});
