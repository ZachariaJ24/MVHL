import { db } from "./db";
import { awards } from "@shared/schema";
import { randomUUID } from "crypto";

async function seedAwards() {
  console.log("Seeding awards...");

  const awardData = [
    {
      id: randomUUID(),
      name: "Hart Memorial Trophy",
      description: "Most Valuable Player",
      category: "mvp",
      season: "2024-25",
      votingStartDate: new Date("2024-01-01"),
      votingEndDate: new Date("2024-04-01"),
      isActive: true,
    },
    {
      id: randomUUID(),
      name: "Art Ross Trophy",
      description: "Leading Scorer",
      category: "leading-scorer",
      season: "2024-25",
      votingStartDate: new Date("2024-01-01"),
      votingEndDate: new Date("2024-04-01"),
      isActive: true,
    },
    {
      id: randomUUID(),
      name: "Vezina Trophy",
      description: "Best Goaltender",
      category: "best-goaltender",
      season: "2024-25",
      votingStartDate: new Date("2024-01-01"),
      votingEndDate: new Date("2024-04-01"),
      isActive: true,
    },
    {
      id: randomUUID(),
      name: "Calder Memorial Trophy",
      description: "Rookie of the Year",
      category: "rookie-of-year",
      season: "2024-25",
      votingStartDate: new Date("2024-01-01"),
      votingEndDate: new Date("2024-04-01"),
      isActive: true,
    },
  ];

  try {
    // Clear existing awards
    await db.delete(awards);
    console.log("Cleared existing awards");

    // Insert new awards
    await db.insert(awards).values(awardData);
    console.log(`Seeded ${awardData.length} awards`);

    console.log("Awards seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding awards:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAwards()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedAwards };