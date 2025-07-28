import { 
  type User, 
  type InsertUser, 
  type Team,
  type InsertTeam,
  type Player,
  type InsertPlayer,
  type Game,
  type InsertGame,
  type DraftPick,
  type InsertDraftPick,
  type DraftProspect,
  type InsertDraftProspect,
  type DraftSettings,
  type InsertDraftSettings,
  type Trade,
  type InsertTrade,
  type GeneratedContent, 
  type InsertContent,
  type ActivityLog,
  type InsertActivity,
  type NewsArticle,
  type InsertNewsArticle,
  type Award,
  type InsertAward,
  type AwardVote,
  type InsertAwardVote,
  users,
  teams,
  players,
  games,
  draftPicks,
  draftProspects,
  draftSettings,
  trades,
  generatedContent,
  activityLog,
  newsArticles,
  awards,
  awardVotes,
  teamLineups,
  playerAvailability
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getAllUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
  // Teams
  getAllTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, updates: Partial<Team>): Promise<Team>;
  
  // Players
  getAllPlayers(): Promise<Player[]>;
  getPlayer(id: string): Promise<Player | undefined>;
  getPlayersByTeam(teamId: string): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, updates: Partial<Player>): Promise<Player>;
  
  // Games
  getAllGames(): Promise<Game[]>;
  getGame(id: string): Promise<Game | undefined>;
  getGamesByTeam(teamId: string): Promise<Game[]>;
  getRecentGames(limit?: number): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: string, updates: Partial<Game>): Promise<Game>;
  
  // Playoff Brackets
  getPlayoffBrackets(): Promise<any[]>;
  createPlayoffBracket(bracket: any): Promise<any>;
  updatePlayoffBracket(id: string, updates: any): Promise<any>;
  
  // Draft
  getAllDraftPicks(): Promise<DraftPick[]>;
  getDraftPick(id: string): Promise<DraftPick | undefined>;
  createDraftPick(pick: InsertDraftPick): Promise<DraftPick>;
  updateDraftPick(id: string, updates: Partial<DraftPick>): Promise<DraftPick>;
  
  // Draft Prospects
  getAllDraftProspects(): Promise<DraftProspect[]>;
  getDraftProspect(id: string): Promise<DraftProspect | undefined>;
  getAvailableProspects(): Promise<DraftProspect[]>;
  createDraftProspect(prospect: InsertDraftProspect): Promise<DraftProspect>;
  updateDraftProspect(id: string, updates: Partial<DraftProspect>): Promise<DraftProspect>;
  draftProspect(prospectId: string, teamId: string, round: number, pick: number): Promise<DraftProspect>;
  
  // Draft Settings
  getDraftSettings(): Promise<DraftSettings | undefined>;
  updateDraftSettings(updates: Partial<DraftSettings>): Promise<DraftSettings>;
  initializeDraftSettings(): Promise<DraftSettings>;
  
  // Trades
  getAllTrades(): Promise<Trade[]>;
  getTrade(id: string): Promise<Trade | undefined>;
  getTradesByTeam(teamId: string): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTrade(id: string, updates: Partial<Trade>): Promise<Trade>;
  
  // AI Content
  createGeneratedContent(content: InsertContent): Promise<GeneratedContent>;
  getGeneratedContent(type?: string): Promise<GeneratedContent[]>;
  getAllGeneratedContent(): Promise<GeneratedContent[]>;
  
  // Activity
  createActivity(activity: InsertActivity): Promise<ActivityLog>;
  getAllActivity(): Promise<ActivityLog[]>;
  getRecentActivity(limit?: number): Promise<ActivityLog[]>;
  
  // Stats
  getLeagueStats(): Promise<{
    totalTeams: number;
    totalPlayers: number;
    totalGames: number;
    completedGames: number;
    activeTrades: number;
  }>;

  // News
  getAllNews(): Promise<NewsArticle[]>;
  getNewsArticle(id: string): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle>;

  // Awards
  getAllAwards(): Promise<Award[]>;
  getAward(id: string): Promise<Award | undefined>;
  createAward(award: InsertAward): Promise<Award>;
  updateAward(id: string, updates: Partial<Award>): Promise<Award>;

  // Award Voting
  createAwardVote(vote: InsertAwardVote): Promise<AwardVote>;
  getVoteByIpAndAward(voterIp: string, awardId: string): Promise<AwardVote | undefined>;
  getAwardVoteResults(awardId: string): Promise<any>;

  // Team Chat operations
  getTeamChatMessages(teamId: string): Promise<any[]>;
  createTeamChatMessage(data: any): Promise<any>;

  // CHEL Stats operations
  getChelStats(gamertag: string): Promise<any | undefined>;
  upsertChelStats(data: any): Promise<any>;

  // Draft Pick operations for management
  makeDraftPick(prospectId: string, teamId: string): Promise<any>;
  advanceDraftPick(): Promise<void>;

  // Team Lineup operations
  getTeamLineup(teamId: string, gameId?: string): Promise<any | undefined>;
  createTeamLineup(lineup: any): Promise<any>;
  updateTeamLineup(id: string, updates: any): Promise<any>;
  
  // Player Availability operations
  getPlayerAvailability(playerId: string, gameId?: string): Promise<any | undefined>;
  setPlayerAvailability(data: any): Promise<any>;
  getTeamAvailability(teamId: string, gameId?: string): Promise<any[]>;

  // Image management
  getAllImages(): Promise<any[]>;
  createImage(image: any): Promise<any>;
  deleteImage(id: string): Promise<void>;
  getImagesByCategory(category: string): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private teams: Map<string, Team>;
  private players: Map<string, Player>;
  private games: Map<string, Game>;
  private draftPicks: Map<string, DraftPick>;
  private trades: Map<string, Trade>;
  private content: Map<string, GeneratedContent>;
  private activities: Map<string, ActivityLog>;
  private teamChatMessages: Map<string, any>;
  private chelStats: Map<string, any>;
  private images: any[];

  constructor() {
    this.users = new Map();
    this.teams = new Map();
    this.players = new Map();
    this.games = new Map();
    this.draftPicks = new Map();
    this.trades = new Map();
    this.content = new Map();
    this.activities = new Map();
    this.teamChatMessages = new Map();
    this.chelStats = new Map();
    this.images = [];
    
    // Initialize with mock data
    this.initializeMockData().catch(console.error);
  }

  private async initializeMockData() {
    // Only initialize once
    if (this.teams.size > 0) return;
    
    // Import and use the mock data generator
    const { generateMockLeagueData } = await import('./lib/mock-data');
    const mockData = generateMockLeagueData();
    
    // Populate teams
    mockData.teams.forEach(team => {
      this.teams.set(team.id, team);
    });
    
    // Populate players
    mockData.players.forEach(player => {
      this.players.set(player.id, player);
    });
    
    // Populate games
    mockData.games.forEach(game => {
      this.games.set(game.id, game);
    });
    
    // Populate draft picks
    mockData.draftPicks.forEach(pick => {
      this.draftPicks.set(pick.id, pick);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      role: insertUser.role || "player",
      teamId: insertUser.teamId || null,
      playerId: insertUser.playerId || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Team methods
  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeam(id: string): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = randomUUID();
    const team: Team = { 
      ...insertTeam, 
      id,
      logoUrl: insertTeam.logoUrl || null,
      stadium: insertTeam.stadium || null,
      wins: insertTeam.wins || null,
      losses: insertTeam.losses || null,
      otLosses: insertTeam.otLosses || null,
      points: insertTeam.points || null
    };
    this.teams.set(id, team);
    return team;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
    const team = this.teams.get(id);
    if (!team) throw new Error("Team not found");
    const updatedTeam = { ...team, ...updates };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  // Player methods
  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return Array.from(this.players.values()).filter(p => p.teamId === teamId);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = { 
      ...insertPlayer, 
      id,
      number: insertPlayer.number || null,
      teamId: insertPlayer.teamId || null,
      wins: insertPlayer.wins || null,
      losses: insertPlayer.losses || null,
      otLosses: insertPlayer.otLosses || null,
      points: insertPlayer.points || null,
      gamesPlayed: insertPlayer.gamesPlayed || null,
      goals: insertPlayer.goals || null,
      assists: insertPlayer.assists || null,
      plusMinus: insertPlayer.plusMinus || null,
      penaltyMinutes: insertPlayer.penaltyMinutes || null,
      hits: insertPlayer.hits || null,
      blocks: insertPlayer.blocks || null,
      sog: insertPlayer.sog || null,
      gaa: insertPlayer.gaa || null,
      svPct: insertPlayer.svPct || null,
      isManagement: insertPlayer.isManagement || null,
      gamertag: insertPlayer.gamertag || null,
      bio: insertPlayer.bio || null,
      availability: insertPlayer.availability || null
    };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    const player = this.players.get(id);
    if (!player) throw new Error("Player not found");
    const updatedPlayer = { ...player, ...updates };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }

  // Game methods
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGame(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getGamesByTeam(teamId: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      g => g.homeTeamId === teamId || g.awayTeamId === teamId
    );
  }

  async getRecentGames(limit = 10): Promise<Game[]> {
    return Array.from(this.games.values())
      .filter(g => g.status === 'completed')
      .sort((a, b) => b.gameDate.getTime() - a.gameDate.getTime())
      .slice(0, limit);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = randomUUID();
    const game: Game = { 
      ...insertGame, 
      id,
      status: insertGame.status || null,
      homeScore: insertGame.homeScore || null,
      awayScore: insertGame.awayScore || null,
      isPlayoff: insertGame.isPlayoff || null,
      round: insertGame.round || null,
      series: insertGame.series || null,
      gameNumber: insertGame.gameNumber || null,
      venue: insertGame.venue || null
    };
    this.games.set(id, game);
    return game;
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game> {
    const game = this.games.get(id);
    if (!game) throw new Error("Game not found");
    const updatedGame = { ...game, ...updates };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  // Draft methods
  async getAllDraftPicks(): Promise<DraftPick[]> {
    return Array.from(this.draftPicks.values()).sort((a, b) => a.pickNumber - b.pickNumber);
  }

  async getDraftPick(id: string): Promise<DraftPick | undefined> {
    return this.draftPicks.get(id);
  }

  async createDraftPick(insertPick: InsertDraftPick): Promise<DraftPick> {
    const id = randomUUID();
    const pick: DraftPick = { 
      ...insertPick, 
      id, 
      createdAt: new Date(),
      playerName: insertPick.playerName || null,
      isSelected: insertPick.isSelected || null,
      timeRemaining: insertPick.timeRemaining || null,
      playerId: insertPick.playerId || null
    };
    this.draftPicks.set(id, pick);
    return pick;
  }

  async updateDraftPick(id: string, updates: Partial<DraftPick>): Promise<DraftPick> {
    const pick = this.draftPicks.get(id);
    if (!pick) throw new Error("Draft pick not found");
    const updatedPick = { ...pick, ...updates };
    this.draftPicks.set(id, updatedPick);
    return updatedPick;
  }

  // Trade methods
  async getAllTrades(): Promise<Trade[]> {
    return Array.from(this.trades.values());
  }

  async getTrade(id: string): Promise<Trade | undefined> {
    return this.trades.get(id);
  }

  async getTradesByTeam(teamId: string): Promise<Trade[]> {
    return Array.from(this.trades.values()).filter(
      t => t.fromTeamId === teamId || t.toTeamId === teamId
    );
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = randomUUID();
    const trade: Trade = { 
      ...insertTrade, 
      id, 
      createdAt: new Date(),
      status: insertTrade.status || null
    };
    this.trades.set(id, trade);
    return trade;
  }

  async updateTrade(id: string, updates: Partial<Trade>): Promise<Trade> {
    const trade = this.trades.get(id);
    if (!trade) throw new Error("Trade not found");
    const updatedTrade = { ...trade, ...updates };
    this.trades.set(id, updatedTrade);
    return updatedTrade;
  }

  async createGeneratedContent(insertContent: InsertContent): Promise<GeneratedContent> {
    const id = randomUUID();
    const content: GeneratedContent = {
      ...insertContent,
      id,
      createdAt: new Date(),
    };
    this.content.set(id, content);
    return content;
  }

  async getGeneratedContent(type?: string): Promise<GeneratedContent[]> {
    const allContent = Array.from(this.content.values());
    if (type) {
      return allContent.filter(c => c.type === type);
    }
    return allContent.sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getAllGeneratedContent(): Promise<GeneratedContent[]> {
    return Array.from(this.content.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getAllGeneratedContent(): Promise<GeneratedContent[]> {
    return Array.from(this.content.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<ActivityLog> {
    const id = randomUUID();
    const activity: ActivityLog = {
      ...insertActivity,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getAllActivity(): Promise<ActivityLog[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getRecentActivity(limit = 10): Promise<ActivityLog[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getLeagueStats(): Promise<{
    totalTeams: number;
    totalPlayers: number;
    totalGames: number;
    completedGames: number;
    activeTrades: number;
  }> {
    return {
      totalTeams: this.teams.size,
      totalPlayers: this.players.size,
      totalGames: this.games.size,
      completedGames: Array.from(this.games.values()).filter(g => g.status === 'completed').length,
      activeTrades: Array.from(this.trades.values()).filter(t => t.status === 'pending').length,
    };
  }

  // Add missing methods for interface compliance
  async getPlayoffBrackets(): Promise<any[]> {
    return [];
  }

  async createPlayoffBracket(bracket: any): Promise<any> {
    const id = randomUUID();
    const newBracket = { ...bracket, id };
    return newBracket;
  }

  async updatePlayoffBracket(id: string, updates: any): Promise<any> {
    return { id, ...updates };
  }

  async getAllDraftProspects(): Promise<DraftProspect[]> {
    return [];
  }

  async getDraftProspect(id: string): Promise<DraftProspect | undefined> {
    return undefined;
  }

  async getAvailableProspects(): Promise<DraftProspect[]> {
    return [];
  }

  async createDraftProspect(prospect: InsertDraftProspect): Promise<DraftProspect> {
    const id = randomUUID();
    return { ...prospect, id } as DraftProspect;
  }

  async updateDraftProspect(id: string, updates: Partial<DraftProspect>): Promise<DraftProspect> {
    return { id, ...updates } as DraftProspect;
  }

  async draftProspect(prospectId: string, teamId: string, round: number, pick: number): Promise<DraftProspect> {
    return { 
      id: prospectId, 
      name: 'Unknown Prospect',
      position: 'Unknown',
      age: 18,
      height: null,
      weight: null,
      country: null,
      league: null,
      skating: null,
      shooting: null,
      passing: null,
      puckSkills: null,
      puckHandling: null,
      checking: null,
      defense: null,
      physical: null,
      mental: null,
      overall: null,
      potential: null,
      draftRank: pick,
      draftPick: pick,
      isDrafted: true,
      draftedBy: teamId,
      draftRound: round,
      createdAt: new Date()
    } as DraftProspect;
  }

  async getDraftSettings(): Promise<DraftSettings | undefined> {
    return undefined;
  }

  async updateDraftSettings(updates: Partial<DraftSettings>): Promise<DraftSettings> {
    return updates as DraftSettings;
  }

  async initializeDraftSettings(): Promise<DraftSettings> {
    return {} as DraftSettings;
  }

  async getAllNews(): Promise<NewsArticle[]> {
    return [];
  }

  async getNewsArticle(id: string): Promise<NewsArticle | undefined> {
    return undefined;
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const id = randomUUID();
    return { ...article, id } as NewsArticle;
  }

  async updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle> {
    return { id, ...updates } as NewsArticle;
  }

  async getAllAwards(): Promise<Award[]> {
    return [];
  }

  async getAward(id: string): Promise<Award | undefined> {
    return undefined;
  }

  async createAward(award: InsertAward): Promise<Award> {
    const id = randomUUID();
    return { ...award, id } as Award;
  }

  async updateAward(id: string, updates: Partial<Award>): Promise<Award> {
    return { id, ...updates } as Award;
  }

  async createAwardVote(vote: InsertAwardVote): Promise<AwardVote> {
    const id = randomUUID();
    return { ...vote, id } as AwardVote;
  }

  async getVoteByIpAndAward(voterIp: string, awardId: string): Promise<AwardVote | undefined> {
    return undefined;
  }

  async getAwardVoteResults(awardId: string): Promise<any> {
    return {};
  }

  async getTeamChatMessages(teamId: string): Promise<any[]> {
    return Array.from(this.teamChatMessages.values()).filter(msg => msg.teamId === teamId);
  }

  async createTeamChatMessage(data: any): Promise<any> {
    const id = randomUUID();
    const message = { ...data, id, createdAt: new Date() };
    this.teamChatMessages.set(id, message);
    return message;
  }

  async getChelStats(gamertag: string): Promise<any | undefined> {
    return this.chelStats.get(gamertag);
  }

  async upsertChelStats(data: any): Promise<any> {
    this.chelStats.set(data.gamertag, data);
    return data;
  }

  async makeDraftPick(prospectId: string, teamId: string): Promise<any> {
    return { prospectId, teamId };
  }

  async advanceDraftPick(): Promise<void> {
    // Implementation for advancing draft pick
  }

  async getTeamLineup(teamId: string, gameId?: string): Promise<any | undefined> {
    return undefined;
  }

  async createTeamLineup(lineup: any): Promise<any> {
    const id = randomUUID();
    return { ...lineup, id };
  }

  async updateTeamLineup(id: string, updates: any): Promise<any> {
    return { id, ...updates };
  }

  async getPlayerAvailability(playerId: string, gameId?: string): Promise<any | undefined> {
    return undefined;
  }

  async setPlayerAvailability(data: any): Promise<any> {
    const id = randomUUID();
    return { ...data, id };
  }

  async getTeamAvailability(teamId: string, gameId?: string): Promise<any[]> {
    return [];
  }

  async getAllImages(): Promise<any[]> {
    return this.images;
  }

  async createImage(image: any): Promise<any> {
    const id = randomUUID();
    const newImage = { ...image, id };
    this.images.push(newImage);
    return newImage;
  }

  async deleteImage(id: string): Promise<void> {
    this.images = this.images.filter(img => img.id !== id);
  }

  async getImagesByCategory(category: string): Promise<any[]> {
    return this.images.filter(img => img.category === category);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: string): Promise<void> {
    this.users.delete(id);
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates) 
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Teams
  async getAllTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const [team] = await db
      .insert(teams)
      .values(insertTeam)
      .returning();
    return team;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
    const [team] = await db
      .update(teams)
      .set(updates)
      .where(eq(teams.id, id))
      .returning();
    return team;
  }

  // Players
  async getAllPlayers(): Promise<Player[]> {
    return await db.select().from(players);
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player || undefined;
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return await db.select().from(players).where(eq(players.teamId, teamId));
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const [player] = await db
      .insert(players)
      .values(insertPlayer)
      .returning();
    return player;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    const [player] = await db
      .update(players)
      .set(updates)
      .where(eq(players.id, id))
      .returning();
    return player;
  }

  // Games
  async getAllGames(): Promise<Game[]> {
    return await db.select().from(games);
  }

  async getGame(id: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game || undefined;
  }

  async getGamesByTeam(teamId: string): Promise<Game[]> {
    return await db.select().from(games).where(
      sql`${games.homeTeamId} = ${teamId} OR ${games.awayTeamId} = ${teamId}`
    );
  }

  async getRecentGames(limit = 10): Promise<Game[]> {
    return await db.select().from(games)
      .orderBy(desc(games.gameDate))
      .limit(limit);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db
      .insert(games)
      .values(insertGame)
      .returning();
    return game;
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game> {
    const [game] = await db
      .update(games)
      .set(updates)
      .where(eq(games.id, id))
      .returning();
    return game;
  }

  // Draft
  async getAllDraftPicks(): Promise<DraftPick[]> {
    return await db.select().from(draftPicks);
  }

  async getDraftPick(id: string): Promise<DraftPick | undefined> {
    const [pick] = await db.select().from(draftPicks).where(eq(draftPicks.id, id));
    return pick || undefined;
  }

  async createDraftPick(insertPick: InsertDraftPick): Promise<DraftPick> {
    const [pick] = await db
      .insert(draftPicks)
      .values(insertPick)
      .returning();
    return pick;
  }

  async updateDraftPick(id: string, updates: Partial<DraftPick>): Promise<DraftPick> {
    const [pick] = await db
      .update(draftPicks)
      .set(updates)
      .where(eq(draftPicks.id, id))
      .returning();
    return pick;
  }

  // Draft Prospects methods
  async getAllDraftProspects(): Promise<DraftProspect[]> {
    return await db.select().from(draftProspects);
  }

  async getDraftProspect(id: string): Promise<DraftProspect | undefined> {
    const [prospect] = await db.select().from(draftProspects).where(eq(draftProspects.id, id));
    return prospect || undefined;
  }

  async getAvailableProspects(): Promise<DraftProspect[]> {
    return await db.select().from(draftProspects).where(eq(draftProspects.isDrafted, false));
  }

  async createDraftProspect(prospect: InsertDraftProspect): Promise<DraftProspect> {
    const [created] = await db
      .insert(draftProspects)
      .values(prospect)
      .returning();
    return created;
  }

  async updateDraftProspect(id: string, updates: Partial<DraftProspect>): Promise<DraftProspect> {
    const [prospect] = await db
      .update(draftProspects)
      .set(updates)
      .where(eq(draftProspects.id, id))
      .returning();
    return prospect;
  }

  async draftProspect(prospectId: string, teamId: string, round: number, pick: number): Promise<DraftProspect> {
    const [prospect] = await db
      .update(draftProspects)
      .set({
        isDrafted: true,
        draftedBy: teamId,
        draftRound: round,
        draftPick: pick
      })
      .where(eq(draftProspects.id, prospectId))
      .returning();
    return prospect;
  }

  // Draft Settings methods
  async getDraftSettings(): Promise<DraftSettings | undefined> {
    const [settings] = await db.select().from(draftSettings).limit(1);
    return settings || undefined;
  }

  async updateDraftSettings(updates: Partial<DraftSettings>): Promise<DraftSettings> {
    const [settings] = await db
      .update(draftSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(draftSettings.id, "draft_2024"))
      .returning();
    return settings;
  }

  async initializeDraftSettings(): Promise<DraftSettings> {
    try {
      const [settings] = await db
        .insert(draftSettings)
        .values({
          id: "draft_2024",
          isActive: false,
          currentPick: 1,
          currentRound: 1,
          pickTimeLimit: 300,
          totalRounds: 5,
          picksPerRound: 32,
          startTime: null,
          updatedAt: new Date()
        })
        .returning();
      return settings;
    } catch (error) {
      // If already exists, return existing
      const existing = await this.getDraftSettings();
      if (existing) return existing;
      throw error;
    }
  }

  // Trades
  async getAllTrades(): Promise<Trade[]> {
    return await db.select().from(trades);
  }

  async getTrade(id: string): Promise<Trade | undefined> {
    const [trade] = await db.select().from(trades).where(eq(trades.id, id));
    return trade || undefined;
  }

  async getTradesByTeam(teamId: string): Promise<Trade[]> {
    return await db.select().from(trades).where(
      sql`${trades.fromTeamId} = ${teamId} OR ${trades.toTeamId} = ${teamId}`
    );
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const [trade] = await db
      .insert(trades)
      .values(insertTrade)
      .returning();
    return trade;
  }

  async updateTrade(id: string, updates: Partial<Trade>): Promise<Trade> {
    const [trade] = await db
      .update(trades)
      .set(updates)
      .where(eq(trades.id, id))
      .returning();
    return trade;
  }

  // AI Content
  async createGeneratedContent(insertContent: InsertContent): Promise<GeneratedContent> {
    const [content] = await db
      .insert(generatedContent)
      .values(insertContent)
      .returning();
    return content;
  }

  async getGeneratedContent(type?: string): Promise<GeneratedContent[]> {
    if (type) {
      return await db.select().from(generatedContent)
        .where(eq(generatedContent.type, type))
        .orderBy(desc(generatedContent.createdAt));
    }
    return await db.select().from(generatedContent)
      .orderBy(desc(generatedContent.createdAt));
  }

  async getAllGeneratedContent(): Promise<GeneratedContent[]> {
    return await db.select().from(generatedContent)
      .orderBy(desc(generatedContent.createdAt));
  }

  async getAllGeneratedContent(): Promise<GeneratedContent[]> {
    return await db.select().from(generatedContent)
      .orderBy(desc(generatedContent.createdAt));
  }

  // Activity
  async createActivity(insertActivity: InsertActivity): Promise<ActivityLog> {
    const [activity] = await db
      .insert(activityLog)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getAllActivity(): Promise<ActivityLog[]> {
    return await db.select().from(activityLog)
      .orderBy(desc(activityLog.createdAt));
  }

  async getRecentActivity(limit = 10): Promise<ActivityLog[]> {
    return await db.select().from(activityLog)
      .orderBy(desc(activityLog.createdAt))
      .limit(limit);
  }

  // Stats
  async getLeagueStats(): Promise<{
    totalTeams: number;
    totalPlayers: number;
    totalGames: number;
    completedGames: number;
    activeTrades: number;
  }> {
    const [teamCount] = await db.select({ count: sql<number>`count(*)` }).from(teams);
    const [playerCount] = await db.select({ count: sql<number>`count(*)` }).from(players);
    const [gameCount] = await db.select({ count: sql<number>`count(*)` }).from(games);
    const [completedCount] = await db.select({ count: sql<number>`count(*)` }).from(games)
      .where(eq(games.status, 'completed'));
    const [activeTradesCount] = await db.select({ count: sql<number>`count(*)` }).from(trades)
      .where(eq(trades.status, 'pending'));

    return {
      totalTeams: teamCount.count,
      totalPlayers: playerCount.count,
      totalGames: gameCount.count,
      completedGames: completedCount.count,
      activeTrades: activeTradesCount.count,
    };
  }

  // News methods
  async getAllNews(): Promise<NewsArticle[]> {
    return await db.select().from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt));
  }

  async getNewsArticle(id: string): Promise<NewsArticle | undefined> {
    const [article] = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
    return article || undefined;
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const [created] = await db
      .insert(newsArticles)
      .values(article)
      .returning();
    return created;
  }

  async updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle> {
    const [article] = await db
      .update(newsArticles)
      .set(updates)
      .where(eq(newsArticles.id, id))
      .returning();
    return article;
  }

  // Awards methods
  async getAllAwards(): Promise<Award[]> {
    return await db.select().from(awards)
      .orderBy(desc(awards.createdAt));
  }

  async getAward(id: string): Promise<Award | undefined> {
    const [award] = await db.select().from(awards).where(eq(awards.id, id));
    return award || undefined;
  }

  async createAward(award: InsertAward): Promise<Award> {
    const [created] = await db
      .insert(awards)
      .values(award)
      .returning();
    return created;
  }

  async updateAward(id: string, updates: Partial<Award>): Promise<Award> {
    const [award] = await db
      .update(awards)
      .set(updates)
      .where(eq(awards.id, id))
      .returning();
    return award;
  }

  // Award voting methods
  async createAwardVote(vote: InsertAwardVote): Promise<AwardVote> {
    const [created] = await db
      .insert(awardVotes)
      .values(vote)
      .returning();
    return created;
  }

  async getVoteByIpAndAward(voterIp: string, awardId: string): Promise<AwardVote | undefined> {
    const [vote] = await db.select().from(awardVotes)
      .where(sql`${awardVotes.voterIp} = ${voterIp} AND ${awardVotes.awardId} = ${awardId}`);
    return vote || undefined;
  }

  async getAwardVoteResults(awardId: string): Promise<any> {
    const votes = await db.select().from(awardVotes)
      .where(eq(awardVotes.awardId, awardId));
    
    const results = votes.reduce((acc: any, vote) => {
      acc[vote.nomineeId] = (acc[vote.nomineeId] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalVotes: votes.length,
      results,
      winner: Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b, '')
    };
  }

  // Team Chat operations
  async getTeamChatMessages(teamId: string): Promise<any[]> {
    // For now, return mock data - in production this would use a database table
    return [];
  }

  async createTeamChatMessage(data: any): Promise<any> {
    // Mock implementation - in production this would save to database
    const message = {
      id: randomUUID(),
      teamId: data.teamId,
      userId: data.userId,
      message: data.message,
      messageType: data.messageType || 'text',
      createdAt: new Date().toISOString(),
      username: 'Team Member'
    };
    return message;
  }

  // CHEL Stats operations
  async getChelStats(gamertag: string): Promise<any | undefined> {
    // Mock implementation - return undefined to force fresh lookup
    return undefined;
  }

  async upsertChelStats(data: any): Promise<any> {
    // Mock implementation - just return the data with added metadata
    return {
      ...data,
      id: randomUUID(),
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
  }

  // Draft Pick operations for management
  async makeDraftPick(prospectId: string, teamId: string): Promise<any> {
    // Mock implementation - in production this would save to database
    const draftPick = {
      id: randomUUID(),
      prospectId,
      teamId,
      round: 1,
      pick: 1,
      createdAt: new Date().toISOString(),
    };
    return draftPick;
  }

  async advanceDraftPick(): Promise<void> {
    // Mock implementation - in production this would update draft settings
    return;
  }

  // Team Lineup operations
  async getTeamLineup(teamId: string, gameId?: string): Promise<any | undefined> {
    if (gameId) {
      const [lineup] = await db.select().from(teamLineups)
        .where(sql`${teamLineups.teamId} = ${teamId} AND ${teamLineups.gameId} = ${gameId} AND ${teamLineups.isActive} = true`);
      return lineup || undefined;
    } else {
      const [lineup] = await db.select().from(teamLineups)
        .where(sql`${teamLineups.teamId} = ${teamId} AND ${teamLineups.gameId} IS NULL AND ${teamLineups.isActive} = true`);
      return lineup || undefined;
    }
  }

  async createTeamLineup(lineup: any): Promise<any> {
    const [created] = await db
      .insert(teamLineups)
      .values(lineup)
      .returning();
    return created;
  }

  async updateTeamLineup(id: string, updates: any): Promise<any> {
    const [lineup] = await db
      .update(teamLineups)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(teamLineups.id, id))
      .returning();
    return lineup;
  }

  // Player Availability operations
  async getPlayerAvailability(playerId: string, gameId?: string): Promise<any | undefined> {
    if (gameId) {
      const [availability] = await db.select().from(playerAvailability)
        .where(sql`${playerAvailability.playerId} = ${playerId} AND ${playerAvailability.gameId} = ${gameId}`);
      return availability || undefined;
    } else {
      const [availability] = await db.select().from(playerAvailability)
        .where(sql`${playerAvailability.playerId} = ${playerId} AND ${playerAvailability.gameId} IS NULL`);
      return availability || undefined;
    }
  }

  async setPlayerAvailability(data: any): Promise<any> {
    // First check if availability already exists
    const existing = await this.getPlayerAvailability(data.playerId, data.gameId);
    
    if (existing) {
      const [updated] = await db
        .update(playerAvailability)
        .set({ 
          isAvailable: data.isAvailable, 
          availabilityNote: data.availabilityNote,
          submittedAt: new Date()
        })
        .where(eq(playerAvailability.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(playerAvailability)
        .values(data)
        .returning();
      return created;
    }
  }

  async getTeamAvailability(teamId: string, gameId?: string): Promise<any[]> {
    // Get all players for the team
    const teamPlayers = await db.select().from(players)
      .where(eq(players.teamId, teamId));
    
    // Get availability for all players
    const availabilityPromises = teamPlayers.map(player =>
      this.getPlayerAvailability(player.id, gameId)
    );
    
    const availabilities = await Promise.all(availabilityPromises);
    
    // Combine player info with availability
    return teamPlayers.map((player, index) => ({
      ...player,
      availability: availabilities[index] || { isAvailable: true, availabilityNote: null }
    }));
  }

  // Image management
  async getAllImages(): Promise<any[]> {
    // Mock implementation - return empty array for now
    return [];
  }

  async createImage(image: any): Promise<any> {
    // Mock implementation - simulate image creation
    const newImage = {
      id: randomUUID(),
      ...image,
      uploadedAt: new Date(),
      createdAt: new Date(),
    };
    return newImage;
  }

  async deleteImage(id: string): Promise<void> {
    // Mock implementation - in production this would delete from database
    return;
  }

  async getImagesByCategory(category: string): Promise<any[]> {
    // Mock implementation - return empty array for now
    return [];
  }

  // Playoff Brackets (missing methods)
  async getPlayoffBrackets(): Promise<any[]> {
    // Mock implementation - return empty for now
    return [];
  }

  async createPlayoffBracket(bracket: any): Promise<any> {
    // Mock implementation 
    return { ...bracket, id: randomUUID() };
  }

  async updatePlayoffBracket(id: string, updates: any): Promise<any> {
    // Mock implementation
    return { id, ...updates };
  }


}

export const storage = new DatabaseStorage();
