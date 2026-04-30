import { Router } from 'express';
import { ProductModel } from '../models/Product.js';
import { createProductSchema, updateProductSchema } from '../validation/products.js';

export const productsRouter = Router();

// Browse products
productsRouter.get('/', async (_req, res, next) => {
  try {
    const products = await ProductModel.find({}).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    next(err);
  }
});

productsRouter.get('/:id', async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// Optional (useful for setup/testing): create/update products
productsRouter.post('/', async (req, res, next) => {
  try {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues });
    }

    const created = await ProductModel.create(parsed.data);
    res.status(201).json({ product: created.toJSON() });
  } catch (err: any) {
    if (err?.code === 11000) return res.status(409).json({ message: 'SKU already exists' });
    next(err);
  }
});

productsRouter.put('/:id', async (req, res, next) => {
  try {
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues });
    }

    const updated = await ProductModel.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: 'Product not found' });

    res.json({ product: updated.toJSON() });
  } catch (err: any) {
    if (err?.code === 11000) return res.status(409).json({ message: 'SKU already exists' });
    next(err);
  }
});
