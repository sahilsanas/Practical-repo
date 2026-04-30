import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  sku: z.string().min(1).max(80),
  description: z.string().max(5000).optional(),
  price: z.number().min(0),
  stock: z.number().int().min(0),
  imageUrl: z.string().url().max(500).optional()
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  sku: z.string().min(1).max(80).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  imageUrl: z.string().url().max(500).optional()
});
