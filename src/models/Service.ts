import mongoose, { Schema, model, models, type Model } from "mongoose";

export interface IService {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  features: string[];
  image: string;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    description: { type: String, required: true, trim: true, maxlength: 8000 },
    features: { type: [String], default: [] },
    // Managed upload URL (/api/uploads/...) or an empty string.
    image: { type: String, default: "" },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ServiceSchema.index({ published: 1, order: 1 });

export const Service: Model<IService> =
  (models.Service as Model<IService>) ??
  model<IService>("Service", ServiceSchema);
