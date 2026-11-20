import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomerUserDoc extends Document {
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  isSuspended?: boolean;
  suspendedAt?: Date;
  suspendedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerUserSchema = new Schema<ICustomerUserDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
      index: true,
    },
    suspendedAt: {
      type: Date,
    },
    suspendedReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CustomerUser: Model<ICustomerUserDoc> =
  mongoose.models.CustomerUser ||
  mongoose.model<ICustomerUserDoc>("CustomerUser", CustomerUserSchema);
