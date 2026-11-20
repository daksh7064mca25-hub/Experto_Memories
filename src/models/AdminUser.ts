import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminUserDoc extends Document {
  email: string;
  passwordHash: string;
  role: "admin";
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" },
    name: { type: String, default: "Studio Admin" },
  },
  {
    timestamps: true,
  }
);

export const AdminUser: Model<IAdminUserDoc> =
  mongoose.models.AdminUser || mongoose.model<IAdminUserDoc>("AdminUser", AdminUserSchema);

