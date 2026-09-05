import mongoose, { Schema, model, models, type Model } from "mongoose";

export interface ITestimonial {
  _id: mongoose.Types.ObjectId;
  name: string;
  content: string;
  rating: number | null;
  location: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    rating: { type: Number, min: 1, max: 5, default: null },
    location: { type: String, default: "", trim: true, maxlength: 80 },
    // Unpublished by default so nothing reaches the public site by accident.
    published: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

TestimonialSchema.index({ published: 1, createdAt: -1 });

export const Testimonial: Model<ITestimonial> =
  (models.Testimonial as Model<ITestimonial>) ??
  model<ITestimonial>("Testimonial", TestimonialSchema);
