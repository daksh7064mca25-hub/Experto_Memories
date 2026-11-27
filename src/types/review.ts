export type ReviewCategory =
  | "Love & Relationship"
  | "Wedding Invitations"
  | "Birthday Gifts"
  | "Anniversary Keepsakes"
  | "Personalized Memories";

export type ReviewStatus = "approved" | "pending" | "rejected" | "sample";

export interface CustomerReview {
  id: string;
  customerName: string;
  avatarInitials: string;
  photoUrl?: string; // Local sample asset for dev; real customer photo in production with permission
  rating: number; // 1 to 5
  reviewText: string;
  category: ReviewCategory;
  reviewDate: string;
  isVerifiedPurchase: boolean; // Strictly false for samples; true only for verified buyers
  isSample?: boolean; // Identifies illustrative development reviews
  status: ReviewStatus;
  consentForDisplay?: boolean;
  submittedAt?: string;
  moderatedAt?: string;
  moderatedBy?: string;
  moderationNote?: string;
  verifiedOrderId?: string;
}

export interface ReviewSubmissionInput {
  customerName: string;
  rating: number;
  reviewText: string;
  category: ReviewCategory;
  consentForDisplay: boolean;
}

export interface AdminReviewSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  averageApprovedRating: number;
}
