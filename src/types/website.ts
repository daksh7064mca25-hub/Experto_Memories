export type OccasionType = "apology" | "anniversary" | "birthday" | "love" | "wedding";

export type ApologyThemeId = "cotton-candy" | "lavender-dreams" | "peachy-love" | "midnight-hearts";

export type AnniversaryThemeId = "pink-paradise" | "golden-forever" | "our-universe" | "sunset-love";

export type BirthdayThemeId = "golden-champagne" | "blush-wonderland" | "peachy-celebration" | "midnight-sparkle";

export type LoveThemeId =
  | "burgundy-velvet"
  | "rose-blush"
  | "midnight-starlight"
  | "champagne-romance";

export type WeddingThemeId =
  | "royal-crimson"
  | "marigold-sindoor"
  | "shahi-emerald"
  | "golden-anand"
  | "noor-emerald"
  | "cathedral-rose"
  | "minimal-linen"
  | "velvet-onyx"
  | "botanical-sage"
  | "coastal-azure"
  | "champagne-gold";

export type ThemeId =
  | ApologyThemeId
  | AnniversaryThemeId
  | BirthdayThemeId
  | LoveThemeId
  | WeddingThemeId;

export type ApologySectionType =
  | "envelope"
  | "ready_check"
  | "letter"
  | "memories"
  | "reasons"
  | "forgiveness_garden"
  | "promises"
  | "scratch_card"
  | "coupon_book"
  | "catch_love_game"
  | "final_apology"
  | "secret_heart";

export type AnniversarySectionType =
  | "anniversary_envelope"
  | "anniversary_intro"
  | "anniversary_counter"
  | "anniversary_first_met"
  | "anniversary_timeline"
  | "anniversary_then_now"
  | "anniversary_reasons"
  | "anniversary_museum"
  | "anniversary_gallery"
  | "anniversary_quiz"
  | "anniversary_memory_match"
  | "anniversary_scratch"
  | "anniversary_promises"
  | "anniversary_whatsapp"
  | "anniversary_spin_wheel"
  | "anniversary_moon"
  | "anniversary_playlist"
  | "anniversary_constellation"
  | "anniversary_love_notes"
  | "anniversary_soundtrack"
  | "anniversary_future_letter"
  | "anniversary_bucket_list"
  | "anniversary_finale";

export type BirthdaySectionType =
  | "birthday_invitation"
  | "birthday_welcome"
  | "birthday_balloons"
  | "birthday_cake"
  | "birthday_scrapbook"
  | "birthday_game"
  | "birthday_letter"
  | "birthday_finale";

export type LoveSectionType =
  | "love_invitation"
  | "love_photo_reveal"
  | "love_question"
  | "love_timeline"
  | "love_reasons"
  | "love_counter"
  | "love_universe"
  | "love_puzzle"
  | "love_gallery"
  | "love_letter"
  | "love_surprise_gift"
  | "love_playlist"
  | "love_soundtrack"
  | "love_surprise";

export type WeddingSectionType =
  | "wedding_opening"
  | "wedding_couple"
  | "wedding_countdown"
  | "wedding_events"
  | "wedding_story"
  | "wedding_gallery"
  | "wedding_soundtrack"
  | "wedding_rsvp"
  | "wedding_travel"
  | "wedding_registry"
  | "wedding_wishes";

export type SectionType =
  | ApologySectionType
  | AnniversarySectionType
  | BirthdaySectionType
  | LoveSectionType
  | WeddingSectionType;

// --- SHARED DATA STRUCTURES ---

export interface PolaroidPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
  rotation?: number; // degrees, e.g. -3 to 4
}

export interface WebsiteSectionData {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  order: number;
  config: Record<string, any>;
}

export interface AudioSettings {
  enabled: boolean;
  backgroundMusicUrl?: string;
  title?: string;
  artist?: string;
  autoplay: boolean; // default false per performance requirements
}

export type ProjectStatus = "draft" | "published" | "unpublished" | "suspended";

export type ProjectPaymentStatus = "unpaid" | "pending_verification" | "paid" | "refunded";

export type CustomDomainStatus =
  | "not_requested"
  | "awaiting_payment"
  | "awaiting_customer_registration"
  | "awaiting_dns_configuration"
  | "verification_pending"
  | "connected"
  | "failed";

export interface CustomDomainConfig {
  requested: boolean;
  domainName?: string;
  status: CustomDomainStatus;
  dnsInstructions?: {
    recordType: string;
    host: string;
    target: string;
  };
  verifiedAt?: string | Date;
  notes?: string;
}

