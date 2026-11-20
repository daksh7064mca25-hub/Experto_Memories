import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminAuditLogDoc extends Document {
  actor: string;
  action: string;
  targetType: "order" | "customer" | "website" | "domain" | "pricing" | "catalogue" | "system";
  targetId?: string;
  targetIdentifier?: string;
  details?: Record<string, any>;
  notes?: string;
  createdAt: Date;
}

const AdminAuditLogSchema = new Schema<IAdminAuditLogDoc>(
  {
    actor: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    targetType: {
      type: String,
      required: true,
      enum: ["order", "customer", "website", "domain", "pricing", "catalogue", "system"],
      index: true,
    },
    targetId: {
      type: String,
      trim: true,
      index: true,
    },
    targetIdentifier: {
      type: String,
      trim: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Read-only / append-only audit trail
  }
);

export const AdminAuditLog: Model<IAdminAuditLogDoc> =
  mongoose.models.AdminAuditLog ||
  mongoose.model<IAdminAuditLogDoc>("AdminAuditLog", AdminAuditLogSchema);
