import mongoose, { Schema, Document, Model } from "mongoose";
import { ReviewCategory } from "@/types/review";

export const REVIEW_CATEGORIES: ReviewCategory[] = [
  "Love & Relationship",
  "Wedding Invitations",
  "Birthday Gifts",
  "Anniversary Keepsakes",
  "Personalized Memories",
];

export interface ICustomerReviewDoc extends Document {
  customerName: string;
  avatarInitials: string;
  category: ReviewCategory;
  rating: number;
  reviewText: string;
  consentForDisplay: boolean;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  moderatedAt?: Date;
  moderatedBy?: string;
  moderationNote?: string;
  verifiedOrderId?: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerReviewSchema = new Schema<ICustomerReviewDoc>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    avatarInitials: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: REVIEW_CATEGORIES,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer between 1 and 5",
      },
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    consentForDisplay: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    moderatedAt: {
      type: Date,
    },
    moderatedBy: {
      type: String,
      trim: true,
    },
    moderationNote: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    verifiedOrderId: {
      type: String,
      trim: true,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// High-performance compound indexes for public approved reviews and admin status queries
CustomerReviewSchema.index({ status: 1, submittedAt: -1 });
CustomerReviewSchema.index({ category: 1, status: 1 });

// Helper to compute avatar initials reliably
export function computeAvatarInitials(name: string): string {
  if (!name) return "EM";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "EM";
}

if (mongoose.models.CustomerReview) {
  delete (mongoose.models as any).CustomerReview;
}

export const CustomerReview: Model<ICustomerReviewDoc> =
  mongoose.model<ICustomerReviewDoc>("CustomerReview", CustomerReviewSchema);
