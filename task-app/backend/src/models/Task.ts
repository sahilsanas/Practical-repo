import mongoose, { InferSchemaType } from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: false, default: '' },
    completed: { type: Boolean, required: true, default: false },
    dueDate: { type: Date, required: false }
  },
  { timestamps: true }
);

taskSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export type TaskDocument = InferSchemaType<typeof taskSchema>;

export const TaskModel = mongoose.models.Task ?? mongoose.model('Task', taskSchema);
