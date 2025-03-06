import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertGameSchema, insertScoreSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  // WebSocket handling for real-time updates
  wss.on("connection", (ws) => {
    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === "subscribe_game") {
          ws.gameId = message.gameId;
        }
        
        if (message.type === "new_score" && ws.gameId) {
          const scores = await storage.getScores(ws.gameId);
          wss.clients.forEach((client) => {
            if (client.gameId === ws.gameId && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "scores_update", scores }));
            }
          });
        }
      } catch (err) {
        console.error("WebSocket error:", err);
      }
    });
  });

  // Games API
  app.get("/api/games/trending", async (req, res) => {
    try {
      const games = await storage.getTrendingGames(10);
      res.json(games);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch trending games" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame(parseInt(req.params.id));
      if (!game) return res.status(404).json({ message: "Game not found" });
      res.json(game);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  app.post("/api/games", async (req, res) => {
    try {
      const game = insertGameSchema.parse(req.body);
      const created = await storage.createGame(game);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: "Invalid game data", errors: err.errors });
      } else {
        res.status(500).json({ message: "Failed to create game" });
      }
    }
  });

  app.patch("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.updateGame(parseInt(req.params.id), req.body);
      res.json(game);
    } catch (err) {
      res.status(500).json({ message: "Failed to update game" });
    }
  });

  // Scores API
  app.get("/api/games/:id/scores", async (req, res) => {
    try {
      const scores = await storage.getScores(parseInt(req.params.id));
      res.json(scores);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch scores" });
    }
  });

  app.post("/api/scores", async (req, res) => {
    try {
      const score = insertScoreSchema.parse(req.body);
      const created = await storage.createScore(score);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: "Invalid score data", errors: err.errors });
      } else {
        res.status(500).json({ message: "Failed to create score" });
      }
    }
  });

  // Users API
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/users/:id/games", async (req, res) => {
    try {
      const games = await storage.getGamesByAuthor(parseInt(req.params.id));
      res.json(games);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch user's games" });
    }
  });

  // Follows API
  app.post("/api/users/:id/follow", async (req, res) => {
    try {
      await storage.followUser(req.body.followerId, parseInt(req.params.id));
      res.status(201).json({ message: "Successfully followed user" });
    } catch (err) {
      res.status(500).json({ message: "Failed to follow user" });
    }
  });

  app.delete("/api/users/:id/follow", async (req, res) => {
    try {
      await storage.unfollowUser(req.body.followerId, parseInt(req.params.id));
      res.status(200).json({ message: "Successfully unfollowed user" });
    } catch (err) {
      res.status(500).json({ message: "Failed to unfollow user" });
    }
  });

  return httpServer;
}
