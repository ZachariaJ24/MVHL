import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Crown, Target, Star } from "lucide-react";

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
  gamesPlayed: number;
  goalsFor: number;
  goalsAgainst: number;
}

interface PlayoffBracketProps {
  teams: Team[];
  conference: 'Eastern' | 'Western';
}

interface BracketMatchup {
  seed1: number;
  seed2: number;
  team1?: Team;
  team2?: Team;
  series: string;
  round: string;
}

export function PlayoffBracket({ teams, conference }: PlayoffBracketProps) {
  const conferenceTeams = teams
    .filter(team => team.conference === conference)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
    })
    .slice(0, 8); // Top 8 teams make playoffs

  const getMatchups = (): BracketMatchup[] => {
    return [
      // First Round
      { seed1: 1, seed2: 8, team1: conferenceTeams[0], team2: conferenceTeams[7], series: 'A', round: 'First Round' },
      { seed1: 2, seed2: 7, team1: conferenceTeams[1], team2: conferenceTeams[6], series: 'B', round: 'First Round' },
      { seed1: 3, seed2: 6, team1: conferenceTeams[2], team2: conferenceTeams[5], series: 'C', round: 'First Round' },
      { seed1: 4, seed2: 5, team1: conferenceTeams[3], team2: conferenceTeams[4], series: 'D', round: 'First Round' },
    ];
  };

  const getConferenceColor = () => {
    return conference === 'Eastern' 
      ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30' 
      : 'from-green-500/20 to-green-600/20 border-green-500/30';
  };

  const getSeedColor = (seed: number) => {
    if (seed <= 3) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (seed <= 8) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const matchups = getMatchups();

  return (
    <div className="space-y-6">
      {/* Conference Header */}
      <Card className={`bg-gradient-to-br ${getConferenceColor()}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <Trophy className="h-6 w-6" />
            {conference} Conference Playoff Bracket
          </CardTitle>
          <CardDescription className="text-center">
            Current playoff positioning based on standings
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Bracket Grid */}
      <div className="space-y-8">
        {/* First Round */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <Target className="h-5 w-5" />
            First Round Matchups
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {matchups.map((matchup, index) => (
              <Card key={index} className={`bg-gradient-to-r ${getConferenceColor()} hover:scale-105 transition-transform`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-center text-lg">
                    Series {matchup.series}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Team 1 (Higher Seed) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <Badge className={getSeedColor(matchup.seed1)}>
                          #{matchup.seed1}
                        </Badge>
                        <div>
                          <div className="font-bold text-lg">
                            {matchup.team1 ? `${matchup.team1.city} ${matchup.team1.name}` : 'TBD'}
                          </div>
                          {matchup.team1 && (
                            <div className="text-sm text-muted-foreground">
                              {matchup.team1.wins}-{matchup.team1.losses}-{matchup.team1.otLosses} • {matchup.team1.points} PTS
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">HOME ICE</div>
                    </div>

                    {/* VS */}
                    <div className="text-center text-lg font-bold text-muted-foreground">VS</div>

                    {/* Team 2 (Lower Seed) */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <Badge className={getSeedColor(matchup.seed2)}>
                          #{matchup.seed2}
                        </Badge>
                        <div>
                          <div className="font-bold text-lg">
                            {matchup.team2 ? `${matchup.team2.city} ${matchup.team2.name}` : 'TBD'}
                          </div>
                          {matchup.team2 && (
                            <div className="text-sm text-muted-foreground">
                              {matchup.team2.wins}-{matchup.team2.losses}-{matchup.team2.otLosses} • {matchup.team2.points} PTS
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Series Info */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">Best of 7 Series</div>
                      <Badge variant="outline" className="text-xs">
                        0-0
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Future Rounds Placeholder */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Second Round */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-center text-purple-400">Second Round</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2" />
              Winner of Series A vs Winner of Series B
              <br />
              Winner of Series C vs Winner of Series D
            </CardContent>
          </Card>

          {/* Conference Final */}
          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-center text-yellow-400">Conference Final</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <Crown className="h-8 w-8 mx-auto mb-2" />
              Conference Championship
              <br />
              Winner advances to Stanley Cup Final
            </CardContent>
          </Card>

          {/* Stanley Cup Final */}
          <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-center text-red-400">Stanley Cup Final</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <Star className="h-8 w-8 mx-auto mb-2" />
              Lord Stanley's Cup
              <br />
              {conference} Champion vs Opposite Conference
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Playoff Format Info */}
      <Card className="bg-gradient-to-br from-slate-500/20 to-slate-600/20 border-slate-500/30">
        <CardHeader>
          <CardTitle className="text-center">Playoff Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Seeding</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Top 8 teams from each conference qualify</li>
                <li>• Seeded 1-8 by total points</li>
                <li>• Higher seed gets home ice advantage</li>
                <li>• Division winners guaranteed top 3 seeds</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Format</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• All series are best-of-seven</li>
                <li>• Standard 2-2-1-1-1 home ice format</li>
                <li>• Conference champions meet in Stanley Cup Final</li>
                <li>• Winner receives Lord Stanley's Cup</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}