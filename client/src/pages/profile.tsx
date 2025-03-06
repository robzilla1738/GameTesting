import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameCard } from "@/components/games/game-card";
import type { Game, User } from "@shared/schema";
import { Edit, Github, Globe, Twitter } from "lucide-react";

export default function Profile() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/1"], // TODO: Replace with actual user ID
  });

  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/users/1/games"],
  });

  const achievements = [
    { name: "Early Adopter", description: "Joined during beta" },
    { name: "Game Creator", description: "Published first game" },
    { name: "Popular", description: "1000+ total plays" },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-[300px,1fr] gap-8"
        >
          {/* Profile Sidebar */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto border-2 border-primary/20 ring-2 ring-background">
                    <AvatarImage src={user.avatarUrl ?? `https://api.dicebear.com/7.x/avatars/svg?seed=${user.id}`} />
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-2xl font-bold">{user.username}</h2>
                  <p className="text-muted-foreground mt-1">{user.bio || "No bio available"}</p>
                  <Button variant="outline" className="mt-4">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>

                <div className="mt-6 flex gap-4 justify-center">
                  <Button variant="ghost" size="icon" className="rounded-full hover:text-primary">
                    <Github className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:text-primary">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:text-primary">
                    <Globe className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.name}
                      className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        🏆
                      </div>
                      <div>
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div>
            <Tabs defaultValue="games" className="space-y-6">
              <TabsList>
                <TabsTrigger value="games">Games</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="games">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                  {games?.map((game) => (
                    <GameCard key={game.id} game={game} author={user} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      No recent activity
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}