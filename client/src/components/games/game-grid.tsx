import { useQuery } from "@tanstack/react-query";
import { GameCard } from "./game-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Game, User } from "@shared/schema";

// Sample placeholder data for development
const PLACEHOLDER_GAMES: Game[] = [
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

export function GameGrid() {
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games/trending"],
    placeholderData: PLACEHOLDER_GAMES,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-video rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!games?.length) {
    return (
      <div className="text-center py-24 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
        <p className="text-xl text-muted-foreground">No games found</p>
        <p className="text-sm text-muted-foreground mt-2">Be the first to upload a game!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {games.map((game) => (
        <GameCard 
          key={game.id} 
          game={game}
          author={{
            id: game.authorId,
            username: game.authorId === 1 ? "Alex Parker" : game.authorId === 2 ? "Sarah Chen" : "Marcus Rodriguez",
            avatarUrl: `https://api.dicebear.com/7.x/avatars/svg?seed=${game.authorId}`,
          } as User}
        />
      ))}
    </div>
  );
}