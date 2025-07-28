import { db } from "./db";
import { teams, players } from "@shared/schema";

export async function seedDatabase() {
  console.log("Seeding MVHL database...");

  // Insert the 32 NHL teams for MVHL
  const mvhlTeams = [
    // Eastern Conference - Atlantic Division
    { name: "Bruins", city: "Boston", abbreviation: "BOS", conference: "Eastern", division: "Atlantic" },
    { name: "Sabres", city: "Buffalo", abbreviation: "BUF", conference: "Eastern", division: "Atlantic" },
    { name: "Red Wings", city: "Detroit", abbreviation: "DET", conference: "Eastern", division: "Atlantic" },
    { name: "Panthers", city: "Florida", abbreviation: "FLA", conference: "Eastern", division: "Atlantic" },
    { name: "Canadiens", city: "Montreal", abbreviation: "MTL", conference: "Eastern", division: "Atlantic" },
    { name: "Senators", city: "Ottawa", abbreviation: "OTT", conference: "Eastern", division: "Atlantic" },
    { name: "Lightning", city: "Tampa Bay", abbreviation: "TBL", conference: "Eastern", division: "Atlantic" },
    { name: "Maple Leafs", city: "Toronto", abbreviation: "TOR", conference: "Eastern", division: "Atlantic" },

    // Eastern Conference - Metropolitan Division
    { name: "Hurricanes", city: "Carolina", abbreviation: "CAR", conference: "Eastern", division: "Metropolitan" },
    { name: "Blue Jackets", city: "Columbus", abbreviation: "CBJ", conference: "Eastern", division: "Metropolitan" },
    { name: "Devils", city: "New Jersey", abbreviation: "NJD", conference: "Eastern", division: "Metropolitan" },
    { name: "Islanders", city: "New York", abbreviation: "NYI", conference: "Eastern", division: "Metropolitan" },
    { name: "Rangers", city: "New York", abbreviation: "NYR", conference: "Eastern", division: "Metropolitan" },
    { name: "Flyers", city: "Philadelphia", abbreviation: "PHI", conference: "Eastern", division: "Metropolitan" },
    { name: "Penguins", city: "Pittsburgh", abbreviation: "PIT", conference: "Eastern", division: "Metropolitan" },
    { name: "Capitals", city: "Washington", abbreviation: "WSH", conference: "Eastern", division: "Metropolitan" },

    // Western Conference - Central Division
    { name: "Coyotes", city: "Arizona", abbreviation: "ARI", conference: "Western", division: "Central" },
    { name: "Blackhawks", city: "Chicago", abbreviation: "CHI", conference: "Western", division: "Central" },
    { name: "Avalanche", city: "Colorado", abbreviation: "COL", conference: "Western", division: "Central" },
    { name: "Stars", city: "Dallas", abbreviation: "DAL", conference: "Western", division: "Central" },
    { name: "Wild", city: "Minnesota", abbreviation: "MIN", conference: "Western", division: "Central" },
    { name: "Predators", city: "Nashville", abbreviation: "NSH", conference: "Western", division: "Central" },
    { name: "Blues", city: "St. Louis", abbreviation: "STL", conference: "Western", division: "Central" },
    { name: "Jets", city: "Winnipeg", abbreviation: "WPG", conference: "Western", division: "Central" },

    // Western Conference - Pacific Division
    { name: "Ducks", city: "Anaheim", abbreviation: "ANA", conference: "Western", division: "Pacific" },
    { name: "Flames", city: "Calgary", abbreviation: "CGY", conference: "Western", division: "Pacific" },
    { name: "Oilers", city: "Edmonton", abbreviation: "EDM", conference: "Western", division: "Pacific" },
    { name: "Kings", city: "Los Angeles", abbreviation: "LAK", conference: "Western", division: "Pacific" },
    { name: "Kraken", city: "Seattle", abbreviation: "SEA", conference: "Western", division: "Pacific" },
    { name: "Sharks", city: "San Jose", abbreviation: "SJS", conference: "Western", division: "Pacific" },
    { name: "Canucks", city: "Vancouver", abbreviation: "VAN", conference: "Western", division: "Pacific" },
    { name: "Golden Knights", city: "Vegas", abbreviation: "VGK", conference: "Western", division: "Pacific" },
  ];

  try {
    // Check if teams already exist
    const existingTeams = await db.select().from(teams).limit(1);
    
    if (existingTeams.length === 0) {
      await db.insert(teams).values(mvhlTeams);
      console.log("✓ Successfully seeded 32 MVHL teams");
    } else {
      console.log("✓ Teams already exist, skipping team seeding");
    }

    // Check if players already exist
    const existingPlayers = await db.select().from(players).limit(1);
    
    if (existingPlayers.length === 0) {
      // Insert some sample players for each team
      const allTeamsFromDb = await db.select().from(teams);
      const samplePlayers = [];
      
      for (const team of allTeamsFromDb) {
        // Create a realistic 20-player roster per team
        const positions = [
          // Forwards (12 players)
          'C', 'C', 'C', 'C',      // 4 Centers
          'LW', 'LW', 'LW', 'LW',  // 4 Left Wings  
          'RW', 'RW', 'RW', 'RW',  // 4 Right Wings
          // Defense (6 players)
          'LD', 'LD', 'LD',        // 3 Left Defense
          'RD', 'RD', 'RD',        // 3 Right Defense
          // Goalies (2 players)
          'G', 'G'                 // 2 Goalies
        ];

        const firstNames = ['Alex', 'Connor', 'Jack', 'Tyler', 'Ryan', 'Jake', 'Nathan', 'Brandon', 'Kyle', 'Dylan', 
                           'Matt', 'Chris', 'Sam', 'Nick', 'Mike', 'David', 'John', 'Luke', 'Max', 'Zach'];
        const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas',
                          'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez'];

        for (let i = 0; i < positions.length; i++) {
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const playerNumber = i + 1; // Numbers 1-20
          
          samplePlayers.push({
            name: `${firstName} ${lastName}`,
            position: positions[i],
            number: playerNumber,
            teamId: team.id,
            gamesPlayed: Math.floor(Math.random() * 50) + 10,
            goals: Math.floor(Math.random() * 30),
            assists: Math.floor(Math.random() * 40),
            points: 0, // Will be calculated
            plusMinus: Math.floor(Math.random() * 21) - 10,
            penaltyMinutes: Math.floor(Math.random() * 50),
            hits: Math.floor(Math.random() * 100),
            blocks: Math.floor(Math.random() * 50),
            sog: Math.floor(Math.random() * 150) + 50,
            bio: `Talented ${i <= 2 ? "forward" : i <= 4 ? "defenseman" : "goaltender"} for the ${team.city} ${team.name}`,
            availability: "available",
          });
        }
      }

      // Calculate points for each player
      samplePlayers.forEach(player => {
        player.points = player.goals + player.assists;
      });

      await db.insert(players).values(samplePlayers);
      console.log(`✓ Successfully seeded ${samplePlayers.length} sample players`);
    } else {
      console.log("✓ Players already exist, skipping player seeding");
    }

    console.log("✓ Database seeding completed successfully!");
  } catch (error) {
    console.error("✗ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}