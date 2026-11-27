import { WebsiteProjectData, WebsiteSectionData } from "@/types/website";

export function createDefaultLoveProject(
  slug: string,
  recipientName = "Maya",
  senderName = "Dev"
): WebsiteProjectData {
  const sections: WebsiteSectionData[] = [
    // PAGE 1 — THE COVER
    {
      id: "sec-love-invitation",
      type: "love_invitation",
      title: "Page 1 • Book Cover",
      enabled: true,
      order: 0,
      config: {
        badgeText: "STRICTLY FOR YOUR EYES ONLY ❤️",
        headline: "Our Little Love Story",
        subtext:
          "A private handwritten collection of our sweetest moments, silly memories, and endless love.",
        recipientTitle: recipientName,
        senderTitle: senderName,
        sealText: "Open Our Love Story 📖",
      },
    },

    // PAGE 2 — WHERE IT ALL BEGAN
    {
      id: "sec-love-timeline",
      type: "love_timeline",
      title: "Page 2 • Where It All Began",
      enabled: true,
      order: 1,
      config: {
        headline: "Chapter I • Where It All Began",
        subtext:
          "Before all the inside jokes and quiet Sundays, there was a day that changed everything.",
        items: [
          {
            id: "tl-1",
            title: "The First Day Our Eyes Met ✨",
            date: "Chapter 1",
            description:
              "I still remember the exact clothes you were wearing, the sound of your laugh across the room, and how my heart quietly knew you would be someone special.",
            photoUrl:
              "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
            tag: "Day One",
          },
          {
            id: "tl-2",
            title: "Our Very First Conversation ☕",
            date: "Chapter 2",
            description:
              "What was supposed to be a quick five-minute coffee turned into hours of walking through the evening streets because neither of us wanted the night to end.",
            photoUrl:
              "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
            tag: "Sparks",
          },
        ],
      },
    },

    // PAGE 3 — OUR LITTLE MEMORIES
    {
      id: "sec-love-gallery",
      type: "love_gallery",
      title: "Page 3 • Our Little Memories",
      enabled: true,
      order: 2,
      config: {
        headline: "Chapter II • Our Little Memories",
        subtext:
          "Every photograph is proof of a quiet afternoon where I fell in love with you all over again.",
        photos: [
          {
            id: "gal-1",
            url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
            caption: "Golden hour and the smile that outshines the sunset.",
            date: "Summer Getaway",
            location: "The Beach Walk",
          },
          {
            id: "gal-2",
            url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
            caption: "When you told that silly joke and neither of us could breathe.",
            date: "Autumn Rain",
            location: "Porch Cafe",
          },
          {
            id: "gal-3",
            url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
            caption: "The world blurred out completely, only you in focus.",
            date: "Every Day",
            location: "Our Spot",
          },
        ],
      },
    },

    // PAGE 4 — A LETTER FOR YOU
    {
      id: "sec-love-letter",
      type: "love_letter",
      title: "Page 4 • A Letter For You",
      enabled: true,
      order: 3,
      config: {
        headline: "Chapter III • A Letter For You",
        waxSealText: "FOREVER",
        salutation: `My Dearest ${recipientName},`,
        letterBody: `I wanted to write this because sometimes ordinary days move too fast, and I don't say the things that truly matter nearly often enough.

Before you, love was just a word in books and songs. With you, it became the comforting smell of fresh coffee on quiet mornings, the sound of your key in the front door, and the deep peace that settles in my chest whenever you rest your head on my shoulder.

Thank you for choosing me. Thank you for your warmth on my quiet days, your cheer on stressful days, and your hand in mine on every walk we take.

I love you not only for who you are, but for who I become when I am by your side. You make me want to be better, kinder, and braver.

Wherever this life takes us, remember this: you will never have to face the world alone again. My heart is yours, today, tomorrow, and across every tomorrow that follows.`,
        closing: "With all my love and devotion,",
        signature: senderName,
        dateText: "Tonight & Always",
      },
    },

    // PAGE 5 — LITTLE THINGS I LOVE ABOUT YOU
    {
      id: "sec-love-reasons",
      type: "love_reasons",
      title: "Page 5 • Things I Love About You",
      enabled: true,
      order: 4,
      config: {
        headline: "Chapter IV • Little Things I Love About You",
        subtext:
          "Tap each mounted keepsake note to unfold what my heart notices when you are simply being you.",
        cards: [
          {
            id: "rc-1",
            title: "Your Spontaneous Laughter",
            message:
              "The way you crinkle your nose and laugh without holding back—it instantly dissolves every heavy thought in the world.",
            badge: "Reason #1",
          },
          {
            id: "rc-2",
            title: "How You Look When Sleepy",
            message:
              "Wrapped like a burrito in blankets, rubbing your eyes, speaking in soft murmurs. You are the softest, safest place I know.",
            badge: "Reason #2",
          },
          {
            id: "rc-3",
            title: "The Kindness In Your Eyes",
            message:
              "How gently you treat strangers, little animals, and me even when you are exhausted. Your goodness is effortless and breathtaking.",
            badge: "Reason #3",
          },
          {
            id: "rc-4",
            title: "The Way You Hold My Hand",
            message:
              "A quiet squeeze at crosswalks, fingers interlaced in movie theaters, an anchor that tells me I will never walk alone again.",
            badge: "Reason #4",
          },
        ],
        finalCardTitle: "And The Biggest Reason Of All...",
        finalCardMessage:
          "Because loving you is as natural as breathing. I don't love you for what you do—I love you for the incredible, irreplaceable soul that you are.",
      },
    },

    // PAGE 6 — OUR FUN SIDE
    {
      id: "sec-love-puzzle",
      type: "love_puzzle",
      title: "Page 6 • Our Fun Side (Game)",
      enabled: true,
      order: 5,
      config: {
        puzzleType: "memory_match",
        headline: "Chapter V • Our Fun Side",
        subtext:
          "Match the pairs of our favourite memories to unlock a hidden secret made just for you.",
        completionMessage:
          "You solved every piece! Just like you completed every piece of my heart.",
        secretRewardText:
          "SPECIAL REWARD: One spontaneous midnight date with your favorite dessert, zero phone distractions, and endless hugs.",
        skipButtonText: "Reveal Reward 🔓",
      },
    },

    // PAGE 7 — A LITTLE SURPRISE
    {
      id: "sec-love-surprise-gift",
      type: "love_surprise_gift",
      title: "Page 7 • A Little Surprise",
      enabled: true,
      order: 6,
      config: {
        headline: "Chapter VI • A Little Surprise",
        subtext:
          "Untie the golden ribbon to reveal a collection of real, redeemable date-night privileges.",
        giftBoxTitle: "Your Exclusive Couple's Pass",
        couponCode: "LOVE-FOREVER-US",
        surprises: [
          {
            id: "cp-1",
            title: "Spontaneous Midnight Ice Cream Run 🍦",
            description: "Valid anytime, no questions asked. I'll drive, you pick the flavors.",
            tag: "Anytime",
          },
          {
            id: "cp-2",
            title: "Master Chef Home Dinner + Movie 🎬",
            description: "I cook your favorite comfort meal and let you choose every movie.",
            tag: "VIP Pass",
          },
          {
            id: "cp-3",
            title: "One Free Argument Win Pass 🏆",
            description: "Hand this to me anytime and I will instantly agree you were 100% right.",
            tag: "Golden Ticket",
          },
          {
            id: "cp-4",
            title: "A 30-Minute Shoulder & Foot Massage 💆",
            description: "Complete with lavender oil, soft music, and absolute zero complaints from me.",
            tag: "Relaxation",
          },
        ],
      },
    },

    // PAGE 8 — OUR SONG
    {
      id: "sec-love-playlist",
      type: "love_playlist",
      title: "Page 8 • Our Song",
      enabled: true,
      order: 7,
      config: {
        headline: "Chapter VII • Our Song",
        subtext: "The soundtrack to all our quiet moments and long drives.",
        songTitle: "Until I Found You",
        artistName: "Stephen Sanchez",
        audioUrl: "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3",
        personalNote:
          "The song that was playing when you first rested your head on my shoulder during our long late-night drive.",
        externalLink: "https://open.spotify.com",
      },
    },

    // PAGE 9 — OUR STORY CONTINUES
    {
      id: "sec-love-surprise",
      type: "love_surprise",
      title: "Page 9 • Our Story Continues",
      enabled: true,
      order: 8,
      config: {
        headline: "Out of all the people in this world, I'm still glad it's you ❤️",
        subtext:
          "Our story doesn't end on the final page of this book. The best chapters are yet to be written.",
        surpriseTitle: "My Eternal Promise To You",
        surpriseBody:
          "I promise to celebrate your victories as if they are my own, to hold you through the storms, to always leave you the last bite of dessert, and to choose you—every single morning—for the rest of my days.",
        photoUrl:
          "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
        actionButtonText: "Seal Our Promise 💍",
        whatsappShareText:
          "I just read through our love story book and it made me so happy! I love you more than words can say! ❤️📖✨",
      },
    },
  ];

  return {
    slug,
    title: `Our Little Love Story — ${recipientName} & ${senderName} 📖❤️`,
    recipientName,
    senderName,
    occasionType: "love",
    theme: "burgundy-velvet",
    status: "draft",
    paymentStatus: "unpaid",
    audioSettings: {
      enabled: true,
      backgroundMusicUrl:
        "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3",
      title: "Until I Found You (Acoustic)",
      artist: "Our Little Love Story",
      autoplay: false,
    },
    sections,
  };
}
