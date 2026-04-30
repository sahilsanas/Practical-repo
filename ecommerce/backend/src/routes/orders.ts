import { Router } from 'express';
import mongoose from 'mongoose';
import { OrderModel } from '../models/Order.js';
import { ProductModel } from '../models/Product.js';
import { createOrderSchema } from '../validation/orders.js';

export const ordersRouter = Router();

ordersRouter.get('/', async (_req, res, next) => {
  try {
    const orders = await OrderModel.find({}).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

ordersRouter.get('/:id', async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// Simulate a basic purchase (checkout)
ordersRouter.post('/', async (req, res, next) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid body', issues: parsed.error.issues });
    }

    const items = parsed.data.items;

    // Load products
    const productIds = items.map((i) => new mongoose.Types.ObjectId(i.productId));
    const products = await ProductModel.find({ _id: { $in: productIds } });

    const byId = new Map(products.map((p) => [String(p._id), p] as const));

    // Validate existence & stock
    for (const item of items) {
      const p = byId.get(item.productId);
      if (!p) return res.status(400).json({ message: `Invalid productId: ${item.productId}` });
      if (p.stock < item.quantity) {
        return res.status(409).json({ message: `Insufficient stock for ${p.name} (available: ${p.stock})` });
      }
    }

    // Decrement stock (simple approach; adequate for basic simulation)
    for (const item of items) {
      const p = byId.get(item.productId)!;
      p.stock -= item.quantity;
      await p.save();
    }

    const orderItems = items.map((item) => {
      const p = byId.get(item.productId)!;
      const unitPrice = p.price;
      const lineTotal = unitPrice * item.quantity;
      return {
        productId: p._id,
        name: p.name,
        sku: p.sku,
        unitPrice,
        quantity: item.quantity,
        lineTotal
      };
    });

    const total = orderItems.reduce((sum, i) => sum + i.lineTotal, 0);

    const created = await OrderModel.create({
      customer: parsed.data.customer,
      items: orderItems,
      total,
      status: 'created'
    });

    res.status(201).json({ order: created.toJSON() });
  } catch (err) {
    next(err);
  }
});
