import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMediaAssetDoc extends Document {
  storageProvider: "r2" | "cloudinary" | "local";
  key?: string;
  originalName?: string;
  mimeType?: string;
  bucket?: string;
  publicId?: string;
  secureUrl: string;
  mediaType: "image" | "video" | "audio";
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  orderId?: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  associatedProject?: string;
  caption?: string;
  createdAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAssetDoc>(
  {
    storageProvider: { type: String, enum: ["r2", "cloudinary", "local"], default: "r2", index: true },
    key: { type: String, index: true },
    originalName: { type: String },
    mimeType: { type: String },
    bucket: { type: String },
    publicId: { type: String },
    secureUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video", "audio"], default: "image" },
    format: { type: String },
    bytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "WebsiteProject", index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "CustomerUser", index: true },
    associatedProject: { type: String, index: true },
    caption: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const MediaAsset: Model<IMediaAssetDoc> =
  mongoose.models.MediaAsset || mongoose.model<IMediaAssetDoc>("MediaAsset", MediaAssetSchema);

