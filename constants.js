export const PILLAR_ACTIONS = {
  breathing: {
    action: "Nose Breathing",
    description: "Practiced 2 minutes of focused nose-only breathing.",
    icon: "air",
  },
  sleep: {
    action: "Digital Sunset",
    description: "Avoided all screens for 30 minutes before bed.",
    icon: "bedtime",
  },
  hydration: {
    action: "Morning Hydration",
    description: "Drank 500ml of water immediately upon waking.",
    icon: "water-drop",
  },
  nutrition: {
    action: "Protein First",
    description: "Included a quality protein source with breakfast.",
    icon: "restaurant",
  },
  movement: {
    action: "Daily 10",
    description: "Completed a brisk 10-minute walk or movement session.",
    icon: "directions-run",
  },
  environment: {
    action: "Light Exposure",
    description: "Spent 15 minutes outdoors in natural sunlight.",
    icon: "park",
  },
  mindfulness: {
    action: "Daily Gratitude",
    description: "Wrote down 3 things I am genuinely grateful for.",
    icon: "psychology",
  },
};

export const WORKOUTS = [
  {
    id: "1",
    title: "Morning Kickstart",
    duration: 10,
    level: "Beginner",
    type: "Bodyweight",
    image: "https://picsum.photos/400/300?random=1",
    category: "Cardio",
  },
  {
    id: "2",
    title: "Lunch Break Burn",
    duration: 15,
    level: "Intermediate",
    type: "Bodyweight",
    image: "https://picsum.photos/400/300?random=2",
    category: "Strength",
  },
  {
    id: "3",
    title: "Evening Unwind",
    duration: 20,
    level: "Beginner",
    type: "Mobility",
    image: "https://picsum.photos/400/300?random=3",
    category: "Mobility",
  },
];

export const PILLARS = [
  { name: "Breathing", id: "breathing", icon: "air" },
  { name: "Sleep", id: "sleep", icon: "bedtime" },
  { name: "Hydration", id: "hydration", icon: "water-drop" },
  { name: "Nutrition", id: "nutrition", icon: "restaurant" },
  { name: "Movement", id: "movement", icon: "directions-run" },
  { name: "Environment", id: "environment", icon: "park" },
  { name: "Mindfulness", id: "mindfulness", icon: "psychology" },
];

export const FAVORITE_MEALS = [
  {
    name: "Oatmeal & Berries",
    kcal: 350,
    image: "https://picsum.photos/200/200?random=10",
  },
  {
    name: "Chicken Salad",
    kcal: 420,
    image: "https://picsum.photos/200/200?random=11",
  },
];

// 21-Day Pillar Challenges
// 4 phases (5 days each) + Day 21 celebration
export const TWENTY_ONE_DAY_CHALLENGES = {
  breathing: {
    name: "Breathing",
    icon: "air",
    tasks: [
      {
        id: "morning_breath",
        name: "Morning Breath Check",
        description: "Take 5 deep belly breaths upon waking",
        unlockedDay: 1,
        phase: 1,
      },
      {
        id: "stress_reset",
        name: "Stress Reset",
        description:
          "4-7-8 breathing when stressed (inhale 4s, hold 7s, exhale 8s)",
        unlockedDay: 6,
        phase: 2,
      },
      {
        id: "box_breathing",
        name: "Box Breathing Break",
        description:
          "5-minute box breathing during lunch (4s inhale, 4s hold, 4s exhale, 4s hold)",
        unlockedDay: 11,
        phase: 3,
      },
      {
        id: "evening_wind",
        name: "Evening Wind-Down",
        description: "10 slow breaths before bed, extending exhale",
        unlockedDay: 16,
        phase: 4,
      },
    ],
  },
  sleep: {
    name: "Sleep",
    icon: "bedtime",
    tasks: [
      {
        id: "consistent_wake",
        name: "Consistent Wake Time",
        description: "Wake up at the same time every day (within 30 min)",
        unlockedDay: 1,
        phase: 1,
      },
      {
        id: "screen_curfew",
        name: "Screen Curfew",
        description: "No screens 30 minutes before bed",
        unlockedDay: 6,
        phase: 2,
      },
      {
        id: "cool_dark",
        name: "Cool & Dark",
        description: "Bedroom temp below 68°F, blackout conditions",
        unlockedDay: 11,
        phase: 3,
      },
      {
        id: "wind_down_ritual",
        name: "Wind-Down Ritual",
        description:
          "15-min relaxation routine (reading, stretching, journaling)",
        unlockedDay: 16,
        phase: 4,
      },
    ],
  },
  hydration: {
    name: "Hydration",
    icon: "water-drop",
    tasks: [
      {
        id: "morning_hydration",
        name: "Morning Hydration",
        description: "Drink 16oz water within 30 min of waking",
        unlockedDay: 1,
        phase: 1,
      },
      {
        id: "water_tracking",
        name: "Water Tracking",
        description: "Log and drink at least 64oz total daily",
        unlockedDay: 6,
        phase: 2,
      },
      {
        id: "electrolyte_balance",
        name: "Electrolyte Balance",
        description: "Add electrolytes or mineral-rich water once daily",
        unlockedDay: 11,
        phase: 3,
      },
      {
        id: "pre_meal_hydration",
        name: "Pre-Meal Hydration",
        description: "Drink 8oz water 15 min before each meal",
        unlockedDay: 16,
        phase: 4,
      },
    ],
  },
  nutrition: {
    name: "Nutrition",
    icon: "restaurant",
    tasks: [
      {
        id: "protein_first",
        name: "Protein First",
        description: "Eat protein within 1 hour of waking",
        unlockedDay: 1,
        phase: 1,
      },
      {
        id: "eat_rainbow",
        name: "Eat the Rainbow",
        description: "Include 3+ colors of vegetables daily",
        unlockedDay: 6,
        phase: 2,
      },
      {
        id: "mindful_eating",
        name: "Mindful Eating",
        description: "No screens during at least one meal, chew thoroughly",
        unlockedDay: 11,
        phase: 3,
      },
      {
        id: "fiber_focus",
        name: "Fiber Focus",
        description: "Aim for 25-30g fiber (track one day per week)",
        unlockedDay: 16,
        phase: 4,
      },
    ],
  },
  movement: {
    name: "Movement",
    icon: "directions-run",
    tasks: [
      {
        id: "daily_walk",
        name: "Daily Walk",
        description:
          "Walk for at least 10 minutes outdoors (15 min Phase 2, 20 min Phase 3+)",
        unlockedDay: 1,
        phase: 1,
      },
      {
        id: "movement_snacks",
        name: "Movement Snacks",
        description:
          "3 micro-movements throughout the day (squats, stretches, stairs)",
        unlockedDay: 6,
        phase: 2,
      },
      {
        id: "strength_session",
        name: "Strength Session",
        description: "2x per week bodyweight or resistance training (15+ min)",
        unlockedDay: 11,
        phase: 3,
      },
      {
        id: "mobility_work",
        name: "Mobility Work",
        description: "5-10 min daily stretching or yoga",
        unlockedDay: 16,
        phase: 4,
      },
    ],
  },
  environment: {
    name: "Environment",
    icon: "park",
    tasks: [
      {
        id: "morning_light",
        name: "Morning Light",
        description: "Get 10 min of natural sunlight within 1 hour of waking",
        unlockedDay: 1,
        phase: 1,
      },
      {
        id: "declutter_zone",
        name: "Declutter Zone",
        description: "Spend 5 min tidying one area in your living space",
        unlockedDay: 6,
        phase: 2,
      },
      {
        id: "nature_time",
        name: "Nature Time",
        description: "Spend 20+ minutes in nature (park, garden, trail)",
        unlockedDay: 11,
        phase: 3,
      },
      {
        id: "digital_detox",
        name: "Digital Detox",
        description: "1 hour phone-free time in the evening",
        unlockedDay: 16,
        phase: 4,
      },
    ],
  },
  mindfulness: {
    name: "Mindfulness",
    icon: "psychology",
    tasks: [
      {
        id: "gratitude_moment",
        name: "Gratitude Moment",
        description: "Write or think of 3 things you're grateful for",
        unlockedDay: 1,
        phase: 1,
      },
      {
        id: "mindful_minute",
        name: "Mindful Minute",
        description:
          "1-5 minutes of present-moment awareness (Phase 2: 1 min, Phase 3+: 5 min)",
        unlockedDay: 6,
        phase: 2,
      },
      {
        id: "reflection_check",
        name: "Reflection Check",
        description: "End-of-day reflection: What went well? What to improve?",
        unlockedDay: 11,
        phase: 3,
      },
      {
        id: "intention_setting",
        name: "Intention Setting",
        description: "Set one clear intention each morning",
        unlockedDay: 16,
        phase: 4,
      },
    ],
  },
};

// Backward compat alias
export const THIRTY_DAY_CHALLENGES = TWENTY_ONE_DAY_CHALLENGES;

// Phase structure
export const CHALLENGE_PHASES = [
  { phase: 1, days: "1-5", taskCount: 1, focus: "Foundation", label: "Build the core habit" },
  { phase: 2, days: "6-10", taskCount: 2, focus: "Expansion", label: "Add complementary habit" },
  { phase: 3, days: "11-15", taskCount: 3, focus: "Deepening", label: "Increase complexity" },
  { phase: 4, days: "16-20", taskCount: 4, focus: "Mastery", label: "Full daily practice" },
];

// Day 21 "Cherry on Top" capstone challenges per pillar
export const DAY_21_CHALLENGES = {
  breathing: {
    name: "The 20-Minute Breath Journey",
    description: "Extended breathwork creates a profound state shift you'll want to explore further.",
    icon: "self-improvement",
  },
  sleep: {
    name: "The Sleep Sanctuary Reset",
    description: "Transform your space — make the habit tangible and permanent.",
    icon: "king-bed",
  },
  hydration: {
    name: "The Hydration Awareness Day",
    description: "Full-day tracking reveals how far you've come.",
    icon: "water",
  },
  nutrition: {
    name: "The Celebration Meal",
    description: "Cook a nourishing meal that connects emotion to nutrition.",
    icon: "dinner-dining",
  },
  movement: {
    name: "The Personal Record Day",
    description: "Achieve a PR — build confidence to push further with coaching.",
    icon: "fitness-center",
  },
  environment: {
    name: "The Digital Sunset",
    description: "A full evening unplugged shows you what's possible.",
    icon: "wb-twilight",
  },
  mindfulness: {
    name: "The Silent Hour",
    description: "Extended mindfulness opens the door to deeper practice.",
    icon: "spa",
  },
};

// Day 21 rewards for completing the challenge
export const DAY_21_REWARDS = [
  "Free Behavior Framework Call with Coach Al",
  "Free 1-Hour Training Session with Al",
];

