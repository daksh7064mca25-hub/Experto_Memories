import { z } from "zod";

export const ALL_THEME_IDS = [
  // Apology Themes
  "cotton-candy",
  "lavender-dreams",
  "peachy-love",
  "midnight-hearts",
  // Anniversary Themes
  "pink-paradise",
  "golden-forever",
  "our-universe",
  "sunset-love",
  // Birthday Themes
  "golden-champagne",
  "blush-wonderland",
  "peachy-celebration",
  "midnight-sparkle",
  // Love & Romance Themes ("The Secret World of Us")
  "burgundy-velvet",
  "rose-blush",
  "midnight-starlight",
  "champagne-romance",
  // Wedding Themes
  "royal-crimson",
  "marigold-sindoor",
  "shahi-emerald",
  "golden-anand",
  "noor-emerald",
  "cathedral-rose",
  "minimal-linen",
  "velvet-onyx",
  "botanical-sage",
  "coastal-azure",
  "champagne-gold",
] as const;

export const CreateProjectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  occasionType: z.enum(["apology", "anniversary", "birthday", "love", "wedding"]).default("apology"),
  recipientName: z.string().min(1, "Recipient name is required"),
  senderName: z.string().min(1, "Sender name is required"),
  partner1Name: z.string().optional(),
  partner2Name: z.string().optional(),
  anniversaryDate: z.string().optional(),
  relationshipStartDate: z.string().optional(),
  yearsTogether: z.number().optional(),
  birthdayDate: z.string().optional(),
  age: z.number().optional(),
  categoryId: z.enum(["digital-gifts", "wedding-invitations", "birthday-celebrations", "future-celebrations"]).optional(),
  subcategoryId: z.string().optional(),
  templateId: z.string().optional(),
  recipientType: z.string().optional(),
  weddingDetails: z.record(z.string(), z.any()).optional(),
  orderId: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  customerId: z.string().optional(),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  theme: z.enum(ALL_THEME_IDS).default("cotton-candy"),
});

export const UpdateProjectSchema = z.object({
  title: z.string().optional(),
  occasionType: z.enum(["apology", "anniversary", "birthday", "love", "wedding"]).optional(),
  recipientName: z.string().optional(),
  senderName: z.string().optional(),
  partner1Name: z.string().optional(),
  partner2Name: z.string().optional(),
  anniversaryDate: z.string().optional(),
  relationshipStartDate: z.string().optional(),
  yearsTogether: z.number().optional(),
  birthdayDate: z.string().optional(),
  age: z.number().optional(),
  categoryId: z.enum(["digital-gifts", "wedding-invitations", "birthday-celebrations", "future-celebrations"]).optional(),
  subcategoryId: z.string().optional(),
  templateId: z.string().optional(),
  recipientType: z.string().optional(),
  weddingDetails: z.record(z.string(), z.any()).optional(),
  orderId: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  theme: z.enum(ALL_THEME_IDS).optional(),
  sections: z.array(z.any()).optional(),
  audioSettings: z.any().optional(),
  status: z.enum(["draft", "published", "unpublished", "suspended"]).optional(),
  isPasswordProtected: z.boolean().optional(),
  password: z.string().min(3).optional(),
  passwordHint: z.string().optional(),
  customDomain: z
    .object({
      requested: z.boolean().optional(),
      domainName: z.string().optional(),
    })
    .optional(),
});
