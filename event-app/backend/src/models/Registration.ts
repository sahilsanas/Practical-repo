import mongoose, { InferSchemaType } from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    phone: { type: String, required: false, trim: true, maxlength: 30 },
    organization: { type: String, required: false, trim: true, maxlength: 200 }
  },
  { timestamps: true }
);

registrationSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export type RegistrationDocument = InferSchemaType<typeof registrationSchema>;

export const RegistrationModel =
  mongoose.models.Registration ?? mongoose.model('Registration', registrationSchema);
