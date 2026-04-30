import mongoose, { InferSchemaType } from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 100 },
    lastName: { type: String, required: true, trim: true, maxlength: 100 },
    rollNumber: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
    email: { type: String, required: false, unique: true, sparse: true, trim: true, maxlength: 200 },
    program: { type: String, required: true, trim: true, maxlength: 200 },
    year: { type: Number, required: true, min: 1, max: 10 },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

studentSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export type StudentDocument = InferSchemaType<typeof studentSchema>;

export const StudentModel = mongoose.models.Student ?? mongoose.model('Student', studentSchema);
