import mongoose, { Schema, Document, Model } from "mongoose";
import { OrderData } from "@/types/order";

export interface IOrderDoc extends Omit<OrderData, "_id">, Document {}

const OrderItemSchema = new Schema(
  {
    productSlug: { type: String, required: true },
    occasionType: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    selectedTheme: { type: String, required: true },
  },
  { _id: false }
);

const OrderCustomerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const RazorpayDetailsSchema = new Schema(
  {
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paidAt: { type: Date },
  },
  { _id: false }
);

const ManualUpiDetailsSchema = new Schema(
  {
    utrNumber: { type: String, trim: true },
    screenshotUrl: { type: String },
    submittedAt: { type: Date },
    verifiedAt: { type: Date },
    verifiedBy: { type: String },
    rejectionReason: { type: String },
    rejectedAt: { type: Date },
    rejectedBy: { type: String },
  },
  { _id: false }
);

const AuditTrailEntrySchema = new Schema(
  {
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    actor: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDoc>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    customer: {
      type: OrderCustomerSchema,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "manual_upi"],
      default: "manual_upi",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "payment_pending_verification", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    razorpayDetails: {
      type: RazorpayDetailsSchema,
      default: () => ({}),
    },
    manualUpiDetails: {
      type: ManualUpiDetailsSchema,
      default: () => ({}),
    },
    auditTrail: {
      type: [AuditTrailEntrySchema],
      default: [],
    },
    orderStatus: {
      type: String,
      enum: ["placed", "personalizing", "in_review", "completed", "cancelled"],
      default: "placed",
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "CustomerUser",
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "WebsiteProject",
      index: true,
    },
    packageDetails: {
      type: Schema.Types.Mixed,
      default: () => ({}),
    },
    personalization: {
      type: Schema.Types.Mixed,
      default: () => ({}),
    },
    accessToken: {
      type: String,
      required: true,
      index: true,
    },
    accessTokenHash: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrderDoc> =
  mongoose.models.Order || mongoose.model<IOrderDoc>("Order", OrderSchema);
