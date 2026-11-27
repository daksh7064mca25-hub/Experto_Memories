export type PaymentStatus =
  | "pending"
  | "payment_pending_verification"
  | "paid"
  | "failed"
  | "refunded";

export type PaymentMethod = "razorpay" | "manual_upi";

export type OrderStatus =
  | "placed"
  | "personalizing"
  | "in_review"
  | "completed"
  | "cancelled";

export interface OrderItem {
  productSlug: string;
  occasionType: string;
  title: string;
  price: number; // in INR
  selectedTheme: string;
  quantity?: number;
}

export interface UploadedMediaItem {
  url: string;
  key?: string;
  caption?: string;
  type: "image" | "video" | "audio";
  bytes?: number;
}

export interface PersonalizationData {
  recipientName?: string;
  senderName?: string;
  partner1Name?: string;
  partner2Name?: string;
  occasionDate?: string;
  relationshipStartDate?: string;
  yearsTogether?: number;
  letter?: string;
  notes?: string[];
  promises?: Array<{ title: string; description: string }>;
  quiz?: Array<{ question: string; options: string[]; answerIndex: number }>;
  mediaItems?: UploadedMediaItem[];
  audioTrackUrl?: string;
  customDetails?: Record<string, any>;
  lastSavedAt?: Date;
  submittedAt?: Date;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface RazorpayDetails {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: Date;
}

export interface ReleasedUtrRecord {
  utrNumber: string;
  normalizedUtr: string;
  releasedAt: Date;
  releasedBy: string;
  reason: string;
}

export interface ManualUpiDetails {
  utrNumber?: string;
  normalizedUtr?: string;
  screenshotUrl?: string;
  submittedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  rejectionReason?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  releasedUtrHistory?: ReleasedUtrRecord[];
}

export interface AuditTrailEntry {
  action: string;
  timestamp: Date;
  actor: string;
  details?: Record<string, any>;
}

export interface OrderData {
  _id?: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  totalAmount: number; // in INR
  currency: "INR";
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayDetails?: RazorpayDetails;
  manualUpiDetails?: ManualUpiDetails;
  auditTrail?: AuditTrailEntry[];
  orderStatus: OrderStatus;
  customerId?: string;
  projectId?: string; // Reference to the authoritative WebsiteProject
  packageDetails?: Record<string, any>;
  personalization?: PersonalizationData;
  accessToken: string; // Cryptographic raw token (returned to customer on creation)
  accessTokenHash?: string; // SHA-256 hash of accessToken for secure lookup
  createdAt?: Date;
  updatedAt?: Date;
}
