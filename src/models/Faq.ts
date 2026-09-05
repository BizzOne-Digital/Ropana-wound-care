import mongoose, { Schema, model, models, type Model } from "mongoose";

export interface IFaq {
  _id: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true, trim: true, maxlength: 250 },
    answer: { type: String, required: true, trim: true, maxlength: 4000 },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

FaqSchema.index({ published: 1, order: 1 });

export const Faq: Model<IFaq> =
  (models.Faq as Model<IFaq>) ?? model<IFaq>("Faq", FaqSchema);
