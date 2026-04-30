import mongoose, { InferSchemaType } from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    sku: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    description: { type: String, required: false, default: '' },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: false, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

productSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export type ProductDocument = InferSchemaType<typeof productSchema>;

export const ProductModel = mongoose.models.Product ?? mongoose.model('Product', productSchema);
