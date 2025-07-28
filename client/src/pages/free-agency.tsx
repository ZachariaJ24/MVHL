import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Search, TrendingUp, Trophy, Target, Clock } from "lucide-react";

export function FreeAgency() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: players } = useQuery({
    queryKey: ["/api/players"],
  });

  // Filter for free agents (players without team assignment)
  const freeAgents = (players as any[])?.filter(player => !player.teamId) || [];
  
  const filteredAgents = freeAgents.filter(player =>
    player.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTopStats = (player: any) => {
    const stats = [];
    if (player.goals) stats.push(`${player.goals}G`);
    if (player.assists) stats.push(`${player.assists}A`);
    if (player.points) stats.push(`${player.points}P`);
    if (player.plusMinus !== undefined) stats.push(`${player.plusMinus > 0 ? '+' : ''}${player.plusMinus}`);
    return stats.slice(0, 4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center">
          <UserPlus className="mr-3 h-8 w-8 text-green-600" />
          MVHL Free Agency
        </h1>
        <p className="text-muted-foreground">
          Available players seeking team contracts and opportunities
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players by name or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Free Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Players</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{freeAgents.length}</div>
            <p className="text-xs text-muted-foreground">Seeking contracts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Prospects</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {freeAgents.filter(p => (p.points || 0) > 50).length}
            </div>
            <p className="text-xs text-muted-foreground">50+ point players</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fresh Talent</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {freeAgents.filter(p => (p.gamesPlayed || 0) < 20).length}
            </div>
            <p className="text-xs text-muted-foreground">New to league</p>
          </CardContent>
        </Card>
      </div>

      {/* Free Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Free Agents</CardTitle>
          <CardDescription>
            {filteredAgents.length} players available for signing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Top 4 Stats</TableHead>
                <TableHead>Performance History</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((player: any) => (
                <TableRow key={player.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        #{player.number || "--"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{player.position}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getTopStats(player).map((stat, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {stat}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{player.gamesPlayed || 0} GP this season</span>
                      </div>
                      <div className="text-muted-foreground">
                        {player.bio || "Experienced player seeking new opportunity"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Make Offer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Free Agents Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria" : "All players are currently under contract"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}