import mongoose, { InferSchemaType } from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: false, trim: true, maxlength: 200 },
      email: { type: String, required: false, trim: true, maxlength: 200 }
    },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ['created'], default: 'created' }
  },
  { timestamps: true }
);

orderSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export type OrderDocument = InferSchemaType<typeof orderSchema>;

export const OrderModel = mongoose.models.Order ?? mongoose.model('Order', orderSchema);
