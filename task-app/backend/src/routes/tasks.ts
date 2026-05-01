import { Router } from 'express';
import mongoose from 'mongoose';
import { TaskModel } from '../models/Task.js';
import { createTaskSchema, updateTaskSchema } from '../validation/tasks.js';

export const tasksRouter = Router();

tasksRouter.get('/', async (_req, res, next) => {
  try {
    const tasks = await TaskModel.find({}).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
});

tasksRouter.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await TaskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    next(err);
  }
});

tasksRouter.post('/', async (req, res, next) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues });
    }

    const created = await TaskModel.create(parsed.data);
    res.status(201).json({ task: created.toJSON() });
  } catch (err) {
    next(err);
  }
});

tasksRouter.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues });
    }

    const updated = await TaskModel.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: 'Task not found' });

    res.json({ task: updated.toJSON() });
  } catch (err) {
    next(err);
  }
});

tasksRouter.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const deleted = await TaskModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
