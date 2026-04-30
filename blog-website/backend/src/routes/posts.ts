import { Router } from 'express';
import { PostModel } from '../models/Post.js';
import { createPostSchema, updatePostSchema } from '../validation/posts.js';

export const postsRouter = Router();

postsRouter.get('/', async (req, res, next) => {
  try {
    const publishedParam = req.query.published;
    const published =
      publishedParam === undefined
        ? undefined
        : String(publishedParam).toLowerCase() === 'true';

    const filter = published === undefined ? {} : { published };
    const posts = await PostModel.find(filter).sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    next(err);
  }
});

postsRouter.get('/slug/:slug', async (req, res, next) => {
  try {
    const post = await PostModel.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

postsRouter.get('/:id', async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

postsRouter.post('/', async (req, res, next) => {
  try {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues });
    }

    const created = await PostModel.create(parsed.data);
    res.status(201).json({ post: created.toJSON() });
  } catch (err: any) {
    // Mongo duplicate key (slug)
    if (err?.code === 11000) return res.status(409).json({ message: 'Slug already exists' });
    next(err);
  }
});

postsRouter.put('/:id', async (req, res, next) => {
  try {
    const parsed = updatePostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues });
    }

    const updated = await PostModel.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: 'Post not found' });

    res.json({ post: updated.toJSON() });
  } catch (err: any) {
    if (err?.code === 11000) return res.status(409).json({ message: 'Slug already exists' });
    next(err);
  }
});

postsRouter.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await PostModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Post not found' });
    res.status(204).send();
  } catch (err: any) {
    next(err);
  }
});
