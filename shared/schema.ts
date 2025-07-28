import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users and Authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  role: text("role").notNull().default("player"), // 'player', 'management', 'admin'
  teamId: varchar("team_id"),
  playerId: varchar("player_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Teams
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  city: text("city").notNull(),
  abbreviation: text("abbreviation").notNull(),
  conference: text("conference").notNull(),
  division: text("division").notNull(),
  logoUrl: text("logo_url"),
  stadium: text("stadium"),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  otLosses: integer("ot_losses").default(0),
  points: integer("points").default(0),
});

// Players
export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  number: integer("number"),
  position: text("position").notNull(),
  teamId: varchar("team_id"),
  isManagement: boolean("is_management").default(false),
  gamertag: text("gamertag"),
  bio: text("bio"),
  availability: text("availability").default("available"),
  // Stats
  gamesPlayed: integer("games_played").default(0),
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  points: integer("points").default(0),
  plusMinus: integer("plus_minus").default(0),
  penaltyMinutes: integer("penalty_minutes").default(0),
  hits: integer("hits").default(0),
  blocks: integer("blocks").default(0),
  sog: integer("sog").default(0),
  // Goalie stats
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  otLosses: integer("ot_losses").default(0),
  gaa: text("gaa").default("0.00"),
  svPct: text("sv_pct").default("0.000"),
});

// Games
export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  homeTeamId: varchar("home_team_id").notNull(),
  awayTeamId: varchar("away_team_id").notNull(),
  gameDate: timestamp("game_date").notNull(),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  status: text("status").default("scheduled"), // 'scheduled', 'live', 'completed'
  isPlayoff: boolean("is_playoff").default(false),
  round: text("round"),
  series: text("series"),
  gameNumber: integer("game_number"),
  venue: text("venue"),
});

