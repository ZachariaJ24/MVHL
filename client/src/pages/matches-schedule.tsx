import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, Clock, MapPin, Filter, Search, Trophy, 
  Play, Users, Star, TrendingUp, ChevronLeft, ChevronRight 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function MatchesSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentWeek, setCurrentWeek] = useState(0);

  const { data: teams } = useQuery({ queryKey: ["/api/teams"] });
  const { data: games } = useQuery({ queryKey: ["/api/games"] });

  // Mock comprehensive match data
  const mockMatches = [
    {
      id: "1",
      homeTeam: "Boston Bruins",
      awayTeam: "Toronto Maple Leafs",
      homeTeamId: "bos",
      awayTeamId: "tor",
      gameDate: new Date("2024-01-30T19:00:00"),
      venue: "TD Garden",
      status: "scheduled",
      homeScore: null,
      awayScore: null,
      isPlayoff: false,
      gameNumber: 1,
      series: null,
      round: null,
      homeRecord: "24-8-2",
      awayRecord: "22-9-3",
      lastMeeting: "TOR 4-2 (Jan 15)",
      odds: { home: -135, away: +115 },
      attendance: null,
      maxAttendance: 17565
    },
    {
      id: "2",
      homeTeam: "Tampa Bay Lightning",
      awayTeam: "Florida Panthers",
      homeTeamId: "tbl",
      awayTeamId: "fla",
      gameDate: new Date("2024-01-30T19:30:00"),
      venue: "Amalie Arena",
      status: "live",
      homeScore: 2,
      awayScore: 1,
      isPlayoff: false,
      gameNumber: 1,
      series: null,
      round: null,
      homeRecord: "21-10-3",
      awayRecord: "25-7-2",
      lastMeeting: "FLA 3-1 (Jan 12)",
      odds: { home: +105, away: -125 },
      attendance: 19092,
      maxAttendance: 19092,
      period: "2nd",
      timeRemaining: "14:23"
    },
    {
      id: "3",
      homeTeam: "Edmonton Oilers",
      awayTeam: "Calgary Flames",
      homeTeamId: "edm",
      awayTeamId: "cgy",
      gameDate: new Date("2024-01-29T20:00:00"),
      venue: "Rogers Place",
      status: "completed",
      homeScore: 4,
      awayScore: 2,
      isPlayoff: false,
      gameNumber: 1,
      series: null,
      round: null,
      homeRecord: "23-9-2",
      awayRecord: "20-11-3",
      lastMeeting: "EDM 5-3 (Jan 8)",
      odds: { home: -155, away: +135 },
      attendance: 18347,
      maxAttendance: 18347,
      stars: ["Connor McDavid (2G, 1A)", "Leon Draisaitl (1G, 2A)", "Stuart Skinner (32 saves)"]
    },
    {
      id: "4",
      homeTeam: "Colorado Avalanche",
      awayTeam: "Vegas Golden Knights",
      homeTeamId: "col",
      awayTeamId: "vgk",
      gameDate: new Date("2024-01-31T21:00:00"),
      venue: "Ball Arena",
      status: "scheduled",
      homeScore: null,
      awayScore: null,
      isPlayoff: false,
      gameNumber: 1,
      series: null,
      round: null,
      homeRecord: "26-6-2",
      awayRecord: "23-9-2",
      lastMeeting: "COL 4-1 (Jan 5)",
      odds: { home: -145, away: +125 },
      attendance: null,
      maxAttendance: 18086
    },
    {
      id: "5",
      homeTeam: "New York Rangers",
      awayTeam: "New Jersey Devils",
      homeTeamId: "nyr",
      awayTeamId: "njd",
      gameDate: new Date("2024-01-31T19:00:00"),
      venue: "Madison Square Garden",
      status: "scheduled",
      homeScore: null,
      awayScore: null,
      isPlayoff: false,
      gameNumber: 1,
      series: null,
      round: null,
      homeRecord: "21-10-3",
      awayRecord: "13-18-3",
      lastMeeting: "NYR 3-1 (Jan 2)",
      odds: { home: -175, away: +155 },
      attendance: null,
      maxAttendance: 18006
    },
    {
      id: "6",
      homeTeam: "Pittsburgh Penguins",
      awayTeam: "Philadelphia Flyers",
      homeTeamId: "pit",
      awayTeamId: "phi",
      gameDate: new Date("2024-01-29T19:00:00"),
      venue: "PPG Paints Arena",
      status: "completed",
      homeScore: 2,
      awayScore: 5,
      isPlayoff: false,
      gameNumber: 1,
      series: null,
      round: null,
      homeRecord: "11-20-3",
      awayRecord: "15-16-3",
      lastMeeting: "PHI 4-2 (Dec 28)",
      odds: { home: +125, away: -145 },
      attendance: 18387,
      maxAttendance: 18387,
      stars: ["Travis Konecny (2G, 1A)", "Sean Couturier (1G, 2A)", "Carter Hart (35 saves)"]
    }
  ];

  const allMatches = games ? [...(games as any), ...mockMatches] : mockMatches;

  const filteredMatches = allMatches.filter(match => {
    const matchesTeam = selectedTeam === "all" || 
                       match.homeTeamId === selectedTeam || 
                       match.awayTeamId === selectedTeam;
    const matchesStatus = selectedStatus === "all" || match.status === selectedStatus;
    return matchesTeam && matchesStatus;
  });

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (match: any) => {
    switch (match.status) {
      case "scheduled":
        return <Badge variant="outline" className="text-blue-400 border-blue-400">Scheduled</Badge>;
      case "live":
        return <Badge className="bg-red-600 text-white animate-pulse">Live</Badge>;
      case "completed":
        return <Badge variant="secondary">Final</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const MatchCard = ({ match }: { match: any }) => (
    <Card className={`transition-all hover:shadow-lg ${
      match.status === 'live' ? 'bg-gradient-to-br from-red-900/40 to-red-800/40 border-red-500/30' :
      match.status === 'completed' ? 'bg-gray-800/50 border-gray-600/30' :
      'bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30'
    }`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusBadge(match)}
              {match.isPlayoff && (
                <Badge className="bg-yellow-600 text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  Playoff
                </Badge>
              )}
            </div>
            <div className="text-right text-sm text-gray-400">
              <div>{formatDate(match.gameDate)}</div>
              <div>{formatTime(match.gameDate)}</div>
            </div>
          </div>

          {/* Teams and Score */}
          <div className="space-y-3">
            {/* Away Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {match.awayTeam.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-white">{match.awayTeam}</div>
                  <div className="text-xs text-gray-400">{match.awayRecord}</div>
                </div>
              </div>
              <div className="text-right">
                {match.status === 'completed' || match.status === 'live' ? (
                  <div className="text-2xl font-bold text-white">{match.awayScore}</div>
                ) : (
                  <div className="text-sm text-gray-400">
                    {match.odds?.away > 0 ? `+${match.odds.away}` : match.odds?.away}
                  </div>
                )}
              </div>
            </div>

            {/* Home Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {match.homeTeam.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-white">{match.homeTeam}</div>
                  <div className="text-xs text-gray-400">{match.homeRecord}</div>
                </div>
              </div>
              <div className="text-right">
                {match.status === 'completed' || match.status === 'live' ? (
                  <div className="text-2xl font-bold text-white">{match.homeScore}</div>
                ) : (
                  <div className="text-sm text-gray-400">
                    {match.odds?.home > 0 ? `+${match.odds.home}` : match.odds?.home}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Game Info */}
          {match.status === 'live' && (
            <div className="bg-red-900/30 rounded-lg p-3 border border-red-500/30">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-300 font-medium">{match.period} Period</span>
                </div>
                <span className="text-white font-mono">{match.timeRemaining}</span>
              </div>
            </div>
          )}

          {/* Venue and Details */}
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3" />
              <span>{match.venue}</span>
            </div>
            {match.attendance && (
              <div className="flex items-center space-x-2">
                <Users className="h-3 w-3" />
                <span>{match.attendance.toLocaleString()} / {match.maxAttendance.toLocaleString()}</span>
              </div>
            )}
            {match.lastMeeting && (
              <div className="text-gray-500">
                Last meeting: {match.lastMeeting}
              </div>
            )}
          </div>

          {/* Three Stars (Completed games) */}
          {match.status === 'completed' && match.stars && (
            <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-300 font-medium text-sm">Three Stars</span>
              </div>
              <div className="space-y-1 text-xs">
                {match.stars.map((star: string, index: number) => (
                  <div key={index} className="text-gray-300">
                    {index + 1}. {star}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            {match.status === 'live' && (
              <Button size="sm" className="bg-red-600 hover:bg-red-700 flex-1">
                <Play className="h-3 w-3 mr-1" />
                Watch Live
              </Button>
            )}
            {match.status === 'completed' && (
              <Button size="sm" variant="outline" className="flex-1">
                Game Recap
              </Button>
            )}
            {match.status === 'scheduled' && (
              <Button size="sm" variant="outline" className="flex-1">
                Set Reminder
              </Button>
            )}
            <Button size="sm" variant="outline">
              Stats
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TableView = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-300">Date/Time</TableHead>
            <TableHead className="text-gray-300">Matchup</TableHead>
            <TableHead className="text-center text-gray-300">Score</TableHead>
            <TableHead className="text-gray-300">Venue</TableHead>
            <TableHead className="text-center text-gray-300">Status</TableHead>
            <TableHead className="text-center text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMatches.map(match => (
            <TableRow key={match.id} className="hover:bg-gray-700/30">
              <TableCell>
                <div className="text-sm">
                  <div className="text-white font-medium">{formatDate(match.gameDate)}</div>
                  <div className="text-gray-400">{formatTime(match.gameDate)}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-white font-medium">
                    {match.awayTeam} @ {match.homeTeam}
                  </div>
                  <div className="text-xs text-gray-400">
                    {match.awayRecord} vs {match.homeRecord}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {match.status === 'completed' || match.status === 'live' ? (
                  <div className="text-lg font-bold text-white">
                    {match.awayScore} - {match.homeScore}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">
                    {match.odds?.home > 0 ? `+${match.odds.home}` : match.odds?.home} / 
                    {match.odds?.away > 0 ? `+${match.odds.away}` : match.odds?.away}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-300">{match.venue}</div>
                {match.attendance && (
                  <div className="text-xs text-gray-400">
                    {match.attendance.toLocaleString()} attendance
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(match)}
                {match.status === 'live' && match.period && (
                  <div className="text-xs text-red-300 mt-1">
                    {match.period} - {match.timeRemaining}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-1">
                  {match.status === 'live' && (
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Live
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Stats
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">MVHL Matches</h1>
          <p className="text-xl text-gray-300">Complete schedule and live game coverage</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teams or venues..."
              className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Teams</option>
            {(teams as any)?.map((team: any) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Games</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <Tabs defaultValue="cards" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-8">
            {/* Live Games */}
            {filteredMatches.filter(m => m.status === 'live').length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                  Live Games
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMatches.filter(m => m.status === 'live').map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </section>
            )}

            {/* Today's Games */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Today's Games</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.filter(m => m.status === 'scheduled').slice(0, 6).map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>

            {/* Recent Results */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Recent Results</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.filter(m => m.status === 'completed').slice(0, 6).map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="table" className="space-y-8">
            <Card className="bg-gray-800/50 border-gray-600/30">
              <CardHeader>
                <CardTitle className="text-white">All Matches</CardTitle>
                <CardDescription>Complete schedule with results and upcoming games</CardDescription>
              </CardHeader>
              <CardContent>
                <TableView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-8">
            <Card className="bg-gray-800/50 border-gray-600/30">
              <CardHeader>
                <CardTitle className="text-white">Calendar View</CardTitle>
                <CardDescription>Navigate games by date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">Calendar view coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}