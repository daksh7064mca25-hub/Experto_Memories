import { WebsiteProjectData, WebsiteSectionData } from "@/types/website";

export const DEFAULT_SECTIONS: WebsiteSectionData[] = [
  {
    id: "sec-envelope",
    type: "envelope",
    title: "The Mysterious Envelope",
    enabled: true,
    order: 0,
    config: {
      teaserText: "Someone has something special to tell you...",
      buttonText: "Open My Letter",
      stampText: "FIRST CLASS LOVE",
      waxSealColor: "#e11d48",
    },
  },
  {
    id: "sec-ready-check",
    type: "ready_check",
    title: "Are You Ready?",
    enabled: true,
    order: 1,
    config: {
      question: "Before I say anything... can you hear me out?",
      subtext: "Take a deep breath. No pressure, just honest words from my heart.",
      acceptButtonText: "Okay, tell me ❤️",
      waitButtonText: "Let me think...",
      waitMessage:
        "Take all the time you need. I'm right here whenever you feel ready to listen. 🤍",
    },
  },
  {
    id: "sec-letter",
    type: "letter",
    title: "The Heartfelt Letter",
    enabled: true,
    order: 2,
    config: {
      salutation: "My Dearest",
      headline: "I am truly, deeply sorry.",
      paragraphs: [
        "I’ve spent the past few hours replaying everything in my mind. Seeing you hurt because of me broke something inside me that I can’t easily put into words.",
        "I was careless with my words and didn't listen to you the way you deserved. You are the kindest, most patient person in my world, and knowing that I took that for granted hurts more than anything.",
        "I don't expect you to brush it aside instantly. Your feelings are 100% valid. All I ask is for you to know that my love for you hasn’t wavered for a second, and I am committed to being better for us.",
      ],
      signoff: "Forever yours with all my love,",
      enableTypewriter: true,
      audioNarrationUrl: "",
    },
  },
  {
    id: "sec-memories",
    type: "memories",
    title: "Our Little Memories",
    enabled: true,
    order: 3,
    config: {
      headline: "Moments I Cherish Most",
      subtext: "A few snapshots of pure happiness that remind me how lucky I am.",
      photos: [
        {
          id: "photo-1",
          url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
          caption: "That sunny coffee date where we couldn't stop laughing",
          date: "October 14th",
          rotation: -2,
        },
        {
          id: "photo-2",
          url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
          caption: "When we got lost in the rain and ate warm pastries",
          date: "November 2nd",
          rotation: 3,
        },
        {
          id: "photo-3",
          url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
          caption: "Your glowing smile that lights up my darkest days",
          date: "December 24th",
          rotation: -3,
        },
        {
          id: "photo-4",
          url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80",
          caption: "Sunset walks where time felt like it stood still",
          date: "January 18th",
          rotation: 2,
        },
      ],
    },
  },
  {
    id: "sec-reasons",
    type: "reasons",
    title: "Things I Never Want You To Forget",
    enabled: true,
    order: 4,
    config: {
      headline: "Tap Each Heart",
      subtext: "Little truths about you that I carry everywhere.",
      reasons: [
        {
          id: "reason-1",
          title: "Your infectious giggle",
          description: "The way your eyes crinkle up when something is genuinely funny. It is my favorite sound on earth.",
          emoji: "✨",
        },
        {
          id: "reason-2",
          title: "How deeply you care",
          description: "Even when life is chaotic, your empathy for everyone around you never fails to inspire me.",
          emoji: "🌸",
        },
        {
          id: "reason-3",
          title: "Your warm morning hugs",
          description: "That cozy moment before the world wakes up where everything feels safe and peaceful.",
          emoji: "☕",
        },
        {
          id: "reason-4",
          title: "The way you believe in me",
          description: "Even when I doubt myself, your faith gives me strength. I promise to protect that faith.",
          emoji: "💖",
        },
      ],
    },
  },
  {
    id: "sec-forgiveness-garden",
    type: "forgiveness_garden",
    title: "The Forgiveness Garden",
    enabled: true,
    order: 5,
    config: {
      headline: "The Forgiveness Garden",
      subtext:
        "Feelings take time and that's okay. Move the heart to see how our garden blossoms with your patience.",
      milestones: [
        {
          level: 1,
          title: "Still a little hurt",
          description: "I hear you, and your hurt is completely understood. A small seedling rests quietly in gentle soil.",
          flowerStage: "seedling",
        },
        {
          level: 2,
          title: "Maybe thinking it through",
          description: "A tender green shoot breaks through the earth under soft warm sunlight.",
          flowerStage: "sprout",
        },
        {
          level: 3,
          title: "A tiny bit better",
          description: "Delicate pink petals begin to unfurl as the gentle breeze clears the clouds.",
          flowerStage: "budding",
        },
        {
          level: 4,
          title: "Smiling again",
          description: "Full blossoms in soft pastel hues wave cheerfully in the afternoon glow.",
          flowerStage: "blooming",
        },
        {
          level: 5,
          title: "Sending a warm virtual hug",
          description: "A lush, radiant bouquet surrounded by dancing butterflies and glowing fireflies!",
          flowerStage: "radiant",
        },
      ],
    },
  },
  {
    id: "sec-promises",
    type: "promises",
    title: "Sealed Promises",
    enabled: true,
    order: 6,
    config: {
      headline: "My Written Promises to You",
      subtext: "Tap each wax seal to reveal a promise I am committed to keeping.",
      promises: [
        {
          id: "promise-1",
          sealColor: "#f43f5e",
          title: "Promise to Listen First",
          description: "I will pause my ego, look you in the eyes, and listen to understand — not to defend myself.",
        },
        {
          id: "promise-2",
          sealColor: "#a855f7",
          title: "Promise to Never Sleep on Anger",
          description: "Even on our hardest days, I will reach out my hand and remind you that we are always a team.",
        },
        {
          id: "promise-3",
          sealColor: "#ec4899",
          title: "Promise to Cherish the Little Things",
          description: "I will keep making your favorite drinks, surprising you with small notes, and never taking our bond for granted.",
        },
      ],
    },
  },
  {
    id: "sec-scratch-card",
    type: "scratch_card",
    title: "Scratch-To-Reveal Surprise",
    enabled: true,
    order: 7,
    config: {
      headline: "A Secret Under the Shimmer",
      subtext: "Use your finger or mouse to scratch the surface below!",
      secretMessage: "I love you more than all the stars in the night sky. 🌟",
      secretSubtext: "P.S. Tonight’s dinner and your favorite ice cream are entirely on me!",
      scratchPercentageToReveal: 50,
    },
  },
  {
    id: "sec-coupon-book",
    type: "coupon_book",
    title: "Apology Coupon Book",
    enabled: true,
    order: 8,
    config: {
      headline: "Your Apology Coupon Book",
      subtext: "Non-expiring vouchers redeemable anytime. Just tap to redeem!",
      coupons: [
        {
          id: "coupon-1",
          title: "One Unlimited Hug",
          description: "Redeemable whenever you need warmth, comfort, or just want to squeeze me tight.",
          iconName: "Heart",
          expiryText: "Never Expires",
          code: "HUG-FOREVER",
        },
        {
          id: "coupon-2",
          title: "Favorite Date Night of Your Choice",
          description: "You pick the spot, you pick the food, no complaints, 100% focused on you.",
          iconName: "Utensils",
          expiryText: "Valid Anytime",
          code: "DINNER-DATE",
        },
        {
          id: "coupon-3",
          title: "Movie & Cozy Blanket Night",
          description: "You get the remote, all the snacks, and I won't fall asleep in the first 20 minutes!",
          iconName: "Film",
          expiryText: "Unlimited",
          code: "MOVIE-NIGHT",
        },
        {
          id: "coupon-4",
          title: "Late Night Sweet Dessert Run",
          description: "Waffles, boba, brownies or ice cream — whatever your sweet craving desires.",
          iconName: "IceCream",
          expiryText: "No Expiry",
          code: "SWEET-TREAT",
        },
        {
          id: "coupon-5",
          title: "Handwritten 3-Page Letter",
          description: "Pen on paper, pouring my thoughts and memories of our sweet beginnings.",
          iconName: "Mail",
          expiryText: "Special Edition",
          code: "INK-AND-PAPER",
        },
      ],
    },
  },
  {
    id: "sec-catch-love-game",
    type: "catch_love_game",
    title: "Catch My Love Mini-Game",
    enabled: true,
    order: 9,
    config: {
      headline: "Catch My Falling Love!",
      subtext: "Catch as many floating hearts as you can in 20 seconds. Ready?",
      durationSeconds: 20,
      targetScore: 10,
      winMessage: "You caught my whole heart! You’re undefeated at making me smile. 💕",
      replayButtonText: "Play Again",
    },
  },
  {
    id: "sec-secret-heart",
    type: "secret_heart",
    title: "Secret Whispers",
    enabled: true,
    order: 10,
    config: {
      teaser: "Hold down the glowing heart for 3 seconds to reveal a secret...",
      hiddenSecret:
        "Every single day with you is my favorite day. I promise to keep working on being the partner you truly deserve.",
      requiredHoldSeconds: 3,
    },
  },
  {
    id: "sec-final-apology",
    type: "final_apology",
    title: "Final Apology",
    enabled: true,
    order: 11,
    config: {
      headline: "Looking Ahead",
      message:
        "I can't undo what happened, but I hope we can make a better tomorrow. What does your heart say?",
      acceptButtonText: "Yes, let's talk ❤️",
      pauseButtonText: "I need some time 💗",
      acceptedResponseTitle: "Thank you for opening your heart 🌸",
      acceptedResponseMessage:
        "I’m ready whenever you are. Let’s talk, cuddle, and make everything sweet again.",
      pausedResponseTitle: "I respect your space completely 🤍",
      pausedResponseMessage:
        "Please take all the time you need. I will be here patiently, loving you just the same.",
    },
  },
];

export const createDefaultProject = (
  slug: string = "sarah-love",
  recipientName: string = "Sarah",
  senderName: string = "Alex"
): WebsiteProjectData => ({
  slug,
  title: `A Little Sorry, A Lot of Love for ${recipientName}`,
  recipientName,
  senderName,
  theme: "cotton-candy",
  sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)),
  audioSettings: {
    enabled: true,
    backgroundMusicUrl:
      "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3",
    title: "Gentle Piano Lullaby",
    artist: "Acoustic Melody",
    autoplay: false,
  },
  status: "published",
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: new Date(),
});