// --- APOLOGY PRODUCT STRUCTURES ---

export interface ReasonHeart {
  id: string;
  title: string;
  description: string;
  emoji?: string;
}

export interface PromiseCard {
  id: string;
  sealColor?: string;
  title: string;
  description: string;
}

export interface ApologyCoupon {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  expiryText?: string;
  code?: string;
}

export interface EnvelopeSectionConfig {
  teaserText: string;
  waxSealColor?: string;
  buttonText: string;
  stampText?: string;
}

export interface ReadyCheckSectionConfig {
  question: string;
  subtext: string;
  acceptButtonText: string;
  waitButtonText: string;
  waitMessage: string;
}

export interface LetterSectionConfig {
  salutation: string;
  headline: string;
  paragraphs: string[];
  signoff: string;
  audioNarrationUrl?: string;
  enableTypewriter: boolean;
}

export interface MemoriesSectionConfig {
  headline: string;
  subtext: string;
  photos: PolaroidPhoto[];
}

export interface ReasonsSectionConfig {
  headline: string;
  subtext: string;
  reasons: ReasonHeart[];
}

export interface ForgivenessGardenConfig {
  headline: string;
  subtext: string;
  milestones: Array<{
    level: number;
    title: string;
    description: string;
    flowerStage: string;
  }>;
}

export interface PromisesSectionConfig {
  headline: string;
  subtext: string;
  promises: PromiseCard[];
}

export interface ScratchCardConfig {
  headline: string;
  subtext: string;
  secretMessage: string;
  secretSubtext: string;
  scratchPercentageToReveal: number;
}

export interface CouponBookConfig {
  headline: string;
  subtext: string;
  coupons: ApologyCoupon[];
  maxRedemptions?: number;
}

export interface CatchLoveGameConfig {
  headline: string;
  subtext: string;
  durationSeconds: number;
  targetScore: number;
  winMessage: string;
  replayButtonText: string;
}

export interface FinalApologyConfig {
  headline: string;
  message: string;
  acceptButtonText: string;
  pauseButtonText: string;
  acceptedResponseTitle: string;
  acceptedResponseMessage: string;
  pausedResponseTitle: string;
  pausedResponseMessage: string;
}

export interface SecretHeartConfig {
  teaser: string;
  hiddenSecret: string;
  requiredHoldSeconds: number;
}

// --- ANNIVERSARY PRODUCT STRUCTURES ---

export interface TimelineMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  photos: string[];
  videoUrl?: string;
  voiceNoteUrl?: string;
  tag?: string;
}

export interface AnniversaryEnvelopeConfig {
  headline?: string;
  recipientName?: string;
  senderName?: string;
  waxSealColor?: string;
  waxSealInitial?: string;
  envelopeColor?: string;
  teaserText?: string;
  stampText?: string;
  buttonText?: string;
  allowSkip?: boolean;
}

export interface AnniversaryIntroConfig {
  headline: string;
  subheadline: string;
  buttonText: string;
  coupleNames?: string;
  anniversaryDate?: string;
  yearsTogetherText?: string;
  couplePhotoUrl?: string;
  personalMessage?: string;
}

export interface AnniversaryTimelineConfig {
  headline: string;
  subtext: string;
  milestones: TimelineMilestone[];
}

