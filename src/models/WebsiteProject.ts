import mongoose, { Schema, Document, Model } from "mongoose";
import { WebsiteProjectData } from "@/types/website";

export interface IWebsiteProjectDoc extends Omit<WebsiteProjectData, "_id">, Document {}

const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, required: true },
    config: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const AudioSettingsSchema = new Schema(
  {
    enabled: { type: Boolean, default: true },
    backgroundMusicUrl: { type: String, default: "" },
    title: { type: String, default: "" },
    artist: { type: String, default: "" },
    autoplay: { type: Boolean, default: false },
  },
  { _id: false }
);

const CustomDomainSchema = new Schema(
  {
    requested: { type: Boolean, default: false },
    domainName: { type: String, trim: true, lowercase: true },
    status: {
      type: String,
      enum: [
        "not_requested",
        "awaiting_payment",
        "awaiting_customer_registration",
        "awaiting_dns_configuration",
        "verification_pending",
        "connected",
        "failed",
      ],
      default: "not_requested",
      index: true,
    },
    dnsInstructions: {
      recordType: { type: String, default: "CNAME" },
      host: { type: String, default: "@" },
      target: { type: String, default: "cname.expertomemories.com" },
    },
    verifiedAt: { type: Date },
    notes: { type: String },
  },
  { _id: false }
);

const WebsiteProjectSchema = new Schema<IWebsiteProjectDoc>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "CustomerUser", index: true },
    customerEmail: { type: String, lowercase: true, trim: true, index: true },
    customerPhone: { type: String, trim: true },
    occasionType: {
      type: String,
      enum: ["apology", "anniversary", "birthday", "love", "wedding"],
      default: "apology",
      index: true,
    },
    categoryId: { type: String, index: true },
    subcategoryId: { type: String, index: true },
    templateId: { type: String, index: true },
    recipientType: { type: String },
    weddingDetails: { type: Schema.Types.Mixed, default: {} },
    recipientName: { type: String, required: true },
    senderName: { type: String, required: true },
    partner1Name: { type: String },
    partner2Name: { type: String },
    anniversaryDate: { type: String },
    relationshipStartDate: { type: String },
    yearsTogether: { type: Number },
    birthdayDate: { type: String },
    age: { type: Number },
    theme: {
      type: String,
      default: "cotton-candy",
    },
    sections: [SectionSchema],
    audioSettings: { type: AudioSettingsSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ["draft", "published", "unpublished", "suspended"],
      default: "draft",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending_verification", "paid", "refunded"],
      default: "unpaid",
      index: true,
    },
    paidAt: { type: Date },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "manual_upi"],
    },
    isPasswordProtected: { type: Boolean, default: false },
    passwordHash: { type: String },
    passwordHint: { type: String },
    customDomain: {
      type: CustomDomainSchema,
      default: () => ({ requested: false, status: "not_requested" }),
    },
    hostingDurationMonths: { type: Number, default: 12 },
    hostingExpiresAt: { type: Date },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const WebsiteProject: Model<IWebsiteProjectDoc> =
  mongoose.models.WebsiteProject ||
  mongoose.model<IWebsiteProjectDoc>("WebsiteProject", WebsiteProjectSchema);
