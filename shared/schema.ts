import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  githubId: text("github_id").unique(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow()
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  authorId: integer("author_id").notNull(),
  version: text("version").notNull(),
  gameUrl: text("game_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  donationUrl: text("donation_url"),
  adScript: text("ad_script"),
  plays: integer("plays").default(0),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow()
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull(),
  followedId: integer("followed_id").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true 
});

export const insertGameSchema = createInsertSchema(games).omit({ 
  id: true, 
  plays: true,
  createdAt: true 
});

export const insertScoreSchema = createInsertSchema(scores).omit({ 
  id: true,
  createdAt: true 
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type InsertScore = z.infer<typeof insertScoreSchema>;
export type User = typeof users.$inferSelect;
export type Game = typeof games.$inferSelect;
export type Score = typeof scores.$inferSelect;