export interface AnniversaryGalleryConfig {
  headline: string;
  subtext: string;
  photos: PolaroidPhoto[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AnniversaryQuizConfig {
  headline: string;
  subtext: string;
  questions: QuizQuestion[];
  passingScoreMessage?: string;
}

export interface ConstellationStar {
  id: string;
  label: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  memoryTitle: string;
  memoryText: string;
  memoryDate?: string;
  photoUrl?: string;
}

export interface AnniversaryConstellationConfig {
  headline: string;
  subtext: string;
  stars: ConstellationStar[];
}

export interface AnniversaryLoveNote {
  id: string;
  title: string;
  content: string;
  iconName?: string;
  photoUrl?: string;
}

export interface AnniversaryLoveNotesConfig {
  headline: string;
  subtext: string;
  notes: AnniversaryLoveNote[];
}

export interface AnniversarySoundtrackConfig {
  headline: string;
  subtext: string;
  songTitle: string;
  artist: string;
  audioUrl: string;
  personalExplanation: string;
}

export interface AnniversaryFutureLetterConfig {
  envelopeTeaser: string;
  headline: string;
  letterBody: string[];
  signoff: string;
  promises: string[];
}

export interface BucketListItem {
  id: string;
  title: string;
  category: string;
  iconName?: string;
  selected?: boolean;
}

export interface AnniversaryBucketListConfig {
  headline: string;
  subtext: string;
  items: BucketListItem[];
}

export interface AnniversaryFinaleConfig {
  headline: string;
  finalMessage: string;
  anniversaryDate: string;
  finalPhotoUrl?: string;
  questionText: string;
  acceptButtonText: string;
  celebrationTitle: string;
  celebrationMessage: string;
}

export interface AnniversaryCounterConfig {
  headline: string;
  subtext: string;
  relationshipStartDate?: string;
  nextAnniversaryDate?: string;
  showSeconds: boolean;
  milestoneMessage?: string;
}

export interface AnniversaryFirstMetConfig {
  headline: string;
  subtext: string;
  dateText?: string;
  location?: string;
  storyText: string;
  photoUrl?: string;
  audioNoteUrl?: string;
}

export interface AnniversaryThenNowConfig {
  headline: string;
  subtext: string;
  thenPhotoUrl: string;
  nowPhotoUrl: string;
  thenLabel?: string;
  nowLabel?: string;
  thenDate?: string;
  nowDate?: string;
  storyText?: string;
}

export interface AnniversaryReasonsConfig {
  headline: string;
  subtext: string;
  reasons: ReasonHeart[];
}

export interface AnniversaryMuseumExhibit {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  photoUrl: string;
  description: string;
  tag?: string;
}

export interface AnniversaryMuseumConfig {
  headline: string;
  subtext: string;
  exhibits: AnniversaryMuseumExhibit[];
}

export interface AnniversaryMemoryMatchCard {
  id: string;
  label: string;
  iconOrImageUrl: string;
  type: "icon" | "image";
}

export interface AnniversaryMemoryMatchConfig {
  headline: string;
  subtext: string;
  cards: AnniversaryMemoryMatchCard[];
  winTitle: string;
  winMessage: string;
}

export interface AnniversaryScratchConfig {
  headline: string;
  subtext: string;
  coverTitle: string;
  coverSubtitle: string;
  secretMessage?: string;
  secretPhotoUrl?: string;
  photoUrl?: string;
  photoCaption?: string;
  foilColor?: string;
  buttonText?: string;
}

export interface AnniversaryPromiseCardItem {
  id: string;
  title: string;
  promise: string;
  icon?: string;
  revealed?: boolean;
}

export interface AnniversaryPromisesConfig {
  headline: string;
  subtext: string;
  promises: AnniversaryPromiseCardItem[];
}

export interface AnniversaryWhatsAppMetrics {
  totalMessages: number;
  partner1Name: string;
  partner1Messages: number;
  partner2Name: string;
  partner2Messages: number;
  firstMessageDate?: string;
  mostActiveDay?: string;
  mostActiveHour?: string;
  loveEmojisCount: number;
  topWords?: { word: string; count: number }[];
  funFact?: string;
}

export interface AnniversaryWhatsAppConfig {
  headline: string;
  subtext: string;
  metrics?: AnniversaryWhatsAppMetrics;
  placeholderMetrics?: AnniversaryWhatsAppMetrics;
  allowClientUpload: boolean;
}

export interface AnniversaryPlaylistTrack {
  id: string;
  title: string;
  artist: string;
  albumArtUrl?: string;
  audioUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  notes?: string;
}

export interface AnniversaryPlaylistConfig {
  headline: string;
  subtext: string;
  tracks: AnniversaryPlaylistTrack[];
}

export interface AnniversaryWheelOption {
  id: string;
  label: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface AnniversarySpinWheelConfig {
  headline: string;
  subtext: string;
  options: AnniversaryWheelOption[];
  footerNote?: string;
  buttonText?: string;
}

export interface AnniversaryMoonConfig {
  headline: string;
  subtext?: string;
  meetingDate?: string;
  location?: string;
  personalMessage?: string;
}

// --- BIRTHDAY PRODUCT STRUCTURES ---

export interface BirthdayInvitationConfig {
  headline: string;
  teaserText: string;
  envelopePrompt: string;
  boxColor?: string;
}

export interface BirthdayWelcomeConfig {
  headline: string;
  subheadline: string;
  birthdayDate?: string;
  age?: number;
  showCountdown: boolean;
  buttonText: string;
}

export interface BirthdayBalloonWish {
  id: string;
  color: string;
  message: string;
  author?: string;
}

export interface BirthdayBalloonsConfig {
  headline: string;
  subtext: string;
  balloons: BirthdayBalloonWish[];
}

export interface BirthdayCakeConfig {
  headline: string;
  subtext: string;
  candlesCount: number;
  allowMicBlowing: boolean;
  wishMessage: string;
  celebrationTitle: string;
  celebrationText: string;
}

export interface BirthdayScrapbookConfig {
  headline: string;
  subtext: string;
  photos: PolaroidPhoto[];
}

export type BirthdaySurpriseCategory =
  | "voucher"
  | "activity"
  | "promise"
  | "favor"
  | "heartfelt"
  | "comedy"
  | "experience";

export type BirthdaySurpriseIcon =
  | "gift"
  | "heart"
  | "sparkles"
  | "coffee"
  | "trophy"
  | "cake"
  | "plane"
  | "star"
  | "music"
  | "compass"
  | "smile"
  | "ticket";

export interface BirthdaySurpriseItem {
  id: string;
  title: string;
  description?: string;
  redemptionInstructions?: string;
  badge?: string;
  icon?: BirthdaySurpriseIcon;
  category?: BirthdaySurpriseCategory;
  enabled: boolean;
  order: number;
}

export interface BirthdayScratchReward {
  id: string;
  title: string;
  description?: string;
  redemptionInstructions?: string;
  icon?: BirthdaySurpriseIcon;
  badge?: string;
  category?: BirthdaySurpriseCategory;
  enabled?: boolean;
}

export interface BirthdayGameConfig {
  headline: string;
  subtext: string;
  relationship?: string;
  gameType?: "scratch" | "mystery_box";
  mode?: "custom" | "random";
  customReward?: BirthdayScratchReward;
  randomRewards?: BirthdayScratchReward[];
  selectedRewardId?: string;
  revealedReward?: BirthdayScratchReward;
  previewRewardId?: string;
  // Legacy fields preserved for backward compatibility
  surprises?: BirthdaySurpriseItem[];
  allowMultipleScratches?: boolean;
  scratchPercentageToReveal?: number;
  previewSurpriseIndex?: number;
  scratchMessage?: string;
  secretGiftText?: string;
}

export interface BirthdayLetterConfig {
  envelopeTitle: string;
  salutation: string;
  letterBody: string[];
  signoff: string;
  senderName?: string;
  audioNarrationUrl?: string;
}

export interface BirthdayFinaleConfig {
  headline: string;
  finalMessage: string;
  celebrationPhotoUrl?: string;
  replayButtonText: string;
}

// --- LOVE & ROMANCE PRODUCT STRUCTURES ("THE SECRET WORLD OF US") ---

export interface LoveInvitationConfig {
  badgeText: string;
  headline: string;
  introMessage: string;
  sealText: string;
  recipientTitle: string;
  senderTitle: string;
  hint?: string;
}

export interface LoveQuestionAnswer {
  id: string;
  label: string;
  responseTitle: string;
  responseMessage: string;
  icon?: string;
}

export interface LoveQuestionConfig {
  headline: string;
  subtext: string;
  questionText: string;
  answers: LoveQuestionAnswer[];
  finalReveal: string;
}

export interface LoveReasonCard {
  id: string;
  title: string;
  message: string;
  photoUrl?: string;
  badge?: string;
}

export interface LoveReasonsConfig {
  headline: string;
  subtext: string;
  cards: LoveReasonCard[];
  finalCardTitle: string;
  finalCardMessage: string;
}

export interface LoveUniverseStar {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: "small" | "medium" | "large";
  title: string;
  date?: string;
  story: string;
  photoUrl?: string;
  glowColor?: string;
}

export interface LoveUniverseConfig {
  headline: string;
  subtext: string;
  centralStarTitle: string;
  centralStarStory: string;
  centralStarPhotoUrl?: string;
  stars: LoveUniverseStar[];
}

export interface LovePuzzleConfig {
  puzzleType: "memory_match" | "scratch_reveal" | "sliding_photo";
  headline: string;
  subtext: string;
  photoUrl?: string;
  completionMessage: string;
  secretRewardText: string;
  skipButtonText?: string;
}

export interface LoveGalleryPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
  location?: string;
  tag?: string;
}

export interface LoveGalleryConfig {
  headline: string;
  subtext: string;
  photos: LoveGalleryPhoto[];
}

export interface LoveLetterConfig {
  headline: string;
  subtext: string;
  waxSealText: string;
  salutation: string;
  letterBody: string;
  closing: string;
  signature: string;
  audioNoteUrl?: string;
  dateText?: string;
}

export interface LoveSoundtrackConfig {
  headline: string;
  subtext: string;
  trackTitle: string;
  artistName: string;
  audioUrl?: string;
}

export interface LoveSurpriseConfig {
  surpriseType: "promise" | "photo_reveal" | "proposal_question" | "future_date" | "custom_message";
  headline: string;
  subtext: string;
  surpriseTitle: string;
  surpriseBody: string;
  photoUrl?: string;
  actionButtonText?: string;
  whatsappShareText?: string;
}

export interface LovePhotoRevealConfig {
  headline: string;
  subtext: string;
  photoUrl: string;
  caption: string;
  loveNote: string;
  scratchPromptText?: string;
  buttonText?: string;
}

export interface LoveTimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  photoUrl?: string;
  tag?: string;
}

export interface LoveTimelineConfig {
  headline: string;
  subtext: string;
  items: LoveTimelineItem[];
}

export interface LoveCounterConfig {
  headline: string;
  subtext: string;
  startDate: string;
  counterLabel?: string;
  milestoneBadge?: string;
  milestoneBadgeText?: string;
  customMetrics?: { label: string; value: string }[];
  metric1Label?: string;
  metric1Value?: string;
  metric2Label?: string;
  metric2Value?: string;
  metric3Label?: string;
  metric3Value?: string;
}

export interface LoveSurpriseGiftItem {
  id: string;
  title: string;
  description: string;
  tag: string;
}

export interface LoveSurpriseGiftConfig {
  headline: string;
  subtext: string;
  giftTitle: string;
  giftDescription: string;
  couponCode?: string;
  redeemPrompt?: string;
  photoUrl?: string;
  surprises?: LoveSurpriseGiftItem[];
}

export interface LovePlaylistTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  personalNote: string;
  duration?: string;
}

