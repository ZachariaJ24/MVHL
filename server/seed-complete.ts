import { db } from "./db";
import { teams, players, games, users } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

// 32 teams organized into 4 divisions with 8 teams each
const TEAMS_DATA = [
  // Atlantic Division
  { name: "Boston Bruins", city: "Boston", abbreviation: "BOS", conference: "Eastern", division: "Atlantic", logoUrl: "/logos/bos.png", stadium: "TD Garden" },
  { name: "Buffalo Sabres", city: "Buffalo", abbreviation: "BUF", conference: "Eastern", division: "Atlantic", logoUrl: "/logos/buf.png", stadium: "KeyBank Center" },
  { name: "Detroit Red Wings", city: "Detroit", abbreviation: "DET", conference: "Eastern", division: "Atlantic", logoUrl: "/logos/det.png", stadium: "Little Caesars Arena" },
  { name: "Florida Panthers", city: "Florida", abbreviation: "FLA", conference: "Eastern", division: "Atlantic", logoUrl: "/logos/fla.png", stadium: "FLA Live Arena" },
  { name: "Montreal Canadiens", city: "Montreal", abbreviation: "MTL", conference: "Eastern", division: "Atlantic", logoUrl: "/logos/mtl.png", stadium: "Bell Centre" },
  { name: "Ottawa Senators", city: "Ottawa", abbreviation: "OTT", conference: "Eastern", division: "Atlantic", logoUrl: "/logos/ott.png", stadium: "Canadian Tire Centre" },
  { name: "Tampa Bay Lightning", city: "Tampa Bay", abbreviation: "TB", conference: "Eastern", division: "Atlantic", logoUrl: "/logos/tb.png", stadium: "Amalie Arena" },
  { name: "Toronto Maple Leafs", city: "Toronto", abbreviation: "TOR", conference: "Eastern", division: "Atlantic", logoUrl: "/logos/tor.png", stadium: "Scotiabank Arena" },

  // Metropolitan Division  
  { name: "Carolina Hurricanes", city: "Carolina", abbreviation: "CAR", conference: "Eastern", division: "Metropolitan", logoUrl: "/logos/car.png", stadium: "PNC Arena" },
  { name: "Columbus Blue Jackets", city: "Columbus", abbreviation: "CBJ", conference: "Eastern", division: "Metropolitan", logoUrl: "/logos/cbj.png", stadium: "Nationwide Arena" },
  { name: "New Jersey Devils", city: "New Jersey", abbreviation: "NJ", conference: "Eastern", division: "Metropolitan", logoUrl: "/logos/nj.png", stadium: "Prudential Center" },
  { name: "New York Islanders", city: "New York", abbreviation: "NYI", conference: "Eastern", division: "Metropolitan", logoUrl: "/logos/nyi.png", stadium: "UBS Arena" },
  { name: "New York Rangers", city: "New York", abbreviation: "NYR", conference: "Eastern", division: "Metropolitan", logoUrl: "/logos/nyr.png", stadium: "Madison Square Garden" },
  { name: "Philadelphia Flyers", city: "Philadelphia", abbreviation: "PHI", conference: "Eastern", division: "Metropolitan", logoUrl: "/logos/phi.png", stadium: "Wells Fargo Center" },
  { name: "Pittsburgh Penguins", city: "Pittsburgh", abbreviation: "PIT", conference: "Eastern", division: "Metropolitan", logoUrl: "/logos/pit.png", stadium: "PPG Paints Arena" },
  { name: "Washington Capitals", city: "Washington", abbreviation: "WSH", conference: "Eastern", division: "Metropolitan", logoUrl: "/logos/wsh.png", stadium: "Capital One Arena" },

  // Central Division
  { name: "Arizona Coyotes", city: "Arizona", abbreviation: "ARI", conference: "Western", division: "Central", logoUrl: "/logos/ari.png", stadium: "Mullett Arena" },
  { name: "Chicago Blackhawks", city: "Chicago", abbreviation: "CHI", conference: "Western", division: "Central", logoUrl: "/logos/chi.png", stadium: "United Center" },
  { name: "Colorado Avalanche", city: "Colorado", abbreviation: "COL", conference: "Western", division: "Central", logoUrl: "/logos/col.png", stadium: "Ball Arena" },
  { name: "Dallas Stars", city: "Dallas", abbreviation: "DAL", conference: "Western", division: "Central", logoUrl: "/logos/dal.png", stadium: "American Airlines Center" },
  { name: "Minnesota Wild", city: "Minnesota", abbreviation: "MIN", conference: "Western", division: "Central", logoUrl: "/logos/min.png", stadium: "Xcel Energy Center" },
  { name: "Nashville Predators", city: "Nashville", abbreviation: "NSH", conference: "Western", division: "Central", logoUrl: "/logos/nsh.png", stadium: "Bridgestone Arena" },
  { name: "St. Louis Blues", city: "St. Louis", abbreviation: "STL", conference: "Western", division: "Central", logoUrl: "/logos/stl.png", stadium: "Enterprise Center" },
  { name: "Winnipeg Jets", city: "Winnipeg", abbreviation: "WPG", conference: "Western", division: "Central", logoUrl: "/logos/wpg.png", stadium: "Canada Life Centre" },

  // Pacific Division
  { name: "Anaheim Ducks", city: "Anaheim", abbreviation: "ANA", conference: "Western", division: "Pacific", logoUrl: "/logos/ana.png", stadium: "Honda Center" },
  { name: "Calgary Flames", city: "Calgary", abbreviation: "CGY", conference: "Western", division: "Pacific", logoUrl: "/logos/cgy.png", stadium: "Scotiabank Saddledome" },
  { name: "Edmonton Oilers", city: "Edmonton", abbreviation: "EDM", conference: "Western", division: "Pacific", logoUrl: "/logos/edm.png", stadium: "Rogers Place" },
  { name: "Los Angeles Kings", city: "Los Angeles", abbreviation: "LA", conference: "Western", division: "Pacific", logoUrl: "/logos/la.png", stadium: "Crypto.com Arena" },
  { name: "San Jose Sharks", city: "San Jose", abbreviation: "SJ", conference: "Western", division: "Pacific", logoUrl: "/logos/sj.png", stadium: "SAP Center" },
  { name: "Seattle Kraken", city: "Seattle", abbreviation: "SEA", conference: "Western", division: "Pacific", logoUrl: "/logos/sea.png", stadium: "Climate Pledge Arena" },
  { name: "Vancouver Canucks", city: "Vancouver", abbreviation: "VAN", conference: "Western", division: "Pacific", logoUrl: "/logos/van.png", stadium: "Rogers Arena" },
  { name: "Vegas Golden Knights", city: "Vegas", abbreviation: "VGK", conference: "Western", division: "Pacific", logoUrl: "/logos/vgk.png", stadium: "T-Mobile Arena" },
];

