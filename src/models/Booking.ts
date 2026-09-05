import mongoose, { Schema, model, models, type Model } from "mongoose";

export type BookingStatus =
  | "pending"
  | "contacted"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface IBooking {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  preferredDate: string; // ISO date (YYYY-MM-DD), stored as typed by the patient
  preferredTime: string;
  service: string;
  message: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true, maxlength: 25 },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    service: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, default: "", trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["pending", "contacted", "confirmed", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ preferredDate: 1 });

export const Booking: Model<IBooking> =
  (models.Booking as Model<IBooking>) ??
  model<IBooking>("Booking", BookingSchema);
