import mongoose, { Schema, Document, Model } from "mongoose";
import { ThemeId, WebsiteSectionData } from "@/types/website";

export interface IWebsiteTemplateDoc extends Document {
  name: string;
  description: string;
  previewImage?: string;
  theme: ThemeId;
  defaultSections: WebsiteSectionData[];
  category: string;
  createdAt: Date;
}

const WebsiteTemplateSchema = new Schema<IWebsiteTemplateDoc>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    previewImage: { type: String },
    theme: { type: String, default: "cotton-candy" },
    defaultSections: [Schema.Types.Mixed],
    category: { type: String, default: "apology" },
  },
  {
    timestamps: true,
  }
);

export const WebsiteTemplate: Model<IWebsiteTemplateDoc> =
  mongoose.models.WebsiteTemplate ||
  mongoose.model<IWebsiteTemplateDoc>("WebsiteTemplate", WebsiteTemplateSchema);

