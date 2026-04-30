import { z } from 'zod';

export const createStudentSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  rollNumber: z.string().min(1).max(50),
  email: z.string().email().max(200).optional(),
  program: z.string().min(1).max(200),
  year: z.number().int().min(1).max(10),
  status: z.enum(['active', 'inactive']).optional()
});

export const updateStudentSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  rollNumber: z.string().min(1).max(50).optional(),
  email: z.string().email().max(200).optional(),
  program: z.string().min(1).max(200).optional(),
  year: z.number().int().min(1).max(10).optional(),
  status: z.enum(['active', 'inactive']).optional()
});
