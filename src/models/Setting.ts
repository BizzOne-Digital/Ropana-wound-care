import mongoose, { Schema, model, models, type Model } from "mongoose";

/**
 * Key/value store for site imagery and copy the admin can swap without a
 * deploy: the logo, hero photo and practitioner portrait.
 */
export interface ISetting {
  _id: mongoose.Types.ObjectId;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    // Managed upload URL (/api/uploads/...) or an empty string.
    value: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Setting: Model<ISetting> =
  (models.Setting as Model<ISetting>) ??
  model<ISetting>("Setting", SettingSchema);

export const SETTING_KEYS = {
  logo: "logo",
  heroImage: "heroImage",
  aboutImage: "aboutImage",
  mobileCareImage: "mobileCareImage",
} as const;
