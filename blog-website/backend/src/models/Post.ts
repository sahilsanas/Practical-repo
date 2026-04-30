import mongoose, { InferSchemaType } from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

postSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export type PostDocument = InferSchemaType<typeof postSchema>;

export const PostModel = mongoose.models.Post ?? mongoose.model('Post', postSchema);
