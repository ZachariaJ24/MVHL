import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Target, Shield, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function Stats() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("all");

  const { data: players, isLoading } = useQuery({
    queryKey: ["/api/players"],
  });

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Loading Statistics...</h1>
        </div>
      </div>
    );
  }

  const filteredPlayers = players?.filter((player: any) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === "all" || player.teamId === selectedTeam;
    return matchesSearch && matchesTeam;
  }) || [];

  // Position-based filtering
  const forwards = filteredPlayers.filter((p: any) => ["C", "RW", "LW"].includes(p.position));
  const defense = filteredPlayers.filter((p: any) => ["LD", "RD", "D"].includes(p.position));
  const goalies = filteredPlayers.filter((p: any) => p.position === "G");

  const getTopForwards = () => {
    return [...forwards]
      .sort((a, b) => b.points - a.points)
      .slice(0, 15);
  };

  const getTopDefense = () => {
    return [...defense]
      .sort((a, b) => b.points - a.points)
      .slice(0, 15);
  };

  const getTopGoalies = () => {
    return [...goalies]
      .filter(g => g.gamesPlayed > 0)
      .sort((a, b) => parseFloat(a.gaa || "999") - parseFloat(b.gaa || "999"))
      .slice(0, 10);
  };

  const StatTable = ({ 
    players, 
    columns, 
    title 
  }: { 
    players: any[], 
    columns: Array<{ key: string, label: string, format?: (value: any) => string }>,
    title: string 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Pos</TableHead>
              {columns.map(col => (
                <TableHead key={col.key} className="text-center">{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => {
              const team = teams?.find((t: any) => t.id === player.teamId);
              return (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>
                    {team ? (
                      <Badge variant="outline">{team.abbreviation}</Badge>
                    ) : (
                      <Badge variant="secondary">FA</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{player.position}</Badge>
                  </TableCell>
                  {columns.map(col => (
                    <TableCell key={col.key} className="text-center">
                      {col.format ? col.format(player[col.key]) : player[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Player Statistics</h1>
        <p className="text-muted-foreground">
          Current season statistics for all MVHL players
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams?.map((team: any) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.city} {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Tabs */}
      <Tabs defaultValue="forwards" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forwards">Forwards</TabsTrigger>
          <TabsTrigger value="defense">Defense</TabsTrigger>
          <TabsTrigger value="goalies">Goalies</TabsTrigger>
        </TabsList>

        <TabsContent value="forwards">
          <StatTable
            players={getTopForwards()}
            title="Forward Stats (C, RW, LW)"
            columns={[
              { key: "gamesPlayed", label: "GP" },
              { key: "goals", label: "G" },
              { key: "assists", label: "A" },
              { key: "points", label: "PTS" },
              { key: "plusMinus", label: "+/-" },
              { key: "sog", label: "SOG" },
              { key: "hits", label: "HITS" },
            ]}
          />
        </TabsContent>

        <TabsContent value="defense">
          <StatTable
            players={getTopDefense()}
            title="Defense Stats (LD, RD)"
            columns={[
              { key: "gamesPlayed", label: "GP" },
              { key: "goals", label: "G" },
              { key: "assists", label: "A" },
              { key: "points", label: "PTS" },
              { key: "plusMinus", label: "+/-" },
              { key: "blocks", label: "BLK" },
              { key: "hits", label: "HITS" },
            ]}
          />
        </TabsContent>

        <TabsContent value="goalies">
          <StatTable
            players={getTopGoalies()}
            title="Goalie Stats (G)"
            columns={[
              { key: "gamesPlayed", label: "GP" },
              { key: "wins", label: "W" },
              { key: "losses", label: "L" },
              { key: "otLosses", label: "OTL" },
              { key: "gaa", label: "GAA", format: (value) => value || "0.00" },
              { key: "svPct", label: "SV%", format: (value) => value || ".000" },
            ]}
          />
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span>Position Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Forwards (C, RW, LW):</span>
              <span className="font-bold">{forwards.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Defense (LD, RD):</span>
              <span className="font-bold">{defense.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Goalies (G):</span>
              <span className="font-bold">{goalies.length}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Total Players:</span>
              <span className="font-bold">{players?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Top Forwards</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {getTopForwards().slice(0, 3).map((player, index) => (
              <div key={player.id} className="flex justify-between items-center">
                <span className="text-sm">
                  {index + 1}. {player.name} ({player.position})
                </span>
                <Badge variant="outline">{player.points} PTS</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Top Defense</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {getTopDefense().slice(0, 3).map((player, index) => (
              <div key={player.id} className="flex justify-between items-center">
                <span className="text-sm">
                  {index + 1}. {player.name} ({player.position})
                </span>
                <Badge variant="outline">{player.points} PTS</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}