export interface LovePlaylistConfig {
  headline: string;
  subtext: string;
  tracks: LovePlaylistTrack[];
}

// --- WEDDING PRODUCT STRUCTURES ---

export interface WeddingEventData {
  id: string;
  title: string;           // e.g. "Haldi & Phoolon Ki Holi", "Grand Sangeet", "Shubh Vivaah (Pheras)"
  date: string;            // e.g. "December 14, 2026"
  time: string;            // e.g. "10:00 AM onwards"
  venueName: string;       // e.g. "The Royal Courtyard, Fairmont Jaipur"
  address: string;         // e.g. "Riico Industrial Area, Kukas, Rajasthan 302028"
  googleMapsUrl?: string;  // e.g. "https://maps.google.com/..."
  dressCode?: string;      // e.g. "Yellow / Mustard Festive Traditional"
  description?: string;    // e.g. "A morning of laughter, dhol beats, and turmeric rituals"
  icon?: string;           // e.g. "sparkles", "music", "ring", "party"
  coverImageUrl?: string;
}

export type WeddingRevealStyle =
  | "hindu_mandir"
  | "palace_doors"
  | "mandap_garland"
  | "phulkari_dhol"
  | "sunrise_lotus"
  | "silk_parchment"
  | "ribbon_arch"
  | "architectural_gatefold"
  | "blooming_petals"
  | "passport_boarding"
  | "velvet_wax_seal"
  | "wax_seal"
  | "gilded_folio"
  // Legacy / fallback styles
  | "wax_envelope"
  | "floral_gate"
  | "silk_scroll";

