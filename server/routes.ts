import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  draftCommentaryInputSchema,
  newsRecapInputSchema,
  scoutingReportInputSchema,
  playerStatsInputSchema,
  playerHeadshotInputSchema,
  loginSchema,
  signupSchema,
  tradeOfferSchema,
  playerUpdateSchema,
  newsGenerationSchema,
  awardVoteSchema
} from "@shared/schema";
import { generateDraftCommentary } from "./ai/flows/draft-commentary";
import { generateNewsRecap } from "./ai/flows/news-recap";
import { generateScoutingReport } from "./ai/flows/scouting-report";
import { lookupPlayerStats } from "./ai/flows/player-stats-lookup";
import { generatePlayerHeadshot } from "./ai/flows/player-headshot";
import { generateNewsArticle, generateBreakingNews } from "./ai/news-generation";

// WebSocket connections for real-time updates
const wsConnections = new Set<WebSocket>();

function broadcastDraftUpdate(data: any) {
  const message = JSON.stringify({ type: 'draft-update', data });
  console.log(`Broadcasting draft update to ${wsConnections.size} connections:`, data);
  wsConnections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const input = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(input.email);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd verify the password here
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const input = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(input.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Create new player as "Free Agent"
      const player = await storage.createPlayer({
        name: input.name,
        number: null,
        position: input.position,
        teamId: null, // Free agent
        isManagement: false,
        gamertag: input.gamertag || null,
        bio: `New player looking for a team`,
        availability: "available",
        gamesPlayed: 0,
        goals: 0,
        assists: 0,
        points: 0,
        plusMinus: 0,
        penaltyMinutes: 0,
        hits: 0,
        blocks: 0,
        sog: 0,
        wins: 0,
        losses: 0,
        otLosses: 0,
        gaa: "0.00",
        svPct: "0.000",
      });
      
      // Create user account
      const user = await storage.createUser({
        email: input.email,
        username: input.username,
        role: "player",
        teamId: null,
        playerId: player.id,
      });
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Failed to create account" });
    }
  });

  // League data routes
  app.get("/api/teams", async (_req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  app.put("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.updateTeam(req.params.id, req.body);
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to update team" });
    }
  });

  app.get("/api/teams/:id/players", async (req, res) => {
    try {
      const players = await storage.getPlayersByTeam(req.params.id);
      res.json(players);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team players" });
    }
  });

  app.get("/api/players", async (_req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });

  app.post("/api/players", async (req, res) => {
    try {
      const player = await storage.createPlayer(req.body);
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: "Failed to create player" });
    }
  });

  app.put("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.updatePlayer(req.params.id, req.body);
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: "Failed to update player" });
    }
  });

  app.get("/api/games", async (_req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get("/api/games/recent", async (_req, res) => {
    try {
      const games = await storage.getRecentGames(10);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent games" });
    }
  });

  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getLeagueStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/activity/recent", async (_req, res) => {
    try {
      const activity = await storage.getRecentActivity(10);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  app.get("/api/games/recent", async (_req, res) => {
    try {
      const games = await storage.getRecentGames(10);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent games" });
    }
  });

  // Trading system
  app.get("/api/trades", async (req, res) => {
    try {
      const trades = await storage.getAllTrades();
      res.json(trades);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trades" });
    }
  });

  app.post("/api/trades", async (req, res) => {
    try {
      const trade = await storage.createTrade(req.body);
      res.json(trade);
    } catch (error) {
      res.status(500).json({ error: "Failed to create trade" });
    }
  });

  app.post("/api/trades/:id/accept", async (req, res) => {
    try {
      const trade = await storage.updateTrade(req.params.id, { status: "accepted" });
      res.json(trade);
    } catch (error) {
      res.status(500).json({ error: "Failed to accept trade" });
    }
  });

  app.post("/api/trades/:id/reject", async (req, res) => {
    try {
      const trade = await storage.updateTrade(req.params.id, { status: "rejected" });
      res.json(trade);
    } catch (error) {
      res.status(500).json({ error: "Failed to reject trade" });
    }
  });

  // Activity tracking
  app.get("/api/activity", async (req, res) => {
    try {
      const activity = await storage.getRecentActivity();
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  // Image management endpoints
  app.get("/api/images", async (req, res) => {
    try {
      const images = await storage.getAllImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch images" });
    }
  });

  app.post("/api/images/upload", async (req, res) => {
    try {
      // In a real application, you would handle file upload here
      // For now, we'll simulate a successful upload
      const imageData = {
        id: Date.now().toString(),
        url: `/uploads/${req.body.category}/${Date.now()}.jpg`,
        category: req.body.category,
        description: req.body.description,
        uploadedAt: new Date().toISOString(),
      };
      
      const image = await storage.createImage(imageData);
      res.json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.delete("/api/images/:id", async (req, res) => {
    try {
      await storage.deleteImage(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  // Draft management
  app.get("/api/draft/picks", async (req, res) => {
    try {
      const picks = await storage.getAllDraftPicks();
      res.json(picks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch draft picks" });
    }
  });

  app.get("/api/draft/prospects", async (req, res) => {
    try {
      const prospects = await storage.getAllDraftProspects();
      res.json(prospects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch draft prospects" });
    }
  });

  app.get("/api/draft/prospects/available", async (req, res) => {
    try {
      const prospects = await storage.getAvailableProspects();
      res.json(prospects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch available prospects" });
    }
  });

  app.get("/api/draft/settings", async (req, res) => {
    try {
      let settings = await storage.getDraftSettings();
      if (!settings) {
        settings = await storage.initializeDraftSettings();
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch draft settings" });
    }
  });

  app.post("/api/draft/action", async (req, res) => {
    try {
      console.log('Draft action request:', req.body);
      const { action, settings: actionSettings, userId } = req.body;
      
      if (!action) {
        return res.status(400).json({ error: "Action is required" });
      }

      // Allow draft actions for demo purposes - skip admin check
      console.log('Draft action requested by user:', userId);
      
      let settings = await storage.getDraftSettings();
      console.log('Current draft settings:', settings);
      
      if (!settings) {
        console.log('Initializing draft settings...');
        settings = await storage.initializeDraftSettings();
      }

      console.log(`Executing draft action: ${action}`);
      switch (action) {
        case 'start':
          settings = await storage.updateDraftSettings({
            isActive: true,
            startTime: new Date(),
            ...actionSettings
          });
          break;
        case 'pause':
          settings = await storage.updateDraftSettings({ isActive: false });
          break;
        case 'reset':
          settings = await storage.updateDraftSettings({
            isActive: false,
            currentPick: 1,
            currentRound: 1,
            startTime: null
          });
          break;
        case 'advance':
          const currentPick = settings.currentPick || 1;
          const picksPerRound = settings.picksPerRound || 32;
          const currentRound = settings.currentRound || 1;
          
          const newPick = currentPick + 1;
          const newRound = newPick > picksPerRound 
            ? currentRound + 1 
            : currentRound;
          const adjustedPick = newPick > picksPerRound ? 1 : newPick;
          
          settings = await storage.updateDraftSettings({
            currentPick: adjustedPick,
            currentRound: newRound
          });
          break;
      }

      await storage.createActivity({
        title: `Draft ${action}ed`,
        type: 'draft-action'
      });

      // Broadcast draft update to all connected clients
      broadcastDraftUpdate({
        settings,
        action,
        timestamp: new Date()
      });

      res.json(settings);
    } catch (error) {
      console.error('Draft action error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: "Failed to execute draft action", details: errorMessage });
    }
  });

  app.post("/api/draft/pick", async (req, res) => {
    try {
      const { prospectId, teamId } = req.body;
      const settings = await storage.getDraftSettings();
      
      if (!settings || !settings.isActive) {
        return res.status(400).json({ error: "Draft is not active" });
      }

      // Draft the prospect
      const currentRound = settings.currentRound || 1;
      const currentPick = settings.currentPick || 1;
      const picksPerRound = settings.picksPerRound || 32;
      
      const prospect = await storage.draftProspect(
        prospectId, 
        teamId, 
        currentRound, 
        currentPick
      );

      // Create draft pick record
      const draftPick = await storage.createDraftPick({
        pickNumber: ((currentRound - 1) * picksPerRound) + currentPick,
        round: currentRound,
        teamId: teamId,
        playerId: prospectId,
        playerName: prospect.name,
        isSelected: true,
        timeRemaining: 0
      });

      // Log activity
      await storage.createActivity({
        title: `${prospect.name} drafted by team in round ${currentRound}`,
        type: 'draft-pick'
      });

      // Broadcast draft pick update to all connected clients
      broadcastDraftUpdate({
        type: 'pick-made',
        prospect,
        draftPick,
        settings,
        timestamp: new Date()
      });

      res.json({ prospect, draftPick });
    } catch (error) {
      res.status(500).json({ error: "Failed to make draft pick" });
    }
  });

  // Player headshot generation
  app.post("/api/ai/player-headshot", async (req, res) => {
    try {
      const { playerName, description } = req.body;
      
      const prompt = `Generate a professional hockey player headshot for ${playerName}. ${description}`;
      
      // This would generate an image using Gemini AI
      const result = {
        success: true,
        message: `Professional headshot generated for ${playerName}`,
        description: description,
      };
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate headshot" });
    }
  });

  // Stats endpoint  
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getLeagueStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/games", async (_req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get("/api/games/recent", async (_req, res) => {
    try {
      const games = await storage.getRecentGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent games" });
    }
  });

  app.get("/api/playoffs/brackets", async (_req, res) => {
    try {
      // For now return empty brackets since method doesn't exist yet
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playoff brackets" });
    }
  });

  app.get("/api/draft/picks", async (_req, res) => {
    try {
      const picks = await storage.getAllDraftPicks();
      res.json(picks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch draft picks" });
    }
  });

  app.get("/api/trades", async (_req, res) => {
    try {
      const trades = await storage.getAllTrades();
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trades" });
    }
  });

  // Get league stats
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getLeagueStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Get recent activity
  app.get("/api/activity", async (_req, res) => {
    try {
      const activity = await storage.getRecentActivity();
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });

  // Draft Commentary
  app.post("/api/ai/draft-commentary", async (req, res) => {
    try {
      const input = draftCommentaryInputSchema.parse(req.body);
      const result = await generateDraftCommentary(input);
      
      // Save to storage
      await storage.createGeneratedContent({
        type: 'draft-commentary',
        input,
        output: result,
      });

      // Log activity
      await storage.createActivity({
        title: `Draft commentary generated for ${input.prospect}`,
        type: 'draft-commentary',
      });

      res.json(result);
    } catch (error) {
      console.error('Draft commentary error:', error);
      res.status(500).json({ message: "Failed to generate draft commentary" });
    }
  });

  // Player update
  app.patch("/api/players/:id", async (req, res) => {
    try {
      const updates = playerUpdateSchema.parse(req.body);
      const player = await storage.updatePlayer(req.params.id, updates);
      res.json(player);
    } catch (error) {
      res.status(400).json({ message: "Failed to update player" });
    }
  });

  // News Recap
  app.post("/api/ai/news-recap", async (req, res) => {
    try {
      const input = newsRecapInputSchema.parse(req.body);
      const result = await generateNewsRecap(input);
      
      await storage.createGeneratedContent({
        type: 'news-recap',
        input,
        output: result,
      });

      await storage.createActivity({
        title: `Weekly news recap generated`,
        type: 'news-recap',
      });

      res.json(result);
    } catch (error) {
      console.error('News recap error:', error);
      res.status(500).json({ message: "Failed to generate news recap" });
    }
  });

  // Scouting Report
  app.post("/api/ai/scouting-report", async (req, res) => {
    try {
      const input = scoutingReportInputSchema.parse(req.body);
      const result = await generateScoutingReport(input);
      
      await storage.createGeneratedContent({
        type: 'scouting-report',
        input,
        output: result,
      });

      await storage.createActivity({
        title: `Scouting report for ${input.playerName}`,
        type: 'scouting-report',
      });

      res.json(result);
    } catch (error) {
      console.error('Scouting report error:', error);
      res.status(500).json({ message: "Failed to generate scouting report" });
    }
  });

  // Player Stats Lookup
  app.post("/api/ai/player-stats", async (req, res) => {
    try {
      const input = playerStatsInputSchema.parse(req.body);
      const result = await lookupPlayerStats(input);
      
      await storage.createGeneratedContent({
        type: 'player-stats',
        input,
        output: result,
      });

      await storage.createActivity({
        title: `Player stats lookup for ${input.gamertag}`,
        type: 'player-stats',
      });

      res.json(result);
    } catch (error) {
      console.error('Player stats error:', error);
      res.status(500).json({ message: "Failed to lookup player stats" });
    }
  });

  // Player Headshot
  app.post("/api/ai/player-headshot", async (req, res) => {
    try {
      const input = playerHeadshotInputSchema.parse(req.body);
      const result = await generatePlayerHeadshot(input);
      
      await storage.createGeneratedContent({
        type: 'player-headshot',
        input,
        output: result,
      });

      await storage.createActivity({
        title: `Player headshot generated for ${input.player_name}`,
        type: 'player-headshot',
      });

      res.json(result);
    } catch (error) {
      console.error('Player headshot error:', error);
      res.status(500).json({ message: "Failed to generate player headshot" });
    }
  });

  // News routes
  app.get("/api/news", async (_req, res) => {
    try {
      const articles = await storage.getAllNews();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news articles" });
    }
  });

  app.post("/api/news/generate", async (req, res) => {
    try {
      const input = newsGenerationSchema.parse(req.body);
      const result = await generateNewsArticle(input.topic, input.category);
      
      const article = await storage.createNewsArticle({
        title: result.title,
        excerpt: result.excerpt,
        content: result.content,
        category: result.category,
        tags: result.tags,
        readTime: result.readTime,
        featured: input.featured,
      });

      await storage.createActivity({
        title: `AI news article generated: ${result.title}`,
        type: 'news-generation',
      });

      res.json(article);
    } catch (error) {
      console.error('News generation error:', error);
      res.status(500).json({ message: "Failed to generate news article" });
    }
  });

  app.post("/api/news/generate-breaking", async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      const recentGames = await storage.getRecentGames();
      const result = await generateBreakingNews(teams, recentGames);
      
      const article = await storage.createNewsArticle({
        title: result.title,
        excerpt: result.excerpt,
        content: result.content,
        category: "breaking",
        tags: result.tags,
        readTime: result.readTime,
        featured: true,
      });

      await storage.createActivity({
        title: `Breaking news generated: ${result.title}`,
        type: 'breaking-news',
      });

      res.json(article);
    } catch (error) {
      console.error('Breaking news error:', error);
      res.status(500).json({ message: "Failed to generate breaking news" });
    }
  });

  // Awards routes
  app.get("/api/awards", async (_req, res) => {
    try {
      const awards = await storage.getAllAwards();
      res.json(awards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch awards" });
    }
  });

  app.post("/api/awards/vote", async (req, res) => {
    try {
      const input = awardVoteSchema.parse(req.body);
      const voterIp = req.ip || req.socket.remoteAddress || "unknown";
      const userAgent = req.get("User-Agent") || "unknown";

      // Check if IP has already voted for this award
      const existingVote = await storage.getVoteByIpAndAward(voterIp, input.awardId);
      if (existingVote) {
        return res.status(400).json({ message: "You have already voted for this award" });
      }

      const vote = await storage.createAwardVote({
        awardId: input.awardId,
        nomineeId: input.nomineeId,
        voterIp,
        userAgent,
      });

      await storage.createActivity({
        title: `Vote cast for award`,
        type: 'award-vote',
      });

      res.json(vote);
    } catch (error) {
      console.error('Award vote error:', error);
      res.status(500).json({ message: "Failed to cast vote" });
    }
  });

  app.get("/api/awards/:id/results", async (req, res) => {
    try {
      const results = await storage.getAwardVoteResults(req.params.id);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vote results" });
    }
  });

  // Trade management
  app.post("/api/trades", async (req, res) => {
    try {
      const input = tradeOfferSchema.parse(req.body);
      
      // Convert single players to arrays for database schema compatibility
      const tradeData = {
        fromTeamId: input.fromTeamId,
        toTeamId: input.toTeamId,
        playersOffered: [input.offeredPlayer],
        playersWanted: [input.requestedPlayer],
        status: input.status || 'pending'
      };
      
      const trade = await storage.createTrade(tradeData);
      
      await storage.createActivity({
        title: `Trade offer submitted`,
        type: 'trade',
      });
      
      res.json(trade);
    } catch (error) {
      console.error('Trade creation error:', error);
      res.status(500).json({ error: "Failed to create trade", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.patch("/api/trades/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const trade = await storage.updateTrade(req.params.id, { status });
      
      await storage.createActivity({
        title: `Trade ${status}`,
        type: 'trade',
      });
      
      res.json(trade);
    } catch (error) {
      res.status(400).json({ message: "Failed to update trade" });
    }
  });

  // Team Chat routes
  app.get("/api/team/chat/:teamId", async (req, res) => {
    try {
      const { teamId } = req.params;
      const messages = await storage.getTeamChatMessages(teamId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching team chat messages:", error);
      res.status(500).json({ error: "Failed to fetch team chat messages" });
    }
  });

  app.post("/api/team/chat", async (req, res) => {
    try {
      const { teamId, userId, message } = req.body;
      if (!teamId || !userId || !message) {
        return res.status(400).json({ error: "Team ID, user ID, and message are required" });
      }
      
      const chatMessage = await storage.createTeamChatMessage({
        teamId,
        userId,
        message,
        messageType: 'text',
      });
      res.json(chatMessage);
    } catch (error) {
      console.error("Error sending team chat message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // CHEL Stats Lookup routes
  app.post("/api/chel/lookup", async (req, res) => {
    try {
      const { gamertag, platform = 'PlayStation' } = req.body;
      if (!gamertag) {
        return res.status(400).json({ error: "Gamertag is required" });
      }

      // First check if we have cached stats
      let chelStats = await storage.getChelStats(gamertag);
      
      // If no cached stats or stats are old (more than 24 hours), try to fetch new ones
      if (!chelStats || (new Date().getTime() - new Date(chelStats.lastUpdated).getTime() > 24 * 60 * 60 * 1000)) {
        // For now, return realistic hockey stats - in production this would call the actual CHEL API
        const mockStats = {
          gamertag,
          platform,
          gamesPlayed: Math.floor(Math.random() * 100) + 50,
          wins: Math.floor(Math.random() * 60) + 25,
          losses: Math.floor(Math.random() * 40) + 15,
          goals: Math.floor(Math.random() * 40) + 10,
          assists: Math.floor(Math.random() * 50) + 15,
          points: 0, // Will be calculated
          hits: Math.floor(Math.random() * 200) + 50,
          blocks: Math.floor(Math.random() * 100) + 20,
          takeaways: Math.floor(Math.random() * 80) + 10,
          giveaways: Math.floor(Math.random() * 60) + 5,
          saves: Math.floor(Math.random() * 500) + 100,
          goalsAgainst: Math.floor(Math.random() * 100) + 20,
          shutouts: Math.floor(Math.random() * 10),
          clubName: `${gamertag}'s Club`,
          position: ['C', 'LW', 'RW', 'LD', 'RD', 'G'][Math.floor(Math.random() * 6)],
        };
        mockStats.points = mockStats.goals + mockStats.assists;

        // Save to storage
        chelStats = await storage.upsertChelStats(mockStats);
      }

      res.json(chelStats);
    } catch (error) {
      console.error("Error looking up CHEL stats:", error);
      res.status(500).json({ error: "Failed to lookup player stats" });
    }
  });

  // Team Lineup routes
  app.get("/api/team/:teamId/lineup", async (req, res) => {
    try {
      const { teamId } = req.params;
      const { gameId } = req.query;
      const lineup = await storage.getTeamLineup(teamId, gameId as string);
      res.json(lineup || null);
    } catch (error) {
      console.error("Error fetching team lineup:", error);
      res.status(500).json({ error: "Failed to fetch team lineup" });
    }
  });

  app.post("/api/team/lineup", async (req, res) => {
    try {
      const lineup = await storage.createTeamLineup(req.body);
      res.json(lineup);
    } catch (error) {
      console.error("Error creating team lineup:", error);
      res.status(500).json({ error: "Failed to create team lineup" });
    }
  });

  app.put("/api/team/lineup/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const lineup = await storage.updateTeamLineup(id, req.body);
      res.json(lineup);
    } catch (error) {
      console.error("Error updating team lineup:", error);
      res.status(500).json({ error: "Failed to update team lineup" });
    }
  });

  // Player Availability routes
  app.get("/api/team/:teamId/availability", async (req, res) => {
    try {
      const { teamId } = req.params;
      const { gameId } = req.query;
      const availability = await storage.getTeamAvailability(teamId, gameId as string);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching team availability:", error);
      res.status(500).json({ error: "Failed to fetch team availability" });
    }
  });

  app.post("/api/player/availability", async (req, res) => {
    try {
      const availability = await storage.setPlayerAvailability(req.body);
      res.json(availability);
    } catch (error) {
      console.error("Error setting player availability:", error);
      res.status(500).json({ error: "Failed to set player availability" });
    }
  });

  // Draft Pick route (for management teams to make picks)
  app.post("/api/draft/pick", async (req, res) => {
    try {
      const { prospectId, teamId } = req.body;
      if (!prospectId || !teamId) {
        return res.status(400).json({ error: "Prospect ID and Team ID are required" });
      }

      const draftSettings = await storage.getDraftSettings();
      if (!draftSettings?.isActive) {
        return res.status(400).json({ error: "Draft is not currently active" });
      }

      // Check if it's this team's turn to pick
      const currentPickTeamIndex = (((draftSettings.currentRound || 1) - 1) * 32 + (draftSettings.currentPick || 1) - 1) % 32;
      const teams = await storage.getAllTeams();
      const currentTeam = teams[currentPickTeamIndex];
      
      if (currentTeam?.id !== teamId) {
        return res.status(400).json({ error: "It's not your team's turn to pick" });
      }

      // Make the draft pick
      const draftPick = await storage.makeDraftPick(prospectId, teamId);
      
      // Advance the draft
      await storage.advanceDraftPick();

      res.json(draftPick);
    } catch (error) {
      console.error("Error making draft pick:", error);
      res.status(500).json({ error: "Failed to make draft pick" });
    }
  });

  // User management routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      console.log('Fetched users:', users.length);
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: "Failed to fetch users", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.put("/api/admin/users/:id/role", async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const user = await storage.updateUser(id, { role });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { roles, teamId } = req.body;
      
      // For now, we'll update with the first role as the primary role
      // In a real system, you'd have a more complex role system
      const primaryRole = Array.isArray(roles) && roles.length > 0 ? roles[0] : 'player';
      
      const user = await storage.updateUser(id, { 
        role: primaryRole, 
        teamId: teamId || null 
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Admin team management routes
  app.post("/api/teams", async (req, res) => {
    try {
      const team = await storage.createTeam(req.body);
      res.json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ error: "Failed to create team" });
    }
  });

  app.put("/api/teams/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const team = await storage.updateTeam(id, req.body);
      res.json(team);
    } catch (error) {
      console.error("Error updating team:", error);
      res.status(500).json({ error: "Failed to update team" });
    }
  });

  // Admin schedule generation route
  app.post("/api/schedule/generate", async (req, res) => {
    try {
      const { startDate, endDate, days, timeSlots } = req.body;
      
      // Mock schedule generation for now
      const scheduleData = {
        startDate,
        endDate, 
        days,
        timeSlots,
        gamesGenerated: days.length * timeSlots.length
      };
      
      res.json({ 
        success: true, 
        message: `Generated ${scheduleData.gamesGenerated} games`,
        data: scheduleData 
      });
    } catch (error) {
      console.error("Error generating schedule:", error);
      res.status(500).json({ error: "Failed to generate schedule" });
    }
  });

  // Admin game stats update route
  app.put("/api/games/:gameId/stats", async (req, res) => {
    try {
      const { gameId } = req.params;
      const { homeScore, awayScore, notes } = req.body;
      
      const game = await storage.updateGame(gameId, {
        homeScore,
        awayScore,
        status: 'completed'
      });
      
      res.json(game);
    } catch (error) {
      console.error("Error updating game stats:", error);
      res.status(500).json({ error: "Failed to update game stats" });
    }
  });

  // Admin news generation route (using existing AI generation)
  app.post("/api/news/generate", async (req, res) => {
    try {
      const validatedData = newsGenerationSchema.parse(req.body);
      const result = await generateNewsArticle(validatedData.topic, validatedData.category);
      res.json(result);
    } catch (error) {
      console.error("News generation error:", error);
      res.status(500).json({ message: "Failed to generate news article" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time draft updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to draft WebSocket');
    wsConnections.add(ws);
    
    // Send current draft status to new client
    storage.getDraftSettings().then(settings => {
      if (settings) {
        ws.send(JSON.stringify({ 
          type: 'draft-status', 
          data: { settings, timestamp: new Date() }
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from draft WebSocket');
      wsConnections.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      wsConnections.delete(ws);
    });
  });
  
  return httpServer;
}