// Positions for 15 players per team (realistic hockey roster)
const POSITIONS = [
  "C", "C", "C", // 3 Centers
  "LW", "LW", "LW", // 3 Left Wings  
  "RW", "RW", "RW", // 3 Right Wings
  "LD", "LD", "LD", // 3 Left Defense
  "RD", "RD", // 2 Right Defense
  "G", // 1 Goalie
];

// Sample player names for variety
const FIRST_NAMES = [
  "Alex", "Connor", "Nathan", "Tyler", "Jake", "Ryan", "Matt", "Mike", "David", "Chris",
  "Brandon", "Kyle", "Jordan", "Justin", "Andrew", "Sean", "Derek", "Mark", "Patrick", "Kevin",
  "Dylan", "Zach", "Logan", "Trevor", "Austin", "Blake", "Cole", "Mason", "Hunter", "Carter"
];

const LAST_NAMES = [
  "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas",
  "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez",
  "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright", "Lopez", "Hill"
];

function getRandomName() {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${first} ${last}`;
}

function getRandomStats(position: string) {
  if (position === "G") {
    return {
      gamesPlayed: Math.floor(Math.random() * 30) + 10,
      wins: Math.floor(Math.random() * 20) + 5,
      losses: Math.floor(Math.random() * 15) + 3,
      otLosses: Math.floor(Math.random() * 5),
      gaa: (Math.random() * 2 + 1.5).toFixed(2),
      svPct: (0.850 + Math.random() * 0.100).toFixed(3),
    };
  } else {
    const games = Math.floor(Math.random() * 30) + 15;
    const goals = Math.floor(Math.random() * 25);
    const assists = Math.floor(Math.random() * 30);
    return {
      gamesPlayed: games,
      goals,
      assists,
      points: goals + assists,
      plusMinus: Math.floor(Math.random() * 21) - 10,
      penaltyMinutes: Math.floor(Math.random() * 50),
      hits: Math.floor(Math.random() * 100),
      blocks: Math.floor(Math.random() * 50),
      sog: Math.floor(Math.random() * 150) + 20,
    };
  }
}

async function seedComplete() {
  try {
    console.log("🏒 Starting complete MVHL database seeding...");

    // Clear existing data
    await db.delete(games);
    await db.delete(players);
    await db.delete(teams);
    await db.delete(users);

    console.log("✅ Cleared existing data");

    // Create teams (32 total, 8 per division)
    const createdTeams = [];
    for (const teamData of TEAMS_DATA) {
      const [team] = await db.insert(teams).values({
        id: randomUUID(),
        ...teamData,
        wins: Math.floor(Math.random() * 25) + 10,
        losses: Math.floor(Math.random() * 20) + 5,
        otLosses: Math.floor(Math.random() * 8),
        points: 0, // Will calculate based on wins/losses
      }).returning();
      
      // Calculate points (2 for win, 1 for OT loss)
      const points = ((team.wins || 0) * 2) + (team.otLosses || 0);
      await db.update(teams).set({ points }).where(eq(teams.id, team.id));
      
      createdTeams.push({ ...team, points });
    }

    console.log(`✅ Created ${createdTeams.length} teams across 4 divisions`);

    // Create players (15 per team = 480 total)
    let totalPlayers = 0;
    for (const team of createdTeams) {
      for (let i = 0; i < 15; i++) {
        const position = POSITIONS[i];
        const stats = getRandomStats(position);
        
        await db.insert(players).values({
          id: randomUUID(),
          name: getRandomName(),
          number: i + 1,
          position,
          teamId: team.id,
          gamertag: `${team.abbreviation}_${i + 1}`,
          availability: Math.random() > 0.1 ? "available" : "unavailable",
          ...stats,
        });
        totalPlayers++;
      }
    }

    console.log(`✅ Created ${totalPlayers} players (15 per team)`);

    // Create mock games (minimum 10, with 2 completed)
    const gameData = [];
    
    // 2 completed games
    for (let i = 0; i < 2; i++) {
      const homeTeam = createdTeams[Math.floor(Math.random() * createdTeams.length)];
      let awayTeam = createdTeams[Math.floor(Math.random() * createdTeams.length)];
      while (awayTeam.id === homeTeam.id) {
        awayTeam = createdTeams[Math.floor(Math.random() * createdTeams.length)];
      }

      gameData.push({
        id: randomUUID(),
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        gameDate: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000), // Past dates
        homeScore: Math.floor(Math.random() * 6) + 1,
        awayScore: Math.floor(Math.random() * 6) + 1,
        status: "completed",
        venue: homeTeam.stadium,
      });
    }

    // 8 scheduled games
    for (let i = 0; i < 8; i++) {
      const homeTeam = createdTeams[Math.floor(Math.random() * createdTeams.length)];
      let awayTeam = createdTeams[Math.floor(Math.random() * createdTeams.length)];
      while (awayTeam.id === homeTeam.id) {
        awayTeam = createdTeams[Math.floor(Math.random() * createdTeams.length)];
      }

      gameData.push({
        id: randomUUID(),
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        gameDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000), // Future dates
        status: "scheduled",
        venue: homeTeam.stadium,
      });
    }

    await db.insert(games).values(gameData);

    console.log(`✅ Created ${gameData.length} mock games (2 completed, 8 scheduled)`);

    // Create sample users
    const sampleUsers = [
      {
        id: randomUUID(),
        email: "admin@mvhl.com",
        username: "admin",
        role: "admin",
      },
      {
        id: randomUUID(),
        email: "manager@mvhl.com", 
        username: "teammanager",
        role: "management",
        teamId: createdTeams[0].id,
      },
      {
        id: randomUUID(),
        email: "player@mvhl.com",
        username: "player1",
        role: "player",
        teamId: createdTeams[0].id,
      },
    ];

    await db.insert(users).values(sampleUsers);

    console.log("✅ Created sample users");

    // Summary
    console.log("\n🏒 MVHL Database Seeding Complete!");
    console.log(`📊 Summary:`);
    console.log(`   • ${createdTeams.length} teams (8 per division)`);
    console.log(`   • ${totalPlayers} players (15 per team)`);
    console.log(`   • ${gameData.length} games (2 completed, 8 scheduled)`);
    console.log(`   • ${sampleUsers.length} sample users`);
    console.log(`   • 4 divisions: Atlantic, Metropolitan, Central, Pacific`);
    console.log(`   • 2 conferences: Eastern, Western`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
seedComplete().catch(console.error);

export { seedComplete };