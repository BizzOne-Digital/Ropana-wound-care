import mongoose, { Schema, model, models, type Model } from "mongoose";
import { UPLOAD_FOLDERS, type UploadFolder } from "@/lib/uploads";

/**
 * Uploaded images are stored as binary in MongoDB rather than on disk, so they
 * survive redeploys on hosts with a read-only or ephemeral filesystem
 * (Vercel and equivalents). They are served back through
 * /api/uploads/[folder]/[filename].
 *
 * Upload size is capped at 8 MB by the route, which keeps every document well
 * inside MongoDB's 16 MB BSON document limit.
 */
export interface IStoredUpload {
  _id: mongoose.Types.ObjectId;
  folder: UploadFolder;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const StoredUploadSchema = new Schema<IStoredUpload>(
  {
    folder: {
      type: String,
      required: true,
      enum: UPLOAD_FOLDERS as unknown as string[],
    },
    filename: { type: String, required: true, trim: true, maxlength: 128 },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    // The payload is excluded by default so listings and deletes never pull
    // megabytes of binary they do not need. The serving route opts back in
    // with .select("+data").
    data: { type: Buffer, required: true, select: false },
  },
  { timestamps: true }
);

// One file per name per folder, and the lookup index for the serving route.
StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export const StoredUpload: Model<IStoredUpload> =
  (models.StoredUpload as Model<IStoredUpload>) ??
  model<IStoredUpload>("StoredUpload", StoredUploadSchema);
