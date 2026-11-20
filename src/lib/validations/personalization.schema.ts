import { z } from "zod";

export const MediaItemSchema = z.object({
  url: z.string().url("Valid media URL required"),
  key: z.string().optional(),
  caption: z.string().max(300, "Caption too long").optional(),
  type: z.enum(["image", "video", "audio"]).default("image"),
  bytes: z.number().nonnegative().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const PromiseItemSchema = z.object({
  title: z.string().min(1, "Promise title required").max(120),
  description: z.string().min(1, "Promise description required").max(500),
});

export const PersonalizationDraftSchema = z.object({
  recipientName: z.string().max(80).optional().default(""),
  senderName: z.string().max(80).optional().default(""),
  partner1Name: z.string().max(80).optional(),
  partner2Name: z.string().max(80).optional(),
  occasionDate: z.string().max(50).optional(),
  relationshipStartDate: z.string().max(50).optional(),
  yearsTogether: z.number().min(0).max(100).optional(),
  letter: z.string().max(10000).optional().default(""),
  notes: z.array(z.string().max(500)).optional().default([]),
  promises: z.array(PromiseItemSchema).optional().default([]),
  mediaItems: z.array(MediaItemSchema).optional().default([]),
  audioTrackUrl: z.string().url().optional().or(z.literal("")),
  customDetails: z.record(z.string(), z.any()).optional().default({}),
});

/**
 * Occasion-specific schema for final submission
 */
export const ApologySubmissionSchema = z.object({
  recipientName: z.string().min(2, "Recipient name must be at least 2 characters").max(80).trim(),
  senderName: z.string().min(2, "Sender name must be at least 2 characters").max(80).trim(),
  letter: z.string().min(20, "Please write at least a short heartfelt letter (20+ characters)").max(10000).trim(),
  notes: z.array(z.string().max(500)).optional().default([]),
  promises: z.array(PromiseItemSchema).optional().default([]),
  mediaItems: z.array(MediaItemSchema).min(1, "Please upload at least 1 memory photograph").default([]),
  audioTrackUrl: z.string().url().optional().or(z.literal("")),
});

export const AnniversarySubmissionSchema = z.object({
  recipientName: z.string().min(2, "Partner name must be at least 2 characters").max(80).trim(),
  senderName: z.string().min(2, "Your name must be at least 2 characters").max(80).trim(),
  partner1Name: z.string().max(80).optional(),
  partner2Name: z.string().max(80).optional(),
  occasionDate: z.string().min(3, "Anniversary date is required").max(50).trim(),
  relationshipStartDate: z.string().max(50).optional(),
  yearsTogether: z.number().min(0).max(100).optional(),
  letter: z.string().min(20, "Please write a heartfelt anniversary message").max(10000).trim(),
  mediaItems: z.array(MediaItemSchema).min(1, "Please upload at least 1 couple photograph").default([]),
  audioTrackUrl: z.string().url().optional().or(z.literal("")),
});

export const BirthdaySubmissionSchema = z.object({
  recipientName: z.string().min(2, "Birthday person's name required").max(80).trim(),
  senderName: z.string().min(2, "Sender name required").max(80).trim(),
  occasionDate: z.string().min(3, "Birthday date is required").max(50).trim(),
  letter: z.string().min(20, "Please write a celebratory birthday message").max(10000).trim(),
  mediaItems: z.array(MediaItemSchema).min(1, "Please upload at least 1 birthday photograph").default([]),
  audioTrackUrl: z.string().url().optional().or(z.literal("")),
});

export const LoveSubmissionSchema = z.object({
  recipientName: z.string().min(2, "Recipient name required").max(80).trim(),
  senderName: z.string().min(2, "Your name required").max(80).trim(),
  letter: z.string().min(20, "Please write a romantic love letter").max(10000).trim(),
  occasionDate: z.string().max(50).optional(),
  mediaItems: z.array(MediaItemSchema).min(1, "Please upload at least 1 photograph").default([]),
  audioTrackUrl: z.string().url().optional().or(z.literal("")),
});

export function getSubmissionSchemaForOccasion(occasionType: string) {
  switch (occasionType) {
    case "anniversary":
      return AnniversarySubmissionSchema;
    case "birthday":
      return BirthdaySubmissionSchema;
    case "love":
      return LoveSubmissionSchema;
    case "apology":
    default:
      return ApologySubmissionSchema;
  }
}
