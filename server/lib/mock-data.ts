import type { Team, Player, Game, DraftPick } from "@shared/schema";
import { randomUUID } from "crypto";

export interface MockLeagueData {
  teams: Team[];
  players: Player[];
  games: Game[];
  draftPicks: DraftPick[];
}

const TEAM_DATA = [
  // Eastern Conference - Northeast Division
  { city: "Boston", name: "Bruins", abbreviation: "BOS", conference: "Eastern", division: "Northeast" },
  { city: "Buffalo", name: "Sabres", abbreviation: "BUF", conference: "Eastern", division: "Northeast" },
  { city: "Montreal", name: "Canadiens", abbreviation: "MTL", conference: "Eastern", division: "Northeast" },
  { city: "Ottawa", name: "Senators", abbreviation: "OTT", conference: "Eastern", division: "Northeast" },
  { city: "Toronto", name: "Maple Leafs", abbreviation: "TOR", conference: "Eastern", division: "Northeast" },
  { city: "Detroit", name: "Red Wings", abbreviation: "DET", conference: "Eastern", division: "Northeast" },
  { city: "Florida", name: "Panthers", abbreviation: "FLA", conference: "Eastern", division: "Northeast" },
  { city: "Tampa Bay", name: "Lightning", abbreviation: "TBL", conference: "Eastern", division: "Northeast" },
  
  // Eastern Conference - South Division
  { city: "Carolina", name: "Hurricanes", abbreviation: "CAR", conference: "Eastern", division: "South" },
  { city: "Columbus", name: "Blue Jackets", abbreviation: "CBJ", conference: "Eastern", division: "South" },
  { city: "New Jersey", name: "Devils", abbreviation: "NJD", conference: "Eastern", division: "South" },
  { city: "New York", name: "Islanders", abbreviation: "NYI", conference: "Eastern", division: "South" },
  { city: "New York", name: "Rangers", abbreviation: "NYR", conference: "Eastern", division: "South" },
  { city: "Philadelphia", name: "Flyers", abbreviation: "PHI", conference: "Eastern", division: "South" },
  { city: "Pittsburgh", name: "Penguins", abbreviation: "PIT", conference: "Eastern", division: "South" },
  { city: "Washington", name: "Capitals", abbreviation: "WSH", conference: "Eastern", division: "South" },
  
  // Western Conference - Midwest Division
  { city: "Chicago", name: "Blackhawks", abbreviation: "CHI", conference: "Western", division: "Midwest" },
  { city: "Colorado", name: "Avalanche", abbreviation: "COL", conference: "Western", division: "Midwest" },
  { city: "Dallas", name: "Stars", abbreviation: "DAL", conference: "Western", division: "Midwest" },
  { city: "Minnesota", name: "Wild", abbreviation: "MIN", conference: "Western", division: "Midwest" },
  { city: "Nashville", name: "Predators", abbreviation: "NSH", conference: "Western", division: "Midwest" },
  { city: "St. Louis", name: "Blues", abbreviation: "STL", conference: "Western", division: "Midwest" },
  { city: "Winnipeg", name: "Jets", abbreviation: "WPG", conference: "Western", division: "Midwest" },
  { city: "Arizona", name: "Coyotes", abbreviation: "ARI", conference: "Western", division: "Midwest" },
  
  // Western Conference - West Division
  { city: "Anaheim", name: "Ducks", abbreviation: "ANA", conference: "Western", division: "West" },
  { city: "Calgary", name: "Flames", abbreviation: "CGY", conference: "Western", division: "West" },
  { city: "Edmonton", name: "Oilers", abbreviation: "EDM", conference: "Western", division: "West" },
  { city: "Los Angeles", name: "Kings", abbreviation: "LAK", conference: "Western", division: "West" },
  { city: "San Jose", name: "Sharks", abbreviation: "SJS", conference: "Western", division: "West" },
  { city: "Seattle", name: "Kraken", abbreviation: "SEA", conference: "Western", division: "West" },
  { city: "Vancouver", name: "Canucks", abbreviation: "VAN", conference: "Western", division: "West" },
  { city: "Vegas", name: "Golden Knights", abbreviation: "VGK", conference: "Western", division: "West" },
];

const PLAYER_NAMES = [
  "Connor McDavid", "Sidney Crosby", "Nathan MacKinnon", "Leon Draisaitl", "Erik Karlsson",
  "David Pastrnak", "Auston Matthews", "Mitch Marner", "Artemi Panarin", "Igor Shesterkin",
  "Frederik Andersen", "Victor Hedman", "Cale Makar", "Quinn Hughes", "Adam Fox",
  "Mikko Rantanen", "Brad Marchand", "Patrice Bergeron", "Steven Stamkos", "Nikita Kucherov",
  "Alex Ovechkin", "John Carlson", "T.J. Oshie", "Evgeni Malkin", "Kris Letang",
  "Jake Guentzel", "Sebastian Aho", "Andrei Svechnikov", "Dougie Hamilton", "Frederik Andersen",
  "Johnny Gaudreau", "Matthew Tkachuk", "Aleksander Barkov", "Jonathan Huberdeau", "Aaron Ekblad",
  "Mitchell Marner", "William Nylander", "John Tavares", "Morgan Rielly", "Mitch Marner",
  "Jack Hughes", "Nico Hischier", "Dougie Hamilton", "Ryan Graves", "Mackenzie Blackwood",
  "Chris Kreider", "Mika Zibanejad", "Adam Fox", "Jacob Trouba", "Igor Shesterkin"
];

