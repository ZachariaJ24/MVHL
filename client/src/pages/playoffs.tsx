import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Crown, Target, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PlayoffBracket } from "@/components/playoffs/bracket";

interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  conference: string;
  division: string;
}

interface BracketSeries {
  id: string;
  season: string;
  conference: string;
  round: string;
  series: string;
  team1Id: string;
  team2Id: string;
  team1Wins: number;
  team2Wins: number;
  status: 'scheduled' | 'in_progress' | 'completed';
  winnerId?: string;
}

export function Playoffs() {
  const { data: brackets, isLoading: bracketsLoading } = useQuery<BracketSeries[]>({
    queryKey: ["/api/playoffs/brackets"],
  });

  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  if (bracketsLoading || teamsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Stanley Cup Playoffs
          </h1>
          <p className="text-muted-foreground mt-2">Loading playoff brackets...</p>
        </div>
      </div>
    );
  }

  if (!brackets || !teams) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Stanley Cup Playoffs
          </h1>
          <p className="text-muted-foreground mt-2">Error loading data</p>
        </div>
      </div>
    );
  }

  const hasPlayoffData = brackets.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 p-6 rounded-xl bg-gradient-to-r from-yellow-500/20 via-purple-500/20 to-blue-500/20 border border-yellow-500/30">
        <Crown className="h-16 w-16 mx-auto text-yellow-400" />
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Stanley Cup Playoffs
        </h1>
        <p className="text-lg text-yellow-300">
          The road to Lord Stanley's Cup
        </p>
      </div>

      {hasPlayoffData ? (
        /* Playoff Brackets */
        <Tabs defaultValue="eastern" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="eastern" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Eastern Conference
            </TabsTrigger>
            <TabsTrigger value="western" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              Western Conference
            </TabsTrigger>
          </TabsList>

          <TabsContent value="eastern" className="space-y-6">
            <PlayoffBracket series={brackets} teams={teams} conference="Eastern" />
          </TabsContent>

          <TabsContent value="western" className="space-y-6">
            <PlayoffBracket series={brackets} teams={teams} conference="Western" />
          </TabsContent>
        </Tabs>
      ) : (
        /* No Playoffs Yet */
        <div className="space-y-6">
          {/* Playoff Format Information */}
          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Trophy className="h-6 w-6" />
                Stanley Cup Playoff Format
              </CardTitle>
              <CardDescription>How the MVHL playoffs work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-400">Qualification</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-green-400" />
                      Top 3 teams from each division automatically qualify
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-blue-400" />
                      2 wild card teams from each conference
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-purple-400" />
                      16 teams total (8 per conference)
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-400">Tournament Structure</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Crown className="h-3 w-3 text-yellow-400" />
                      4 rounds of best-of-7 series
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-3 w-3 text-purple-400" />
                      Conference champions meet in Stanley Cup Final
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-3 w-3 text-blue-400" />
                      Higher seed gets home-ice advantage
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conference Brackets Preview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Trophy className="h-5 w-5" />
                  Eastern Conference
                </CardTitle>
                <CardDescription>Atlantic and Metropolitan divisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                    <h4 className="font-semibold text-blue-400 mb-2">Bracket Coming Soon</h4>
                    <p className="text-sm text-muted-foreground">
                      Eastern Conference playoff bracket will be generated when the regular season ends
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-blue-300">Divisions</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-blue-500/10">Atlantic</div>
                      <div className="p-2 rounded bg-blue-500/10">Metropolitan</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Trophy className="h-5 w-5" />
                  Western Conference
                </CardTitle>
                <CardDescription>Central and Pacific divisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-green-400 mb-4" />
                    <h4 className="font-semibold text-green-400 mb-2">Bracket Coming Soon</h4>
                    <p className="text-sm text-muted-foreground">
                      Western Conference playoff bracket will be generated when the regular season ends
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-green-300">Divisions</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-green-500/10">Central</div>
                      <div className="p-2 rounded bg-green-500/10">Pacific</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stanley Cup History */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Crown className="h-6 w-6" />
                About the Stanley Cup
              </CardTitle>
              <CardDescription>The most coveted prize in hockey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Trophy className="h-8 w-8 mx-auto text-yellow-400 mb-2" />
                  <h4 className="font-semibold text-yellow-400">The Ultimate Prize</h4>
                  <p className="text-xs text-muted-foreground mt-2">
                    Awarded annually to the MVHL playoff champion
                  </p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto text-green-400 mb-2" />
                  <h4 className="font-semibold text-green-400">Tradition</h4>
                  <p className="text-xs text-muted-foreground mt-2">
                    Each winning player gets their name engraved on the Cup
                  </p>
                </div>
                <div className="text-center">
                  <Crown className="h-8 w-8 mx-auto text-purple-400 mb-2" />
                  <h4 className="font-semibold text-purple-400">Legacy</h4>
                  <p className="text-xs text-muted-foreground mt-2">
                    The most prestigious trophy in virtual hockey
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}