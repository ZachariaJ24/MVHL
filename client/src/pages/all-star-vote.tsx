import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Trophy, Users, Vote, CheckCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function AllStarVote() {
  const [selectedVotes, setSelectedVotes] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const { data: players } = useQuery({
    queryKey: ["/api/players"],
  });

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const submitVoteMutation = useMutation({
    mutationFn: (voteData: any) => apiRequest("/api/awards/vote", "POST", voteData),
    onSuccess: () => {
      toast({ title: "Vote submitted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/awards"] });
    },
    onError: () => {
      toast({ 
        title: "Vote failed", 
        description: "Unable to submit vote. You may have already voted for this position.",
        variant: "destructive" 
      });
    },
  });

  // Separate players by conference
  const easternPlayers = (players as any[])?.filter(p => {
    const team = (teams as any[])?.find(t => t.id === p.teamId);
    return team?.conference === "Eastern";
  }) || [];

  const westernPlayers = (players as any[])?.filter(p => {
    const team = (teams as any[])?.find(t => t.id === p.teamId);
    return team?.conference === "Western";
  }) || [];

  const positions = ["C", "LW", "RW", "LD", "RD", "G"];

  const getTopPlayersByPosition = (playerList: any[], position: string) => {
    return playerList
      .filter(p => p.position === position)
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 10);
  };

  const handleVote = (conference: string, position: string, playerId: string) => {
    const voteKey = `${conference}-${position}`;
    setSelectedVotes(prev => ({
      ...prev,
      [voteKey]: playerId
    }));
  };

  const submitAllVotes = () => {
    Object.entries(selectedVotes).forEach(([key, playerId]) => {
      const [conference, position] = key.split('-');
      submitVoteMutation.mutate({
        category: `${conference}-${position}-all-star`,
        playerId,
        votedAt: new Date().toISOString()
      });
    });
  };

  const renderPositionVoting = (playerList: any[], conference: string, position: string) => {
    const topPlayers = getTopPlayersByPosition(playerList, position);
    const voteKey = `${conference}-${position}`;
    
    return (
      <Card key={`${conference}-${position}`} className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            {conference} Conference - {position}
          </CardTitle>
          <CardDescription>
            Vote for your {position} All-Star representative
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vote</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>GP</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>+/-</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPlayers.map((player: any) => {
                const team = (teams as any[])?.find(t => t.id === player.teamId);
                const isSelected = selectedVotes[voteKey] === player.id;
                
                return (
                  <TableRow 
                    key={player.id} 
                    className={`cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-blue-50 dark:bg-blue-950' : ''}`}
                    onClick={() => handleVote(conference, position, player.id)}
                  >
                    <TableCell>
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={isSelected ? "bg-blue-600" : ""}
                      >
                        {isSelected ? <CheckCircle className="h-4 w-4" /> : <Vote className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">#{player.number || "--"}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{team?.city} {team?.name}</div>
                        <div className="text-sm text-muted-foreground">{team?.abbreviation}</div>
                      </div>
                    </TableCell>
                    <TableCell>{player.gamesPlayed || 0}</TableCell>
                    <TableCell className="font-semibold">{player.points || 0}</TableCell>
                    <TableCell className={player.plusMinus >= 0 ? "text-green-600" : "text-red-600"}>
                      {player.plusMinus > 0 ? '+' : ''}{player.plusMinus || 0}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center">
          <Star className="mr-3 h-8 w-8 text-yellow-500" />
          MVHL All-Star Voting
        </h1>
        <p className="text-muted-foreground">
          Vote for your All-Star representatives - 1 vote per position per conference
        </p>
      </div>

      {/* Voting Rules */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-200">
            <Trophy className="mr-2 h-5 w-5" />
            Voting Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700 dark:text-yellow-300">
          <ul className="list-disc list-inside space-y-2">
            <li>One vote per IP address</li>
            <li>One vote per position per conference</li>
            <li>You can only vote for the conference you represent</li>
            <li>Voting closes at the end of the regular season</li>
            <li>Top voted players will participate in the All-Star Game</li>
          </ul>
        </CardContent>
      </Card>

      {/* Vote Submission Status */}
      {Object.keys(selectedVotes).length > 0 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                <span className="text-green-800 dark:text-green-200">
                  {Object.keys(selectedVotes).length} vote(s) selected
                </span>
              </div>
              <Button 
                onClick={submitAllVotes}
                disabled={submitVoteMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitVoteMutation.isPending ? "Submitting..." : "Submit All Votes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conference Tabs */}
      <Tabs defaultValue="eastern" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="eastern" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Eastern Conference
          </TabsTrigger>
          <TabsTrigger value="western" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Western Conference
          </TabsTrigger>
        </TabsList>

        <TabsContent value="eastern" className="space-y-6 mt-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Eastern Conference All-Stars</h2>
            <p className="text-muted-foreground">Vote for your Eastern Conference representatives</p>
          </div>
          
          {positions.map(position => 
            renderPositionVoting(easternPlayers, "Eastern", position)
          )}
        </TabsContent>

        <TabsContent value="western" className="space-y-6 mt-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Western Conference All-Stars</h2>
            <p className="text-muted-foreground">Vote for your Western Conference representatives</p>
          </div>
          
          {positions.map(position => 
            renderPositionVoting(westernPlayers, "Western", position)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}