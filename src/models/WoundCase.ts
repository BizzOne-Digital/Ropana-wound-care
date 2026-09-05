import mongoose, { Schema, model, models, type Model } from "mongoose";

/**
 * A before / after wound care result.
 *
 * These are clinical photographs of real patients, so two fields exist purely
 * as safeguards and are enforced by the route handlers, not just the UI:
 *
 *   consent   - the practice holds written patient permission to publish.
 *               A case cannot be published while this is false.
 *   sensitive - the imagery is graphic enough to hold behind a click-to-reveal
 *               on the public site. Defaults to true; opting out is deliberate.
 */
export interface IWoundCase {
  _id: mongoose.Types.ObjectId;
  title: string;
  summary: string;
  timeframe: string;
  beforeImage: string;
  afterImage: string;
  consent: boolean;
  sensitive: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const WoundCaseSchema = new Schema<IWoundCase>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    summary: { type: String, default: "", trim: true, maxlength: 600 },
    // Free text rather than a number: "8 weeks", "3 months", "6 visits".
    timeframe: { type: String, default: "", trim: true, maxlength: 60 },
    // Managed upload URLs (/api/uploads/results/...).
    beforeImage: { type: String, required: true },
    afterImage: { type: String, required: true },
    consent: { type: Boolean, default: false },
    sensitive: { type: Boolean, default: true },
    // Unpublished by default so nothing reaches the public site by accident.
    published: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

WoundCaseSchema.index({ published: 1, order: 1, createdAt: -1 });

export const WoundCase: Model<IWoundCase> =
  (models.WoundCase as Model<IWoundCase>) ??
  model<IWoundCase>("WoundCase", WoundCaseSchema);
