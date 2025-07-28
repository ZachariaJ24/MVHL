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

  app.put("/api/admin/users/:id/role", async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const user = await storage.updateUser(id, { role });
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
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

  // Player availability routes
  app.get("/api/player-availability", async (req, res) => {
    try {
      const { teamId } = req.query;
      const availability = await storage.getPlayerAvailability(teamId as string);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching player availability:", error);
      res.status(500).json({ error: "Failed to fetch player availability" });
    }
  });

  app.put("/api/player-availability/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;
      const { status, reason, estimatedReturn } = req.body;
      
      const availability = await storage.updatePlayerAvailability(playerId, {
        isAvailable: status === 'available',
        availabilityNote: reason || null,
        // For now, we'll store the status and estimatedReturn in the note
        status,
        estimatedReturn
      });
      
      res.json(availability);
    } catch (error) {
      console.error("Error updating player availability:", error);
      res.status(500).json({ error: "Failed to update player availability" });
    }
  });

  // Team lineup routes
  app.get("/api/teams/:teamId/lineup", async (req, res) => {
    try {
      const { teamId } = req.params;
      const { gameId } = req.query;
      const lineup = await storage.getTeamLineup(teamId, gameId as string);
      res.json(lineup);
    } catch (error) {
      console.error("Error fetching team lineup:", error);
      res.status(500).json({ error: "Failed to fetch team lineup" });
    }
  });

  app.put("/api/teams/:teamId/lineup", async (req, res) => {
    try {
      const { teamId } = req.params;
      const { lineup, playerAvailability, gameId } = req.body;
      
      const lineupData = await storage.updateTeamLineup(teamId, {
        lineup,
        playerAvailability,
        gameId: gameId || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      res.json(lineupData);
    } catch (error) {
      console.error("Error updating team lineup:", error);
      res.status(500).json({ error: "Failed to update team lineup" });
    }
  });

  // Image management routes
  app.get("/api/images", async (req, res) => {
    try {
      const images = await storage.getAllImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Failed to fetch images" });
    }
  });

  app.post("/api/images/upload", async (req, res) => {
    try {
      // For now, simulate image upload processing
      // In production, this would handle actual file uploads to cloud storage
      const { category, subcategory, title, description, targetEntity, tags } = req.body;
      
      const imageData = {
        id: `img-${Date.now()}`,
        url: `https://via.placeholder.com/300x200?text=${encodeURIComponent(title || 'Image')}`,
        category: category || 'general',
        subcategory: subcategory || 'misc',
        title: title || 'Uploaded Image',
        description: description || '',
        targetEntity: targetEntity || null,
        tags: Array.isArray(tags) ? tags : [],
        uploadedAt: new Date(),
        uploadedBy: 'current-user' // In production, get from session
      };
      
      const savedImage = await storage.createImage(imageData);
      res.json(savedImage);
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.delete("/api/images/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteImage(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to delete image" });
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
      const content = await storage.createGeneratedContent(req.body);
      res.json(content);
    } catch (error) {
      console.error("Error saving generated content:", error);
      res.status(500).json({ error: "Failed to save generated content" });
    }
  });

  const server = createServer(app);
  return Promise.resolve(server);
}