export interface WeddingOpeningConfig {
  revealStyle: WeddingRevealStyle;
  eyebrow: string;         // e.g. "With The Blessings of The Almighty"
  monogram: string;        // e.g. "A & R"
  headline: string;        // e.g. "We are Getting Married!"
  coupleNames: string;     // e.g. "Aarav & Roshni"
  weddingDateText: string; // e.g. "December 14-15, 2026"
  actionButtonText: string;// e.g. "Open Royal Invitation"
  skipButtonText?: string;
  audioNotice?: string;
  religiousBlessingText?: string; // Optional customer-controlled sacred invocation
  culturalSymbol?: string;        // e.g. "kalash", "lotus", "crescent", "cross", "rings", "monogram"
  soundEnabled?: boolean;
  modelUrl?: string;              // Optional custom GLB/GLTF 3D temple model URL
  transitionVideoUrl?: string;    // Optional cinematic transition video URL
  heroBackgroundImageUrl?: string;// Optional royal palace hero background image URL
}

export interface WeddingCoupleConfig {
  headline: string;
  subtext: string;
  brideName: string;
  brideTitle?: string;     // e.g. "D/o Smt. Sunita & Shri Rajesh Sharma"
  brideBio?: string;
  bridePhotoUrl?: string;
  groomName: string;
  groomTitle?: string;     // e.g. "S/o Smt. Rekha & Shri Vikram Kapoor"
  groomBio?: string;
  groomPhotoUrl?: string;
  parentsBlessing?: string;
}

