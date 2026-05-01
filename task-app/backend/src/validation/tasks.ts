import { z } from 'zod';

const zDateFromString = z.preprocess((val) => {
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '') return undefined;
    return new Date(trimmed);
  }
  return val;
}, z.date());

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  completed: z.boolean().optional(),
  dueDate: zDateFromString.optional()
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  completed: z.boolean().optional(),
  dueDate: zDateFromString.optional()
});
