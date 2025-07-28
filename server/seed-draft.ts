import { db } from "./db";
import { draftProspects, draftSettings, draftPicks } from "@shared/schema";

const MOCK_PROSPECTS = [
  // Top 10 Prospects - Elite tier
  {
    name: "Connor McDaniel",
    position: "C",
    age: 18,
    height: "6'1\"",
    weight: "195 lbs",
    country: "Canada",
    league: "CHL",
    skating: 9,
    shooting: 9,
    passing: 10,
    checking: 7,
    defense: 8,
    puckHandling: 9,
    overall: 9,
    potential: 10
  },
  {
    name: "Auston Backstrom",
    position: "LW",
    age: 18,
    height: "6'3\"",
    weight: "210 lbs",
    country: "Sweden",
    league: "SHL",
    skating: 8,
    shooting: 10,
    passing: 8,
    checking: 8,
    defense: 7,
    puckHandling: 9,
    overall: 9,
    potential: 9
  },
  {
    name: "Erik Karlsson Jr",
    position: "D",
    age: 18,
    height: "6'0\"",
    weight: "185 lbs",
    country: "Sweden",
    league: "SHL",
    skating: 10,
    shooting: 8,
    passing: 9,
    checking: 6,
    defense: 9,
    puckHandling: 9,
    overall: 9,
    potential: 9
  },
  {
    name: "Jack Gibson",
    position: "RW",
    age: 18,
    height: "5'11\"",
    weight: "180 lbs",
    country: "USA",
    league: "NCAA",
    skating: 9,
    shooting: 9,
    passing: 8,
    checking: 7,
    defense: 7,
    puckHandling: 10,
    overall: 8,
    potential: 9
  },
  {
    name: "Vasily Petrov",
    position: "G",
    age: 18,
    height: "6'4\"",
    weight: "190 lbs",
    country: "Russia",
    league: "KHL",
    skating: 7,
    shooting: 5,
    passing: 6,
    checking: 5,
    defense: 10,
    puckHandling: 8,
    overall: 8,
    potential: 9
  },
  // Prospects 6-15 - First Round talent
  {
    name: "Mason Wheeler",
    position: "C",
    age: 18,
    height: "6'2\"",
    weight: "200 lbs",
    country: "Canada",
    league: "CHL",
    skating: 8,
    shooting: 8,
    passing: 9,
    checking: 8,
    defense: 8,
    puckHandling: 8,
    overall: 8,
    potential: 8
  },
  {
    name: "Luke Davidson",
    position: "D",
    age: 18,
    height: "6'5\"",
    weight: "220 lbs",
    country: "Canada",
    league: "CHL",
    skating: 7,
    shooting: 6,
    passing: 7,
    checking: 9,
    defense: 9,
    puckHandling: 7,
    overall: 8,
    potential: 8
  },
  {
    name: "Niko Koskinen",
    position: "LW",
    age: 18,
    height: "6'0\"",
    weight: "185 lbs",
    country: "Finland",
    league: "Liiga",
    skating: 9,
    shooting: 8,
    passing: 8,
    checking: 7,
    defense: 7,
    puckHandling: 9,
    overall: 8,
    potential: 8
  },
  {
    name: "Brady Johnson",
    position: "RW",
    age: 18,
    height: "6'1\"",
    weight: "190 lbs",
    country: "USA",
    league: "NCAA",
    skating: 8,
    shooting: 9,
    passing: 7,
    checking: 8,
    defense: 7,
    puckHandling: 8,
    overall: 8,
    potential: 8
  },
  {
    name: "Samuel Lafleur",
    position: "C",
    age: 18,
    height: "5'10\"",
    weight: "175 lbs",
    country: "Canada",
    league: "CHL",
    skating: 9,
    shooting: 7,
    passing: 9,
    checking: 6,
    defense: 7,
    puckHandling: 9,
    overall: 8,
    potential: 8
  },
  // Prospects 16-30 - Second Round talent
  {
    name: "Oliver Andersson",
    position: "D",
    age: 18,
    height: "6'3\"",
    weight: "205 lbs",
    country: "Sweden",
    league: "SHL",
    skating: 7,
    shooting: 7,
    passing: 8,
    checking: 8,
    defense: 8,
    puckHandling: 7,
    overall: 7,
    potential: 8
  },
  {
    name: "Jake Morrison",
    position: "G",
    age: 18,
    height: "6'2\"",
    weight: "185 lbs",
    country: "Canada",
    league: "CHL",
    skating: 7,
    shooting: 5,
    passing: 6,
    checking: 5,
    defense: 9,
    puckHandling: 7,
    overall: 7,
    potential: 8
  },
  {
    name: "Dmitri Volkov",
    position: "LW",
    age: 18,
    height: "6'2\"",
    weight: "195 lbs",
    country: "Russia",
    league: "KHL",
    skating: 8,
    shooting: 8,
    passing: 7,
    checking: 7,
    defense: 6,
    puckHandling: 8,
    overall: 7,
    potential: 8
  },
  {
    name: "Cole Thompson",
    position: "RW",
    age: 18,
    height: "6'0\"",
    weight: "180 lbs",
    country: "USA",
    league: "NCAA",
    skating: 8,
    shooting: 8,
    passing: 7,
    checking: 7,
    defense: 7,
    puckHandling: 8,
    overall: 7,
    potential: 7
  },
  {
    name: "Henri Dubois",
    position: "C",
    age: 18,
    height: "5'11\"",
    weight: "185 lbs",
    country: "Canada",
    league: "CHL",
    skating: 8,
    shooting: 7,
    passing: 8,
    checking: 7,
    defense: 7,
    puckHandling: 8,
    overall: 7,
    potential: 7
  }
];