const POSITIONS = ["C", "LW", "RW", "LD", "RD", "G"];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomStats() {
  const position = getRandomElement(POSITIONS);
  const gamesPlayed = Math.floor(Math.random() * 82) + 1;
  
  if (position === "G") {
    return {
      position,
      gamesPlayed,
      goals: 0,
      assists: 0,
      points: 0,
      plusMinus: 0,
      penaltyMinutes: Math.floor(Math.random() * 20),
      hits: 0,
      blocks: 0,
      sog: 0,
      wins: Math.floor(Math.random() * gamesPlayed),
      losses: Math.floor(Math.random() * (gamesPlayed * 0.6)),
      otLosses: Math.floor(Math.random() * 10),
      gaa: (Math.random() * 3 + 1.5).toFixed(2),
      svPct: (0.900 + Math.random() * 0.050).toFixed(3),
    };
  } else {
    const goals = Math.floor(Math.random() * 50);
    const assists = Math.floor(Math.random() * 70);
    return {
      position,
      gamesPlayed,
      goals,
      assists,
      points: goals + assists,
      plusMinus: Math.floor(Math.random() * 40) - 20,
      penaltyMinutes: Math.floor(Math.random() * 100),
      hits: Math.floor(Math.random() * 200),
      blocks: Math.floor(Math.random() * 150),
      sog: Math.floor(Math.random() * 300),
      wins: 0,
      losses: 0,
      otLosses: 0,
      gaa: "0.00",
      svPct: "0.000",
    };
  }
}

export function generateMockLeagueData(): MockLeagueData {
  // Generate teams
  const teams: Team[] = TEAM_DATA.map((teamData, index) => {
    const wins = Math.floor(Math.random() * 60) + 10;
    const losses = Math.floor(Math.random() * 40) + 10;
    const otLosses = Math.floor(Math.random() * 15);
    
    return {
      id: randomUUID(),
      ...teamData,
      logoUrl: `https://placehold.co/100x100/0066cc/ffffff?text=${teamData.abbreviation}`,
      stadium: `${teamData.city} Arena`,
      wins,
      losses,
      otLosses,
      points: (wins * 2) + otLosses,
    };
  });

  // Generate players (20 per team)
  const players: Player[] = [];
  teams.forEach((team, teamIndex) => {
    for (let i = 0; i < 20; i++) {
      const stats = generateRandomStats();
      const playerName = getRandomElement(PLAYER_NAMES);
      
      players.push({
        id: randomUUID(),
        name: `${playerName} ${teamIndex + 1}-${i + 1}`, // Make names unique
        number: i + 1,
        teamId: team.id,
        isManagement: i === 0, // First player is management
        gamertag: `${playerName.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 999)}`,
        bio: `Professional hockey player for the ${team.city} ${team.name}`,
        availability: getRandomElement(['available', 'maybe', 'unavailable']),
        ...stats,
      });
    }
  });

  // Generate some sample games
  const games: Game[] = [];
  const today = new Date();
  
  // Generate past games (completed)
  for (let i = 0; i < 50; i++) {
    const homeTeam = getRandomElement(teams);
    const awayTeam = getRandomElement(teams.filter(t => t.id !== homeTeam.id));
    const gameDate = new Date(today.getTime() - (Math.random() * 30 * 24 * 60 * 60 * 1000));
    
    games.push({
      id: randomUUID(),
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      gameDate,
      homeScore: Math.floor(Math.random() * 7) + 1,
      awayScore: Math.floor(Math.random() * 7) + 1,
      status: "completed",
      isPlayoff: false,
      round: null,
    });
  }
  
  // Generate future games (scheduled)
  for (let i = 0; i < 30; i++) {
    const homeTeam = getRandomElement(teams);
    const awayTeam = getRandomElement(teams.filter(t => t.id !== homeTeam.id));
    const gameDate = new Date(today.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000));
    
    games.push({
      id: randomUUID(),
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      gameDate,
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      isPlayoff: false,
      round: null,
    });
  }

  // Generate draft picks
  const draftPicks: DraftPick[] = [];
  for (let i = 1; i <= 32; i++) {
    draftPicks.push({
      id: randomUUID(),
      pickNumber: i,
      teamId: teams[i - 1].id,
      playerName: i <= 5 ? `Draft Prospect ${i}` : null,
      isSelected: i <= 5,
      createdAt: new Date(),
    });
  }

  return {
    teams,
    players,
    games,
    draftPicks,
  };
}