// Pillar-specific Coach Al videos (Day 10 milestone)
export const PILLAR_VIDEOS = {
  breathing: require("./assets/videos/breathing.mp4"),
  hydration: require("./assets/videos/watering.mp4"),
  nutrition: require("./assets/videos/food.mp4"),
  movement: require("./assets/videos/movement.mp4"),
  environment: require("./assets/videos/environment.mp4"),
  mindfulness: require("./assets/videos/mindfulness.mp4"),
  sleep: require("./assets/videos/sleep.mp4"),
};

// Challenge trigger milestones
export const CHALLENGE_TRIGGERS = {
  phase1: {
    triggerDay: 5,
    type: "encouragement",
    icon: "emoji-emotions",
  },
  phase2: {
    triggerDay: 10,
    type: "video",
    icon: "play-circle-filled",
    label: "Mid-Challenge Video from Coach Al",
  },
  phase3: {
    triggerDay: 15,
    type: "discount",
    icon: "local-offer",
    label: "15% Off Coaching",
    discount: "15%",
    code: "PILLAR15",
  },
  day21: {
    triggerDay: 21,
    type: "reward",
    icon: "card-giftcard",
  },
};

// Phase-specific encouragement messages per pillar
export const PHASE_ENCOURAGEMENT = {
  breathing: "You've committed 5 days to better breathing — your nervous system is already thanking you. Keep going!",
  sleep: "5 days of consistent sleep habits! Your body is starting to reset its internal clock. Don't stop now.",
  hydration: "You've hydrated intentionally for 5 straight days. Your energy and focus are already improving!",
  nutrition: "5 days of fueling your body right! You're building a foundation for lasting energy.",
  movement: "You've moved your body for 5 days in a row. The momentum is real — let's keep it rolling!",
  environment: "5 days of shaping your environment. You're proving that small changes create big shifts.",
  mindfulness: "5 days of mindful awareness. You're rewiring your brain for calm and clarity. Beautiful work!",
};

// Helper function to get current phase from day
export const getPhaseFromDay = (day) => {
  if (day <= 5) return 1;
  if (day <= 10) return 2;
  if (day <= 15) return 3;
  if (day <= 20) return 4;
  return 5; // Day 21 — celebration
};

// Keep backward compat
export const getWeekFromDay = getPhaseFromDay;

// Helper function to get available tasks for a given day
export const getAvailableTasks = (pillarId, currentDay) => {
  const challenge = TWENTY_ONE_DAY_CHALLENGES[pillarId];
  if (!challenge) return [];
  return challenge.tasks.filter((task) => task.unlockedDay <= currentDay);
};

