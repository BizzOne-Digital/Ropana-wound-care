import mongoose, { Schema, model, models, type Model } from "mongoose";

export interface IPayment {
  _id: mongoose.Types.ObjectId;
  /** Stripe Checkout Session id. Unique, so a replayed webhook is a no-op. */
  stripeId: string;
  /** Amount in cents, exactly as Stripe reports it. */
  amount: number;
  currency: string;
  email: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    stripeId: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, lowercase: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    reference: { type: String, default: "", trim: true, maxlength: 60 },
  },
  { timestamps: true }
);

PaymentSchema.index({ createdAt: -1 });

export const Payment: Model<IPayment> =
  (models.Payment as Model<IPayment>) ??
  model<IPayment>("Payment", PaymentSchema);
