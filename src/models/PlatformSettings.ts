import mongoose, { Schema, Document, Model } from "mongoose";

export interface IManualUpiConfig {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  displayName: string;
  qrCodeUrl: string;
}

export interface IPlatformSettingsDoc extends Document {
  basePrice: number;
  customDomainPrice: number;
  currency: string;
  hostingDurationMonths: number;
  renewalPolicy: string;
  cnameTarget: string;
  paymentMethodsAllowed: "both" | "razorpay_only" | "upi_only";
  manualUpiConfig: IManualUpiConfig;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ManualUpiConfigSchema = new Schema<IManualUpiConfig>(
  {
    bankName: { type: String, default: "State Bank of India" },
    accountNumber: { type: String, default: "31310000000" },
    ifscCode: { type: String, default: "SBIN0001234" },
    upiId: { type: String, default: "dakshbabbar31@oksbi" },
    displayName: { type: String, default: "Experto Memories" },
    qrCodeUrl: { type: String, default: "/images/upi-qr.jpeg" },
  },
  { _id: false }
);

const PlatformSettingsSchema = new Schema<IPlatformSettingsDoc>(
  {
    basePrice: {
      type: Number,
      required: true,
      default: 999,
    },
    customDomainPrice: {
      type: Number,
      required: true,
      default: 1200,
    },
    currency: {
      type: String,
      default: "INR",
    },
    hostingDurationMonths: {
      type: Number,
      default: 12,
    },
    renewalPolicy: {
      type: String,
      default:
        "1 Year hosting included. Annual hosting renewal applies thereafter. Custom domain renewal after Year 1 is managed directly by you with your domain registrar.",
    },
    cnameTarget: {
      type: String,
      default: "cname.expertomemories.com",
    },
    paymentMethodsAllowed: {
      type: String,
      enum: ["both", "razorpay_only", "upi_only"],
      default: "both",
    },
    manualUpiConfig: {
      type: ManualUpiConfigSchema,
      default: () => ({
        bankName: "State Bank of India",
        accountNumber: "31310000000",
        ifscCode: "SBIN0001234",
        upiId: "dakshbabbar31@oksbi",
        displayName: "Experto Memories",
        qrCodeUrl: "/images/upi-qr.jpeg",
      }),
    },
    updatedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const PlatformSettings: Model<IPlatformSettingsDoc> =
  mongoose.models.PlatformSettings ||
  mongoose.model<IPlatformSettingsDoc>("PlatformSettings", PlatformSettingsSchema);

/**
 * Returns current platform settings or creates default singleton record if not found.
 */
export async function getPlatformSettings(): Promise<IPlatformSettingsDoc> {
  let settings = await PlatformSettings.findOne();
  if (!settings) {
    settings = await PlatformSettings.create({
      basePrice: 999,
      customDomainPrice: 1200,
      currency: "INR",
      hostingDurationMonths: 12,
      renewalPolicy:
        "1 Year hosting included. Annual hosting renewal applies thereafter. Custom domain renewal after Year 1 is managed directly by you with your domain registrar.",
      cnameTarget: "cname.expertomemories.com",
      paymentMethodsAllowed: "both",
      manualUpiConfig: {
        bankName: "State Bank of India",
        accountNumber: "31310000000",
        ifscCode: "SBIN0001234",
        upiId: "dakshbabbar31@oksbi",
        displayName: "Experto Memories",
        qrCodeUrl: "/images/upi-qr.jpeg",
      },
    });
  }
  return settings;
}
