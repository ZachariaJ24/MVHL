import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Trophy, MapPin, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  gameDate: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'completed';
  isPlayoff: boolean;
  round?: string;
  series?: string;
  gameNumber?: number;
  venue?: string;
}

interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  conference: string;
  division: string;
}

function GameCard({ game, teams }: { game: Game; teams: Team[] }) {
  const homeTeam = teams.find(t => t.id === game.homeTeamId);
  const awayTeam = teams.find(t => t.id === game.awayTeamId);

  if (!homeTeam || !awayTeam) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/50 text-red-400';
      case 'completed': return 'bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/50 text-green-400';
      default: return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/50 text-blue-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const gameTime = formatDate(game.gameDate);

  return (
    <Card className={`transition-all duration-300 hover:scale-105 ${getStatusColor(game.status)}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {game.isPlayoff && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                {game.round && game.series ? `${game.round} - Game ${game.gameNumber}` : 'Playoff'}
              </Badge>
            )}
            <Badge variant="outline" className={getStatusColor(game.status)}>
              {game.status === 'live' ? 'LIVE' : game.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {gameTime.date}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {gameTime.time}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Teams and Score */}
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Away Team */}
            <div className="text-center">
              <div className="font-bold text-lg">{awayTeam.city}</div>
              <div className="text-sm text-muted-foreground">{awayTeam.name}</div>
              <div className="text-xs text-muted-foreground">{awayTeam.abbreviation}</div>
            </div>
            
            {/* Score or VS */}
            <div className="text-center">
              {game.status === 'completed' && game.homeScore !== undefined && game.awayScore !== undefined ? (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    {game.awayScore} - {game.homeScore}
                  </div>
                  <div className="text-xs text-muted-foreground">Final</div>
                </div>
              ) : game.status === 'live' && game.homeScore !== undefined && game.awayScore !== undefined ? (
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-red-400">
                    {game.awayScore} - {game.homeScore}
                  </div>
                  <div className="text-xs text-red-400 animate-pulse">LIVE</div>
                </div>
              ) : (
                <div className="text-xl font-bold text-muted-foreground">VS</div>
              )}
            </div>
            
            {/* Home Team */}
            <div className="text-center">
              <div className="font-bold text-lg">{homeTeam.city}</div>
              <div className="text-sm text-muted-foreground">{homeTeam.name}</div>
              <div className="text-xs text-muted-foreground">{homeTeam.abbreviation}</div>
            </div>
          </div>

          {/* Venue */}
          {game.venue && (
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {game.venue}
            </div>
          )}

          {/* Conference Info */}
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>{awayTeam.conference} vs {homeTeam.conference}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Matches() {
  const { data: games, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  if (gamesLoading || teamsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Matches & Schedule
          </h1>
          <p className="text-muted-foreground mt-2">Loading games...</p>
        </div>
      </div>
    );
  }

  if (!games || !teams || games.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4 p-6 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 border border-blue-500/30">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            Matches & Schedule
          </h1>
          <p className="text-lg text-blue-300">
            No games scheduled yet. Check back soon for the latest schedule!
          </p>
        </div>

        {/* Sample Schedule Message */}
        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Calendar className="h-5 w-5" />
              Season Schedule Coming Soon
            </CardTitle>
            <CardDescription>The MVHL 2025 season schedule will be released shortly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-400">Regular Season</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 82 games per team</li>
                    <li>• October 2024 - April 2025</li>
                    <li>• Divisional and conference matchups</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-400">Playoffs</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 16 teams qualify</li>
                    <li>• Best-of-7 series format</li>
                    <li>• Stanley Cup Finals in June</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter games by status
  const liveGames = games.filter(game => game.status === 'live');
  const upcomingGames = games.filter(game => game.status === 'scheduled').slice(0, 10);
  const recentGames = games.filter(game => game.status === 'completed').slice(0, 10);
  const playoffGames = games.filter(game => game.isPlayoff);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 p-6 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 border border-blue-500/30">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
          Matches & Schedule
        </h1>
        <p className="text-lg text-blue-300">
          Complete MVHL game schedule and results
        </p>
      </div>

      {/* Live Games Alert */}
      {liveGames.length > 0 && (
        <Card className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400 animate-pulse">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              LIVE GAMES NOW
            </CardTitle>
            <CardDescription>Games currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {liveGames.map(game => (
                <GameCard key={game.id} game={game} teams={teams} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
            Recent Results
          </TabsTrigger>
          <TabsTrigger value="playoffs" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            Playoffs
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            Full Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Calendar className="h-5 w-5" />
                Upcoming Games
              </CardTitle>
              <CardDescription>Next games on the schedule</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingGames.length > 0 ? (
                <div className="grid gap-4">
                  {upcomingGames.map(game => (
                    <GameCard key={game.id} game={game} teams={teams} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No upcoming games scheduled</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Trophy className="h-5 w-5" />
                Recent Results
              </CardTitle>
              <CardDescription>Latest completed games</CardDescription>
            </CardHeader>
            <CardContent>
              {recentGames.length > 0 ? (
                <div className="grid gap-4">
                  {recentGames.map(game => (
                    <GameCard key={game.id} game={game} teams={teams} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent games completed</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playoffs" className="space-y-6">
          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Trophy className="h-5 w-5" />
                Playoff Schedule
              </CardTitle>
              <CardDescription>Stanley Cup Playoffs bracket and games</CardDescription>
            </CardHeader>
            <CardContent>
              {playoffGames.length > 0 ? (
                <div className="grid gap-4">
                  {playoffGames.map(game => (
                    <GameCard key={game.id} game={game} teams={teams} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">Playoffs Coming Soon</h3>
                  <p className="text-muted-foreground">The Stanley Cup Playoffs will begin after the regular season concludes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Calendar className="h-5 w-5" />
                Full Season Schedule
              </CardTitle>
              <CardDescription>Complete 2024-25 MVHL schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {games.map(game => (
                  <GameCard key={game.id} game={game} teams={teams} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-400">{games.length}</div>
                <div className="text-sm text-blue-300">Total Games</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-400">{recentGames.length}</div>
                <div className="text-sm text-green-300">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-400">{upcomingGames.length}</div>
                <div className="text-sm text-purple-300">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}