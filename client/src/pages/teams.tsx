import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users, MapPin, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function Teams() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: teams, isLoading } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: allPlayers } = useQuery({
    queryKey: ["/api/players"],
  });

  const filteredTeams = teams?.filter((team: any) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.city.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getTeamPlayers = (teamId: string) => {
    return allPlayers?.filter((player: any) => player.teamId === teamId) || [];
  };

  const TeamCard = ({ team }: { team: any }) => {
    const players = getTeamPlayers(team.id);
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">{team.abbreviation}</span>
          </div>
          <CardTitle className="text-lg">{team.city} {team.name}</CardTitle>
          <CardDescription>{team.conference} • {team.division}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <div className="flex justify-center space-x-4 text-sm">
            <div>
              <div className="font-semibold">{team.wins}</div>
              <div className="text-muted-foreground">Wins</div>
            </div>
            <div>
              <div className="font-semibold">{team.losses}</div>
              <div className="text-muted-foreground">Losses</div>
            </div>
            <div>
              <div className="font-semibold">{team.points}</div>
              <div className="text-muted-foreground">Points</div>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                View Roster ({players.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{team.city} {team.name}</DialogTitle>
                <DialogDescription>
                  View complete team roster and player statistics
                </DialogDescription>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {team.stadium}
                  </div>
                  <Badge variant="secondary">{team.conference}</Badge>
                  <Badge variant="outline">{team.division}</Badge>
                </div>
              </DialogHeader>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-4">Player Roster</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>GP</TableHead>
                      <TableHead>G</TableHead>
                      <TableHead>A</TableHead>
                      <TableHead>P</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player: any) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">{player.number || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{player.name}</span>
                            {player.isManagement && <Star className="h-4 w-4 text-yellow-500" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{player.position}</Badge>
                        </TableCell>
                        <TableCell>{player.gamesPlayed}</TableCell>
                        <TableCell>{player.goals}</TableCell>
                        <TableCell>{player.assists}</TableCell>
                        <TableCell className="font-semibold">{player.points}</TableCell>
                        <TableCell>
                          {player.isManagement ? "Management" : "Player"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Loading Teams...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">MVHL Teams</h1>
        <p className="text-muted-foreground">Explore all 32 teams across 4 divisions</p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams by city or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTeams.map((team: any) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {filteredTeams.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No teams found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}