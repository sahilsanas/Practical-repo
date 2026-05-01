import { z } from 'zod';

const email = z.string().email().max(320);

export const createRegistrationSchema = z.object({
  fullName: z.string().min(1).max(200),
  email,
  phone: z.string().max(30).optional(),
  organization: z.string().max(200).optional()
});
