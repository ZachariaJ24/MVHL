import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, TrendingUp, Award, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function StandingsBracket() {
  const [selectedView, setSelectedView] = useState("bracket");

  const { data: teams } = useQuery({ queryKey: ["/api/teams"] });
  const { data: games } = useQuery({ queryKey: ["/api/games"] });

  // Mock standings data with proper divisions
  const easternConference = {
    south: [
      { id: "1", name: "Florida Panthers", city: "Florida", wins: 25, losses: 7, otLosses: 2, points: 52 },
      { id: "2", name: "Tampa Bay Lightning", city: "Tampa Bay", wins: 21, losses: 10, otLosses: 3, points: 45 },
      { id: "3", name: "Carolina Hurricanes", city: "Carolina", wins: 20, losses: 11, otLosses: 3, points: 43 },
      { id: "4", name: "Washington Capitals", city: "Washington", wins: 18, losses: 13, otLosses: 3, points: 39 },
      { id: "5", name: "Atlanta Thrashers", city: "Atlanta", wins: 16, losses: 15, otLosses: 3, points: 35 },
      { id: "6", name: "Nashville Predators", city: "Nashville", wins: 15, losses: 16, otLosses: 3, points: 33 },
      { id: "7", name: "Columbus Blue Jackets", city: "Columbus", wins: 12, losses: 19, otLosses: 3, points: 27 },
      { id: "8", name: "Miami Heat", city: "Miami", wins: 10, losses: 21, otLosses: 3, points: 23 },
    ],
    northeast: [
      { id: "9", name: "Boston Bruins", city: "Boston", wins: 24, losses: 8, otLosses: 2, points: 50 },
      { id: "10", name: "Toronto Maple Leafs", city: "Toronto", wins: 22, losses: 9, otLosses: 3, points: 47 },
      { id: "11", name: "New York Rangers", city: "New York", wins: 21, losses: 10, otLosses: 3, points: 45 },
      { id: "12", name: "Buffalo Sabres", city: "Buffalo", wins: 19, losses: 12, otLosses: 3, points: 41 },
      { id: "13", name: "Montreal Canadiens", city: "Montreal", wins: 17, losses: 14, otLosses: 3, points: 37 },
      { id: "14", name: "Ottawa Senators", city: "Ottawa", wins: 15, losses: 16, otLosses: 3, points: 33 },
      { id: "15", name: "New Jersey Devils", city: "New Jersey", wins: 13, losses: 18, otLosses: 3, points: 29 },
      { id: "16", name: "Pittsburgh Penguins", city: "Pittsburgh", wins: 11, losses: 20, otLosses: 3, points: 25 },
    ],
  };

  const westernConference = {
    midwest: [
      { id: "17", name: "Colorado Avalanche", city: "Colorado", wins: 26, losses: 6, otLosses: 2, points: 54 },
      { id: "18", name: "Minnesota Wild", city: "Minnesota", wins: 23, losses: 8, otLosses: 3, points: 49 },
      { id: "19", name: "St. Louis Blues", city: "St. Louis", wins: 20, losses: 11, otLosses: 3, points: 43 },
      { id: "20", name: "Chicago Blackhawks", city: "Chicago", wins: 18, losses: 13, otLosses: 3, points: 39 },
      { id: "21", name: "Dallas Stars", city: "Dallas", wins: 16, losses: 15, otLosses: 3, points: 35 },
      { id: "22", name: "Detroit Red Wings", city: "Detroit", wins: 14, losses: 17, otLosses: 3, points: 31 },
      { id: "23", name: "Winnipeg Jets", city: "Winnipeg", wins: 12, losses: 19, otLosses: 3, points: 27 },
      { id: "24", name: "Milwaukee Admirals", city: "Milwaukee", wins: 9, losses: 22, otLosses: 3, points: 21 },
    ],
    west: [
      { id: "25", name: "Vegas Golden Knights", city: "Vegas", wins: 23, losses: 9, otLosses: 2, points: 48 },
      { id: "26", name: "Edmonton Oilers", city: "Edmonton", wins: 22, losses: 10, otLosses: 2, points: 46 },
      { id: "27", name: "Calgary Flames", city: "Calgary", wins: 20, losses: 11, otLosses: 3, points: 43 },
      { id: "28", name: "Vancouver Canucks", city: "Vancouver", wins: 18, losses: 13, otLosses: 3, points: 39 },
      { id: "29", name: "Seattle Kraken", city: "Seattle", wins: 16, losses: 15, otLosses: 3, points: 35 },
      { id: "30", name: "Los Angeles Kings", city: "Los Angeles", wins: 15, losses: 16, otLosses: 3, points: 33 },
      { id: "31", name: "San Jose Sharks", city: "San Jose", wins: 13, losses: 18, otLosses: 3, points: 29 },
      { id: "32", name: "Anaheim Ducks", city: "Anaheim", wins: 10, losses: 21, otLosses: 3, points: 23 },
    ],
  };

  const renderDivisionStandings = (teams: any[], divisionName: string, position: "left" | "right") => (
    <div className={`space-y-3 ${position === "right" ? "text-right" : ""}`}>
      <h3 className="text-xl font-bold text-white mb-4">{divisionName} Division</h3>
      {teams.slice(0, 4).map((team, index) => (
        <Card key={team.id} className={`transition-all hover:scale-105 ${
          index === 0 ? "bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border-yellow-500/30" :
          index < 3 ? "bg-gradient-to-r from-green-600/20 to-green-500/20 border-green-500/30" :
          "bg-gradient-to-r from-blue-600/20 to-blue-500/20 border-blue-500/30"
        }`}>
          <CardContent className="p-4">
            <div className={`flex items-center justify-between ${position === "right" ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center space-x-3 ${position === "right" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">
                  {index + 1}
                </Badge>
                <div className={position === "right" ? "text-right" : ""}>
                  <div className="font-semibold text-white">{team.name}</div>
                  <div className="text-sm text-gray-300">{team.wins}-{team.losses}-{team.otLosses}</div>
                </div>
              </div>
              <div className={`text-right ${position === "right" ? "text-left" : ""}`}>
                <div className="text-xl font-bold text-white">{team.points}</div>
                <div className="text-xs text-gray-400">PTS</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const BracketView = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">MVHL Standings</h1>
          <p className="text-xl text-gray-300">2024-25 Season Playoff Picture</p>
        </div>

        {/* Bracket Layout */}
        <div className="relative max-w-7xl mx-auto">
          {/* Eastern Conference */}
          <div className="grid lg:grid-cols-12 gap-8 mb-16">
            {/* Eastern South */}
            <div className="lg:col-span-3">
              {renderDivisionStandings(easternConference.south, "Eastern South", "left")}
            </div>

            {/* Eastern Northeast */}
            <div className="lg:col-span-3">
              {renderDivisionStandings(easternConference.northeast, "Eastern Northeast", "left")}
            </div>

            {/* Center Championship Area */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <Card className="bg-gradient-to-br from-yellow-600/30 to-yellow-500/30 border-yellow-500/50 w-full max-w-md">
                <CardHeader className="text-center">
                  <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <CardTitle className="text-3xl font-bold text-white">MVHL CUP</CardTitle>
                  <CardDescription className="text-yellow-200">Championship Final</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-4">
                    <div className="text-lg text-white">Eastern Champion</div>
                    <div className="text-4xl font-bold text-yellow-400">VS</div>
                    <div className="text-lg text-white">Western Champion</div>
                  </div>
                  <div className="mt-6">
                    <Badge variant="outline" className="text-yellow-300 border-yellow-300">
                      Best of 7 Series
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Western Conference */}
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Western Midwest */}
            <div className="lg:col-span-3">
              {renderDivisionStandings(westernConference.midwest, "Western Midwest", "right")}
            </div>

            {/* Western West */}
            <div className="lg:col-span-3">
              {renderDivisionStandings(westernConference.west, "Western West", "right")}
            </div>
          </div>

          {/* Conference Labels */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-400 mb-2">EASTERN CONFERENCE</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto"></div>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-orange-400 mb-2">WESTERN CONFERENCE</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Playoff Qualification Legend */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 border-gray-600/30">
            <CardHeader>
              <CardTitle className="text-white text-center">Playoff Qualification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded"></div>
                  <span className="text-white">Division Winner</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-600 to-green-500 rounded"></div>
                  <span className="text-white">Wildcard Spot</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded"></div>
                  <span className="text-white">Playoff Bubble</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const TableView = () => (
    <div className="space-y-8">
      {/* Eastern Conference */}
      <Card className="bg-gray-800/50 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-400">Eastern Conference</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="south" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="south">South Division</TabsTrigger>
              <TabsTrigger value="northeast">Northeast Division</TabsTrigger>
            </TabsList>
            
            <TabsContent value="south">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left p-3 text-gray-300">Rank</th>
                      <th className="text-left p-3 text-gray-300">Team</th>
                      <th className="text-center p-3 text-gray-300">W</th>
                      <th className="text-center p-3 text-gray-300">L</th>
                      <th className="text-center p-3 text-gray-300">OTL</th>
                      <th className="text-center p-3 text-gray-300">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {easternConference.south.map((team, index) => (
                      <tr key={team.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                        <td className="p-3">
                          <Badge variant={index < 4 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center">
                            {index + 1}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="font-semibold text-white">{team.name}</div>
                            <div className="text-sm text-gray-400">{team.city}</div>
                          </div>
                        </td>
                        <td className="text-center p-3 text-white font-semibold">{team.wins}</td>
                        <td className="text-center p-3 text-white">{team.losses}</td>
                        <td className="text-center p-3 text-white">{team.otLosses}</td>
                        <td className="text-center p-3">
                          <span className="text-xl font-bold text-white">{team.points}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="northeast">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left p-3 text-gray-300">Rank</th>
                      <th className="text-left p-3 text-gray-300">Team</th>
                      <th className="text-center p-3 text-gray-300">W</th>
                      <th className="text-center p-3 text-gray-300">L</th>
                      <th className="text-center p-3 text-gray-300">OTL</th>
                      <th className="text-center p-3 text-gray-300">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {easternConference.northeast.map((team, index) => (
                      <tr key={team.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                        <td className="p-3">
                          <Badge variant={index < 4 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center">
                            {index + 1}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="font-semibold text-white">{team.name}</div>
                            <div className="text-sm text-gray-400">{team.city}</div>
                          </div>
                        </td>
                        <td className="text-center p-3 text-white font-semibold">{team.wins}</td>
                        <td className="text-center p-3 text-white">{team.losses}</td>
                        <td className="text-center p-3 text-white">{team.otLosses}</td>
                        <td className="text-center p-3">
                          <span className="text-xl font-bold text-white">{team.points}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Western Conference */}
      <Card className="bg-gray-800/50 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-2xl text-orange-400">Western Conference</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="midwest" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="midwest">Midwest Division</TabsTrigger>
              <TabsTrigger value="west">West Division</TabsTrigger>
            </TabsList>
            
            <TabsContent value="midwest">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left p-3 text-gray-300">Rank</th>
                      <th className="text-left p-3 text-gray-300">Team</th>
                      <th className="text-center p-3 text-gray-300">W</th>
                      <th className="text-center p-3 text-gray-300">L</th>
                      <th className="text-center p-3 text-gray-300">OTL</th>
                      <th className="text-center p-3 text-gray-300">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {westernConference.midwest.map((team, index) => (
                      <tr key={team.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                        <td className="p-3">
                          <Badge variant={index < 4 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center">
                            {index + 1}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="font-semibold text-white">{team.name}</div>
                            <div className="text-sm text-gray-400">{team.city}</div>
                          </div>
                        </td>
                        <td className="text-center p-3 text-white font-semibold">{team.wins}</td>
                        <td className="text-center p-3 text-white">{team.losses}</td>
                        <td className="text-center p-3 text-white">{team.otLosses}</td>
                        <td className="text-center p-3">
                          <span className="text-xl font-bold text-white">{team.points}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="west">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left p-3 text-gray-300">Rank</th>
                      <th className="text-left p-3 text-gray-300">Team</th>
                      <th className="text-center p-3 text-gray-300">W</th>
                      <th className="text-center p-3 text-gray-300">L</th>
                      <th className="text-center p-3 text-gray-300">OTL</th>
                      <th className="text-center p-3 text-gray-300">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {westernConference.west.map((team, index) => (
                      <tr key={team.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                        <td className="p-3">
                          <Badge variant={index < 4 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center">
                            {index + 1}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="font-semibold text-white">{team.name}</div>
                            <div className="text-sm text-gray-400">{team.city}</div>
                          </div>
                        </td>
                        <td className="text-center p-3 text-white font-semibold">{team.wins}</td>
                        <td className="text-center p-3 text-white">{team.losses}</td>
                        <td className="text-center p-3 text-white">{team.otLosses}</td>
                        <td className="text-center p-3">
                          <span className="text-xl font-bold text-white">{team.points}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
            <Button
              variant={selectedView === "bracket" ? "default" : "ghost"}
              onClick={() => setSelectedView("bracket")}
              className="text-white"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Bracket View
            </Button>
            <Button
              variant={selectedView === "table" ? "default" : "ghost"}
              onClick={() => setSelectedView("table")}
              className="text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              Table View
            </Button>
          </div>
        </div>

        {selectedView === "bracket" ? <BracketView /> : <TableView />}
      </div>
    </div>
  );
}