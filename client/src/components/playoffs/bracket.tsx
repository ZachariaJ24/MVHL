import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Target } from "lucide-react";

interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  conference: string;
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

interface PlayoffBracketProps {
  series: BracketSeries[];
  teams: Team[];
  conference: 'Eastern' | 'Western';
}

function SeriesCard({ bracket, teams }: { bracket: BracketSeries; teams: Team[] }) {
  const team1 = teams.find(t => t.id === bracket.team1Id);
  const team2 = teams.find(t => t.id === bracket.team2Id);

  if (!team1 || !team2) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/50';
      case 'in_progress': return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
      default: return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/50';
    }
  };

  const getRoundIcon = (round: string) => {
    switch (round) {
      case 'stanley-cup': return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'conference-final': return <Trophy className="h-4 w-4 text-purple-400" />;
      default: return <Target className="h-4 w-4 text-blue-400" />;
    }
  };

  const getRoundName = (round: string) => {
    switch (round) {
      case 'round1': return 'First Round';
      case 'round2': return 'Second Round';
      case 'conference-final': return 'Conference Final';
      case 'stanley-cup': return 'Stanley Cup Final';
      default: return round;
    }
  };

  const isWinner = (teamId: string) => bracket.winnerId === teamId;
  const isEliminated = (teamId: string) => bracket.winnerId && bracket.winnerId !== teamId;

  return (
    <Card className={`transition-all duration-300 hover:scale-105 ${getStatusColor(bracket.status)}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getRoundIcon(bracket.round)}
            <span className="font-semibold text-sm">{getRoundName(bracket.round)}</span>
          </div>
          <Badge variant="outline" className={getStatusColor(bracket.status)}>
            {bracket.status === 'in_progress' ? 'ACTIVE' : bracket.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Team 1 */}
        <div className={`flex justify-between items-center p-3 rounded-lg transition-all ${
          isWinner(team1.id) 
            ? 'bg-green-500/20 border border-green-500/50' 
            : isEliminated(team1.id)
            ? 'bg-red-500/20 border border-red-500/50 opacity-60'
            : 'bg-muted/30'
        }`}>
          <div className="flex items-center gap-3">
            {isWinner(team1.id) && <Trophy className="h-4 w-4 text-green-400" />}
            <div>
              <div className="font-semibold">{team1.city} {team1.name}</div>
              <div className="text-xs text-muted-foreground">{team1.abbreviation}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{bracket.team1Wins}</div>
            <div className="text-xs text-muted-foreground">wins</div>
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center">
          <span className="text-sm font-semibold text-muted-foreground">
            Best of 7 Series
          </span>
        </div>

        {/* Team 2 */}
        <div className={`flex justify-between items-center p-3 rounded-lg transition-all ${
          isWinner(team2.id) 
            ? 'bg-green-500/20 border border-green-500/50' 
            : isEliminated(team2.id)
            ? 'bg-red-500/20 border border-red-500/50 opacity-60'
            : 'bg-muted/30'
        }`}>
          <div className="flex items-center gap-3">
            {isWinner(team2.id) && <Trophy className="h-4 w-4 text-green-400" />}
            <div>
              <div className="font-semibold">{team2.city} {team2.name}</div>
              <div className="text-xs text-muted-foreground">{team2.abbreviation}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{bracket.team2Wins}</div>
            <div className="text-xs text-muted-foreground">wins</div>
          </div>
        </div>

        {/* Series Status */}
        {bracket.status === 'completed' && bracket.winnerId && (
          <div className="text-center p-2 bg-green-500/20 rounded-lg border border-green-500/50">
            <span className="text-sm font-semibold text-green-400">
              {(bracket.winnerId === team1.id ? team1 : team2).city} advances!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PlayoffBracket({ series, teams, conference }: PlayoffBracketProps) {
  const conferenceSeries = series.filter(s => s.conference === conference);
  
  // Group series by round
  const seriesByRound = {
    'round1': conferenceSeries.filter(s => s.round === 'round1'),
    'round2': conferenceSeries.filter(s => s.round === 'round2'),
    'conference-final': conferenceSeries.filter(s => s.round === 'conference-final'),
    'stanley-cup': series.filter(s => s.round === 'stanley-cup') // Stanley Cup includes both conferences
  };

  const getConferenceColor = (conf: string) => {
    return conf === 'Eastern' 
      ? 'from-blue-500/20 to-blue-600/20 border-blue-500/50 text-blue-400'
      : 'from-green-500/20 to-green-600/20 border-green-500/50 text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Conference Header */}
      <Card className={`bg-gradient-to-br ${getConferenceColor(conference)}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            {conference} Conference Playoffs
          </CardTitle>
          <CardDescription>Stanley Cup Playoff bracket</CardDescription>
        </CardHeader>
      </Card>

      {/* Bracket Rounds */}
      <div className="grid gap-6">
        {/* First Round */}
        {seriesByRound['round1'].length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-center">First Round</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {seriesByRound['round1'].map(bracket => (
                <SeriesCard key={bracket.id} bracket={bracket} teams={teams} />
              ))}
            </div>
          </div>
        )}

        {/* Second Round */}
        {seriesByRound['round2'].length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-center">Second Round</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {seriesByRound['round2'].map(bracket => (
                <SeriesCard key={bracket.id} bracket={bracket} teams={teams} />
              ))}
            </div>
          </div>
        )}

        {/* Conference Final */}
        {seriesByRound['conference-final'].length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-center text-purple-400">Conference Final</h3>
            <div className="max-w-md mx-auto">
              {seriesByRound['conference-final'].map(bracket => (
                <SeriesCard key={bracket.id} bracket={bracket} teams={teams} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stanley Cup Final (shown in both conferences but only once) */}
      {conference === 'Eastern' && seriesByRound['stanley-cup'].length > 0 && (
        <div className="space-y-4 pt-8 border-t border-border">
          <div className="text-center space-y-2">
            <Crown className="h-12 w-12 mx-auto text-yellow-400" />
            <h2 className="text-2xl font-bold text-yellow-400">Stanley Cup Final</h2>
            <p className="text-muted-foreground">The ultimate prize in hockey</p>
          </div>
          <div className="max-w-md mx-auto">
            {seriesByRound['stanley-cup'].map(bracket => (
              <SeriesCard key={bracket.id} bracket={bracket} teams={teams} />
            ))}
          </div>
        </div>
      )}

      {/* No Series Message */}
      {conferenceSeries.length === 0 && (
        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50">
          <CardContent className="text-center py-8">
            <Trophy className="h-16 w-16 mx-auto text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-purple-400 mb-2">Playoffs Not Yet Started</h3>
            <p className="text-muted-foreground">
              The {conference} Conference playoff bracket will be generated when the regular season ends
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}