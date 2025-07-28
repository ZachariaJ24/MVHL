import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Users, 
  Calendar, 
  TrendingUp, 
  Crown, 
  Award,
  BarChart3,
  Activity,
  Clock,
  Star
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function Home() {
  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: games } = useQuery({
    queryKey: ["/api/games/recent"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: activity } = useQuery({
    queryKey: ["/api/activity/recent"],
  });

  const FEATURE_CARDS = [
    {
      title: "Teams",
      description: "Browse all 32 MVHL teams and their rosters",
      icon: Users,
      href: "/teams",
      color: "bg-blue-500",
      count: stats?.totalTeams || 0,
    },
    {
      title: "Standings",
      description: "Current league standings and playoff race",
      icon: BarChart3,
      href: "/standings",
      color: "bg-green-500",
      count: `${teams?.length || 0} teams`,
    },
    {
      title: "Stats",
      description: "Player statistics and league leaders",
      icon: TrendingUp,
      href: "/stats",
      color: "bg-purple-500",
      count: stats?.totalPlayers || 0,
    },
    {
      title: "Schedule",
      description: "Upcoming games and results",
      icon: Calendar,
      href: "/matches",
      color: "bg-orange-500",
      count: stats?.totalGames || 0,
    },
    {
      title: "Awards",
      description: "Season awards and achievements",
      icon: Award,
      href: "/awards",
      color: "bg-yellow-500",
      count: "Multiple",
    },
    {
      title: "Draft Central",
      description: "Draft analysis and player evaluations",
      icon: Crown,
      href: "/draft-central",
      color: "bg-red-500",
      count: "Live",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 p-8 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 border border-blue-500/30">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
          Welcome to MVHL Hub
        </h1>
        <p className="text-lg md:text-xl text-blue-300 max-w-2xl mx-auto">
          The complete digital hub for the Major Virtual Hockey League. 
          Track teams, players, stats, and more.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50 hover:border-blue-400/70 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-500/30">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-blue-400">{stats?.totalTeams || 0}</p>
                <p className="text-sm text-blue-300">Teams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50 hover:border-green-400/70 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-500/30">
                <Trophy className="h-5 w-5 text-green-400" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-green-400">{stats?.totalPlayers || 0}</p>
                <p className="text-sm text-green-300">Players</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50 hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-500/30">
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-purple-400">{stats?.totalGames || 0}</p>
                <p className="text-sm text-purple-300">Games</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/50 hover:border-orange-400/70 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-orange-500/30">
                <Activity className="h-5 w-5 text-orange-400" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-orange-400">{stats?.activeTrades || 0}</p>
                <p className="text-sm text-orange-300">Active Trades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/50">Overview</TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:border-green-500/50">Recent Activity</TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 data-[state=active]:border-purple-500/50">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* League Highlights */}
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400">League Highlights</span>
                </CardTitle>
                <CardDescription className="text-yellow-300">Latest news and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Season 2025 Now Live!</h4>
                  <p className="text-sm text-muted-foreground">
                    All 32 teams are ready for action in the new season.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">New Draft System</h4>
                  <p className="text-sm text-muted-foreground">
                    Enhanced draft experience with AI-powered analysis.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Trading Block Active</h4>
                  <p className="text-sm text-muted-foreground">
                    Teams are actively making moves for the season.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Games */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Recent Games</span>
                </CardTitle>
                <CardDescription>Latest game results</CardDescription>
              </CardHeader>
              <CardContent>
                {games && games.length > 0 ? (
                  <div className="space-y-3">
                    {games.slice(0, 3).map((game: any) => (
                      <div key={game.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">{game.awayTeam}</span>
                          <span className="mx-2">@</span>
                          <span className="font-medium">{game.homeTeam}</span>
                        </div>
                        <Badge variant="outline">{game.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent games available. Season starting soon!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across the league</CardDescription>
            </CardHeader>
            <CardContent>
              {activity && activity.length > 0 ? (
                <div className="space-y-3">
                  {activity.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent activity. Check back for league updates!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_CARDS.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.href} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${feature.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <Badge variant="secondary">{feature.count}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {feature.description}
                    </CardDescription>
                    <Button asChild className="w-full">
                      <Link href={feature.href}>
                        Explore {feature.title}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}