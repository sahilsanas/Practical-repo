import { Router } from 'express';
import { StudentModel } from '../models/Student.js';
import { createStudentSchema, updateStudentSchema } from '../validation/students.js';

export const studentsRouter = Router();

studentsRouter.get('/', async (_req, res, next) => {
  try {
    const students = await StudentModel.find({}).sort({ createdAt: -1 });
    res.json({ students });
  } catch (err) {
    next(err);
  }
});

studentsRouter.get('/:id', async (req, res, next) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ student });
  } catch (err) {
    next(err);
  }
});

studentsRouter.post('/', async (req, res, next) => {
  try {
    const parsed = createStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues });
    }

    const created = await StudentModel.create(parsed.data);
    res.status(201).json({ student: created.toJSON() });
  } catch (err: any) {
    // Mongo duplicate key
    if (err?.code === 11000) {
      const key = err?.keyPattern ? Object.keys(err.keyPattern)[0] : undefined;
      const message = key === 'rollNumber' ? 'Roll number already exists' : key === 'email' ? 'Email already exists' : 'Duplicate key';
      return res.status(409).json({ message });
    }
    next(err);
  }
});

studentsRouter.put('/:id', async (req, res, next) => {
  try {
    const parsed = updateStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues });
    }

    const updated = await StudentModel.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: 'Student not found' });

    res.json({ student: updated.toJSON() });
  } catch (err: any) {
    if (err?.code === 11000) {
      const key = err?.keyPattern ? Object.keys(err.keyPattern)[0] : undefined;
      const message = key === 'rollNumber' ? 'Roll number already exists' : key === 'email' ? 'Email already exists' : 'Duplicate key';
      return res.status(409).json({ message });
    }
    next(err);
  }
});

studentsRouter.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await StudentModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
