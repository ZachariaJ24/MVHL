import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trophy, Star, Crown, Award, Vote, Users, Loader2, CheckCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Award as AwardType, AwardVoteInput, Player } from "@shared/schema";

export function Awards() {
  const [selectedVote, setSelectedVote] = useState<{ awardId: string; nomineeId: string } | null>(null);
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch awards from API
  const { data: awards = [], isLoading: awardsLoading } = useQuery<AwardType[]>({
    queryKey: ["/api/awards"],
  });

  // Fetch players for nomination options
  const { data: players = [], isLoading: playersLoading } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  // Vote mutation
  const vote = useMutation({
    mutationFn: async (input: AwardVoteInput) => {
      return await apiRequest("/api/awards/vote", "POST", input);
    },
    onSuccess: () => {
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/awards"] });
      setIsVoteDialogOpen(false);
      setSelectedVote(null);
    },
    onError: (error: any) => {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to submit vote. You may have already voted for this award.",
        variant: "destructive",
      });
    },
  });

  const awardCategories = [
    {
      name: "Hart Memorial Trophy",
      description: "Most Valuable Player",
      icon: Trophy,
      color: "text-yellow-500",
      category: "mvp"
    },
    {
      name: "Art Ross Trophy",
      description: "Leading Scorer",
      icon: Star,
      color: "text-purple-500",
      category: "leading-scorer"
    },
    {
      name: "Vezina Trophy",
      description: "Best Goaltender",
      icon: Crown,
      color: "text-blue-500",
      category: "best-goaltender"
    },
    {
      name: "Calder Memorial Trophy",
      description: "Rookie of the Year",
      icon: Award,
      color: "text-green-500",
      category: "rookie-of-year"
    }
  ];

  const getTopPlayers = (category: string) => {
    // Filter players based on award category
    switch (category) {
      case "best-goaltender":
        return players.filter(p => p.position === "G").slice(0, 5);
      case "rookie-of-year":
        // For now, show all players since isRookie field doesn't exist yet
        return players.slice(0, 5);
      default:
        return players.slice(0, 5);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">MVHL Awards Voting</h1>
        <p className="text-muted-foreground">
          Vote for the season's best players across different categories
        </p>
        <Badge variant="outline" className="text-sm">
          <Vote className="h-4 w-4 mr-1" />
          One vote per IP address per award
        </Badge>
      </div>

      {awardsLoading || playersLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {awardCategories.map((awardCategory) => {
            const Icon = awardCategory.icon;
            const existingAward = awards.find(a => a.category === awardCategory.category);
            const topPlayers = getTopPlayers(awardCategory.category);

            return (
              <Card key={awardCategory.category} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-6 w-6 ${awardCategory.color}`} />
                      <span>{awardCategory.name}</span>
                    </div>
                    {existingAward && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-1" />
                            Results
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{awardCategory.name} - Voting Results</DialogTitle>
                            <DialogDescription>
                              Current vote standings for this award
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p>Voting results will be displayed here once the voting period ends.</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardTitle>
                  <CardDescription>{awardCategory.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Top Candidates</h4>
                    <div className="space-y-2">
                      {topPlayers.length > 0 ? (
                        topPlayers.map((player, index) => (
                          <div key={player.id} className="flex items-center justify-between p-2 rounded-md bg-slate-100 dark:bg-slate-800">
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="w-6 h-6 rounded-full text-xs">
                                {index + 1}
                              </Badge>
                              <span className="font-medium">{player.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {player.position}
                              </Badge>
                            </div>
                            <Dialog open={isVoteDialogOpen && selectedVote?.nomineeId === player.id} 
                                   onOpenChange={(open) => {
                                     setIsVoteDialogOpen(open);
                                     if (!open) setSelectedVote(null);
                                   }}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    if (existingAward) {
                                      setSelectedVote({ awardId: existingAward.id, nomineeId: player.id });
                                      setIsVoteDialogOpen(true);
                                    }
                                  }}
                                  className="h-8"
                                >
                                  <Vote className="h-3 w-3 mr-1" />
                                  Vote
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="flex items-center space-x-2">
                                    <Icon className={`h-5 w-5 ${awardCategory.color}`} />
                                    <span>Vote for {awardCategory.name}</span>
                                  </DialogTitle>
                                  <DialogDescription>
                                    You are voting for <strong>{player.name}</strong> for the {awardCategory.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Player Details</h4>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                      <strong>Name:</strong> {player.name}<br />
                                      <strong>Position:</strong> {player.position}<br />
                                      <strong>Team:</strong> {player.teamId}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() => {
                                        if (selectedVote) {
                                          vote.mutate(selectedVote);
                                        }
                                      }}
                                      disabled={vote.isPending}
                                      className="flex-1"
                                    >
                                      {vote.isPending ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Submitting...
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Confirm Vote
                                        </>
                                      )}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        setIsVoteDialogOpen(false);
                                        setSelectedVote(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No eligible candidates found for this category.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Voting Information */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Voting Information</h3>
            <p className="text-slate-700 dark:text-slate-300">
              Each IP address can vote once per award category. Votes are anonymous and cannot be changed.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span>4 Award Categories</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Anonymous Voting</span>
              </div>
              <div className="flex items-center space-x-1">
                <Vote className="h-4 w-4" />
                <span>One Vote Per Award</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}