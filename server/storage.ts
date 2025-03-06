import { users, games, scores, follows } from "@shared/schema";
import type { User, Game, Score, InsertUser, InsertGame, InsertScore } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByGithubId(githubId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;

  // Games
  getGame(id: number): Promise<Game | undefined>;
  getGamesByAuthor(authorId: number): Promise<Game[]>;
  getTrendingGames(limit?: number): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<InsertGame>): Promise<Game>;
  incrementPlays(id: number): Promise<void>;

  // Scores
  getScores(gameId: number, limit?: number): Promise<Score[]>;
  createScore(score: InsertScore): Promise<Score>;

  // Follows
  getFollowers(userId: number): Promise<User[]>;
  getFollowing(userId: number): Promise<User[]>;
  followUser(followerId: number, followedId: number): Promise<void>;
  unfollowUser(followerId: number, followedId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private scores: Map<number, Score>;
  private follows: Map<number, { followerId: number; followedId: number }>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.scores = new Map();
    this.follows = new Map();
    this.currentIds = { users: 1, games: 1, scores: 1, follows: 1 };

    // Initialize with placeholder games
    const placeholderGames: Game[] = [
      {
        id: 1,
        title: "Autogun Heroes",
        description: "Fast-paced action shooter where heroes battle with automatic weapons. Unlock powerful abilities and defeat waves of enemies.",
        authorId: 1,
        gameUrl: "https://example.com/games/autogun-heroes",
        thumbnailUrl: "/games/autogun-heroes.png",
        donationUrl: null,
        adScript: null,
        plays: 45000,
        version: "2.1.0",
        createdAt: new Date(),
        published: true,
      },
      {
        id: 2,
        title: "World Z Defense",
        description: "Strategic defense game where you protect cities from zombie invasions. Build defenses, upgrade weapons, and survive the apocalypse.",
        authorId: 2,
        gameUrl: "https://example.com/games/world-z-defense",
        thumbnailUrl: "/games/world-z-defense.png",
        donationUrl: null,
        adScript: null,
        plays: 32000,
        version: "1.5.0",
        createdAt: new Date(),
        published: true,
      },
      {
        id: 3,
        title: "Aces of the Sky",
        description: "Epic aerial combat simulator featuring intense dogfights and stunning visuals. Master the skies in this action-packed flight combat game.",
        authorId: 3,
        gameUrl: "https://example.com/games/aces-of-sky",
        thumbnailUrl: "/games/aces-of-sky.png",
        donationUrl: null,
        adScript: null,
        plays: 28000,
        version: "3.0.1",
        createdAt: new Date(),
        published: true,
      }
    ];

    // Add placeholder games to storage
    placeholderGames.forEach(game => this.games.set(game.id, game));
    this.currentIds.games = placeholderGames.length + 1;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.githubId === githubId);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const newUser: User = {
      id,
      createdAt: new Date(),
      username: user.username,
      githubId: user.githubId ?? null,
      avatarUrl: user.avatarUrl ?? null,
      bio: user.bio ?? null,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, update: Partial<InsertUser>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    const updatedUser: User = {
      ...user,
      username: update.username ?? user.username,
      githubId: update.githubId ?? user.githubId,
      avatarUrl: update.avatarUrl ?? user.avatarUrl,
      bio: update.bio ?? user.bio,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Games
  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getGamesByAuthor(authorId: number): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.authorId === authorId);
  }

  async getTrendingGames(limit: number = 10): Promise<Game[]> {
    return Array.from(this.games.values())
      .sort((a, b) => (b.plays || 0) - (a.plays || 0))
      .slice(0, limit);
  }

  async createGame(game: InsertGame): Promise<Game> {
    const id = this.currentIds.games++;
    const newGame: Game = {
      id,
      title: game.title,
      description: game.description ?? null,
      authorId: game.authorId,
      version: game.version,
      gameUrl: game.gameUrl,
      thumbnailUrl: game.thumbnailUrl ?? null,
      donationUrl: game.donationUrl ?? null,
      adScript: game.adScript ?? null,
      plays: 0,
      published: game.published ?? true,
      createdAt: new Date(),
    };
    this.games.set(id, newGame);
    return newGame;
  }

  async updateGame(id: number, update: Partial<InsertGame>): Promise<Game> {
    const game = await this.getGame(id);
    if (!game) throw new Error("Game not found");
    const updatedGame: Game = {
      ...game,
      title: update.title ?? game.title,
      description: update.description ?? game.description,
      version: update.version ?? game.version,
      gameUrl: update.gameUrl ?? game.gameUrl,
      thumbnailUrl: update.thumbnailUrl ?? game.thumbnailUrl,
      donationUrl: update.donationUrl ?? game.donationUrl,
      adScript: update.adScript ?? game.adScript,
      published: update.published ?? game.published,
    };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async incrementPlays(id: number): Promise<void> {
    const game = await this.getGame(id);
    if (!game) throw new Error("Game not found");
    this.games.set(id, { ...game, plays: (game.plays || 0) + 1 });
  }

  // Scores
  async getScores(gameId: number, limit: number = 10): Promise<Score[]> {
    return Array.from(this.scores.values())
      .filter(score => score.gameId === gameId)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async createScore(score: InsertScore): Promise<Score> {
    const id = this.currentIds.scores++;
    const newScore: Score = {
      id,
      gameId: score.gameId,
      userId: score.userId,
      score: score.score,
      metadata: score.metadata ?? null,
      createdAt: new Date(),
    };
    this.scores.set(id, newScore);
    return newScore;
  }

  // Follows
  async getFollowers(userId: number): Promise<User[]> {
    const followerIds = Array.from(this.follows.values())
      .filter(f => f.followedId === userId)
      .map(f => f.followerId);
    return Array.from(this.users.values()).filter(u => followerIds.includes(u.id));
  }

  async getFollowing(userId: number): Promise<User[]> {
    const followingIds = Array.from(this.follows.values())
      .filter(f => f.followerId === userId)
      .map(f => f.followedId);
    return Array.from(this.users.values()).filter(u => followingIds.includes(u.id));
  }

  async followUser(followerId: number, followedId: number): Promise<void> {
    const id = this.currentIds.follows++;
    this.follows.set(id, { followerId, followedId });
  }

  async unfollowUser(followerId: number, followedId: number): Promise<void> {
    const followId = Array.from(this.follows.entries())
      .find(([_, f]) => f.followerId === followerId && f.followedId === followedId)?.[0];
    if (followId) this.follows.delete(followId);
  }
}

export const storage = new MemStorage();