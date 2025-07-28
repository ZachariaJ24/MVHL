import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Users, TrendingUp, Award, Vote, Crown, Target } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function AwardsVoting() {
  const [selectedAward, setSelectedAward] = useState("mvp");
  const [votedAwards, setVotedAwards] = useState(new Set());
  const { toast } = useToast();

  const { data: players } = useQuery({ queryKey: ["/api/players"] });
  const { data: awards } = useQuery({ queryKey: ["/api/awards"] });

  const voteMutation = useMutation({
    mutationFn: async ({ awardId, playerId }: { awardId: string; playerId: string }) => {
      return apiRequest("/api/awards/vote", "POST", { awardId, playerId });
    },
    onSuccess: (_, { awardId }) => {
      setVotedAwards(prev => new Set([...prev, awardId]));
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/awards"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Unable to submit vote. You may have already voted for this award.",
        variant: "destructive",
      });
    },
  });

  // Mock awards data
  const mockAwards = [
    {
      id: "mvp",
      name: "Most Valuable Player",
      description: "Player who is most valuable to their team",
      icon: Crown,
      color: "text-yellow-400",
      bgColor: "from-yellow-900/40 to-yellow-800/40",
      borderColor: "border-yellow-500/30",
      totalVotes: 2847,
      nominees: [
        { 
          id: "p1", 
          name: "Connor McDavid", 
          team: "Edmonton Oilers", 
          position: "C",
          stats: { goals: 52, assists: 89, points: 141, gamesPlayed: 82 },
          votes: 1245,
          percentage: 43.7
        },
        { 
          id: "p2", 
          name: "Nathan MacKinnon", 
          team: "Colorado Avalanche", 
          position: "C",
          stats: { goals: 49, assists: 87, points: 136, gamesPlayed: 81 },
          votes: 892,
          percentage: 31.3
        },
        { 
          id: "p3", 
          name: "David Pastrnak", 
          team: "Boston Bruins", 
          position: "RW",
          stats: { goals: 61, assists: 52, points: 113, gamesPlayed: 82 },
          votes: 710,
          percentage: 24.9
        }
      ]
    },
    {
      id: "rookie",
      name: "Rookie of the Year",
      description: "Outstanding first-year player",
      icon: Star,
      color: "text-blue-400",
      bgColor: "from-blue-900/40 to-blue-800/40",
      borderColor: "border-blue-500/30",
      totalVotes: 1923,
      nominees: [
        { 
          id: "p4", 
          name: "Connor Bedard", 
          team: "Chicago Blackhawks", 
          position: "C",
          stats: { goals: 22, assists: 39, points: 61, gamesPlayed: 68 },
          votes: 987,
          percentage: 51.3
        },
        { 
          id: "p5", 
          name: "Luke Hughes", 
          team: "New Jersey Devils", 
          position: "D",
          stats: { goals: 5, assists: 42, points: 47, gamesPlayed: 82 },
          votes: 567,
          percentage: 29.5
        },
        { 
          id: "p6", 
          name: "Macklin Celebrini", 
          team: "San Jose Sharks", 
          position: "C",
          stats: { goals: 19, assists: 31, points: 50, gamesPlayed: 71 },
          votes: 369,
          percentage: 19.2
        }
      ]
    },
    {
      id: "defenseman",
      name: "Best Defenseman",
      description: "Top defensive player",
      icon: Target,
      color: "text-purple-400",
      bgColor: "from-purple-900/40 to-purple-800/40",
      borderColor: "border-purple-500/30",
      totalVotes: 2156,
      nominees: [
        { 
          id: "p7", 
          name: "Cale Makar", 
          team: "Colorado Avalanche", 
          position: "D",
          stats: { goals: 24, assists: 66, points: 90, gamesPlayed: 77 },
          votes: 1134,
          percentage: 52.6
        },
        { 
          id: "p8", 
          name: "Erik Karlsson", 
          team: "Pittsburgh Penguins", 
          position: "D",
          stats: { goals: 23, assists: 78, points: 101, gamesPlayed: 82 },
          votes: 673,
          percentage: 31.2
        },
        { 
          id: "p9", 
          name: "Roman Josi", 
          team: "Nashville Predators", 
          position: "D",
          stats: { goals: 15, assists: 70, points: 85, gamesPlayed: 82 },
          votes: 349,
          percentage: 16.2
        }
      ]
    },
    {
      id: "goalie",
      name: "Best Goaltender",
      description: "Top goalie performance",
      icon: Award,
      color: "text-green-400",
      bgColor: "from-green-900/40 to-green-800/40",
      borderColor: "border-green-500/30",
      totalVotes: 1834,
      nominees: [
        { 
          id: "p10", 
          name: "Igor Shesterkin", 
          team: "New York Rangers", 
          position: "G",
          stats: { wins: 36, losses: 13, saves: 2847, savePercentage: 0.916 },
          votes: 892,
          percentage: 48.6
        },
        { 
          id: "p11", 
          name: "Frederik Andersen", 
          team: "Carolina Hurricanes", 
          position: "G",
          stats: { wins: 35, losses: 14, saves: 2623, savePercentage: 0.911 },
          votes: 567,
          percentage: 30.9
        },
        { 
          id: "p12", 
          name: "Linus Ullmark", 
          team: "Boston Bruins", 
          position: "G",
          stats: { wins: 40, losses: 6, saves: 2134, savePercentage: 0.938 },
          votes: 375,
          percentage: 20.4
        }
      ]
    }
  ];

  const submitVote = (awardId: string, playerId: string) => {
    if (votedAwards.has(awardId)) {
      toast({
        title: "Already Voted",
        description: "You have already voted for this award.",
        variant: "destructive",
      });
      return;
    }
    
    voteMutation.mutate({ awardId, playerId });
  };

  const NomineeCard = ({ nominee, award, isLeading }: { nominee: any; award: any; isLeading: boolean }) => (
    <Card className={`transition-all hover:scale-105 cursor-pointer ${
      isLeading 
        ? `bg-gradient-to-br ${award.bgColor} ${award.borderColor}` 
        : 'bg-gray-800/50 border-gray-600/30 hover:border-gray-500/50'
    }`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Player Info */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">{nominee.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Badge variant="outline" className="text-xs">{nominee.position}</Badge>
                <span>{nominee.team}</span>
              </div>
            </div>
            {isLeading && (
              <div className={`p-2 rounded-full bg-gradient-to-r ${award.bgColor}`}>
                <Crown className="h-5 w-5 text-yellow-400" />
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {nominee.position === 'G' ? (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{nominee.stats.wins}</div>
                  <div className="text-gray-400">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{nominee.stats.savePercentage.toFixed(3)}</div>
                  <div className="text-gray-400">SV%</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{nominee.stats.goals}</div>
                  <div className="text-gray-400">Goals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{nominee.stats.assists}</div>
                  <div className="text-gray-400">Assists</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{nominee.stats.points}</div>
                  <div className="text-gray-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{nominee.stats.gamesPlayed}</div>
                  <div className="text-gray-400">GP</div>
                </div>
              </>
            )}
          </div>

          {/* Voting Stats */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Current Votes</span>
              <span className="text-white font-medium">{nominee.votes.toLocaleString()}</span>
            </div>
            <Progress value={nominee.percentage} className="h-2" />
            <div className="text-center">
              <span className={`text-sm font-medium ${award.color}`}>
                {nominee.percentage.toFixed(1)}% of total votes
              </span>
            </div>
          </div>

          {/* Vote Button */}
          <Button
            onClick={() => submitVote(award.id, nominee.id)}
            disabled={votedAwards.has(award.id) || voteMutation.isPending}
            className={`w-full ${
              votedAwards.has(award.id) 
                ? 'bg-gray-600 text-gray-300' 
                : `bg-gradient-to-r ${award.bgColor} hover:opacity-90`
            }`}
          >
            {votedAwards.has(award.id) ? (
              <>
                <Vote className="h-4 w-4 mr-2" />
                Voted
              </>
            ) : (
              <>
                <Vote className="h-4 w-4 mr-2" />
                Vote for {nominee.name}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">MVHL Awards</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Vote for your favorite players across all major award categories. One vote per IP address.
          </p>
        </div>

        {/* Voting Rules */}
        <Card className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/30 mb-8 max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-8 w-8 text-blue-400" />
                <h3 className="font-semibold text-white">One Vote Per IP</h3>
                <p className="text-gray-300 text-sm">Each IP address can vote once per award category</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Trophy className="h-8 w-8 text-yellow-400" />
                <h3 className="font-semibold text-white">4 Major Awards</h3>
                <p className="text-gray-300 text-sm">MVP, Rookie of the Year, Best Defenseman, Best Goaltender</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <h3 className="font-semibold text-white">Live Results</h3>
                <p className="text-gray-300 text-sm">See real-time voting percentages and rankings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedAward} onValueChange={setSelectedAward} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            {mockAwards.map(award => {
              const IconComponent = award.icon;
              return (
                <TabsTrigger key={award.id} value={award.id} className="flex flex-col items-center space-y-1 py-3">
                  <IconComponent className={`h-5 w-5 ${award.color}`} />
                  <span className="text-xs">{award.name.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {mockAwards.map(award => (
            <TabsContent key={award.id} value={award.id} className="space-y-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <award.icon className={`h-8 w-8 ${award.color}`} />
                  <h2 className="text-3xl font-bold text-white">{award.name}</h2>
                </div>
                <p className="text-gray-300 text-lg mb-2">{award.description}</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <span>Total Votes: {award.totalVotes.toLocaleString()}</span>
                  <span>•</span>
                  <span>3 Nominees</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {award.nominees.map((nominee, index) => (
                  <NomineeCard
                    key={nominee.id}
                    nominee={nominee}
                    award={award}
                    isLeading={index === 0}
                  />
                ))}
              </div>

              {/* Award Stats */}
              <Card className="bg-gray-800/50 border-gray-600/30 max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-white text-center">Voting Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {award.nominees.map((nominee, index) => (
                      <div key={nominee.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            index === 0 ? 'bg-yellow-400' : 
                            index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                          }`}></div>
                          <span className="text-white font-medium">{nominee.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{nominee.votes.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">{nominee.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Voting History */}
        {votedAwards.size > 0 && (
          <Card className="bg-green-900/20 border-green-500/30 max-w-2xl mx-auto mt-12">
            <CardHeader>
              <CardTitle className="text-green-300 flex items-center">
                <Vote className="h-5 w-5 mr-2" />
                Your Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from(votedAwards).map(awardId => {
                  const award = mockAwards.find(a => a.id === awardId);
                  return (
                    <div key={awardId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{award?.name}</span>
                      <Badge className="bg-green-600 text-white">Voted</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}