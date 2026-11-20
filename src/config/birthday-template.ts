import { WebsiteProjectData, WebsiteSectionData, BirthdayThemeId } from "@/types/website";

export type BirthdayRelationship =
  | "general"
  | "mother"
  | "father"
  | "sister"
  | "brother"
  | "best-friend"
  | "wife"
  | "husband"
  | "kids";

export function createRelationshipBirthdayProject(
  slug: string,
  recipientName = "Ananya",
  senderName = "Rohan & Family",
  relationship: BirthdayRelationship | string = "general",
  age = 25
): WebsiteProjectData {
  const rel = (relationship || "general").toLowerCase();

  // Content customization based on relationship
  let headline = `Happy Birthday, ${recipientName}! 🎂✨`;
  let subheadline = `Another trip around the sun for someone who makes every day brighter. Today is dedicated entirely to you, your laughter, and celebrating the wonderful person you are!`;
  let cakeHeadline = "Blow The Candles & Make A Wish 🎂";
  let cakeSubtext = "Close your eyes, make the secret wish of your heart, and tap each candle flame to extinguish it!";
  let scratchMessage = `HAPPY BIRTHDAY! 🌟\nYou've won unlimited hugs, a weekend getaway plan, and dessert on me!`;
  let scratchGift = "Redeemable with sender anytime this year! 🥂";
  let letterSalutation = `Dearest ${recipientName},`;
  let letterParagraphs = [
    `Happy, happy birthday! As you celebrate another incredible milestone, I wanted to pause and remind you just how deeply special you are.`,
    `Your kindness, your strength, and the effortless way you bring warmth into the lives of everyone around you is nothing short of extraordinary. The world is so much brighter simply because you are in it.`,
    `May this coming year bring you health, audacious joy, adventures you'll talk about for decades, and peace in every quiet moment. Never forget how loved and cherished you are.`,
  ];
  let finaleMessage = `Thank you for making this world a kinder, happier, and infinitely more wonderful place just by being you. Here is to health, unshakeable happiness, and a year full of magic!`;
  let theme: BirthdayThemeId = "golden-champagne";

  let balloons = [
    {
      id: "b-1",
      color: "#f43f5e",
      message: "May your coming year be filled with spontaneous road trips, belly laughs, and zero worries! 🌟",
      author: "With Love",
    },
    {
      id: "b-2",
      color: "#ec4899",
      message: "Wishing you big wins, effortless courage, and every single dream on your vision board! ✨",
      author: "Always Cheering",
    },
    {
      id: "b-3",
      color: "#8b5cf6",
      message: "Thank you for lighting up every room with your infectious smile and radiant kindness! 💖",
      author: "Forever Grateful",
    },
    {
      id: "b-4",
      color: "#3b82f6",
      message: "May your coffee always be hot, your skin glowing, and your heart always at peace! ☕",
      author: "Best Wishes",
    },
    {
      id: "b-5",
      color: "#10b981",
      message: "Here's to celebrating YOU — the world is so much happier with you in it! 🥂",
      author: "Cheers!",
    },
  ];

  if (rel === "mother" || rel === "mom") {
    headline = `Happy Birthday to the World's Best Mom! 🌸✨`;
    subheadline = `To the beating heart of our home, the quiet miracle-worker, and the woman whose unconditional love shaped everything good in our lives.`;
    cakeHeadline = "Blow The Candles, Mom — Make a Wish Just For You! 🎂";
    cakeSubtext = "You spend every day caring for everyone else. Today, close your eyes and wish for your own happiness and peace.";
    theme = "golden-champagne";
    balloons = [
      {
        id: "b-1",
        color: "#f43f5e",
        message: "Thank you for every quiet sacrifice you made without ever asking for praise or applause. 🤍",
        author: "With Immense Gratitude",
      },
      {
        id: "b-2",
        color: "#ec4899",
        message: "Your warm hugs, your healing voice, and your home-cooked meals will always be the purest comfort in this world. 🍲",
        author: "Always Loved",
      },
      {
        id: "b-3",
        color: "#8b5cf6",
        message: "Wishing you serene mornings, unhurried chai, and radiant health in every season of life! 🌿",
        author: "Warmest Wishes",
      },
      {
        id: "b-4",
        color: "#3b82f6",
        message: "No matter how old or busy I get, coming home to you will always be my safest sanctuary. 🏡",
        author: "Forever Your Child",
      },
      {
        id: "b-5",
        color: "#10b981",
        message: "Here is to celebrating the most selfless, graceful, and beautiful mother in the universe! 💐",
        author: "With All Our Hearts",
      },
    ];
    scratchMessage = `HAPPY BIRTHDAY MOM! 💐\nYou've won: A complete weekend off from all cooking & chores, a spa day, and your favorite feast prepared for you!`;
    scratchGift = "100% Guaranteed and redeemable anytime! 🥂";
    letterSalutation = `Dearest Mom,`;
    letterParagraphs = [
      `Happy birthday to the most wonderful woman in my world. As we celebrate you today, words feel too small to express how deeply grateful I am to have you as my mother.`,
      `You have given me the foundation to stand tall, the courage to chase my dreams, and the gentlest safe harbor whenever life got overwhelming. Your wisdom and patience are a masterclass in love.`,
      `Today and every day, I pray for your health, your laughter, and for your days to be filled with the same boundless joy that you have poured into all of us.`,
    ];
    finaleMessage = `Happy Birthday Mom! Thank you for giving us roots and wings. May this year shower you with all the peace and joy you so richly deserve.`;
  } else if (rel === "father" || rel === "dad") {
    headline = `To My Pillar of Strength & Hero — Happy Birthday, Dad! 🎖️`;
    subheadline = `For your quiet wisdom, endless dedication, and the steady anchor you have always been for our family.`;
    cakeHeadline = "Blow The Candles, Dad — A Toast to Your Legacy! 🎂";
    cakeSubtext = "Close your eyes, Dad. Today we honor your hard work, your guidance, and your loving heart.";
    theme = "golden-champagne";
    balloons = [
      {
        id: "b-1",
        color: "#1e3a8a",
        message: "Thank you for working tirelessly behind the scenes so we could chase every wild dream. 🌟",
        author: "With Deep Respect",
      },
      {
        id: "b-2",
        color: "#0f766e",
        message: "For all the late-night road trip conversations, life advice, and dad jokes that still make us groan and smile! 🚗",
        author: "Forever Proud",
      },
      {
        id: "b-3",
        color: "#78350f",
        message: "Wishing you unbreakable health, serene retirement mornings, and golf or chai sessions with zero worries! ☕",
        author: "Warmest Prayers",
      },
      {
        id: "b-4",
        color: "#4338ca",
        message: "You taught me what true integrity, resilience, and honor look like by the simple way you live your life. ⚓",
        author: "Always Inspired",
      },
      {
        id: "b-5",
        color: "#15803d",
        message: "Proudest child in the world to call you my father. Here's to your health and happiness, Dad! 🥂",
        author: "With Deep Love",
      },
    ];
    scratchMessage = `HAPPY BIRTHDAY DAD! 🏆\nYou've won: Total TV remote monopoly, an all-inclusive family dinner at your favorite restaurant, and zero unsolicited advice for a month!`;
    scratchGift = "Signed and guaranteed by the family! ☕";
    letterSalutation = `Dearest Dad,`;
    letterParagraphs = [
      `Happy birthday to my first hero and lifelong guide. Looking back on every challenge I faced, your calm presence and steady belief in me were always what kept me grounded.`,
      `You never asked for fanfare or applause; you simply showed up every single day and gave everything for our happiness. That quiet devotion is the greatest lesson in strength anyone could ever receive.`,
      `I wish you vibrant health, deep peace of mind, and the happiest year ahead. Thank you for being the father everyone wishes they had.`,
    ];
    finaleMessage = `Happy Birthday Dad! Thank you for leading our family with dignity, patience, and love. Here's to many more golden years together!`;
  } else if (rel === "best-friend" || rel === "friend") {
    headline = `To My Partner in Crime — Happy Birthday Bestie! 🎉`;
    subheadline = `Another year of questionable decisions, laughing till our abs hurt, sharing unhinged memes, and an unbreakable bond!`;
    cakeHeadline = "Blow Out The Candles, Bestie! Make a Big Wild Wish 🎂";
    cakeSubtext = "Make a wish that scares you! The candles are lit and the universe is taking notes.";
    theme = "blush-wonderland";
    balloons = [
      {
        id: "b-1",
        color: "#d946ef",
        message: "Thank you for being the first person I text when chaotic tea drops at 2 AM! 📱",
        author: "Your Ride-or-Die",
      },
      {
        id: "b-2",
        color: "#ec4899",
        message: "Here's to the only human alive who knows all my embarrassing secrets and hasn't blackmailed me yet. 🤫",
        author: "Friend For Life",
      },
      {
        id: "b-3",
        color: "#8b5cf6",
        message: "May your upcoming year be packed with spontaneous trips, massive career wins, and zero toxic people! 🚀",
        author: "Cheering Loudest",
      },
      {
        id: "b-4",
        color: "#3b82f6",
        message: "From surviving college breakdowns to celebrating big life moments — wouldn't trade our friendship for anything! 👯",
        author: "Forever Connected",
      },
      {
        id: "b-5",
        color: "#10b981",
        message: "Happy birthday to my soul sibling! Tonight, the first round of desserts and drinks is 100% on me! 🥂",
        author: "Cheers to Us!",
      },
    ];
    scratchMessage = `HAPPY BIRTHDAY BESTIE! 🍕\nYou've won: A midnight street food crawl + an all-access pass to vent to me whenever you need without judgment!`;
    scratchGift = "Non-transferable best friend pass! 💃";
    letterSalutation = `Hey Bestie,`;
    letterParagraphs = [
      `Happy birthday to the person who makes life a thousand times more exciting and hilarious! I honestly don't know how I would navigate this crazy world without our daily check-ins, rants, and laughter.`,
      `You show up for me on the good days, the bad days, and the days when I make completely ridiculous choices. Having a friend who loves you unconditionally while laughing at your clumsiness is the greatest gift.`,
      `May this year bring you all the success, happiness, romance, and peace you've been working so hard for. Let's make this your best trip around the sun yet!`,
    ];
    finaleMessage = `Happy Birthday to my favorite human! Here is to conquering another year together with inside jokes and unstoppable energy!`;
  } else if (rel === "kids" || rel === "kid") {
    headline = `Happy Birthday Superhero! 🚀🎈`;
    subheadline = `Put on your superhero cape — today is all about balloons, superpowers, giant cake, and magical adventures!`;
    cakeHeadline = "Make a Big Magic Wish & Blow Out the Candles! 🎂✨";
    cakeSubtext = "Close your eyes, make a super magical wish, and blow all the candles away!";
    theme = "blush-wonderland";
    balloons = [
      {
        id: "b-1",
        color: "#f43f5e",
        message: "You have the superpower of making everyone smile wherever you go! 🦸",
        author: "Super Cheer",
      },
      {
        id: "b-2",
        color: "#3b82f6",
        message: "May your day be filled with your favorite toys, giant slices of cake, and fun games! 🎮",
        author: "Playtime Champ",
      },
      {
        id: "b-3",
        color: "#8b5cf6",
        message: "Never stop asking curious questions and dreaming sky-high dreams! 🚀",
        author: "Star Explorer",
      },
      {
        id: "b-4",
        color: "#10b981",
        message: "Wishing you the happiest birthday full of giggles, hugs, and candy! 🍭",
        author: "Sweet Magic",
      },
      {
        id: "b-5",
        color: "#f59e0b",
        message: "You are our biggest blessing and the sweetest kid in the whole universe! 🌟",
        author: "With All Our Love",
      },
    ];
    scratchMessage = `HAPPY BIRTHDAY SUPERSTAR! 🎁\nYou unlocked: The Giant Toy Surprise + Extra Ice Cream Cone + A Day at the Amusement Park!`;
    scratchGift = "Redeemable with Mommy & Daddy! 🍦";
    letterSalutation = `Dearest ${recipientName},`;
    letterParagraphs = [
      `Happy, happy birthday to our little champion! Watching you grow, laugh, and discover the world is the greatest joy of our lives.`,
      `You bring so much sunshine into our home with your sweet smile and creative imagination. Always remember how special, smart, and brave you are.`,
      `May your birthday be packed with delicious treats, fun games, and hugs from everyone who loves you!`,
    ];
    finaleMessage = `Happy Birthday Superstar! Keep shining your bright light and having the most awesome adventures!`;
  } else if (rel === "sister") {
    headline = `To My Wonderful Sister — Happy Birthday! 🌸✨`;
    subheadline = `From childhood secrets and closet borrowing to being each other's lifelong cheerleader, today is all about celebrating you!`;
    theme = "blush-wonderland";
    scratchMessage = `HAPPY BIRTHDAY SIS! 👗\nYou've won: 1 week of borrowing my favorite outfits without asking + a coffee date on me!`;
    scratchGift = "Sisterly pact activated! ☕";
    letterSalutation = `Dearest Sister,`;
    letterParagraphs = [
      `Happy birthday to my first best friend and forever confidante! Having a sister like you is one of life's greatest blessings.`,
      `Through all the squabbles over the remote and all the late-night heart-to-hearts, you have always been someone I can count on completely.`,
      `I wish you all the happiness, love, and dream-come-true moments in the world. Shine bright today!`,
    ];
  } else if (rel === "brother") {
    headline = `Happy Birthday to My Brother! ⚡🎮`;
    subheadline = `To my partner in trouble, my biggest protector, and the guy who always has my back — cheers to your day!`;
    theme = "golden-champagne";
    scratchMessage = `HAPPY BIRTHDAY BRO! 🍕\nYou've won: Unlimited gaming bragging rights for 24 hours + pizza on me!`;
    scratchGift = "Brotherly agreement! 🏆";
    letterSalutation = `Hey Bro,`;
    letterParagraphs = [
      `Happy birthday to the coolest brother anyone could ask for! Life would be pretty boring without your jokes, competitive spirit, and support.`,
      `Thank you for always standing up for me and being someone I can always rely on, no matter what.`,
      `Hope this year brings you huge wins, exciting road trips, and everything you've been working towards!`,
    ];
  }

  const sections: WebsiteSectionData[] = [
    {
      id: "sec-bday-invitation",
      type: "birthday_invitation",
      title: "1. The Birthday Invitation",
      enabled: true,
      order: 0,
      config: {
        headline: "A Special Surprise Awaits",
        teaserText: `A hand-crafted digital celebration created with love by ${senderName}.`,
        envelopePrompt: "Tap to Unbox Your Gift 🎁",
      },
    },
    {
      id: "sec-bday-welcome",
      type: "birthday_welcome",
      title: "2. The Birthday Welcome",
      enabled: true,
      order: 1,
      config: {
        headline,
        subheadline,
        birthdayDate: "Today",
        age,
        showCountdown: true,
        buttonText: "Discover Your Surprise 🎈",
      },
    },
    {
      id: "sec-bday-balloons",
      type: "birthday_balloons",
      title: "3. Balloon Surprise",
      enabled: true,
      order: 2,
      config: {
        headline: "Pop The Birthday Balloons 🎈",
        subtext: "Each floating balloon holds a secret wish written especially for you. Tap them to pop!",
        balloons,
      },
    },
    {
      id: "sec-bday-cake",
      type: "birthday_cake",
      title: "4. Interactive Birthday Cake",
      enabled: true,
      order: 3,
      config: {
        headline: cakeHeadline,
        subtext: cakeSubtext,
        candlesCount: 5,
        allowMicBlowing: true,
        wishMessage: "May every wish whispered today find its way to you.",
        celebrationTitle: "Wish Sealed in The Stars! ✨",
        celebrationText: "Candles blown out! The universe is now conspiring to make it happen.",
      },
    },
    {
      id: "sec-bday-scrapbook",
      type: "birthday_scrapbook",
      title: "5. The Memory Scrapbook",
      enabled: true,
      order: 4,
      config: {
        headline: "The Birthday Scrapbook 📸",
        subtext: "Frozen in time — the smiles, silly moments, and adventures that make you so unforgettable.",
        photos: [
          {
            id: "photo-1",
            url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
            caption: "Day 1 of making the entire world brighter! ✨",
            date: "Childhood Magic",
            rotation: -2,
          },
          {
            id: "photo-2",
            url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
            caption: "Graduation day win — we screamed louder than anyone else! 🎓",
            date: "Milestone Day",
            rotation: 2.5,
          },
          {
            id: "photo-3",
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            caption: "That epic sunny trip where we made memories for a lifetime 🌊",
            date: "Cherished Moment",
            rotation: -1.5,
          },
        ],
      },
    },
    {
      id: "sec-bday-game",
      type: "birthday_game",
      title: "6. Birthday Surprise Game",
      enabled: true,
      order: 5,
      config: {
        headline: "Scratch To Reveal Your Prize 🎁",
        subtext: "Rub or drag your finger across the golden foil to unlock your personalized birthday surprise!",
        scratchMessage,
        secretGiftText: scratchGift,
        gameType: "scratch",
      },
    },
    {
      id: "sec-bday-letter",
      type: "birthday_letter",
      title: "7. Personal Letter",
      enabled: true,
      order: 6,
      config: {
        envelopeTitle: "A Birthday Letter For You 💌",
        salutation: letterSalutation,
        letterBody: letterParagraphs,
        signoff: "With all my love and warmest wishes,",
        senderName,
      },
    },
    {
      id: "sec-bday-finale",
      type: "birthday_finale",
      title: "8. Grand Birthday Finale",
      enabled: true,
      order: 7,
      config: {
        headline: `Happy Birthday, ${recipientName}! 🥂✨`,
        finalMessage: finaleMessage,
        celebrationPhotoUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
        replayButtonText: "Replay Celebration ↺",
      },
    },
  ];

  return {
    slug,
    title: `The Birthday Wonderland — For ${recipientName} 🎂`,
    recipientName,
    senderName,
    occasionType: "birthday",
    birthdayDate: "Today",
    age,
    theme,
    status: "draft",
    sections,
    audioSettings: {
      enabled: true,
      backgroundMusicUrl: "https://assets.mixkit.co/music/preview/mixkit-celebration-happiness-565.mp3",
      title: "Acoustic Birthday Melody",
      artist: "ExpertoMemories Soundtrack",
      autoplay: false,
    },
  };
}

export function createDefaultBirthdayProject(
  slug: string,
  recipientName = "Ananya",
  senderName = "Rohan & Family"
): WebsiteProjectData {
  return createRelationshipBirthdayProject(slug, recipientName, senderName, "general", 25);
}