// Book Content - "Burnt Out and Ready to Feel Great" by Al Cummings
export const BOOK_CHAPTERS = [
  {
    id: "intro",
    title: "Introduction",
    subtitle: "The Skinny Kid Who Ate Everything and Absorbed Nothing",
    icon: "menu-book",
    readTime: 12,
    sections: [
      {
        heading: "The Beginning",
        content:
          "I used to hide sandwiches behind radiators until they grew mold.\n\nNot because I was conducting science experiments or had some weird fetish for decomposition. I hid them because my mom packed them with love every morning, and I couldn't bear to tell her that \"normal\" food she made got in the way of my sugar high. So I'd smile, take the lunch, and systematically hide it in increasingly creative places\u2014bottom of lockers, under my bed, behind heating units\u2014until the smell gave me away months later.\n\nThis is a book about transformation, but not the kind you see in fitness magazines. There's no dramatic before-and-after photo where I went from fat to fit in 90 days. Instead, this is the story of a skinny kid who ate 4,000 calories a day and absorbed nothing, who trained four hours daily but got weaker, who slept five hours a night and called it productivity, who spent decades slowly poisoning himself while calling it normal.\n\nAt my worst, I was 155 pounds of contradiction on a six-foot frame\u2014somehow both skinny and soft, exhausted but unable to sleep, constantly eating but always malnourished. I had IBS that sent me to the bathroom for 30 minutes after every meal. Debilitating migraines every couple of months. Energy that came only from sugar, video games and anxiety. I was the picture of everything wrong with modern health, and I didn't even know it.",
      },
      {
        heading: "Why This Book Exists",
        content:
          "I wrote this book because I needed it 30 years ago. I needed someone to tell me that feeling like garbage wasn't normal. That spending nine months with a cough wasn't \"seasonal asthma.\" That living on Sunny D and ice cream while exercising four hours a day wasn't a fast metabolism\u2014it was a quick ride to feeling 5 times older, then discovering a heart issue, cancer, diabetes, or some other auto-immune dysfunction at mid-life.\n\nBut more than that, I needed someone to show me that the solution wasn't complicated. It wasn't about finding the perfect diet or the ultimate workout plan or the magic supplement. It was about seven simple pillars of health that, when addressed with basic habits, could transform everything:\n\nBreathing - Because I'd been restricting my airways and my potential for 30 years\nSleep - Because five hours plus caffeine and refined carbs doesn't equal eight hours of rest\nHydration - Because you can't live on juice and pop, and wonder why you have migraines\nNutrition - Because eating everything while absorbing nothing isn't a fast metabolism\nMovement - Because quality movement is a stimulus for better choices, and is a much better lifestyle outlet than smart phones, video games and tv\nEnvironment - Because humans weren't meant to live in basements year-round\nMindfulness - Because anxiety isn't a personality trait, it's a treatable condition",
      },
      {
        heading: "What Makes This Resource Different",
        content:
          "This isn't another health book written by someone who's always been fit, telling you to just eat less and move more. This is written by someone who did everything wrong for decades, who made every mistake possible, who normalized dysfunction so completely that rock bottom felt like home.\n\nI'm not a doctor. I'm not a nutritionist with perfect genes. I'm not a celebrity with a team of trainers. I'm a regular guy who spent 30 years accidentally destroying himself, then figured out how to rebuild. And the rebuilding didn't require anything special\u2014no expensive supplements, no extreme diets, no two-hour daily workouts.\n\nIt required simple things done consistently. Breathing through my nose instead of my mouth. Going to bed and waking up at the same time as my wife. Drinking water before coffee. Eating protein at breakfast. Taking ten minutes of sunlight to start the day. The basics that everyone knows but nobody does.",
      },
      {
        heading: "Who This Book Is For",
        content:
          "This book is for you if:\n\u2022 You're tired all the time but don't know why\n\u2022 You exercise regularly but don't see results\n\u2022 You've tried every diet but you always find excuses to go back to your old ways\n\u2022 You know what to do but can't seem to do it\n\u2022 You suspect feeling like crap isn't normal but don't know where to start\n\nThis book is NOT for you if:\n\u2022 You want a quick fix or magic pill\n\u2022 You believe extreme measures are the only way\n\u2022 You believe age is what is holding you back\n\u2022 You think your genetics doom you to poor health\n\u2022 You're looking for someone to tell you what you want to hear",
      },
      {
        heading: "The Promise",
        content:
          "I can't promise you'll gain 20 pounds of muscle like I did. I can't promise your IBS will disappear or your migraines will stop or your anxiety will vanish. Every body is different, and what worked for me might need tweaking for you.\n\nWhat I can promise is this: if you're willing to try simple habits consistently, if you're ready to stop normalizing feeling terrible, if you can start where you are instead of waiting for perfect conditions\u2014your life will improve. Maybe dramatically, maybe subtly, but definitively.\n\nBecause here's what I learned after 30 years of diminished outcomes and 15 years of recovery, hundreds of clients, and thousands of hours of guiding people just like you: your body wants to be healthy. It wants to be strong, energized, capable. It's programmed for vitality. You just have to stop actively preventing it from doing its job.",
      },
      {
        heading: "How to Use This Book",
        content:
          "Read it straight through first. See yourself in my disasters. Laugh at my stupidity. Cringe at the familiar patterns. Then go back and pick one habit from each pillar to start with. Not all of them. Not the hardest ones. The ones that seem almost insultingly easy.\n\nDo those for 30 days. Just 30 days. Track them however works\u2014paper, phone, check marks on your mirror. When you miss a day (you will), just start again the next day. No guilt spiral. No starting over. Just continue.\n\nAfter 30 days, add more habits or modify the ones that aren't working. Keep what serves you, discard what doesn't. This isn't about following my exact blueprint\u2014it's about building your own. When you are deciding what habits to keep and what habits to discontinue, own your bias, what activities in your day actually make you a better human versus just distracting and numbing you from the yucky stuff. Just because you are not doing something challenging in a moment of distraction, does not always mean that you are actually \"filling your cup\".\n\nThat kid hiding moldy sandwiches behind radiators? He thought that was just how life was. That guy exhausted playing video games or doom scrolling on the phone until 1 AM? He thought sleep was for people without ambition. The athlete who couldn't build muscle? He blamed genetics.\n\nThey were all wrong. I was wrong. For the first 30 years of my life, I accepted feeling unmotivated as my normal. I normalized exhaustion, anxiety, digestive destruction, daily bouts of abdominal pain, and diarrhea. I built an entire identity around being the guy who could eat anything and not gain weight, who needed less sleep, who pushed through pain.\n\nThat identity was literally making me worse for everyone around me, and especially for myself.\n\nThis book is about building a new identity. One where feeling good is normal. Where energy is abundant. Where your body works with you, not against you. Where simple habits create extraordinary results. Where people ask if my energy level is always this high.\n\nIt starts with admitting that maybe\u2014just maybe\u2014you don't have to feel like shit when you wake up tomorrow.\n\nAnd it continues with the next page.",
      },
    ],
  },
  {
    id: "ch1",
    title: "Chapter 1",
    subtitle: "When Your Lifestyle Choices Tell a Story",
    icon: "local-hospital",
    readTime: 10,
    sections: [
      {
        heading: "The Doctor's Office",
        content:
          "The doctor's office smelled like disinfectant and disappointment. I was 14, sitting on that crinkly paper that covers examination tables, trying not to think about how many other sick kids had sat here before me. My mom was in the plastic chair by the wall, doing that thing where she made sure that I was heard and seen.\n\n\"So,\" 'Dr. Martinez' said, flipping through my chart, \"you're having digestive issues.\"\n\nDigestive issues. What a polite way to describe spending 30 minutes in the bathroom after every meal, while my friends waited for me to play basketball.\n\n\"It's IBS,\" he continued. \"Irritable Bowel Syndrome. Very common.\"\n\nCommon. Great. That made me feel so much better about being the kid who knew every public bathroom in a five-mile radius.\n\nThen he gave me the choices that would define the next 16 years of my life:\n\n\"Option one: medication. It'll help, but you'll need to take it daily, probably forever.\"\n\n\"Option two: accept that you'll need those bathroom breaks. Plan your life around them.\"\n\nI looked at my mom. She looked at me. We both knew which option a 14-year-old boy who lived for his nightly quarter-tub of ice cream was going to choose.\n\n\"I'll take option two.\"",
      },
      {
        heading: "The Price of That Choice",
        content:
          "What 'Dr. Martinez' didn't explain\u2014what nobody tells you when you're 14\u2014is that IBS isn't just about bathroom time. It's about what your body isn't doing while it's frantically pushing everything through your system.\n\nAbsorption. That's the word that would haunt me for years.\n\nWhile my friends were growing taller, getting stronger, building muscle from our shared sports practices, I remained the skinny kid who could eat 4,000 calories a day and gain nothing. Not weight, not muscle, no explosiveness. The only thing I had over a lot of my peers was endurance. Because a body that's all skin and bone, doesn't take much muscle to keep moving.\n\nThe salt packets became my trademark. Five, six, sometimes seven packets on my cafeteria fries. My friends thought it was gross. My body was screaming for electrolytes\u2014any electrolytes\u2014that might stick around long enough to matter. I was literally salting my food to the point of disgust because my body was desperate for minerals it couldn't hold onto.\n\nMy daily routine was a masterpiece of self-destruction:\n\u2022 Morning: Danish or croissant (butter-flavored nothing)\n\u2022 Lunch: Bacon cheese bagel, salt-mountain fries\n\u2022 Afternoon: 2 liters of apple juice or an entire jug of Sunny D\n\u2022 Dinner: Pick at whatever meat I could isolate from Mom's cooking, hide the vegetables\n\u2022 Night: Quarter tub of ice cream, every single night, like a ritual\n\nThen I'd hide the evidence of real food\u2014Mom's carefully made sandwiches\u2014behind radiators and in lockers until they grew mold. Because somehow, letting food rot felt better than admitting I wouldn't eat normally.",
      },
      {
        heading: "The Identity Crisis",
        content:
          "Here's what I told myself for 16 years:\n\n\"I need the energy\" (while eating pure sugar)\n\"I can't gain weight anyway\" (while never giving my body actual nutrients)\n\"This is just how I am\" (while actively choosing to stay sick)\n\"At least I'm athletic\" (while too depleted to reach my potential)\n\nI was sabotaging myself every single day, then wondering why I felt like garbage. It wasn't my body betraying me\u2014it was me betraying my body, one danish at a time.",
      },
      {
        heading: "The Day Everything Changed",
        content:
          "It wasn't dramatic. There was no hospital visit, no rock bottom moment like you see in movies. I was 30, about to become a fitness professional\u2014someone who was supposed to teach others about health. Our daughter was 2, running around with endless energy while I could barely keep up. Our son was on the way.\n\nI looked in the mirror one morning at 155 pounds of contradiction on my 6-foot frame\u2014skinny arms, soft middle, exhausted at 8 AM from staying up too late the night before.\n\nThe thought hit me like a brick: What kind of example am I setting?\n\nMy children would grow up watching me. Learning from me. What was I teaching them? That feeling tired is normal? That you should hide your struggles behind fake energy and bathroom humor?\n\nMy wife had been gently pushing to make better lifestyle choices for years. \"Just try it,\" she'd say. \"What's the worst that could happen?\"\n\nThe worst? I might actually get better. I might have to give up my identity as the guy who could eat anything and stay thin. I might have to admit I'd been wrong for 16 years.\n\nI needed to own the reality that my constant consumption of sugar and highly refined foods were making my guts a mess. With messy guts your body can't come close to functioning at its best.",
      },
      {
        heading: "Your Body Tells the Truth",
        content:
          "Here's what took me 16 years to understand: your body never lies. It only reports the facts.\n\nEvery symptom is data. Every dysfunction is feedback. Every chronic issue is your body saying, \"Hey, what we're doing isn't working.\" Random discomfort in your body isn't random, it just isn't easy to understand from the start.\n\nMy body spent 16 years writing detailed reports about malnutrition, inflammation, and distress. I spent 16 years shooting the messenger.\n\nIf you're reading this because you have IBS, or chronic fatigue, or migraines, or any collection of \"issues\" that you've been \"managing,\" I need you to know something:\n\nYou might be sabotaging yourself and calling it self-care.\n\nThere's always an option three. It's not the easy option. It's not the quick option. It's the option where you stop managing symptoms and start admitting you're the author of your own story.\n\nAnd it begins with two questions:\n\n\"What if I'm doing this to myself?\" - this can apply to all kinds of health issues. From the fat you want to release, to the brain fog, lethargy, and then the joint pain or breathing issues. The list goes on and on.\n\n\"What if I don't have to?\" - what if you can enjoy all of your current real priorities while making investments into yourself along the way.\n\nIn the next chapter, I'll show you how being a high school athlete made everything worse\u2014and why training four hours a day while eating like a gas station dumpster nearly broke me completely.",
      },
    ],
  },
  {
    id: "ch2",
    title: "Chapter 2",
    subtitle: "The Athletic Paradox",
    icon: "sports-basketball",
    readTime: 10,
    sections: [
      {
        heading: "The Addiction of Movement",
        content:
          "I was the captain of both my high school basketball and soccer teams. I got to those roles from shear will power. From being the \"try hard\" all the time. Let that sink in for a second. The kid who couldn't digest food properly, who hid sandwiches behind radiators until they grew mold, who lived on penny candy and Sunny D\u2014that kid was leading teams.\n\nLooking back, it's insane. But at the time, sports were my only identity that mattered.\n\nI started martial arts at six. Taekwondo first, then six years of judo. By 12, I was provincial judo champion\u2014throwing kids around the mat while my body was wondering if it would get digestible protein or fibre anytime soon.\n\nSports weren't just something I did. They were my drug. My escape. When I was moving, I wasn't anxious. When I was competing, I wasn't lonely. When I was exhausted from four hours of daily training, I couldn't feel how broken everything else was.",
      },
      {
        heading: "The Perfect Storm at 12",
        content:
          "That soccer camp story? I was 12, not in high school yet. Three-on-three tournament at Summer Camp, summer heat, everything on the line. When we lost that final by one goal, my body just... gave up.\n\nThe hyperventilating wasn't from exertion. It was my malnourished nervous system finally hitting its breaking point. My identity as the best 12-year old soccer player at camp shattered. While other kids shook hands and moved on, I was gasping for air that wouldn't come, crying like someone had died. In hindsight, the other kids must have thought that I was way over the top. I didn't know that skipping over healthy lifestyle choices would just make my emotional regulation a giant roller coaster.\n\nAt 12 years old, I'd already normalized:\n\u2022 Drinking 2 liters of apple juice daily\n\u2022 Hiding my mom's packed lunches behind radiators\n\u2022 Replacing real food with penny candy\n\u2022 Convincing myself this was all fine because I was an athlete\n\nThe crying wasn't about losing actually about losing, even though I thought it was at the time. It was my body screaming that something was fundamentally wrong. I just wasn't willing to process the gap in my approach to life.",
      },
      {
        heading: "The ACL and The Junk Food Athlete",
        content:
          "Summer between grade 9 and 10. I was just starting to dunk, feeling like maybe\u2014finally\u2014I was becoming the athlete I desperately wanted to be. Then one wrong cut on the soccer field, and my knee exploded.\n\nHere's the thing about tearing your ACL when you're already malnourished: everything about recovery is harder. The surgery. The rehab. The mental game. Your body can't rebuild what it could never build in the first place.\n\nBut the real damage was to my identity. I'd told myself stories about varsity scholarships, about being recruited, about sports being my ticket to... something. Anything that proved I was more than the anxious kid who knew every public bathroom in town.\n\nInstead, I had to learn to shoot because I couldn't drive to the basket anymore. I had to become strategic because I couldn't be explosive. I had to watch other kids get stronger while I got craftier, telling myself that was just as good.\n\nIt wasn't.\n\nThe irony still kills me. I wanted so badly to be a great athlete, but I was fueling myself like a gas station dumpster.",
      },
      {
        heading: "The Real Competition",
        content:
          "Looking back, I wasn't competing against other players. I was competing against my own body. Trying to prove I could overcome IBS through sheer will. Trying to show that determination could beat malnutrition.\n\nSpoiler alert: it can't.\n\nAll those hours. All that effort. All that identity wrapped up in being an athlete while actively poisoning myself with junk food and other poor lifestyle choices.\n\nThe real tragedy? I genuinely loved sports. The feeling of a perfect shot. The rush of a good play. The bond with teammates. But I experienced all of it through a fog of exhaustion, anxiety, and bathroom planning that I'd normalized as \"just how I am.\"\n\nIt would take becoming a fitness professional at 30\u2014and wanting to be a better example for my family\u2014to finally connect the dots between what I ate and how I felt.\n\nBut first, I had to spend another decade learning that 5 hours of sleep wasn't a badge of honor. It was another way to slowly destroy myself while calling it dedication.\n\nNext, I'll show you how my restricted breathing was tripping up my energetic day.",
      },
    ],
  },
  {
    id: "ch3",
    title: "Chapter 3",
    subtitle: "The Day I Learned to Breathe",
    icon: "air",
    readTime: 10,
    sections: [
      {
        heading: "Not Breathing in My Sleep",
        content:
          "My wife nudged me in the ribs for the third time that night. \"You're doing it again.\"\n\n\"Doing what?\" I mumbled, still half-asleep.\n\n\"Not breathing. You just stopped for like 20 seconds. It's freaking me out.\"\n\nI was 30 years old, and my wife was literally watching me suffocate in my sleep. My snoring had gotten so bad she worried it would wake our 2-year-old daughter down the hall. But the snoring wasn't the worst part\u2014it was the silence between snores. The moments where my body just... forgot to breathe.\n\nSleep apnea runs in my family, but I'd convinced myself I was different. Sure, I snored like a chainsaw. Sure, I woke up exhausted every morning. Sure, I needed two-hour afternoon naps to function. But that was normal for busy people, right?\n\nWrong.",
      },
      {
        heading: "The Sleepwalking Chronicles",
        content:
          "Here's something nobody tells you about shitty sleep quality\u2014it makes you do insane things while unconscious.\n\nOne night, a long long time ago, my wife woke up to find me standing in the corner of our bedroom. Not just standing. Peeing. On our dresser. While completely asleep.\n\n\"WHAT ARE YOU DOING?\" she screamed.\n\nI woke up mid-stream, confused, horrified, still peeing. Have you ever tried to stop peeing while half-asleep and fully mortified? It's like trying to stop a freight train with your mind.\n\nThe sleep-talking started innocently enough. She would ask me questions, thinking I was awake:\n\nHer: \"Did you set your alarm?\" Me: \"The dolphins need bicycles.\" Her: \"...What?\" Me: \"For the race. Obviously.\"\n\nBut as my breathing got worse, so did the sleep activities:\n\u2022 Walking out of hotel rooms\n\u2022 Trying to climb out of windows at the cottage\n\u2022 Having full conversations about nonsense\n\nMy body was so desperate for proper oxygen and more sleep that it couldn't even shut down correctly for sleep. I was living in a state of constant semi-suffocation, and my brain was short-circuiting every night.",
      },
      {
        heading: "The Book That Changed How I Breathe",
        content:
          "At 30, newly committed to becoming a fitness professional (and not being a hypocrite), I started devouring health books. Every single one mentioned breathing. At first, I skipped those chapters. Breathing? I've been doing it for 30 years, thanks.\n\nBut they kept coming up. Author after author saying the same thing:\n\u2022 Most people breathe wrong\n\u2022 Mouth breathing destroys sleep quality\n\u2022 Your breath controls your nervous system\n\u2022 Nasal breathing changes everything\n\nMark Divine's book introduced me to box breathing. Four counts in through the nose, hold for four, four counts out through the nose, hold for four. Simple, right?\n\nFirst attempt: Couldn't even finish one cycle through my nose. My nostrils felt like trying to breathe through coffee stirrers. My chest got tight. I panicked and gulped air through my mouth like a drowning man.\n\nThis was my \"holy shit\" moment. I couldn't even breathe slowly for 16 seconds without panicking.\n\nThen I started to learn that there were several different great resources on better breathing habits, Wim Hoff, Warrior Breathing, Yogic Breathing. I started to apply portions of all of it, finding what worked for me, and what I could consistently do.",
      },
      {
        heading: "The Humbling Journey to Nasal Breathing",
        content:
          "Learning to breathe through my nose during the day was like learning to write with my non-dominant hand. Everything felt wrong:\n\nWeek 1: Constant feeling of suffocation. Mouth hanging open from habit. Kelly catching me and saying \"Mouth closed!\" like I was a toddler.\nWeek 2: Could make it through meals breathing through my nose. Noticed I was chewing slower, tasting food more. Weird.\nWeek 3: First workout breathing only through nose. Had to cut the intensity by 40%. Ego crushed. But I didn't feel like dying after.\nWeek 4: My wife mentioned I was snoring less. I was waking up without the usual sandpaper throat.",
      },
      {
        heading: "The Unexpected Benefits",
        content:
          "When you fix your breathing, weird things happen:\n\nEnergy: No more 2-hour afternoon naps. Turns out when you oxygen your brain properly, you don't crash at 2 PM.\nDigestion: Deep belly breathing massages your internal organs. My IBS symptoms started improving just from breathing properly.\nAnxiety: That constant low-grade panic I'd carried since childhood? Mostly gone. Can't be anxious when you're breathing like a calm person.\nStrength: Once I learned to breathe during lifts\u2014inhale on the lowering, exhale on the exertion\u2014my numbers jumped 20% in a month.\nRecovery: Between sets, between workouts, between stressful events. Everything recovered faster when I wasn't hyperventilating 24/7.\n\nHere's what pisses me off: This information was always available. Every athlete, every fitness professional, every half-decent coach knows about breathing. But nobody teaches it to kids. Nobody told the hyperventilating 12-year-old at soccer camp that he was breathing wrong.\n\nI spent 30 years suffocating myself\u2014during sports, during sleep, during sex, during life. All because nobody said: \"Hey, maybe try breathing through your nose.\"\n\nYour breath is your life force. Stop treating it like an afterthought.\n\nNext, I'll show you why I thought 5 hours of sleep was productive, and how staying up until 2 AM gaming was keeping me from doing all the things that are truly important to me.",
      },
    ],
  },
  {
    id: "ch4",
    title: "Chapter 4",
    subtitle: "The 5-Hour Sleep Delusion",
    icon: "bedtime",
    readTime: 10,
    sections: [
      {
        heading: "Chasing the Next Rush",
        content:
          "At 12:47 AM, the credits finally rolled on the second action movie of the night, or final video game quest. My eyes burned like they'd been sandblasted, and every blink stung, but I was wide awake in the worst way. I should've gone to bed two hours ago\u2014actually, I should've gone to bed at 9:30, like someone who valued the productive and fulfilling actions of the next day.\n\nBut that's the thing about chasing the next rush\u2014whether it's a boss fight, a plot twist, or just background noise that drowns out the quiet. You tell yourself it's harmless. Just one more. Just until the next save point, or the next scene, or the next dopamine hit.\n\nVictory tasted like stale snacks and lukewarm caffeine.\n\nI had less than five or six hours until the day demanded my attention again. And not just from work or a calendar\u2014real responsibilities. The kind that deserve more of me than what I have left after a night like this.",
      },
      {
        heading: "The Lies I Told Myself",
        content:
          "\"I'm just not someone who needs much sleep.\"\n\nThat was my favorite lie. I'd read somewhere that some CEOs only slept 4-5 hours a night, even Arnold would brag about his 6 hour sleeps in the early days of his career. Therefore, I must be one of those genetic anomalies who thrived on minimal sleep. Never mind that I needed a constant sugar fix to get through the day. Never mind the afternoon crash that hit like a truck. Never mind that I was basically a zombie with a pulse.\n\nOther lies included:\n\u2022 \"I'm being productive with my free time\"\n\u2022 \"This is my only time to myself\"\n\u2022 \"I'll catch up on sleep this weekend\"\n\u2022 \"At least I'm not out drinking\"\n\nWhat I was really saying: \"I'd rather slowly kill myself than face the boredom of being present in my actual life.\"",
      },
      {
        heading: "The Daughter I Kept Falling Asleep On",
        content:
          "Here's a memory that still guts me: Standing next to my daughter's crib at 9:30 PM, rubbing her back to help her fall asleep. She's looking up at me with those trusting eyes, needing her dad to be present, to be there.\n\nI fell asleep with one hand on her back in the crib while I lay on the floor beside her.\n\nI was so exhausted that I couldn't even stay awake for the ten minutes it took to soothe my own child.\n\nMy priorities were fucked. Maybe this is a good time to reflect on your priorities. Are you choosing your health and the people you really care about, or just looking for your next distraction?",
      },
      {
        heading: "The Invisible Damage",
        content:
          "The insidious part about sleep deprivation is that it doesn't kill you dramatically. It kills you slowly, like carbon monoxide poisoning of the soul. You don't realize how impaired you are because impaired becomes your baseline.\n\nI thought I was functioning fine because I could still drive without crashing, party with my friends, spend time with my wife, show up to work.\n\nWhat I couldn't see was everything I was losing:\n\u2022 Creativity: Every idea was beige\n\u2022 Patience: Snapping at smallest little things\n\u2022 Initiative: Always procrastinating, getting shit done in the last minute is never your best effort\n\u2022 Innovation: Choosing the easiest path always\n\u2022 Joy: Everything felt like an obligation\n\nI was a watered-down version of myself, thinking I was at full strength.\n\nAt 30, studying to become a fitness professional, I had to read the sleep research. And holy shit, it was like reading my own death certificate:\n\n5 hours of sleep increases risk of: Diabetes by 200%, Heart disease by 148%, Stroke by 15%, Cancer by 36%, Early death by 12%.\n\nTestosterone drops 15%. Growth hormone plummets. Cortisol spikes. Leptin drops, ghrelin rises.\n\nI was giving myself the hormonal profile of an 80-year-old man at 28.",
      },
      {
        heading: "The Simple Change",
        content:
          "Fixing my sleep wasn't dramatic. I just started going to bed when my wife did.\n\nFirst week was torture. Lying there at 10:30 PM, mind racing, fear of missing out on... what? Movies and games that nobody cares about?\n\nBut then:\n\u2022 Eyes stopped burning\n\u2022 Mornings became bearable\n\u2022 Coffee became a choice, not life support\n\u2022 My kids got a dad who could stay awake during bedtime stories\n\nIf you're reading this at 1 AM, telling yourself you'll go to bed after \"one more\" anything\u2014you're me 15 years ago. If your eyes burn, your patience is shot, and you're falling asleep during your kids' bedtime\u2014you're not a night owl. You're just avoiding something.\n\nSleep isn't a luxury. It's not for the weak. It's literally when your body repairs itself, your brain consolidates memories, and your hormones reset. Skipping sleep to be \"productive\" is like skipping oil changes to save time. Sure, your car still runs. Until it doesn't.\n\nTurn everything off at the same time as your partner. That's it. A hard shut off time for electronics. No \"just checking\" anything. When they sleep, you sleep.\n\nTV, video, and social media games don't mean anything if you can't share them with the people you love. Your shows will still be there tomorrow. Your doom scrolling can wait.\n\nBut your life? Your family? Your health? Those have expiration dates.\n\nAnd they're sooner than you think.\n\nNext, I'll show you how I lived with daily migraines for decades, my head felt like it was in a vice\u2014until I discovered that water isn't just a suggestion, it is medicine.",
      },
    ],
  },
  {
    id: "ch5",
    title: "Chapter 5",
    subtitle: "The Dehydration Decades",
    icon: "water-drop",
    readTime: 10,
    sections: [
      {
        heading: "The Migraine Lottery",
        content:
          "I was halfway between Bowmanville and Guelph when my vision started to blur. The highway lines began dancing, my head felt like someone was driving nails through my temples, and I knew what was coming. Another migraine.\n\nPulling over wasn't an option\u2014I had to get home. So I white-knuckled the steering wheel, turned around, and drove 45 minutes back while my brain tried to escape through my eye sockets. By the time I stumbled through my front door, I could barely see.\n\nDark room. Blackout blinds. 2 liters of water chugged like medicine. Then nothing but darkness and prayer that sleep would kill the pain.\n\nThis was my life every 3-6 months throughout my twenties. And I thought it was normal.\n\nHere's what a migraine felt like for me:\n\u2022 Starts as pressure behind one eye\n\u2022 Spreads like lightning across my skull\n\u2022 Vision goes blurry, like looking through frosted glass\n\u2022 Nausea hits like seasickness on dry land\n\u2022 Light becomes my enemy\n\u2022 Sounds feel like hammers on my brain\n\nThe only cure? Complete darkness, a couple liters of water, and sleep. I'd pop Advil like candy. Nothing really worked except time, darkness, and\u2014though I didn't realize it\u2014water.",
      },
      {
        heading: "The Salt Packet Cover-Up",
        content:
          "Remember those 6-7 salt packets on my fries? Here's what was really happening:\n\nMy body was desperately thirsty. Chronically, dangerously dehydrated. But instead of drinking water, I was salting everything to unconsciously replace the electrolytes I was pissing away through IBS-induced diarrhea.\n\nI was literally trying to eat my hydration.\n\nThe salt made me thirstier, but I'd interpret that as hunger. So I'd eat more salty food. Get thirstier. Eat more. It was a dehydration death spiral disguised as teenage appetite.\n\nDuring high school sports\u20144 hours a day, remember\u2014my hydration strategy was revolutionary:\n\u2022 Drink when coach said to\n\u2022 Stop at the water fountain between classes\n\u2022 Maybe have something with meals\n\nThat's it. Four hours of sweating, and I'd maybe drink 500ml of actual water. The rest was Sunny D, apple juice, pop or whatever fluid came with food.\n\nI thought being thirsty during sports was just part of being tough. Real athletes don't need water breaks. We push through.\n\nI was so ignorant.",
      },
      {
        heading: "The Water Awakening",
        content:
          "The revelation didn't come from some guru or expensive course. It came from my wife going through a \"hyper-nourishing\" protocol five years ago. Part of it required drinking a gallon of water daily.\n\nA GALLON. That's almost 4 liters.\n\n\"That's insane,\" I said, while probably dehydrated.\n\nBut I tried it to support her. First day felt like I was drowning from the inside. Peed every 30 minutes. Thought my bladder would explode.\n\nThen, around day 3, something shifted:\n\u2022 Woke up without sandpaper eyes\n\u2022 Afternoon energy crash disappeared\n\u2022 Thoughts felt... clearer? Like someone had cleaned my mental windshield\n\nBy week 2, I realized I hadn't had a headache. Not even a small one.\n\nBy month 2, no migraine. First time in my adult life I'd gone two months without my brain trying to kill me.",
      },
      {
        heading: "The Free Medicine",
        content:
          "Here's the craziness about dehydration: it disguises itself as hunger.\n\nAll those times I thought I needed food? Most of them I just needed water. But I'd never tested it. Never thought, \"Let me drink a glass of water and see if I'm still hungry in 10 minutes.\"\n\nNow I do. And 70% of the time, the \"hunger\" disappears.\n\nWhen you're properly hydrated, everything works better:\n\u2022 Digestion: Water helps break down food (IBS improved)\n\u2022 Brain function: Your brain is 75% water (goodbye, fog)\n\u2022 Temperature regulation: Less overheating during workouts\n\u2022 Joint lubrication: Less pain, better movement\n\u2022 Nutrient transport: Actually getting benefits from food\n\u2022 Waste removal: Toxins out, health in\n\nIt's not that water is magic. It's that dehydration is poison, and I'd been slowly poisoning myself since childhood.\n\nWater is the closest thing we have to a miracle drug in developed countries: Costs almost nothing. No side effects. Available everywhere. Fixes problems you didn't know you had. Makes everything else work better.\n\nStart tomorrow with a full glass of water. Before coffee. Before phone. Before excuses. Then drink another glass mid-morning. Another at lunch. Another mid-afternoon. Another at dinner.\n\nThat's it. That's the whole system.\n\nYour migraines might disappear. Your energy might return. Your brain might finally work like it's supposed to.\n\nAll for the price of turning on a tap.\n\nNext, I'll show you how I ate 4,000 calories a day and stayed malnourished, hiding sandwiches until they grew mold while my body literally ate itself from the inside out.",
      },
    ],
  },
  {
    id: "ch6",
    title: "Chapter 6",
    subtitle: "Eating Everything, Absorbing Nothing",
    icon: "restaurant",
    readTime: 12,
    sections: [
      {
        heading: "The Sandwich Graveyard",
        content:
          "The smell hit my friends first. That distinctive rot that only comes from food left to die in darkness. They were digging through their lockers looking for a textbook when one of them gagged.\n\n\"Dude, what is that smell?\"\n\nI knew immediately. My heart dropped as I watched them trace the stench to my locker. Inside, at the bottom, was a graveyard of sandwiches in various stages of decomposition. Some were three months old. Some were seven. The Ziploc bags had turned into science experiments.\n\n\"Is that... are those sandwiches?\"\n\nI was in grade 5. Maybe grade 6. And I'd been caught hoarding moldy food like some kind of deranged squirrel.\n\nMy hiding spots were strategic:\n\u2022 Bottom of backpack (2-3 sandwiches)\n\u2022 Bottom of locker (5-10 sandwiches)\n\u2022 Under my bed (who knows how many)\n\u2022 Behind bedroom radiators (the overflow)\n\nEach sandwich represented a meal my mom had made with determination to get me to eat anything, despite my picky nature. Each one I'd smiled and accepted, then systematically hidden rather than admit I couldn't eat \"normal\" food.",
      },
      {
        heading: "The Penny Candy Hustle",
        content:
          "After school, I'd hit the corner store with military precision. This was the late 80s, early 90s, when penny candy was actually a penny and store clerks trusted kids to count honestly.\n\nI didn't count honestly.\n\nMy favorites:\n\u2022 Swedish berries (the red ones)\n\u2022 Fuzzy peaches (covered in that sour sugar)\n\u2022 Cherry blasters (pure chemical cherry)\n\nI'd grab 40-50 pieces. I'd bike home with pockets full of sugar, eat it all before dinner, then wonder why Mom's cooking had no flavour and my stomach was upset.",
      },
      {
        heading: "The Ice Cream Ceremony",
        content:
          "Every night, two hours after dinner like clockwork, I'd perform my ritual:\n\u2022 Get the 1.89L tub (the big one)\n\u2022 Fill a bowl with a quarter of it (yes, QUARTER)\n\u2022 Add chocolate chips\n\u2022 Add cocoa powder\n\u2022 Drown it in chocolate syrup\n\nNot Hershey's syrup. The cheap corn syrup garbage that was basically brown sugar water.\n\nI wasn't even secretive about it. I'd sit in front of the TV, proud of my \"fast metabolism,\" eating enough ice cream to feed a family of four. Then, like clockwork, 30 minutes later I'd be destroying the bathroom while my body rejected everything I'd just consumed.\n\nEvery. Single. Night.\n\nAge 20-something, here's what feeding myself looked like:\n\u2022 Breakfast: Bowl of Vector cereal, eaten DRY, loaded with chocolate chips\n\u2022 Lunch: Grilled sandwich with chicken AND peanut butter. Together.\n\u2022 Snacks: Whatever candy I could get my hands on\n\u2022 Dinner: Pizza pockets or Bagel Bites\n\u2022 Drinks: An ENTIRE JUG of Sunny D. Not a glass. A jug.\n\u2022 Dessert: The quarter-tub ice cream monstrosity\n\nTotal calories: Probably 4,000+. Total nutrition: Essentially zero.",
      },
      {
        heading: "The Transformation Timeline",
        content:
          "At 30, becoming a fitness professional, I finally had to face the truth: you can't teach health while eating like a garbage disposal.\n\nFirst real vegetable I enjoyed: Spinach in a smoothie (couldn't taste it)\nFirst actual salad: Creamy Poppy Seed, drowning in dressing, basically lettuce soup\nBody's initial reaction: Confusion. What is this fiber? These vitamins? Why isn't everything sugar?\n\nThe gain phase:\n\u2022 Month 1-3: Digestive system learning to actually digest\n\u2022 Month 4-6: First signs of muscle definition\n\u2022 Month 7-12: Holy shit, are those abs?\n\u2022 Month 13-18: 175 pounds of actual human, not scarecrow\n\nThe biggest shock? I was eating LESS volume but gaining healthy weight. Turns out when you absorb nutrients, you don't need 4,000 calories of garbage to feel full.",
      },
      {
        heading: "The Recovery Recipe",
        content:
          "You are what you eat, but more importantly, you are what you ABSORB.\n\nI was eating 4,000 calories and absorbing maybe 1,000. The rest was feeding my toilet, not my body.\n\nWhen I finally started eating real food:\n\u2022 Vegetables (even hidden in smoothies)\n\u2022 Actual protein (not peanut butter chicken sandwiches)\n\u2022 Complex carbs (not Sunny D)\n\u2022 Healthy fats (not ice cream soup)\n\nMy body didn't know what to do. It was like giving a drowning man oxygen\u2014overwhelming but lifesaving.\n\nWhat are you hiding? What are you eating in shame? What foods are you choosing that are slowly killing you while you rationalize it as \"just how you are\"?\n\nIt's simpler than you think:\n\u2022 Stop eating foods that make you run to the bathroom\n\u2022 Eat something green every day (even hidden in smoothies)\n\u2022 Satisfy your appetite with protein instead of liquid sugar\n\u2022 Choose foods your great-grandparents would recognize\n\nYou don't need a complex diet. You need to stop actively poisoning yourself.\n\nYour body wants to be strong. It wants to absorb nutrients. It wants to build muscle and burn clean.\n\nBut first, you have to stop feeding it garbage and calling it fuel.\n\nNext, I'll show you how four hours of daily movement couldn't overcome a broken body, and why being the \"athletic kid\" while malnourished was like trying to build a house on quicksand.",
      },
    ],
  },
  {
    id: "ch7",
    title: "Chapter 7",
    subtitle: "Movement Without Recovery",
    icon: "directions-run",
    readTime: 12,
    sections: [
      {
        heading: "The Schedule of Self-Destruction",
        content:
          "I was the kid who showed up an hour early to shoot hoops before school. Empty gym, just me and the echo of the ball bouncing off lacquered wood. I'd run suicides until my legs shook, practice free throws until my arms burned, tell myself that this dedication would make me unstoppable.\n\nSo why was I getting weaker while everyone else got stronger?\n\nThere's this moment burned into my memory from junior year. We were warming up before a game, and I decided today was the day. I'd been visualizing it for months\u2014my first dunk. My genetics had blessed me with long limbs and a lightweight frame. I'd done the math. At my height, with my wingspan, it should have been easy.\n\nI took my steps, planted hard, and launched with everything I had. My fingers grazed the rim's bottom edge, six inches short of jamming. Six inches that might as well have been six feet. I landed awkwardly, trying to play it off like I was just stretching, but everyone saw.\n\nMy training schedule would have impressed anyone who didn't understand recovery. Morning sessions from 6:30 to 7:30, just me in the gym before the janitors finished mopping. Team practice from 3:30 to 5:30. Then the weight room. By 7 PM, pickup games until the janitors kicked us out. Four hours of movement every single day.\n\nBut here's what was really happening beneath all that effort: I was an underfed engine running at redline, burning whatever scraps of muscle tissue I had for fuel. Every workout was making me worse, not better, because I was tearing down faster than I could build up.",
      },
      {
        heading: "The Explosion That Never Came",
        content:
          "In basketball, you need two types of athleticism. The first is endurance\u2014the ability to run the court for four quarters. I had that in spades. I could run forever, defend full-court press all game, never needed to sub out. Coaches loved my \"motor.\"\n\nBut the second type? Explosion? That first deadly step that leaves defenders grabbing air? The vertical leap that turns rebounds into possessions? Nothing. Absolutely nothing.\n\nI'd watch game film with the team, and it was like watching myself move through molasses. Same effort as everyone else. Same hustle. Half the speed. In my mind, I was cutting hard, exploding to the basket, elevating for rebounds. On screen, I was moving in slow motion while everyone else operated at normal speed.\n\nThe malnutrition didn't just steal my strength\u2014it broke the connection between my brain and body. During a crucial game freshman year, we were down by two with thirty seconds left. I'd gotten open on the wing\u2014my spot, where I'd practiced thousands of shots. My teammate saw me, delivered a perfect chest pass. Wide open. Time slowing down. This was my moment.\n\nI ducked.\n\nNot dodged. Not fumbled. Ducked. Like my brain interpreted \"basketball coming toward you\" as \"danger\" instead of \"catch this.\" The ball sailed over my crouched form, out of bounds. The other team got possession, ran out the clock, and we lost.",
      },
      {
        heading: "The Seven-Day Leg Day",
        content:
          "Here's how you know your recovery is completely broken: when leg day cripples you for an entire week. Monday's squats and lunges would leave me wobbling out of the weight room, telling myself the pain meant progress. Tuesday, I'd wake up unable to bend my knees without gasping. Wednesday brought the kind of soreness where sitting on a toilet became an athletic event. Thursday, stairs were my mortal enemy.\n\nBy Friday, I'd have just enough mobility to convince myself I was recovered. Saturday brought slight improvement. Sunday, I'd feel almost normal, just in time to destroy myself again on Monday.\n\nOther kids would bounce back by Wednesday, ready for their next leg session. Some freaks were fine the next day. Meanwhile, I was planning my week around which days I'd be able to walk normally.\n\nChampions also eat protein and sleep eight hours. I was ignorantly mistaking a whole lot of pain for progress.",
      },
      {
        heading: "The 30-Year-Old Awakening",
        content:
          "When I finally started eating real food at 30, the changes were almost insulting in how fast they came. Within a month, movements that had always felt awkward suddenly clicked. My body started responding to coaching cues that had bounced off me for years.\n\nThree months in, my father-in-law noticed my arms at Christmas dinner. \"Have you been working out?\" he asked. I'd been \"working out\" for fifteen years. This was the first time anyone had noticed actual muscle.\n\nBy the end of year one, I'd gained five pounds of actual muscle. Year two brought me to 160\u2014breaking through my seemingly permanent 155 for the first time since high school. By year three, I was 175 pounds with visible abs, looking like the athlete I'd always tried to be.\n\nTwenty pounds of muscle in three years, after twenty years of nothing. All because I finally gave my body the materials it needed to build with. I finally started consistently challenging my body's capacity throughout each week, multiple times a week. I used a wide variety of movements, classic lifts, one side at a time, calisthenics. It was all fair game as part of the development and learning experience. It didn't have to be crazy heavy anything, or super long anything, I just needed to show-up consistently. With consistency, the rest comes along for the ride.",
      },
      {
        heading: "The Truth About Movement",
        content:
          "You can't out-train malnutrition. You can't build strength on starvation. You can't recover without resources. You will keep on having set backs if you don't train for resiliency. Plan around the risk of overuse. You can't get stronger without a variety of movement that continues to challenge capacity on a monthly and weekly basis.\n\nI thought movement was everything. More sport was always better. Rest was for the weak. Pain was just weakness leaving the body. All the classic bro-science bullshit that sounds good on a poster but destroys actual humans.\n\nThe truth is simpler and harder to accept: movement is just stimulus. Recovery is where the magic happens. The gym doesn't make you stronger\u2014it just creates the conditions for strength. What you do in the other 23 hours determines whether you build or break. Especially as I get older, the recovery efforts, the stretching, the hydration, the protein, fibre, sleep. It all matters, it adds up, and your body tells the story.\n\nHere's how I measure real strength now: our Christmas tree. It lives in the basement year-round, waiting for its annual journey upstairs. Those first few years, getting that tree up the stairs was an event. I'd wrestle it out of storage, drag it to the stairs, then need to rest. My wife would offer to help.\n\nNow? I throw it over my shoulder like it weighs nothing. One smooth movement from basement to living room, no breaks, no help, no drama. Same tree. Same stairs. Completely different body. The tree didn't get lighter\u2014I got stronger.\n\nNext, I'll show you how spending life indoors\u2014especially during Canadian winters\u2014slowly drained my energy, and why getting outside wasn't just about fresh air, it was about survival.",
      },
    ],
  },
  {
    id: "ch8",
    title: "Chapter 8",
    subtitle: "The Indoor Prison",
    icon: "park",
    readTime: 10,
    sections: [
      {
        heading: "The Nine-Month Cough",
        content:
          "Nine months. That's how long my cough lasted when I was about 8 years old. It started in October with a little tickle in my throat, the kind you ignore because it's just another cold. By December, I was hacking so hard my ribs hurt. January brought wheezing that kept me up at night. February, March, April\u2014the cough became part of my identity, like my height or my shitty diet.\n\nMy parents tried everything. Cough syrup that tasted like cherry-flavored motor oil. Inhalers that made my heart race. Doctor visits where they'd listen to my lungs and declare \"seasonal asthma\" before sending us home with another prescription that didn't work.\n\nIt wasn't asthma. It was what happens when you spend October through April living like a vampire in Canada, existing on artificial light and recycled air while your immune system slowly surrenders.",
      },
      {
        heading: "The Canadian Cave Dweller's Calendar",
        content:
          "In southern Ontario, winter isn't just a season\u2014it's a lifestyle prison that can start creeping in around Halloween. The jack-o'-lanterns barely have time to rot before the world goes grey. By November, you're leaving for school in darkness and coming home in darkness. The sun becomes a rumor.\n\nThe cold isn't just uncomfortable\u2014it's aggressive. Minus twenty Celsius feels like nature personally hates you. Your face hurts. Your lungs burn. The walk from the house to the car becomes an Olympic event. So you stop going outside unless absolutely necessary.\n\nMy solution was elegant in its stupidity: if outside sucks, keep the distractions indoors, and never go outside.\n\nWhy brave the frozen hellscape when basement warmth beckoned? My hobbies were all conveniently indoor-friendly. Collectible card games don't require sunlight. Video games run twenty-four seven regardless of weather.\n\nFrom October to April\u2014six full months\u2014I lived like a well-fed mole. School, home, basement, bed, repeat. Even basketball, my supposed athletic outlet, happened in climate-controlled gyms where the sun was just a logo on someone's jersey.",
      },
      {
        heading: "The Adrenaline Substitute",
        content:
          "Here's what nobody tells you about chronic vitamin D deficiency: your body finds workarounds. Mine chose adrenaline and dopamine as substitute energy sources. Video games, card games, heck, any type of competition wasn't just entertainment\u2014they were my battery pack. The constant stimulation, the little hits of achievement, the artificial excitement of completing quests or winning matches. It masked how depleted I actually was.\n\nWithout games, I was a zombie stumbling through life. With them, I could pretend I had energy. Sure, it was fake energy\u2014borrowed from tomorrow's exhaustion, propped up by stress hormones\u2014but it felt better than admitting I was accomplishing very little.\n\nEvery summer, something magical happened that I was too dense to understand: I became human again. The outdoor basketball courts called. Soccer fields opened up. The backyard pool beckoned. Suddenly I had energy that didn't require a power outlet. My coughs disappeared like snow in July. My mood lifted without needing to level up or win matches.\n\nDid I make the connection? Did I think \"wow, being outside makes me feel amazing, maybe I should do this year-round?\" Of course not. Then October would creep back in, and I'd retreat to my cave without question, wondering why I felt like shit again by December.",
      },
      {
        heading: "The Transformation Tools",
        content:
          "At 30, finally aware that I was a shadow of my potential self while stuck indoors, I started experimenting with ways to reconnect with the outside world\u2014or at least simulate it. The grounding mat sounds like complete hippie bullshit, I know. It's basically a mat that supposedly connects you to the earth's electrical field. But standing on it while working actually helped with my morning headaches, even better is when I keep it at the foot of our bed, under our calves or feet.\n\nThe cold showers became my favorite hack. Every shower now ends with two-plus minutes of full cold while I do box breathing. I turn to face north, do a full four-count breath cycle. Turn east, another cycle. South, west, repeat. By the time I step out, I feel like I've mainlined espresso without the jitters or crash.\n\nBut the real game-changer was simply moving my work outside when possible. Summer client sessions in the backyard versus winter sessions in the basement\u2014same exercises, same conversations, completely different energy.\n\nThe real tragedy is how easy the fix was. Ten minutes outside. A walk around the block. Morning coffee on the porch even when it's cold. Standing in the backyard and just breathing real air. These weren't huge lifestyle changes\u2014they were tiny adjustments that paid massive dividends.\n\nBut for twenty-plus years, I couldn't be bothered. I was wrong. So wrong. And my nine-month cough was just my body's way of trying to tell me what I was too stubborn to hear: humans weren't designed to live in boxes, no matter how comfortable we make them.\n\nNext, I'll show you how anxiety ran my life for 40 years without me knowing it, and why video games and sports weren't hobbies\u2014they were medication for a mind that couldn't stop racing.",
      },
    ],
  },
  {
    id: "ch9",
    title: "Chapter 9",
    subtitle: "The Anxious Achiever's Trap",
    icon: "psychology",
    readTime: 10,
    sections: [
      {
        heading: "The Perfect Cover Story",
        content:
          "I was 42 years old, trying to figure out how we could keep up with all the commitments. It was my fault, I just wanted so many things, all at the same time. So once I had them, it meant keeping up with all of it.\n\nThat's when it hit me. This wasn't normal worry. This was something else. Something that had been there my whole life, disguised as ambition, drive, perfectionism. I'd been anxious for four decades without knowing that's what it was.\n\nAnxiety is clever. It doesn't always show up as panic attacks or obvious fear of the future. Sometimes it dresses itself up as positive traits. Mine wore the costume of a high achiever. The kid who needed straight A's not because I loved learning, but because anything less meant I wasn't smart enough. The athlete who trained four hours a day not just to improve, but to prove I deserved to exist in that space. The professional who needed to know everything about fitness because admitting ignorance felt like admitting failure.\n\nFor 40 years, I thought I was driven. Turned out I was just scared.",
      },
      {
        heading: "The Achievement Addiction",
        content:
          "When I was 16 and tore my ACL, it wasn't just my knee that shattered. My entire identity\u2014built on being an athlete, on having that one thing I was good at\u2014crumbled. Without basketball and soccer at the highest level, who was I? Just another kid who wasn't particularly good at anything.\n\nSo I pivoted to hobbies to distract my frustration. Not casually, but with the same obsessive intensity I'd brought to my conditioning. I needed to be the best at something, anything, to justify my existence.\n\nSchool responsibilities? Those got avoided because they came with the risk of failure. Better to not try and preserve the illusion of potential than to try and confirm I was average.\n\nAs a fitness professional, my anxiety found a new costume: expertise. I needed to have the answer to everything. Client asks about a supplement I'd never heard of? I'd bullshit my way through rather than admit ignorance.\n\nIt took until my late 30s to realize that \"I don't know, but I'm looking forward to learning more about that\" was a sign of strength, not weakness.",
      },
      {
        heading: "The Physical Tax",
        content:
          "Anxiety doesn't just live in your mind\u2014it sets up shop in your body. The tension headaches that would start at the base of my skull and wrap around like a vice. The way my shoulders lived up near my ears, constantly braced for impact.\n\nBefore I understood what anxiety was, I thought everyone lived this way. Didn't everyone lie awake recalculating their budget for the fifteenth time? Didn't everyone's jaw hurt from unconscious clenching? Didn't everyone feel like they were constantly one mistake away from everything falling apart?\n\nThe hyperventilating at soccer camp when I was 12? That wasn't just about losing a game. That was anxiety finding a crack in my armor and exploding outward. The IBS that destroyed my teens and twenties? Anxiety lives in the gut, and mine was constantly in knots.\n\nThis is the big thing about anxiety that nobody talks about: it creates an overwhelming desire to fill up the present with distractions. Sports, video games, hobby cards, achievement hunting\u2014they weren't hobbies. They were medication. They were ways to avoid sitting with the discomfort of just being.",
      },
      {
        heading: "The Turning Point",
        content:
          "When the pressure of all those metaphorical balls in the air hit, my usual coping mechanisms stopped working. I couldn't exercise my way out of interest rate hikes. I couldn't game my way through cash flow problems. The anxiety, stripped of its usual outlets, stood naked and obvious for the first time.\n\nSo I did something I'd never done before: I addressed it directly.\n\nFirst, I cut out coffee. The caffeine that I thought was giving me energy was actually just adding jet fuel to the anxiety fire.\n\nThen I got serious about sleep. Real sleep. Eight hours of actual rest, not the five hours of unconsciousness I'd been calling sleep. When you're properly rested, problems feel manageable. When you're exhausted, everything feels like a crisis.\n\nI started meditating. Not the \"empty your mind\" bullshit that hasn't worked for me yet, but simple breathing exercises that gave my nervous system permission to calm down. Box breathing became my anchor.\n\nExercise became intentional instead of obsessive. 45 hard sets spread across seven days, focused on building strength rather than burning off anxiety. Movement as medicine, not escape.",
      },
      {
        heading: "Your Hidden Anxiety",
        content:
          "Here's what changed when I finally addressed the anxiety I'd carried for 40 years: I became present. Actually present. Not physically there while mentally calculating, worrying, planning, fearing. But fully there.\n\nConversations with the people I loved stopped being opportunities to half-listen while my brain ran numbers. Time with my kids became actual time with my kids, not just physical supervision while I mentally reviewed client schedules.\n\nFor 40 years, anxiety had been stealing from me. Not dramatically, but consistently. A little presence here, a little peace there. Moments with my family where I was physically present but mentally absent.\n\nIf you're reading this thinking \"I'm not anxious, I'm just driven,\" let me ask you: When was the last time you sat still without distraction and felt completely at peace? When did you last admit ignorance without shame? When did you stop checking\u2014your phone, your bank account, your appearance, your performance\u2014and just exist?\n\nAnxiety doesn't always look like panic attacks. Sometimes it looks like perfectionism. Sometimes it looks like workaholism. Sometimes it looks like needing to be the best at something, anything, to feel worthy of taking up space.\n\nThe good news? Once you see it, you can address it. Not through more achievement or better distraction, but through the simple practices that actually calm your nervous system. Sleep. Effective breathing. Movement. Presence. The same things that fixed my body also can heal my mind.\n\nBecause it turns out, you can't separate the two. An anxious mind lives in a tense body. A calm body houses a peaceful mind. And after 40 years of unconscious anxiety, I finally understand what peace feels like.\n\nIt feels like coming home.\n\nNext, I'll show you how all these pieces came together\u2014how fixing one pillar made the others easier, and why the journey from broken to whole wasn't about perfection, but about finally being honest with myself.",
      },
    ],
  },
  {
    id: "ch10",
    title: "Chapter 10",
    subtitle: "Your 30-Day Foundation",
    icon: "flag",
    readTime: 10,
    sections: [
      {
        heading: "One Small Habit from Each Pillar",
        content:
          "I'm going to tell you something that would have pissed off my younger self: you don't need to fix everything at once. In fact, trying to overhaul your entire life in one heroic effort is exactly how you guarantee failure. Trust me, I tried that approach for twenty years.\n\nHere's what actually works: one small habit from each pillar, practiced consistently for 30 days. Not perfect practice. Not Olympic-level dedication. Just showing up every day and doing something slightly better than yesterday.\n\nWhen I finally got serious about my health at 30, I didn't start with a complex system. I started with what I could actually do while working full-time, raising two kids, and trying to keep up with all those commitments. The habits had to be simple enough to do on my worst days and effective enough to matter.",
      },
      {
        heading: "The Seven Foundation Habits",
        content:
          "Breathing: Nasal only during the day. This one costs zero time because you're breathing anyway. Just close your mouth. Breathe through your nose while working, walking, even during light exercise. By day 30, nasal breathing was automatic.\n\nSleep: Same wake time every single day. Not same bedtime\u2014same wake time. Plus or minus 10 minutes, seven days a week. No sleeping in on weekends. No \"just five more minutes.\" This one habit fixed my sleep more than any supplement or hack ever could.\n\nHydration: Full glass of water before anything else. Before coffee. Before phone. Before the chaos of the day begins. You've just gone 7-8 hours without hydration. Your brain is literally shrunken from dehydration. That morning fog? It's not just tiredness\u2014it's your neurons struggling to fire without adequate fluid.\n\nNutrition: 30 grams of protein at breakfast. Not a protein bar that's basically a candy bar with marketing. Real protein. Eggs. Greek yogurt. A proper protein shake. This killed my mid-morning cravings, stabilized my energy, and started the muscle-building process early.\n\nMovement: 15 squats or 20 pushups before morning shower. Not a workout. Not a gym session. Just 15 bodyweight squats while the shower heats up. Takes 30 seconds. But it wakes up your largest muscle groups, gets blood flowing, and reminds your body that it's meant to move.\n\nEnvironment: 10 minutes of sunlight before 10 AM. Coffee on the porch. Walk around the block. Stand in the driveway like a weirdo\u2014I don't care how you do it. This sets your circadian rhythm, boosts vitamin D production, and gives you energy that coffee can't match.\n\nMindfulness: Three gratitudes before bed. Not a journal. Not an essay. Just three things you're grateful for, said out loud or written in your phone. Takes 60 seconds. But it rewires your brain to notice good things instead of cataloging problems.",
      },
      {
        heading: "Why These Seven Work",
        content:
          "Each habit takes less than 5 minutes. Most take less than 1 minute. But together, they create a compound effect that transforms everything:\n\nThe nasal breathing calms your nervous system, which helps you sleep better. Better sleep gives you energy to move. Movement makes you thirsty, so you drink more water. Proper hydration helps you absorb the protein at breakfast. The protein stabilizes your blood sugar, reducing cravings. Less cravings means better food choices. Proper light in the morning helps you sleep better at night. Gratitude practice reduces the anxiety that used to keep you up.\n\nIt's a positive spiral instead of the negative one I'd been stuck in for decades.",
      },
      {
        heading: "The 30-Day Reality Check",
        content:
          "Here's what the first 30 days actually looked like for me:\n\nDays 1-3: Honeymoon phase. Everything felt easy. I was motivated. I was going to transform my life. I did extra reps, drank extra water, felt like a health guru. This is the dangerous phase because you think it'll always feel this easy.\n\nDays 4-10: The resistance. My body started fighting back. Waking early on Saturday felt like punishment. The squats were boring. Water was annoying. My nose felt stuffed from trying to breathe through it. This is where most people quit, deciding the habits are \"not for them.\"\n\nDays 11-20: The negotiation. My brain tried every trick to sabotage me. \"You've been good all week, sleep in just this once.\" \"Protein powder is expensive, just have toast.\" \"It's cloudy, sunlight doesn't count today.\" This is where you learn that motivation is bullshit\u2014discipline is what matters.\n\nDays 21-30: The shift. Something clicked. The habits stopped feeling like things I had to do and became things I just did. Like brushing teeth or putting on shoes. The resistance faded because the habits were now part of my identity, not impositions on it.\n\nDon't wait for Monday. Don't wait for the new year. Don't wait for life to be less stressful. Start right now with these seven habits. Not perfect execution\u2014just execution.\n\nBecause here's the secret: it's not about the habits themselves. It's about proving to yourself that you can change. Once you believe that\u2014once you have evidence that you're capable of transformation\u2014everything else becomes possible.\n\nThe hardest part isn't the squats or the water or the early wake time. The hardest part is believing you're worth the effort.\n\nYou are. Start now. Thirty days from now, you'll thank yourself.\n\nNext, I'll show you the tracking systems that actually work for real humans with real lives, and why the best system is the one you'll actually use.",
      },
    ],
  },
  {
    id: "ch11",
    title: "Chapter 11",
    subtitle: "The Tracking That Actually Works",
    icon: "track-changes",
    readTime: 10,
    sections: [
      {
        heading: "Why Generic Apps Don't Work",
        content:
          "Let me save you three years of downloading fitness apps: generic apps don't work. Not because they're badly designed, but because automated reminders from robots have zero emotional weight. Your phone buzzes, tells you to log your lunch, and you swipe it away like every other notification. Two weeks later, you delete the app and pretend you never downloaded it.\n\nI know because I tried them all. MyFitnessPal, the fancy scale app that promised to revolutionize my health, the workout trackers with their cheerful notifications. They all failed for the same reason: there's no accountability to a machine. No emotional connection to a spreadsheet. No real consequence to lying to an algorithm about what you ate.\n\nHere's what actually works, and it's stupidly simple: boundaries you don't have to think about and humans you don't want to disappoint.",
      },
      {
        heading: "The Power of Binary Decisions",
        content:
          "The best tracking system I ever found wasn't a system at all\u2014it was elimination. Instead of tracking every calorie, I created hard rules that removed decisions entirely:\n\nIntermittent fasting: 11:30 AM to 7:30 PM eating window. No tracking required. Clock says 11:29? Don't eat. Clock says 7:31? Kitchen's closed. Binary. Simple. No decision fatigue about whether that snack \"counts\" or if you're \"really hungry.\" The clock decides, not your cravings.\n\nCut the obvious garbage. Anything made with flour? Gone. Candy? Deleted. Liquid calories? Extinct. I didn't need to track the nutritional content of foods that shouldn't exist in my kitchen. This wasn't about perfection\u2014I'd still eat cake at birthday parties. But day-to-day, these foods simply weren't options.\n\nThe beauty of elimination is that there's nothing to track. You either did or didn't eat within your window. You either did or didn't buy refined carb based foods. Success becomes binary, not a complex calculation of points or macros or calories.\n\nFor my clients who needed more structure, we found something that actually stuck: food photos. Not for Instagram. Not for likes. Just a simple picture of everything they ate, sent to me or saved in a folder. It takes 3 seconds. Pictures don't lie. And someone else seeing it creates real accountability.",
      },
      {
        heading: "The Exercise Sets That Matter",
        content:
          "While I kept nutrition simple, I tracked exercise religiously. Not every rep, not every weight, just one number: sets per week. My target was a minimum 30 hard sets, across 7 days a week. That's it.\n\nA \"set\" meant pushing close to failure. Three sets of squats? That counts as three. Twenty minutes on the treadmill? That's zero\u2014cardio wasn't what I was tracking. This simplicity meant I could track it in my head. Monday: 3 sets. Tuesday: 3 sets. By Friday, I knew if I'd hit my target or not.\n\nNo apps. No journals. Just awareness of a single number that actually mattered for building muscle and maintaining strength.\n\nCardio is great. Don't get me wrong. It is super important. Heart disease is the number one killer. No doubt. But if you work hard enough against some kind of resistance, your heart rate will go up regardless.",
      },
      {
        heading: "The Balance of Real Life",
        content:
          "The biggest tracking mistake people make is forgetting that life exists. Birthdays happen. Date nights matter. Vacations aren't supposed to be macro-counting expeditions. So I built balance into the system:\n\nSocial events? No tracking. No fasting windows. No refusing cake at my kid's party because \"I don't eat flour.\" Those moments matter more than perfect adherence to any system.\n\nWhen I first started intermittent fasting, I watched the clock obsessively. But after a month, something shifted. I stopped needing to track because the behavior had become automatic.\n\nThe same thing happened with protein. First month: obsessive calculation. Second month: rough estimates. By month three: intuitive understanding of what 100 grams looked like across a day. The tracking scaffolding fell away because the behavior had solidified.\n\nThis is the goal of any tracking system: to make itself obsolete. If you're tracking the same things after a year that you were on day one, the system has failed. Good tracking teaches you what success feels like so you don't need to track anymore.",
      },
      {
        heading: "Your Minimum Viable Tracking",
        content:
          "Here's your assignment: pick the simplest tracking method that creates awareness without overwhelm. Maybe it's:\n\n\u2022 A paper calendar with X's for workout days\n\u2022 Photos of meals sent to a friend\n\u2022 A note in your phone with protein estimates\n\u2022 Marks on your water bottle for refills\n\u2022 A buddy who texts \"gym?\" every morning\n\nThe method matters less than these principles:\n\u2022 It must take less than 30 seconds\n\u2022 It must create real accountability\n\u2022 It must be harder to skip than to do\n\u2022 It must work on your worst days\n\nBecause here's the truth: the best tracking system is the one you actually use. Not the perfect one. Not the comprehensive one. Not the one that would impress a data scientist. The one that gets you to drink more water, eat more protein, and move your body consistently.\n\nEverything else is just expensive procrastination disguised as optimization.\n\nIf you are having trouble consistently doing these things on your own, maybe its time you send an email (info@growyourmusclesstudio.com) to me, and we talk about some tailored solutions and accountability just for you.\n\nNext, I'll show you what happens when you inevitably fall off track\u2014because you will\u2014and why getting back on is the only skill that actually matters for long-term success.",
      },
    ],
  },
  {
    id: "conclusion",
    title: "Conclusion",
    subtitle: "The Life You're Actually Chasing",
    icon: "emoji-events",
    readTime: 8,
    sections: [
      {
        heading: "The Christmas Tree",
        content:
          "I need to tell you something about that Christmas tree.\n\nYou know, the one I can now throw over my shoulder and carry upstairs without breaking a sweat. The same tree that used to require rest breaks, help from my wife, and a recovery period after finally getting it in place.\n\nThat tree hasn't changed. It weighs the same 40 pounds it always did. What changed was me\u201420 pounds of muscle, proper nutrition, actual sleep, and a body that finally works the way it's supposed to. But here's what matters: I don't carry that tree to impress anyone. I don't even think about it as an achievement anymore. It's just... normal.\n\nThat's what this whole journey has really been about. Not the six-pack abs that showed up around year two. Not the migraines that disappeared. Not even the IBS that ruled my life for decades finally going quiet. It's about normal things becoming easy. Automatic. Unremarkable.",
      },
      {
        heading: "What Success Actually Looks Like",
        content:
          "When I started this journey at 30, I thought success would be dramatic. I imagined myself as some fitness influencer type, posting shirtless photos and preaching about optimization.\n\nThank God I was wrong.\n\nReal success is quieter. It's waking up without an alarm because your body actually got enough sleep. It's your children asking you to play and having the energy to say yes. It's sitting through a movie without your stomach cramping. It's forgetting when you last had a headache because they've become so rare.\n\nSuccess is my wife no longer asking \"how are you feeling?\" with that worried look. It's my kids never knowing the version of me that was always exhausted, always in the bathroom, always saying \"maybe later.\" It's being present for the life I worked so hard to build instead of just surviving it.",
      },
      {
        heading: "The Compound Effect of Not Feeling Like Shit",
        content:
          "Here's what nobody tells you about getting healthy: the benefits compound in ways you can't imagine when you're stuck in the struggle. When you fix your breathing, your sleep improves. When your sleep improves, you make better food choices. When you eat better, you have energy to move. When you move, your anxiety decreases. When anxiety decreases, you connect better with people. When you connect better, life gets richer. Life is more inspiring, and that fulfilling accomplishment you have always wanted gets finished. Like me finishing this book.\n\nIt's not linear. It's exponential.\n\nFifteen years into this journey, I'm still discovering benefits. My business thrives because I can think clearly. My family life is amazing because I'm not an irritable zombie. When I am present I can keep up, show up, and light up when they enter the room. None of that was possible when I was slowly poisoning myself and calling it normal.",
      },
      {
        heading: "The Permission You're Waiting For",
        content:
          "If you've made it this far, you're probably one of two people:\n\n\u2022 Someone who sees themselves in my story and finally understands why they feel terrible\n\u2022 Someone who's been trying to get healthy for years and keeps falling off track\n\nEither way, let me give you the permission you're waiting for:\n\nPermission to start small. You don't need to overhaul your entire life tomorrow. One breath through your nose. One glass of water. One good night's sleep. That's enough to begin.\n\nPermission to fail. You'll fall off track. Probably this week. Definitely this month. So what? Getting back on is the only skill that matters.\n\nPermission to be imperfect. I still eat treats sometimes. I skip workouts. I stay up too late occasionally. The difference is these are choices now, not defaults.\n\nPermission to want more. You're not shallow for wanting to look better. You're not selfish for prioritizing your health. You're not weak for admitting you need help.\n\nPermission to believe it can be different. This is the big one. For 30 years, I believed feeling terrible was just my normal. I was wrong. You might be wrong too.",
      },
      {
        heading: "Your Turn",
        content:
          "After all the habits, tracking systems, and transformation stories, here's the real secret: none of this is actually about health.\n\nIt's about becoming who you're supposed to be.\n\nWhen your body works, your mind clears. When your mind clears, your purpose emerges. When your purpose emerges, your life aligns. When your life aligns, you positively impact others. When you impact others, everything matters.\n\nI thought I was just trying to fix my IBS and maybe gain some muscle. Instead, I found myself. The real me that had been buried under exhaustion, malnutrition, and anxiety for three decades.\n\nI've shown you my disasters. I've shared what worked. I've given you simple habits that cost almost nothing but change everything. Now it's on you.\n\nNot to be perfect. Not to follow my exact path. But to start. Today. With one small thing.\n\nPick your hardest pillar\u2014the one that makes you think \"ugh, I really should work on that.\" Start there. Not because it's smart (it's actually probably not), but because that's the one that's holding everything else back.\n\nWhatever it is, face it. Not with a massive overhaul, but with one tiny habit. Do that habit tomorrow. And the next day. And the next.\n\nIn 30 days, you'll have momentum. In six months, you'll have transformation. In a year, you'll have a new normal. In five years, you'll barely remember feeling any other way.\n\nYou got this book for one of two reasons: you're desperate or you're curious. Either way, you know something needs to change.\n\nThat knowing is enough. It's the crack where the light gets in.\n\nWater. Sleep. Real food. Movement. Sunlight. Breath. Presence.\n\nSuch simple things. Such profound changes.\n\nYou don't need anything special. You don't need to be special. You just need to start treating your body like it matters. Because it does. Because you do. Because the life you're meant to live is waiting on the other side of feeling like shit.\n\nOne habit. One day. One chance to be different.\n\nWhat are you waiting for?\n\nP.S. - If you see yourself in these pages, if you finally understand why you feel the way you do, if you're ready to change but scared to start\u2014reach out. Email me (info@growyourmusclesstudio.com). DM me (@althetrainer). Let me know you're beginning. Not because I need to know, but because you need to say it out loud. Sometimes that's all it takes to make it real.\n\nRemember: I was the kid eating a quarter tub of ice cream every night while my body ate itself from the inside out. If I can build a healthy life, anyone can. Even you. Especially you.\n\nStart today.",
      },
    ],
  },
];

