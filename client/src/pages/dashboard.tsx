import { useQuery } from "@tanstack/react-query";
import { GameUploader } from "@/components/games/game-uploader";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { VersionControl } from "@/components/dashboard/version-control";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameCard } from "@/components/games/game-card";
import type { Game, User } from "@shared/schema";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/users/1/games"], // TODO: Replace with actual user ID
  });

  // Mock analytics data
  const analyticsData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    value: Math.floor(Math.random() * 1000),
  })).reverse();

  return (
    <div className="min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Developer Dashboard</h1>
          <Button className="button-glow">
            <Plus className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnalyticsCard
            title="Total Plays"
            value="12,345"
            data={analyticsData}
          />
          <AnalyticsCard
            title="Active Players"
            value="1,234"
            data={analyticsData}
          />
          <AnalyticsCard
            title="Revenue"
            value="$123.45"
            data={analyticsData}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="games">My Games</TabsTrigger>
            <TabsTrigger value="upload">Upload Game</TabsTrigger>
            <TabsTrigger value="versions">Version Control</TabsTrigger>
          </TabsList>

          <TabsContent value="games">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games?.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  author={{ id: game.authorId, username: "You" } as User}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Game</CardTitle>
              </CardHeader>
              <CardContent>
                <GameUploader />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="versions">
            <VersionControl gameId={1} currentVersion="1.0.1" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}