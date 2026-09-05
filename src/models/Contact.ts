import mongoose, { Schema, model, models, type Model } from "mongoose";

export type ContactStatus = "new" | "contacted" | "resolved";

export interface IContact {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true, maxlength: 25 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["new", "contacted", "resolved"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

// Admin list view is always "newest first, optionally filtered by status".
ContactSchema.index({ status: 1, createdAt: -1 });

export const Contact: Model<IContact> =
  (models.Contact as Model<IContact>) ??
  model<IContact>("Contact", ContactSchema);
