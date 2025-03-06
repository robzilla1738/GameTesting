import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/lib/websocket";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Game, Score } from "@shared/schema";
import { Heart, MessageSquare, Share2, Trophy, Users, Star, Gamepad, Maximize2 } from "lucide-react";
import * as React from 'react';

const PLACEHOLDER_GAMES: Game[] = [
  {
    id: 1,
    title: "Autogun Heroes",
    description: "Fast-paced action shooter where heroes battle with automatic weapons. Unlock powerful abilities and defeat waves of enemies.",
    authorId: 1,
    gameUrl: "https://example.com/games/autogun-heroes",
    thumbnailUrl: "/games/autogun-heroes.png",
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
    plays: 28000,
    version: "3.0.1",
    createdAt: new Date(),
    published: true,
  }
];

export default function GamePage() {
  const { id } = useParams();
  const { connect, subscribeToGame } = useWebSocket();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const { data: game } = useQuery<Game>({
    queryKey: [`/api/games/${id}`],
    placeholderData: PLACEHOLDER_GAMES.find(g => g.id.toString() === id),
  });

  const { data: scores } = useQuery<Score[]>({
    queryKey: [`/api/games/${id}/scores`],
    placeholderData: [
      { id: 1, userId: 1, gameId: parseInt(id || "1"), score: 15000, createdAt: new Date(), metadata: {} },
      { id: 2, userId: 2, gameId: parseInt(id || "1"), score: 12500, createdAt: new Date(), metadata: {} },
      { id: 3, userId: 3, gameId: parseInt(id || "1"), score: 10000, createdAt: new Date(), metadata: {} },
    ],
  });

  React.useEffect(() => {
    connect();
    if (id) {
      subscribeToGame(parseInt(id));
    }
  }, [id, connect, subscribeToGame]);

  if (!game) return null;

  return (
    <div className="min-h-screen">
      <div className={`container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${isFullscreen ? 'max-w-none !p-0' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`grid ${isFullscreen ? '' : 'lg:grid-cols-[1fr,350px]'} gap-8`}
        >
          <div className="space-y-8">
            {/* Game Frame */}
            <Card className={`overflow-hidden border-2 hover:border-primary/20 transition-colors ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
              <CardContent className="p-0">
                <div className="aspect-video w-full relative group">
                  <iframe
                    src={game.gameUrl}
                    className="w-full h-full"
                    title={game.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        <Gamepad className="h-4 w-4 mr-1" /> Playing: {(game.plays || 0).toLocaleString()}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!isFullscreen && (
              <>
                {/* Game Info */}
                <div>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-[280px]">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{game.title}</h1>
                        <Badge variant="secondary" className="text-sm">v{game.version}</Badge>
                      </div>
                      <p className="text-muted-foreground text-base sm:text-lg">{game.description || "No description available"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full hover:text-primary">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full hover:text-primary">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Users className="h-5 w-5 mb-2 mx-auto text-muted-foreground" />
                        <p className="text-xl sm:text-2xl font-bold">{(game.plays || 0).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Plays</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Trophy className="h-5 w-5 mb-2 mx-auto text-muted-foreground" />
                        <p className="text-xl sm:text-2xl font-bold">#1</p>
                        <p className="text-sm text-muted-foreground">Ranking</p>
                      </CardContent>
                    </Card>
                    <Card className="col-span-2 sm:col-span-1">
                      <CardContent className="pt-6 text-center">
                        <Star className="h-5 w-5 mb-2 mx-auto text-muted-foreground" />
                        <p className="text-xl sm:text-2xl font-bold">4.8</p>
                        <p className="text-sm text-muted-foreground">Rating</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center gap-4 flex-wrap">
                    <Avatar className="h-12 w-12 border-2 border-primary/20 ring-2 ring-background">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${game.authorId}`} />
                      <AvatarFallback>Dev</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-[200px]">
                      <div className="font-semibold text-lg">
                        {game.authorId === 1 ? "Alex Parker" : game.authorId === 2 ? "Sarah Chen" : "Marcus Rodriguez"}
                      </div>
                      <div className="text-sm text-muted-foreground">Game Developer</div>
                    </div>
                    <Button variant="secondary">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Developer
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {!isFullscreen && (
            /* Leaderboard */
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {scores?.map((score, i) => (
                      <motion.div
                        key={score.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="font-mono w-6 text-center font-bold text-primary">#{i + 1}</div>
                        <Avatar className="border border-primary/20">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${score.userId}`} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">Player #{score.userId}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(score.createdAt || new Date()).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-lg">{score.score.toLocaleString()}</div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}