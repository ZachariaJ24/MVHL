import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Users, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  conference: string;
  division: string;
  wins: number;
  losses: number;
  otLosses: number;
  points: number;
}

interface DivisionStandingsProps {
  teams: Team[];
  divisionName: string;
  conference: string;
}

function DivisionStandings({ teams, divisionName, conference }: DivisionStandingsProps) {
  const divisionTeams = teams
    .filter(team => team.division === divisionName && team.conference === conference)
    .sort((a, b) => b.points - a.points);

  const getPositionColor = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50";
    if (index <= 2) return "bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/50";
    if (index <= 7) return "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/50";
    return "bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/50";
  };

  const getPositionBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">1st</Badge>;
    if (index <= 2) return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Playoff</Badge>;
    if (index <= 7) return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Wild Card</Badge>;
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Eliminated</Badge>;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-500/10 to-slate-600/10 border-slate-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-300">
          <Trophy className="h-5 w-5" />
          {conference} Conference - {divisionName} Division
        </CardTitle>
        <CardDescription>Current standings and playoff positioning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-6 gap-2 text-sm font-semibold text-muted-foreground border-b border-border pb-2">
            <span>Team</span>
            <span className="text-center">W</span>
            <span className="text-center">L</span>
            <span className="text-center">OTL</span>
            <span className="text-center">PTS</span>
            <span className="text-center">Status</span>
          </div>
          {divisionTeams.map((team, index) => (
            <div 
              key={team.id} 
              className={`grid grid-cols-6 gap-2 items-center p-3 rounded-lg transition-all duration-300 hover:scale-105 ${getPositionColor(index)}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{index + 1}.</span>
                <div>
                  <div className="font-semibold">{team.city} {team.name}</div>
                  <div className="text-xs text-muted-foreground">{team.abbreviation}</div>
                </div>
              </div>
              <span className="text-center font-bold text-green-400">{team.wins}</span>
              <span className="text-center font-bold text-red-400">{team.losses}</span>
              <span className="text-center font-bold text-yellow-400">{team.otLosses}</span>
              <span className="text-center font-bold text-blue-400">{team.points}</span>
              <div className="text-center">
                {getPositionBadge(index)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function Standings() {
  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            League Standings
          </h1>
          <p className="text-muted-foreground mt-2">Loading current standings...</p>
        </div>
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            League Standings
          </h1>
          <p className="text-muted-foreground mt-2">No standings data available</p>
        </div>
      </div>
    );
  }

  // Calculate conference standings
  const easternTeams = teams.filter(team => team.conference === "Eastern").sort((a, b) => b.points - a.points);
  const westernTeams = teams.filter(team => team.conference === "Western").sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 p-6 rounded-xl bg-gradient-to-r from-blue-500/20 via-green-500/20 to-purple-500/20 border border-blue-500/30">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 bg-clip-text text-transparent">
          League Standings
        </h1>
        <p className="text-lg text-blue-300">
          Current MVHL standings and playoff race
        </p>
      </div>

      {/* Main Tabs Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Trophy className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="eastern" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Users className="h-4 w-4 mr-2" />
            Eastern
          </TabsTrigger>
          <TabsTrigger value="western" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
            <Users className="h-4 w-4 mr-2" />
            Western
          </TabsTrigger>
          <TabsTrigger value="playoff-race" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            <Target className="h-4 w-4 mr-2" />
            Playoff Race
          </TabsTrigger>
          <TabsTrigger value="bracket" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <TrendingUp className="h-4 w-4 mr-2" />
            Bracket
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Users className="h-5 w-5" />
                  Eastern Conference Leaders
                </CardTitle>
                <CardDescription>Top teams in the East</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {easternTeams.slice(0, 8).map((team, index) => (
                    <div key={team.id} className="flex justify-between items-center p-2 rounded bg-blue-500/10">
                      <span className="font-medium">{index + 1}. {team.city} {team.name}</span>
                      <span className="font-bold text-blue-400">{team.points} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Users className="h-5 w-5" />
                  Western Conference Leaders
                </CardTitle>
                <CardDescription>Top teams in the West</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {westernTeams.slice(0, 8).map((team, index) => (
                    <div key={team.id} className="flex justify-between items-center p-2 rounded bg-green-500/10">
                      <span className="font-medium">{index + 1}. {team.city} {team.name}</span>
                      <span className="font-bold text-green-400">{team.points} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Eastern Conference Tab */}
        <TabsContent value="eastern" className="space-y-6">
          <div className="grid gap-6">
            <DivisionStandings teams={teams} divisionName="Atlantic" conference="Eastern" />
            <DivisionStandings teams={teams} divisionName="Metropolitan" conference="Eastern" />
          </div>
        </TabsContent>

        {/* Western Conference Tab */}
        <TabsContent value="western" className="space-y-6">
          <div className="grid gap-6">
            <DivisionStandings teams={teams} divisionName="Central" conference="Western" />
            <DivisionStandings teams={teams} divisionName="Pacific" conference="Western" />
          </div>
        </TabsContent>

        {/* Playoff Race Tab */}
        <TabsContent value="playoff-race" className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Target className="h-5 w-5" />
                Playoff Race
              </CardTitle>
              <CardDescription>Teams fighting for playoff spots and playoff positioning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Eastern Conference Bubble</h4>
                  <div className="space-y-2">
                    {easternTeams.slice(6, 12).map((team, index) => (
                      <div key={team.id} className="flex justify-between items-center p-2 rounded bg-blue-500/10">
                        <span className="text-sm">{index + 7}. {team.abbreviation}</span>
                        <span className="text-sm font-bold text-blue-400">{team.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-3">Western Conference Bubble</h4>
                  <div className="space-y-2">
                    {westernTeams.slice(6, 12).map((team, index) => (
                      <div key={team.id} className="flex justify-between items-center p-2 rounded bg-green-500/10">
                        <span className="text-sm">{index + 7}. {team.abbreviation}</span>
                        <span className="text-sm font-bold text-green-400">{team.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Playoff Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <TrendingUp className="h-5 w-5" />
                  Playoff Picture
                </CardTitle>
                <CardDescription>Current playoff matchups if season ended today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-yellow-400">Eastern Conference</div>
                  <div className="space-y-1 text-sm">
                    {easternTeams.slice(0, 8).map((team, index) => (
                      <div key={team.id} className="flex justify-between p-1 rounded bg-yellow-500/10">
                        <span>{index + 1}. {team.abbreviation}</span>
                        <span className="text-yellow-400">{team.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <TrendingUp className="h-5 w-5" />
                  Playoff Picture
                </CardTitle>
                <CardDescription>Current playoff matchups if season ended today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-orange-400">Western Conference</div>
                  <div className="space-y-1 text-sm">
                    {westernTeams.slice(0, 8).map((team, index) => (
                      <div key={team.id} className="flex justify-between p-1 rounded bg-orange-500/10">
                        <span>{index + 1}. {team.abbreviation}</span>
                        <span className="text-orange-400">{team.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Playoff Bracket Tab */}
        <TabsContent value="bracket" className="space-y-6">
          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Trophy className="h-5 w-5" />
                Stanley Cup Playoffs Bracket
              </CardTitle>
              <CardDescription>Current playoff matchups and tournament structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Eastern Conference Bracket */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-blue-400 text-center border-b border-blue-500/30 pb-2">
                    Eastern Conference
                  </h3>
                  
                  {/* First Round */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-blue-300">First Round</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((seed) => {
                        const team1 = easternTeams[seed - 1];
                        const team2 = easternTeams[16 - seed];
                        return (
                          <div key={seed} className="space-y-2">
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                              <div className="text-xs text-blue-300 mb-1">Series {seed}</div>
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">{seed}. {team1?.abbreviation || 'TBD'}</span>
                                  <span className="text-xs text-blue-400">-</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">{16 - seed + 1}. {team2?.abbreviation || 'TBD'}</span>
                                  <span className="text-xs text-blue-400">-</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conference Semifinals */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-blue-300">Conference Semifinals</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-500/15 border border-blue-500/40 rounded-lg p-3">
                        <div className="text-xs text-blue-300 mb-1">Winner 1 vs Winner 4</div>
                        <div className="text-sm text-muted-foreground">TBD</div>
                      </div>
                      <div className="bg-blue-500/15 border border-blue-500/40 rounded-lg p-3">
                        <div className="text-xs text-blue-300 mb-1">Winner 2 vs Winner 3</div>
                        <div className="text-sm text-muted-foreground">TBD</div>
                      </div>
                    </div>
                  </div>

                  {/* Conference Finals */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-blue-300">Conference Finals</h4>
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-center">
                      <div className="text-xs text-blue-300 mb-1">Eastern Conference Champion</div>
                      <div className="text-sm text-muted-foreground">TBD</div>
                    </div>
                  </div>
                </div>

                {/* Western Conference Bracket */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-green-400 text-center border-b border-green-500/30 pb-2">
                    Western Conference
                  </h3>
                  
                  {/* First Round */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-green-300">First Round</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((seed) => {
                        const team1 = westernTeams[seed - 1];
                        const team2 = westernTeams[16 - seed];
                        return (
                          <div key={seed} className="space-y-2">
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                              <div className="text-xs text-green-300 mb-1">Series {seed}</div>
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">{seed}. {team1?.abbreviation || 'TBD'}</span>
                                  <span className="text-xs text-green-400">-</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">{16 - seed + 1}. {team2?.abbreviation || 'TBD'}</span>
                                  <span className="text-xs text-green-400">-</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conference Semifinals */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-green-300">Conference Semifinals</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-500/15 border border-green-500/40 rounded-lg p-3">
                        <div className="text-xs text-green-300 mb-1">Winner 1 vs Winner 4</div>
                        <div className="text-sm text-muted-foreground">TBD</div>
                      </div>
                      <div className="bg-green-500/15 border border-green-500/40 rounded-lg p-3">
                        <div className="text-xs text-green-300 mb-1">Winner 2 vs Winner 3</div>
                        <div className="text-sm text-muted-foreground">TBD</div>
                      </div>
                    </div>
                  </div>

                  {/* Conference Finals */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-green-300">Conference Finals</h4>
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                      <div className="text-xs text-green-300 mb-1">Western Conference Champion</div>
                      <div className="text-sm text-muted-foreground">TBD</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stanley Cup Finals */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Stanley Cup Finals
                  </h3>
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-6">
                    <div className="grid md:grid-cols-3 gap-4 items-center">
                      <div className="text-center">
                        <div className="text-sm text-blue-300 mb-1">Eastern Champion</div>
                        <div className="text-lg font-semibold text-muted-foreground">TBD</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">VS</div>
                        <div className="text-xs text-muted-foreground mt-1">Best of 7</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-green-300 mb-1">Western Champion</div>
                        <div className="text-lg font-semibold text-muted-foreground">TBD</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Stanley Cup Champion</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Playoff Format Information */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Target className="h-5 w-5" />
                Playoff Format
              </CardTitle>
              <CardDescription>How the Stanley Cup Playoffs work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-300">Qualification</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Top 8 teams from each conference qualify</li>
                    <li>• Teams ranked 1-8 based on total points</li>
                    <li>• Division winners guaranteed top 3 seeds</li>
                    <li>• Wild card teams fill remaining spots</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-300">Tournament Structure</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• All series are best-of-seven</li>
                    <li>• Higher seed gets home ice advantage</li>
                    <li>• Conference champions meet in Stanley Cup Finals</li>
                    <li>• 4 rounds total to win the Stanley Cup</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}