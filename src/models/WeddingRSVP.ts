import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWeddingRSVPDoc extends Document {
  projectId: mongoose.Types.ObjectId;
  projectSlug: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  attendanceStatus: "attending" | "declined" | "tentative";
  guestCount: number;
  attendingEvents: string[];
  dietaryNotes?: string;
  personalBlessing?: string;
  isApproved: boolean;
  ipHash?: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WeddingRSVPSchema = new Schema<IWeddingRSVPDoc>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "WebsiteProject",
      required: true,
      index: true,
    },
    projectSlug: {
      type: String,
      required: true,
      index: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
    },
    guestEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    guestPhone: {
      type: String,
      trim: true,
    },
    attendanceStatus: {
      type: String,
      enum: ["attending", "declined", "tentative"],
      default: "attending",
      index: true,
    },
    guestCount: {
      type: Number,
      default: 1,
      min: 1,
      max: 20,
    },
    attendingEvents: {
      type: [String],
      default: [],
    },
    dietaryNotes: {
      type: String,
      trim: true,
    },
    personalBlessing: {
      type: String,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    ipHash: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying project RSVPs by status and submission date
WeddingRSVPSchema.index({ projectSlug: 1, attendanceStatus: 1, createdAt: -1 });

export const WeddingRSVP: Model<IWeddingRSVPDoc> =
  mongoose.models.WeddingRSVP ||
  mongoose.model<IWeddingRSVPDoc>("WeddingRSVP", WeddingRSVPSchema);
