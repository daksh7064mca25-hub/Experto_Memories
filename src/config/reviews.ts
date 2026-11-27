import { CustomerReview } from "@/types/review";

/**
 * Genuine Customer Reviews
 * Reviews from verified buyers that have been moderated and approved for display.
 * Empty by default until real submissions are collected and approved.
 */
export const GENUINE_CUSTOMER_REVIEWS: CustomerReview[] = [];

/**
 * Illustrative Sample Reviews (Development & Local Preview Only)
 * Strictly for layout design, typography verification, and responsive styling.
 * Note:
 * - isSample is strictly true.
 * - isVerifiedPurchase is strictly false (no fake verified claims).
 * - Uses local sample portrait photos from /images/reviews/.
 * - Kept strictly for development/preview environments.
 */
export const SAMPLE_ILLUSTRATIVE_REVIEWS: CustomerReview[] = [
  {
    id: "sample-rev-1",
    customerName: "Ananya S.",
    avatarInitials: "AS",
    photoUrl: "/images/reviews/reviewer-1.jpg",
    rating: 5,
    reviewText:
      "I made this for our 3rd anniversary. Watching my partner flip through our photos while our song was playing in the background had both of us in tears. It felt like holding a real physical storybook of our years together.",
    category: "Anniversary Keepsakes",
    reviewDate: "November 2026",
    isVerifiedPurchase: false,
    isSample: true,
    status: "sample",
  },
  {
    id: "sample-rev-2",
    customerName: "Rohan & Meera",
    avatarInitials: "RM",
    photoUrl: "/images/reviews/reviewer-2.jpg",
    rating: 5,
    reviewText:
      "Our wedding guests couldn’t stop texting us about the royal gatefold reveal. Having the ceremonies, Google Maps directions, and RSVP all in one link made managing attendance effortless.",
    category: "Wedding Invitations",
    reviewDate: "October 2026",
    isVerifiedPurchase: false,
    isSample: true,
    status: "sample",
  },
  {
    id: "sample-rev-3",
    customerName: "Tanvi V.",
    avatarInitials: "TV",
    photoUrl: "/images/reviews/reviewer-3.jpg",
    rating: 5,
    reviewText:
      "Sent the birthday website right at midnight. The interactive candle blowout and memory wall were so charming! Way more thoughtful than a standard gift card.",
    category: "Birthday Gifts",
    reviewDate: "October 2026",
    isVerifiedPurchase: false,
    isSample: true,
    status: "sample",
  },
  {
    id: "sample-rev-4",
    customerName: "Aditya K.",
    avatarInitials: "AK",
    photoUrl: "/images/reviews/reviewer-4.jpg",
    rating: 5,
    reviewText:
      "We had a serious fallout, and words over text felt cheap. Being able to put my honest apology letter, our favorite moments, and an acoustic playlist into something she could open privately really bridged the distance between us.",
    category: "Love & Relationship",
    reviewDate: "September 2026",
    isVerifiedPurchase: false,
    isSample: true,
    status: "sample",
  },
  {
    id: "sample-rev-5",
    customerName: "Pooja D.",
    avatarInitials: "PD",
    photoUrl: "/images/reviews/reviewer-5.jpg",
    rating: 5,
    reviewText:
      "The detail is incredible. The wax-sealed letter animation and photo reveals made it feel truly bespoke. My boyfriend saved the link to his home screen like an app.",
    category: "Love & Relationship",
    reviewDate: "September 2026",
    isVerifiedPurchase: false,
    isSample: true,
    status: "sample",
  },
  {
    id: "sample-rev-6",
    customerName: "Kabir S.",
    avatarInitials: "KS",
    photoUrl: "/images/reviews/reviewer-6.jpg",
    rating: 5,
    reviewText:
      "Created a 25th anniversary surprise for my parents with photos contributed by the whole family. They were completely overwhelmed seeing 25 years of memories woven together so beautifully.",
    category: "Personalized Memories",
    reviewDate: "August 2026",
    isVerifiedPurchase: false,
    isSample: true,
    status: "sample",
  },
];

/**
 * Helper to fetch active reviews:
 * In production: returns genuine approved reviews (or empty array if none exist).
 * In development / preview: displays the illustrative sample reviews for visual testing.
 */
export function getHomepageReviews(): {
  reviews: CustomerReview[];
  hasGenuineReviews: boolean;
  isDevelopmentPreview: boolean;
} {
  const isProduction = process.env.NODE_ENV === "production";

  if (GENUINE_CUSTOMER_REVIEWS.length > 0) {
    return {
      reviews: GENUINE_CUSTOMER_REVIEWS.slice(0, 6),
      hasGenuineReviews: true,
      isDevelopmentPreview: false,
    };
  }

  // In production with no genuine reviews yet, do not expose sample testimonials
  if (isProduction) {
    return {
      reviews: [],
      hasGenuineReviews: false,
      isDevelopmentPreview: false,
    };
  }

  // In development / local testing: serve illustrative sample reviews
  return {
    reviews: SAMPLE_ILLUSTRATIVE_REVIEWS,
    hasGenuineReviews: false,
    isDevelopmentPreview: true,
  };
}