// Generate additional prospects to fill out draft pool
function generateMoreProspects(): any[] {
  const positions = ["C", "LW", "RW", "D", "G"];
  const countries = ["Canada", "USA", "Sweden", "Finland", "Russia", "Czech Republic"];
  const leagues = ["CHL", "NCAA", "SHL", "Liiga", "KHL", "Czech"];
  
  const names = {
    first: [
      "Alex", "Ben", "Charlie", "Dylan", "Ethan", "Felix", "Gabriel", "Hunter", "Ian", "Jake",
      "Kyle", "Logan", "Marcus", "Nathan", "Owen", "Parker", "Quinn", "Ryan", "Sean", "Tyler",
      "Victor", "Will", "Xavier", "Zach", "Adam", "Blake", "Carter", "Derek", "Evan", "Finn"
    ],
    last: [
      "Anderson", "Brown", "Campbell", "Davis", "Evans", "Foster", "Garcia", "Harris", "Jackson", "King",
      "Lee", "Miller", "Nelson", "Phillips", "Roberts", "Smith", "Taylor", "Wilson", "Young", "Clark",
      "Lewis", "Walker", "Hall", "Allen", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams"
    ]
  };

  const prospects = [];
  
  for (let i = 0; i < 50; i++) {
    const firstName = names.first[Math.floor(Math.random() * names.first.length)];
    const lastName = names.last[Math.floor(Math.random() * names.last.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    // Generate ratings based on draft position (later picks have lower ratings)
    const baseRating = Math.max(4, 8 - Math.floor(i / 10));
    const variance = 2;
    
    prospects.push({
      name: `${firstName} ${lastName}`,
      position,
      age: 18,
      height: position === "G" ? "6'2\"" : "6'0\"",
      weight: position === "G" ? "185 lbs" : "180 lbs",
      country: countries[Math.floor(Math.random() * countries.length)],
      league: leagues[Math.floor(Math.random() * leagues.length)],
      skating: Math.min(10, Math.max(1, baseRating + Math.floor(Math.random() * variance) - 1)),
      shooting: Math.min(10, Math.max(1, baseRating + Math.floor(Math.random() * variance) - 1)),
      passing: Math.min(10, Math.max(1, baseRating + Math.floor(Math.random() * variance) - 1)),
      checking: Math.min(10, Math.max(1, baseRating + Math.floor(Math.random() * variance) - 1)),
      defense: Math.min(10, Math.max(1, baseRating + Math.floor(Math.random() * variance) - 1)),
      puckHandling: Math.min(10, Math.max(1, baseRating + Math.floor(Math.random() * variance) - 1)),
      overall: baseRating,
      potential: Math.min(10, Math.max(baseRating, baseRating + Math.floor(Math.random() * 2)))
    });
  }
  
  return prospects;
}

export async function seedDraftData() {
  try {
    console.log("Seeding draft data...");
    
    // Initialize draft settings
    await db.insert(draftSettings).values({
      id: "draft_2024",
      isActive: false,
      currentPick: 1,
      currentRound: 1,
      pickTimeLimit: 300,
      totalRounds: 5,
      picksPerRound: 32,
      startTime: null,
      updatedAt: new Date()
    }).onConflictDoNothing();
    
    // Clear existing prospects
    await db.delete(draftProspects);
    
    // Add top prospects
    const allProspects = [...MOCK_PROSPECTS, ...generateMoreProspects()];
    
    for (const prospect of allProspects) {
      await db.insert(draftProspects).values({
        ...prospect,
        isDrafted: false,
        draftedBy: null,
        draftRound: null,
        draftPick: null
      });
    }
    
    console.log(`Seeded ${allProspects.length} draft prospects`);
    console.log("Draft data seeding completed!");
    
  } catch (error) {
    console.error("Error seeding draft data:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDraftData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}