// Screen names for navigation
export const SCREENS = {
  WELCOME: "WELCOME",
  INTAKE_PERSONAL: "INTAKE_PERSONAL",
  INTAKE_DEMOGRAPHICS: "INTAKE_DEMOGRAPHICS",
  INTAKE_GOALS: "INTAKE_GOALS",
  INTAKE_MOVEMENT: "INTAKE_MOVEMENT",
  INTAKE_NUTRITION: "INTAKE_NUTRITION",
  INTAKE_BREATHING_SLEEP: "INTAKE_BREATHING_SLEEP",
  INTAKE_MINDFULNESS: "INTAKE_MINDFULNESS",
  INTAKE_RISK: "INTAKE_RISK",
  SAFETY_NOTICE: "SAFETY_NOTICE",
  DASHBOARD: "DASHBOARD",
  WORKOUT_LIST: "WORKOUT_LIST",
  WORKOUT_DETAIL: "WORKOUT_DETAIL",
  NUTRITION_SUMMARY: "NUTRITION_SUMMARY",
  PROGRESS_SUMMARY: "PROGRESS_SUMMARY",
  PILLARS_OVERVIEW: "PILLARS_OVERVIEW",
  SETTINGS: "SETTINGS",
  CHALLENGE_PROGRESS: "CHALLENGE_PROGRESS",
  CHALLENGE_DETAIL: "CHALLENGE_DETAIL",
  PAYMENT_GATE: "PAYMENT_GATE",
};

// Stan Store product URL (update when product is live)
export const STAN_STORE_URL = "https://stan.store/Althetrainer/p/the-50-accountability-challenge";