export interface WeddingCountdownConfig {
  targetDate: string;      // ISO string or parsable date
  headline: string;
  subtext: string;
  venueCity: string;       // e.g. "Jaipur, Rajasthan"
  calendarAddToGoogleUrl?: string;
}

export interface WeddingEventsConfig {
  headline: string;
  subtext: string;
  events: WeddingEventData[];
}

export interface WeddingStoryChapter {
  id: string;
  title: string;
  yearOrDate: string;
  description: string;
  photoUrl?: string;
}

export interface WeddingStoryConfig {
  headline: string;
  subtext: string;
  quote?: string;
  storyParagraphs: string[];
  chapters?: WeddingStoryChapter[];
}

export interface WeddingGalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  category?: "pre-wedding" | "candid" | "family";
}

export interface WeddingGalleryConfig {
  headline: string;
  subtext: string;
  photos: WeddingGalleryPhoto[];
}

export interface WeddingRSVPConfig {
  headline: string;
  subtext: string;
  rsvpDeadlineText?: string;
  enableMealPreferences?: boolean;
  enablePlusOnes?: boolean;
  enableBlessings?: boolean;
  confirmationMessage?: string;
}

export interface WeddingTravelConfig {
  headline: string;
  subtext: string;
  venueName?: string;
  venueAddress?: string;
  googleMapsUrl?: string;
  nearestAirport?: string;
  nearestRailway?: string;
  hotelAccommodations?: string;
  shuttleNotes?: string;
  conciergeName?: string;
  conciergePhone?: string;
}

export interface WeddingRegistryConfig {
  headline: string;
  subtext: string;
  message?: string;
  enableBankDetails?: boolean;
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  registryNote?: string;
}

export interface WeddingWishesConfig {
  headline: string;
  subtext: string;
  closingNote: string;
  familySignoff: string;
  whatsappShareText?: string;
  coupleNames?: string;
}

// --- MASTER WEBSITE PROJECT SCHEMA ---

export interface WebsiteProjectData {
  _id?: string;
  slug: string;
  title: string;
  recipientName: string;
  senderName: string;
  occasionType?: OccasionType; // "apology" | "anniversary" | "birthday" | "love" | "wedding"
  orderId?: string;            // Linked customer Order ID
  customerId?: string;         // Linked Customer User ID
  customerEmail?: string;
  customerPhone?: string;
  partner1Name?: string;       // Anniversary primary partner
  partner2Name?: string;       // Anniversary secondary partner
  anniversaryDate?: string;    // e.g. "October 14, 2023"
  relationshipStartDate?: string;
  yearsTogether?: number;
  birthdayDate?: string;       // e.g. "November 25th"
  age?: number;                // e.g. 25
  categoryId?: "digital-gifts" | "wedding-invitations" | "birthday-celebrations" | "future-celebrations";
  subcategoryId?: string;
  templateId?: string;
  recipientType?: string;
  weddingDetails?: {
    brideName?: string;
    groomName?: string;
    weddingDate?: string;
    venueCity?: string;
    collection?: string;
    rsvpDeadline?: string;
    guestCountEstimate?: number;
  };
  theme: ThemeId;
  sections: WebsiteSectionData[];
  couponRedemptions?: Record<string, string>;
  audioSettings: AudioSettings;
  status: ProjectStatus;
  paymentStatus?: ProjectPaymentStatus;
  paidAt?: string | Date;
  paymentMethod?: "razorpay" | "manual_upi";
  isPasswordProtected?: boolean;
  password?: string;
  passwordHash?: string;
  passwordHint?: string;
  customDomain?: CustomDomainConfig;
  hostingDurationMonths?: number;
  hostingExpiresAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  publishedAt?: string | Date;
}
