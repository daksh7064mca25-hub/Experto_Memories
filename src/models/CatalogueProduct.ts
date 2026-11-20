import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICatalogueProductDoc extends Document {
  productId: string;
  slug: string;
  title: string;
  subtitle: string;
  occasionType: "apology" | "anniversary" | "birthday" | "love";
  price: number;
  originalPrice?: number;
  badge?: string;
  isActive: boolean;
  description: string;
  features: string[];
  demoUrl: string;
  updatedAt: Date;
}

const CatalogueProductSchema = new Schema<ICatalogueProductDoc>(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    occasionType: {
      type: String,
      required: true,
      enum: ["apology", "anniversary", "birthday", "love"],
    },
    price: {
      type: Number,
      required: true,
      default: 999,
    },
    originalPrice: {
      type: Number,
      default: 1999,
    },
    badge: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    demoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const CatalogueProduct: Model<ICatalogueProductDoc> =
  mongoose.models.CatalogueProduct ||
  mongoose.model<ICatalogueProductDoc>("CatalogueProduct", CatalogueProductSchema);
