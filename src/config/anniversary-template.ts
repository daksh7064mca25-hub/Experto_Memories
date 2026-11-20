import { WebsiteProjectData, WebsiteSectionData } from "@/types/website";

export const DEFAULT_ANNIVERSARY_SECTIONS: WebsiteSectionData[] = [
  {
    id: "anniv-sec-intro",
    type: "anniversary_intro",
    title: "1. A Secret Invitation",
    enabled: true,
    order: 0,
    config: {
      headline: "Hey love... ready to relive our little story?",
      subheadline: "An intimate interactive love museum dedicated entirely to the journey of us.",
      buttonText: "Take Me Back To Us ❤️",
      coupleNames: "Olivia & Liam",
      anniversaryDate: "October 14th",
      yearsTogetherText: "3 Beautiful Years",
    },
  },
  {
    id: "anniv-sec-counter",
    type: "anniversary_counter",
    title: "2. Our Time Together",
    enabled: true,
    order: 1,
    config: {
      headline: "Our Time Together ❤️",
      subtext: "Counting every heartbeat, laugh, and quiet moment we've shared since the day our paths crossed.",
      relationshipStartDate: "October 14, 2021",
      showSeconds: true,
      milestoneMessage: "3 Beautiful Years and counting...",
    },
  },
  {
    id: "anniv-sec-first-met",
    type: "anniversary_first_met",
    title: "3. Where It All Began",
    enabled: true,
    order: 2,
    config: {
      headline: "Where It All Began ✨",
      subtext: "The day two completely different worlds collided and nothing was ever ordinary again.",
      dateText: "October 14, 2021",
      location: "Corner Coffee Roasters in the rain",
      storyText:
        "I still remember the very first second I saw you. In a crowded room, everything else simply faded into background noise. Our drink orders got mixed up, you smiled, and within five minutes I knew you were going to change my life forever.",
      photoUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    },
  },
  {
    id: "anniv-sec-timeline",
    type: "anniversary_timeline",
    title: "4. Our Memory Timeline",
    enabled: true,
    order: 3,
    config: {
      headline: "Chapters of Our Story",
      subtext: "From strangers across a crowded cafe to two hearts beating as one.",
      milestones: [
        {
          id: "m-1",
          title: "The First Date Under City Lights",
          date: "October 22, 2021",
          description:
            "Dinner turned into a 4-hour walk through the park under glowing streetlights. Neither of us wanted the night to end.",
          photos: [
            "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
          ],
          tag: "First Date",
        },
        {
          id: "m-2",
          title: "Our First Road Trip",
          date: "July 18, 2022",
          description:
            "That weekend cabin by the misty lake. Cooking burnt pancakes at 7 AM and singing along to old songs with the windows rolled down.",
          photos: [
            "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
          ],
          tag: "Adventure",
        },
        {
          id: "m-3",
          title: "Our Anniversary Today",
          date: "Present Day",
          description:
            "Three years later, and I still fall for you a little deeper with every sunrise. Happy Anniversary, my favorite human.",
          photos: [
            "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80",
          ],
          tag: "Today & Forever",
        },
      ],
    },
  },
  {
    id: "anniv-sec-then-now",
    type: "anniversary_then_now",
    title: "5. Then vs Now",
    enabled: true,
    order: 4,
    config: {
      headline: "Then vs Now ⏳",
      subtext: "Drag the slider left and right to see how our story began versus how much we've grown together.",
      thenPhotoUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      nowPhotoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      thenLabel: "THEN (2021)",
      nowLabel: "NOW (TODAY)",
      thenDate: "Oct 2021",
      nowDate: "Today",
      storyText: "Two kids who had no idea how deeply they would end up loving each other.",
    },
  },
  {
    id: "anniv-sec-reasons",
    type: "anniversary_reasons",
    title: "6. Reasons I Choose You",
    enabled: true,
    order: 5,
    config: {
      headline: "Reasons I Choose You 💖",
      subtext: "Tap each card to reveal one of the countless reasons why my heart will always belong to you.",
      reasons: [
        {
          id: "r-1",
          title: "Your Infectious Laughter",
          description: "The way you laugh from your whole chest at my silliness makes any terrible day instantly disappear.",
          emoji: "💫",
        },
        {
          id: "r-2",
          title: "How Safe You Make Me Feel",
          description: "In a chaotic and unpredictable world, being in your arms is the only place that feels like absolute home.",
          emoji: "🏡",
        },
        {
          id: "r-3",
          title: "Your Relentless Kindness",
          description: "Watching how gently you treat animals, strangers, and the people you love inspires me every day.",
          emoji: "🌸",
        },
        {
          id: "r-4",
          title: "The Quiet Moments",
          description: "Drinking coffee in silence on Sunday mornings, holding hands in traffic, or just watching you sleep peacefully.",
          emoji: "☕",
        },
        {
          id: "r-5",
          title: "You Are My Best Friend",
          description: "Before romance, before everything else, you are the first person I want to tell every piece of news.",
          emoji: "💍",
        },
      ],
    },
  },
  {
    id: "anniv-sec-museum",
    type: "anniversary_museum",
    title: "7. The Love Museum",
    enabled: true,
    order: 6,
    config: {
      headline: "The Love Museum 🏛️",
      subtext: "Curated moments and priceless artifacts from the journey of us. Tap any exhibit for curatorial notes.",
      exhibits: [
        {
          id: "ex-1",
          title: "Exhibit A: The Rainstorm Coffee",
          date: "October 2021",
          photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
          description: "Caught in an unexpected downpour, we ran laughing into that tiny café and talked until the streetlights came on.",
          tag: "Origin",
        },
        {
          id: "ex-2",
          title: "Exhibit B: Mountain Summit Sunset",
          date: "July 2022",
          photoUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
          description: "After three hours of steep hiking, we sat on the rock ledge wrapped in one jacket, watching the sun dip into the valley.",
          tag: "Adventure",
        },
        {
          id: "ex-3",
          title: "Exhibit C: Midnight Road Trip",
          date: "December 2023",
          photoUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          description: "Windows down, playlist on repeat, singing every word at the top of our lungs while the highway stretched endlessly.",
          tag: "Memory",
        },
      ],
    },
  },
  {
    id: "anniv-sec-soundtrack",
    type: "anniversary_soundtrack",
    title: "8. Our Song",
    enabled: true,
    order: 7,
    config: {
      headline: "The Melody of Us 🎵",
      subtext: "The song that always pulls us onto the dance floor, no matter where we are.",
      songTitle: "Golden Acoustic Melody",
      artist: "Romantic Piano Strings",
      audioUrl: "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3",
      personalExplanation: "Every chord reminds me of slow dancing in the kitchen while dinner was simmering on the stove.",
    },
  },
  {
    id: "anniv-sec-future-letter",
    type: "anniversary_future_letter",
    title: "9. A Letter From My Heart",
    enabled: true,
    order: 8,
    config: {
      envelopeTeaser: "A Love Letter Just For You",
      headline: "To My Forever Person",
      letterBody: [
        "As we celebrate where we are today, my heart is overflowing with gratitude for everything you are and excitement for everything that still awaits us.",
        "I picture the cozy home we'll continue building, the morning coffees on sunlit balconies, the spontaneous weekend getaways, and the quiet comfort of being by each other's side through every season of life.",
        "Thank you for being my anchor, my best friend, and my greatest adventure. I promise to keep dating you, cherishing you, and choosing you forever.",
      ],
      signoff: "Yours through all our tomorrows,",
      promises: [
        "I promise to always hold your hand when walking together.",
        "I promise to make you laugh when life gets too serious.",
        "I promise to never stop listening with an open heart.",
      ],
    },
  },
  {
    id: "anniv-sec-finale",
    type: "anniversary_finale",
    title: "10. The Final Promise",
    enabled: true,
    order: 9,
    config: {
      headline: "Another Year, A Lifetime More",
      finalMessage:
        "Every single day with you proves that true love isn't just found — it is created, treasured, and chosen every morning.",
      anniversaryDate: "October 14th",
      questionText: "Ready for another beautiful chapter with me?",
      acceptButtonText: "Yes, Forever & Always 💍",
      celebrationTitle: "To Us, Today and Always! 🥂",
      celebrationMessage:
        "Thank you for making our story the most magical adventure of my life. I love you more than words could ever tell.",
    },
  },
];

export const createDefaultAnniversaryProject = (
  slug: string,
  partner1Name: string = "Olivia",
  partner2Name: string = "Liam"
): WebsiteProjectData => ({
  slug,
  title: `Our Forever Story — ${partner1Name} & ${partner2Name}`,
  recipientName: partner1Name,
  senderName: partner2Name,
  occasionType: "anniversary",
  partner1Name,
  partner2Name,
  anniversaryDate: "October 14th",
  relationshipStartDate: "October 14, 2021",
  yearsTogether: 3,
  theme: "pink-paradise",
  sections: JSON.parse(JSON.stringify(DEFAULT_ANNIVERSARY_SECTIONS)),
  audioSettings: {
    enabled: true,
    backgroundMusicUrl:
      "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3",
    title: "Golden Acoustic Melody",
    artist: "Romantic Piano Strings",
    autoplay: false,
  },
  status: "draft",
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: new Date(),
});
