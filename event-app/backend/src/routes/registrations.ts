import { Router } from 'express';
import { RegistrationModel } from '../models/Registration.js';
import { createRegistrationSchema } from '../validation/registrations.js';

export const registrationsRouter = Router();

// Register for an event (store details)
registrationsRouter.post('/', async (req, res, next) => {
  try {
    const parsed = createRegistrationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues });
    }

    const created = await RegistrationModel.create(parsed.data);
    res.status(201).json({ registration: created.toJSON() });
  } catch (err) {
    next(err);
  }
});