// Playoff brackets table
export const playoffBrackets = pgTable("playoff_brackets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  season: text("season").notNull().default("2024-25"),
  conference: text("conference").notNull(), // Eastern, Western
  round: text("round").notNull(), // round1, round2, conference-final, stanley-cup
  series: text("series").notNull(),
  team1Id: varchar("team1_id").notNull(),
  team2Id: varchar("team2_id").notNull(),
  team1Wins: integer("team1_wins").default(0),
  team2Wins: integer("team2_wins").default(0),
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed
  winnerId: varchar("winner_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Draft
export const draftPicks = pgTable("draft_picks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pickNumber: integer("pick_number").notNull(),
  round: integer("round").notNull(),
  teamId: varchar("team_id").notNull(),
  playerId: varchar("player_id"),
  playerName: text("player_name"),
  isSelected: boolean("is_selected").default(false),
  timeRemaining: integer("time_remaining").default(300), // 5 minutes in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Draft Prospects (available players for draft)
export const draftProspects = pgTable("draft_prospects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  age: integer("age").notNull(),
  height: text("height"),
  weight: text("weight"),
  country: text("country"),
  league: text("league"),
  // Scouting ratings (1-10)
  skating: integer("skating").default(5),
  shooting: integer("shooting").default(5),
  passing: integer("passing").default(5),
  checking: integer("checking").default(5),
  defense: integer("defense").default(5),
  puckHandling: integer("puck_handling").default(5),
  overall: integer("overall").default(5),
  potential: integer("potential").default(5),
  // Status
  isDrafted: boolean("is_drafted").default(false),
  draftedBy: varchar("drafted_by"),
  draftRound: integer("draft_round"),
  draftPick: integer("draft_pick"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Draft Settings/Status
export const draftSettings = pgTable("draft_settings", {
  id: varchar("id").primaryKey().default("draft_2024"),
  isActive: boolean("is_active").default(false),
  currentPick: integer("current_pick").default(1),
  currentRound: integer("current_round").default(1),
  pickTimeLimit: integer("pick_time_limit").default(300), // 5 minutes
  totalRounds: integer("total_rounds").default(5),
  picksPerRound: integer("picks_per_round").default(32),
  startTime: timestamp("start_time"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trades
export const trades = pgTable("trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromTeamId: varchar("from_team_id").notNull(),
  toTeamId: varchar("to_team_id").notNull(),
  playersOffered: json("players_offered").notNull(),
  playersWanted: json("players_wanted").notNull(),
  status: text("status").default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Generated Content
export const generatedContent = pgTable("generated_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  input: json("input").notNull(),
  output: json("output").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity Log
export const activityLog = pgTable("activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Generated News Articles
export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull().default("MVHL AI Reporter"),
  category: text("category").notNull(),
  tags: json("tags").default([]),
  readTime: text("read_time").default("3 min read"),
  featured: boolean("featured").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Awards and Voting
export const awards = pgTable("awards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'player', 'team', 'special'
  nominees: json("nominees").notNull().default([]), // Array of player/team IDs
  winner: varchar("winner_id"),
  votingOpen: boolean("voting_open").default(true),
  season: text("season").notNull().default("2024-25"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Award Votes with IP tracking
export const awardVotes = pgTable("award_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  awardId: varchar("award_id").notNull(),
  nomineeId: varchar("nominee_id").notNull(),
  voterIp: text("voter_ip").notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Team Chat Messages
export const teamChatMessages = pgTable("team_chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull(),
  userId: varchar("user_id").notNull(),
  message: text("message").notNull(),
  messageType: text("message_type").default("text"), // 'text', 'draft_pick', 'trade_alert'
  createdAt: timestamp("created_at").defaultNow(),
});

// CHEL Stats (external player stats)
export const chelStats = pgTable("chel_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gamertag: text("gamertag").notNull().unique(),
  platform: text("platform").default("PlayStation"), // PlayStation, Xbox, PC
  // Overall stats
  gamesPlayed: integer("games_played").default(0),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  // Offensive stats
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  points: integer("points").default(0),
  // Defensive stats
  hits: integer("hits").default(0),
  blocks: integer("blocks").default(0),
  takeaways: integer("takeaways").default(0),
  giveaways: integer("giveaways").default(0),
  // Goalie stats
  saves: integer("saves").default(0),
  goalsAgainst: integer("goals_against").default(0),
  shutouts: integer("shutouts").default(0),
  // Club info
  clubName: text("club_name"),
  position: text("position"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  gamertag: z.string().optional(),
});

// AI tool schemas
export const draftCommentaryInputSchema = z.object({
  prospect: z.string().min(1, "Prospect name is required"),
  position: z.string().min(1, "Position is required"),
  team: z.string().min(1, "Team name is required"),
  pickNumber: z.number().min(1, "Pick number must be positive"),
});

export const scoutingReportInputSchema = z.object({
  playerName: z.string().min(1, "Player name is required"),
  position: z.string().min(1, "Position is required"),
  stats: z.object({
    gamesPlayed: z.number(),
    goals: z.number(),
    assists: z.number(),
    points: z.number(),
    plusMinus: z.number(),
    penaltyMinutes: z.number(),
    hits: z.number(),
    blocks: z.number(),
    sog: z.number(),
  }),
});

export const newsRecapInputSchema = z.object({
  gameResults: z.string().min(1, "Game results are required"),
  keyPlayers: z.string().min(1, "Key players information is required"),
});

export const playerStatsInputSchema = z.object({
  gamertag: z.string().min(1, "Gamertag is required"),
});

export const playerHeadshotInputSchema = z.object({
  player_name: z.string().min(1, "Player name is required"),
  team_name: z.string().min(1, "Team name is required"),
  position: z.string().min(1, "Position is required"),
});

export const hallOfFameInputSchema = z.object({
  playerName: z.string().min(1, "Player name is required"),
});

// Trade schemas
export const tradeOfferSchema = z.object({
  fromTeamId: z.string().min(1, "From team is required"),
  toTeamId: z.string().min(1, "To team is required"),
  offeredPlayer: z.string().min(1, "Offered player is required"),
  requestedPlayer: z.string().min(1, "Requested player is required"),
  status: z.enum(['pending', 'accepted', 'rejected']).default('pending'),
});

// Player update schemas
export const playerUpdateSchema = z.object({
  gamertag: z.string().optional(),
  bio: z.string().optional(),
  availability: z.enum(['available', 'maybe', 'unavailable']).optional(),
});

// Draft pick schemas
export const draftPickSchema = z.object({
  prospectId: z.string().min(1, "Prospect ID is required"),
  teamId: z.string().min(1, "Team ID is required"),
});

export const draftActionSchema = z.object({
  action: z.enum(['start', 'pause', 'reset', 'advance']),
  settings: z.object({
    pickTimeLimit: z.number().optional(),
    totalRounds: z.number().optional(),
  }).optional(),
});

// News generation schemas
export const newsGenerationSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  category: z.enum(['draft', 'trades', 'standings', 'players', 'analysis', 'league-news']),
  featured: z.boolean().default(false),
});

// Award voting schemas
export const awardVoteSchema = z.object({
  awardId: z.string().min(1, "Award ID is required"),
  nomineeId: z.string().min(1, "Nominee ID is required"),
});

// Team chat schemas
export const teamChatMessageSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  message: z.string().min(1, "Message cannot be empty").max(500, "Message too long"),
  messageType: z.enum(['text', 'draft_pick', 'trade_alert']).default('text'),
});

// CHEL stats lookup schema
export const chelStatsLookupSchema = z.object({
  gamertag: z.string().min(1, "Gamertag is required"),
  platform: z.enum(['PlayStation', 'Xbox', 'PC']).default('PlayStation'),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
});

export const insertTeamChatMessageSchema = createInsertSchema(teamChatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertChelStatsSchema = createInsertSchema(chelStats).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertDraftPickSchema = createInsertSchema(draftPicks).omit({
  id: true,
  createdAt: true,
});

export const insertDraftProspectSchema = createInsertSchema(draftProspects).omit({
  id: true,
  createdAt: true,
});

export const insertDraftSettingsSchema = createInsertSchema(draftSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  createdAt: true,
});

export const insertContentSchema = createInsertSchema(generatedContent).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activityLog).omit({
  id: true,
  createdAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
});

export const insertAwardSchema = createInsertSchema(awards).omit({
  id: true,
  createdAt: true,
});

export const insertAwardVoteSchema = createInsertSchema(awardVotes).omit({
  id: true,
  createdAt: true,
});

// Team Lineups
export const teamLineups = pgTable("team_lineups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull(),
  gameId: varchar("game_id"), // null for default lineup
  lineupName: text("lineup_name").default("Default"),
  // Starting lineup positions
  centerId: varchar("center_id"),
  leftWingId: varchar("left_wing_id"),
  rightWingId: varchar("right_wing_id"),
  leftDefenseId: varchar("left_defense_id"),
  rightDefenseId: varchar("right_defense_id"),
  goalieId: varchar("goalie_id"),
  // Bench players
  benchPlayers: json("bench_players").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Player Availability
export const playerAvailability = pgTable("player_availability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull(),
  gameId: varchar("game_id"), // null for general availability
  isAvailable: boolean("is_available").default(true),
  availabilityNote: text("availability_note"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertTeamLineupSchema = createInsertSchema(teamLineups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlayerAvailabilitySchema = createInsertSchema(playerAvailability).omit({
  id: true,
  submittedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type DraftPick = typeof draftPicks.$inferSelect;
export type InsertDraftPick = z.infer<typeof insertDraftPickSchema>;
export type DraftProspect = typeof draftProspects.$inferSelect;
export type InsertDraftProspect = z.infer<typeof insertDraftProspectSchema>;
export type DraftSettings = typeof draftSettings.$inferSelect;
export type InsertDraftSettings = z.infer<typeof insertDraftSettingsSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type GeneratedContent = typeof generatedContent.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type Award = typeof awards.$inferSelect;
export type InsertAward = z.infer<typeof insertAwardSchema>;
export type AwardVote = typeof awardVotes.$inferSelect;
export type InsertAwardVote = z.infer<typeof insertAwardVoteSchema>;
export type TeamLineup = typeof teamLineups.$inferSelect;
export type InsertTeamLineup = z.infer<typeof insertTeamLineupSchema>;
export type PlayerAvailability = typeof playerAvailability.$inferSelect;
export type InsertPlayerAvailability = z.infer<typeof insertPlayerAvailabilitySchema>;

// Input types
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type DraftCommentaryInput = z.infer<typeof draftCommentaryInputSchema>;
export type ScoutingReportInput = z.infer<typeof scoutingReportInputSchema>;
export type NewsRecapInput = z.infer<typeof newsRecapInputSchema>;
export type PlayerStatsInput = z.infer<typeof playerStatsInputSchema>;
export type PlayerHeadshotInput = z.infer<typeof playerHeadshotInputSchema>;
export type HallOfFameInput = z.infer<typeof hallOfFameInputSchema>;
export type TradeOfferInput = z.infer<typeof tradeOfferSchema>;
export type PlayerUpdateInput = z.infer<typeof playerUpdateSchema>;
export type NewsGenerationInput = z.infer<typeof newsGenerationSchema>;
export type AwardVoteInput = z.infer<typeof awardVoteSchema>;

// Image Management
export const images = pgTable("images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  category: text("category").notNull(), // 'team-logos', 'player-headshots', 'trophies-awards', 'event-banners', 'draft-graphics'
  description: text("description").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  targetId: varchar("target_id"), // ID of associated team, player, award, etc.
  uploadedBy: varchar("uploaded_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
  uploadedAt: true,
});

export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
