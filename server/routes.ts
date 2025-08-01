import { type Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { DatabaseStorage } from "./storage";

// Initialize storage
const storage = new DatabaseStorage();

export function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Teams routes
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const team = await storage.createTeam(req.body);
      res.json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ error: "Failed to create team" });
    }
  });

  // Players routes
  app.get("/api/players", async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  app.post("/api/players", async (req, res) => {
    try {
      const player = await storage.createPlayer(req.body);
      res.json(player);
    } catch (error) {
      console.error("Error creating player:", error);
      res.status(500).json({ error: "Failed to create player" });
    }
  });

  app.put("/api/players/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const player = await storage.updatePlayer(id, req.body);
      res.json(player);
    } catch (error) {
      console.error("Error updating player:", error);
      res.status(500).json({ error: "Failed to update player" });
    }
  });

  app.delete("/api/players/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePlayer(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting player:", error);
      res.status(500).json({ error: "Failed to delete player" });
    }
  });

  // Games routes
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ error: "Failed to fetch games" });
    }
  });

  app.get("/api/games/recent", async (req, res) => {
    try {
      const games = await storage.getRecentGames(10);
      res.json(games);
    } catch (error) {
      console.error("Error fetching recent games:", error);
      res.status(500).json({ error: "Failed to fetch recent games" });
    }
  });

  app.post("/api/games", async (req, res) => {
    try {
      const game = await storage.createGame(req.body);
      res.json(game);
    } catch (error) {
      console.error("Error creating game:", error);
      res.status(500).json({ error: "Failed to create game" });
    }
  });

  // Trades routes
  app.get("/api/trades", async (req, res) => {
    try {
      const trades = await storage.getAllTrades();
      res.json(trades);
    } catch (error) {
      console.error("Error fetching trades:", error);
      res.status(500).json({ error: "Failed to fetch trades" });
    }
  });

  app.post("/api/trades", async (req, res) => {
    try {
      const trade = await storage.createTrade(req.body);
      res.json(trade);
    } catch (error) {
      console.error("Error creating trade:", error);
      res.status(500).json({ error: "Failed to create trade" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      const players = await storage.getAllPlayers();
      const games = await storage.getAllGames();
      
      const stats = {
        totalTeams: teams.length,
        totalPlayers: players.length,
        totalGames: games.length,
        activeTrades: 0,
        topScorers: players.slice(0, 10),
        recentActivity: []
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Activity routes
  app.get("/api/activity", async (req, res) => {
    try {
      const activity = await storage.getAllActivity();
      res.json(activity);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  app.get("/api/activity/recent", async (req, res) => {
    try {
      const activity = await storage.getAllActivity();
      const recentActivity = activity.slice(-20);
      res.json(recentActivity);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ error: "Failed to fetch recent activity" });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllGeneratedContent();
      const newsArticles = news.filter(item => item.type === 'news');
      res.json(newsArticles);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { roles, teamId } = req.body;
      const user = await storage.updateUser(id, { 
        role: roles?.[0] || 'player', 
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
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Draft routes
  app.get("/api/draft/picks", async (req, res) => {
    try {
      const draftPicks = await storage.getAllDraftPicks();
      res.json(draftPicks);
    } catch (error) {
      console.error("Error fetching draft picks:", error);
      res.status(500).json({ error: "Failed to fetch draft picks" });
    }
  });

  app.get("/api/draft/settings", async (req, res) => {
    try {
      const settings = {
        isActive: false,
        currentRound: 1,
        currentPick: 1,
        timeRemaining: 60,
        pickOrder: []
      };
      res.json(settings);
    } catch (error) {
      console.error("Error fetching draft settings:", error);
      res.status(500).json({ error: "Failed to fetch draft settings" });
    }
  });

  // Awards routes
  app.get("/api/awards", async (req, res) => {
    try {
      const awards = await storage.getAllAwards();
      res.json(awards);
    } catch (error) {
      console.error("Error fetching awards:", error);
      res.status(500).json({ error: "Failed to fetch awards" });
    }
  });

  app.post("/api/awards/vote", async (req, res) => {
    try {
      const vote = await storage.createAward(req.body);
      res.json(vote);
    } catch (error) {
      console.error("Error creating award vote:", error);
      res.status(500).json({ error: "Failed to submit vote" });
    }
  });

  // Generated content routes
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getAllGeneratedContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching generated content:", error);
      res.status(500).json({ error: "Failed to fetch generated content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const content = await storage.saveGeneratedContent(req.body);
      res.json(content);
    } catch (error) {
      console.error("Error saving generated content:", error);
      res.status(500).json({ error: "Failed to save generated content" });
    }
  });

  const server = createServer(app);
  return Promise.resolve(server);
}