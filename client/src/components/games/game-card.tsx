import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Game, User } from "@shared/schema";
import { Play, Heart, Share2, Trophy, ImageIcon } from "lucide-react";

interface GameCardProps {
  game: Game;
  author: User;
}

export function GameCard({ game, author }: GameCardProps) {
  const fallbackImageUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${game.id}&backgroundColor=1d283a`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Card className="overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:border-primary/20 h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-video bg-muted relative overflow-hidden group">
            <div className="w-full h-full">
              {game.thumbnailUrl ? (
                <img 
                  src={game.thumbnailUrl}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImageUrl;
                  }}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/5">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Trending</span>
              </div>
              <Link href={`/games/${game.id}`}>
                <Button size="sm" className="shadow-lg">
                  <Play className="mr-2 h-4 w-4" />
                  Play Now
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-1">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="border-2 border-primary/20 ring-2 ring-background">
              <AvatarImage 
                src={author.avatarUrl ?? `https://api.dicebear.com/7.x/avatars/svg?seed=${author.id}`}
              />
              <AvatarFallback>{author.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl mb-1 truncate">{game.title}</CardTitle>
              <p className="text-sm text-muted-foreground">by {author.username}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {game.description || "No description available"}
          </p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex justify-between items-center">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Play className="h-4 w-4" />
            {(game.plays || 0).toLocaleString()} plays
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full hover:text-primary">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:text-primary">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}