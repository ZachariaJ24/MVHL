import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Crown, Star, TrendingUp, Users, Clock, Search, Target, Zap, Trophy, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { CountdownTimer } from "@/components/draft/countdown-timer";
import type { DraftProspect, DraftSettings, Team } from "@shared/schema";

export function DraftCentral() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [selectedProspect, setSelectedProspect] = useState<DraftProspect | null>(null);
  
  // Mock draft settings for demonstration
  const mockDraftSettings = {
    isActive: true,
    currentRound: 1,
    currentPick: 5,
    timeRemaining: 45,
    pickOrder: []
  };

  const { data: draftPicks, isLoading: picksLoading } = useQuery({
    queryKey: ["/api/draft/picks"],
  });

  const { data: draftSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/draft/settings"],
  });

  const { data: prospects, isLoading: prospectsLoading } = useQuery({
    queryKey: ["/api/draft/prospects"],
  });

  const { data: availableProspects, isLoading: availableLoading } = useQuery({
    queryKey: ["/api/draft/prospects/available"],
  });

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const draftActionMutation = useMutation({
    mutationFn: (actionData: { action: string; settings?: any }) => 
      apiRequest("POST", "/api/draft/action", actionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/draft/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activity"] });
      toast({
        title: "Draft action completed",
        description: "Draft status has been updated",
      });
    },
    onError: (error: any) => {
      console.error("Draft action error:", error);
      toast({
        title: "Draft Action Failed",
        description: error.message || "Failed to execute draft action",
        variant: "destructive",
      });
    },
  });

  const makeDraftPickMutation = useMutation({
    mutationFn: (pickData: { prospectId: string; teamId: string }) => 
      apiRequest("POST", "/api/draft/pick", pickData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/draft/picks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/draft/prospects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/draft/prospects/available"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activity"] });
      setSelectedProspect(null);
      toast({
        title: "Pick Made!",
        description: "Prospect has been successfully drafted",
      });
    },
    onError: (error: any) => {
      console.error("Draft pick error:", error);
      toast({
        title: "Draft Pick Failed", 
        description: error.message || "Failed to make draft pick",
        variant: "destructive",
      });
    },
  });

  if (picksLoading || settingsLoading || prospectsLoading || availableLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Loading Draft Central...</h1>
        </div>
      </div>
    );
  }

  const filteredProspects = availableProspects?.filter((prospect: DraftProspect) => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === "all" || prospect.position === positionFilter;
    return matchesSearch && matchesPosition;
  }) || [];

  const topProspects = filteredProspects.slice(0, 10);
  const currentTeam = teams?.find((t: Team) => 
    draftSettings?.currentPick && 
    ((draftSettings.currentRound - 1) * 32 + draftSettings.currentPick - 1) % 32 === teams.indexOf(t)
  );

  const handleDraftAction = (action: string) => {
    // Only allow admins to perform draft actions
    if (user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only administrators can control the draft",
        variant: "destructive",
      });
      return;
    }
    draftActionMutation.mutate({ action, userId: user?.id });
  };

  const handleDraftPick = (prospectId: string, teamId: string) => {
    makeDraftPickMutation.mutate({ prospectId, teamId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Crown className="h-8 w-8 text-yellow-500" />
          <span>Draft Central</span>
        </h1>
        <p className="text-muted-foreground">
          MVHL Draft headquarters - picks, prospects, and analysis
        </p>
      </div>

      {/* Draft Status & Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-blue-500" />
            <span>Draft Status</span>
            {draftSettings?.isActive && <Badge variant="default" className="bg-green-500">LIVE</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Round {draftSettings?.currentRound || 1}
              </div>
              <div className="text-sm text-muted-foreground">Current Round</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                Pick {draftSettings?.currentPick || 1}
              </div>
              <div className="text-sm text-muted-foreground">Current Pick</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {draftPicks?.filter((p: any) => p.isSelected).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Completed Picks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {availableProspects?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Available Prospects</div>
            </div>
          </div>
          
          {/* Draft Controls - Admin Only */}
          {user?.role === 'admin' && (
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => handleDraftAction(draftSettings?.isActive ? 'pause' : 'start')}
                variant={draftSettings?.isActive ? "destructive" : "default"}
                disabled={draftActionMutation.isPending}
              >
                {draftSettings?.isActive ? 'Pause Draft' : 'Start Draft'}
              </Button>
              <Button 
                onClick={() => handleDraftAction('advance')}
                disabled={!draftSettings?.isActive || draftActionMutation.isPending}
                variant="outline"
              >
                Advance Pick
              </Button>
              <Button 
                onClick={() => handleDraftAction('reset')}
                disabled={draftActionMutation.isPending}
                variant="outline"
              >
                Reset Draft
              </Button>
            </div>
          )}
          
          {user?.role !== 'admin' && (
            <div className="text-center text-sm text-muted-foreground">
              Draft controls are available to administrators only
            </div>
          )}

          {/* On the Clock */}
          {draftSettings?.isActive && currentTeam && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900 dark:text-blue-100">On the Clock</span>
              </div>
              <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                {currentTeam.city} {currentTeam.name}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-300">
                Round {draftSettings.currentRound}, Pick {draftSettings.currentPick}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Draft Timer */}
      <CountdownTimer 
        timeRemaining={mockDraftSettings.timeRemaining}
        isActive={mockDraftSettings.isActive}
        currentPick={mockDraftSettings.currentPick}
        currentRound={mockDraftSettings.currentRound}
        onTimeExpired={() => {
          toast({
            title: "Pick Time Expired",
            description: "The time limit for this pick has expired",
            variant: "destructive",
          });
        }}
      />

      {/* Draft Pick Carousel - NHL Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-500" />
            <span>Draft Pick Timeline</span>
          </CardTitle>
          <CardDescription>Past picks, current selection, and upcoming turns</CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent className="-ml-1">
              {/* Generate 7 picks: 3 past, 1 current, 3 upcoming */}
              {Array.from({ length: 7 }, (_, index) => {
                const currentPickNumber = ((draftSettings?.currentRound || 1) - 1) * 32 + (draftSettings?.currentPick || 1);
                const pickNumber = currentPickNumber - 3 + index;
                const round = Math.ceil(pickNumber / 32);
                const pickInRound = ((pickNumber - 1) % 32) + 1;
                
                // Determine pick status
                const isPast = index < 3;
                const isCurrent = index === 3;
                const isUpcoming = index > 3;
                
                // Get team for this pick (rotating through teams)
                const teamIndex = (pickInRound - 1) % (teams?.length || 32);
                const team = teams?.[teamIndex];
                
                // Get pick data if it exists
                const existingPick = draftPicks?.find((p: any) => 
                  p.round === round && p.pick === pickInRound
                );

                if (pickNumber <= 0 || round > (draftSettings?.totalRounds || 5)) {
                  return null;
                }

                return (
                  <CarouselItem key={index} className="pl-1 md:basis-1/3 lg:basis-1/5">
                    <div className="p-1">
                      <Card className={`
                        transition-all duration-300 bg-gray-900 border-gray-700
                        ${isCurrent ? 'ring-2 ring-green-500 bg-green-900 border-green-600' : ''}
                        ${isPast ? 'opacity-75 bg-gray-800' : ''}
                        ${isUpcoming ? 'border-dashed border-gray-600' : ''}
                      `}>
                        <CardContent className="p-4 text-center space-y-2">
                          {/* Pick Number */}
                          <div className={`
                            text-xs font-medium px-2 py-1 rounded-full
                            ${isCurrent ? 'bg-green-600 text-white' : ''}
                            ${isPast ? 'bg-gray-600 text-white' : ''}
                            ${isUpcoming ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : ''}
                          `}>
                            R{round} P{pickInRound}
                          </div>

                          {/* Team Logo/Name */}
                          <div className="space-y-1">
                            <div className={`
                              w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-sm
                              ${isCurrent ? 'bg-green-600 animate-pulse' : ''}
                              ${isPast ? 'bg-gray-500' : ''}
                              ${isUpcoming ? 'bg-gray-300 dark:bg-gray-600' : ''}
                            `}>
                              {team?.abbreviation || 'TBD'}
                            </div>
                            <div className="text-xs font-medium truncate text-gray-300">
                              {team?.name || 'Team TBD'}
                            </div>
                          </div>

                          {/* Pick Status */}
                          {existingPick?.prospectName ? (
                            <div className="space-y-1">
                              <div className="text-sm font-semibold text-green-400">
                                {existingPick.prospectName}
                              </div>
                              <div className="text-xs text-gray-400">
                                {existingPick.position}
                              </div>
                            </div>
                          ) : isCurrent ? (
                            <div className="space-y-1">
                              <div className="text-sm font-semibold text-green-400 animate-pulse">
                                ON THE CLOCK
                              </div>
                              <div className="text-xs text-gray-400">
                                {draftSettings?.pickTimeLimit ? `${draftSettings.pickTimeLimit}s` : 'No limit'}
                              </div>
                            </div>
                          ) : isUpcoming ? (
                            <div className="space-y-1">
                              <div className="text-sm text-gray-300">
                                Upcoming
                              </div>
                              <div className="text-xs text-gray-400">
                                {pickNumber - currentPickNumber + 1} picks away
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="text-sm text-gray-300">
                                Available
                              </div>
                              <div className="text-xs text-gray-400">
                                No selection yet
                              </div>
                            </div>
                          )}

                          {/* Timer for current pick */}
                          {isCurrent && (
                            <div className="mt-2 flex items-center justify-center space-x-1 p-2 border border-blue-500 bg-blue-950 rounded-lg ring-1 ring-blue-400">
                              <Clock className="h-3 w-3 text-blue-400" />
                              <div className="text-xs font-mono text-blue-400">
                                {draftSettings?.isActive 
                                  ? `${draftSettings?.pickTimeLimit || 300}s` 
                                  : 'READY'
                                }
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              }).filter(Boolean)}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>

      <Tabs defaultValue="prospects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prospects">Top Prospects</TabsTrigger>
          <TabsTrigger value="picks">Draft Board</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="prospects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <span>Available Prospects</span>
              </CardTitle>
              <CardDescription>Scout and select from the available prospect pool</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search prospects by name, position, or country..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={positionFilter} onValueChange={setPositionFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="C">Center</SelectItem>
                    <SelectItem value="LW">Left Wing</SelectItem>
                    <SelectItem value="RW">Right Wing</SelectItem>
                    <SelectItem value="D">Defense</SelectItem>
                    <SelectItem value="G">Goalie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prospects Table */}
              {filteredProspects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead>Pos</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>League</TableHead>
                      <TableHead>Overall</TableHead>
                      <TableHead>Potential</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProspects.slice(0, 20).map((prospect: DraftProspect, index) => (
                      <TableRow key={prospect.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{prospect.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {prospect.height}, {prospect.weight} • {prospect.country}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{prospect.position}</Badge>
                        </TableCell>
                        <TableCell>{prospect.age}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{prospect.league}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span className="font-bold">{prospect.overall}</span>
                            <span className="text-muted-foreground">/10</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span className="font-bold text-blue-600">{prospect.potential}</span>
                            <span className="text-muted-foreground">/10</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedProspect(prospect)}>
                                <User className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{prospect.name} - Scouting Report</DialogTitle>
                                <DialogDescription>{prospect.position} • {prospect.league}</DialogDescription>
                              </DialogHeader>
                              {selectedProspect && (
                                <ProspectDetails 
                                  prospect={selectedProspect} 
                                  teams={teams}
                                  currentTeam={currentTeam}
                                  draftSettings={draftSettings}
                                  onDraftPick={handleDraftPick}
                                  isLoading={makeDraftPickMutation.isPending}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Available Prospects</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || positionFilter !== "all" 
                      ? "No prospects match your search criteria"
                      : "All players have been drafted! Check back for future drafts."
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="picks">
          <Card>
            <CardHeader>
              <CardTitle>Draft Board</CardTitle>
              <CardDescription>Complete draft pick order and selections</CardDescription>
            </CardHeader>
            <CardContent>
              {draftPicks && draftPicks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pick #</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Player Selected</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draftPicks.slice(0, 20).map((pick: any) => {
                      const team = teams?.find((t: any) => t.id === pick.teamId);
                      return (
                        <TableRow key={pick.id}>
                          <TableCell className="font-medium">#{pick.pickNumber}</TableCell>
                          <TableCell>
                            {team ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                  <span className="text-xs font-bold text-blue-600">
                                    {team.abbreviation}
                                  </span>
                                </div>
                                <span>{team.city} {team.name}</span>
                              </div>
                            ) : (
                              "Unknown Team"
                            )}
                          </TableCell>
                          <TableCell>
                            {pick.playerName || (
                              <span className="text-muted-foreground">TBD</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={pick.isSelected ? "default" : "outline"}>
                              {pick.isSelected ? "Selected" : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Draft Board Empty</h3>
                  <p className="text-muted-foreground">
                    No draft picks have been configured yet. Check back when the draft begins!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Draft Analysis</CardTitle>
                <CardDescription>AI-powered insights and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Best Available Player</h4>
                  <p className="text-sm text-blue-700">
                    Based on current stats and projections, {topProspects[0]?.name || "TBD"} 
                    appears to be the top remaining prospect.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Position Need</h4>
                  <p className="text-sm text-green-700">
                    Teams should focus on drafting defensemen and goalies in upcoming rounds.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Draft Trend</h4>
                  <p className="text-sm text-orange-700">
                    High-scoring forwards are being selected early, creating value opportunities 
                    for defensive players.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mock Draft Predictions</CardTitle>
                <CardDescription>AI predictions for next 5 picks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((pick) => {
                    const prospect = topProspects[pick - 1];
                    return (
                      <div key={pick} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <span className="font-medium">Pick #{pick}</span>
                          <div className="text-sm text-muted-foreground">
                            {prospect?.name || `Prospect ${pick}`}
                          </div>
                        </div>
                        <Badge variant="outline">
                          {prospect?.position || "F"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Prospect Details Component
function ProspectDetails({ 
  prospect, 
  teams, 
  currentTeam, 
  draftSettings, 
  onDraftPick, 
  isLoading 
}: {
  prospect: DraftProspect;
  teams: Team[];
  currentTeam?: Team;
  draftSettings?: DraftSettings;
  onDraftPick: (prospectId: string, teamId: string) => void;
  isLoading: boolean;
}) {
  const attributes = [
    { label: "Skating", value: prospect.skating },
    { label: "Shooting", value: prospect.shooting },
    { label: "Passing", value: prospect.passing },
    { label: "Checking", value: prospect.checking },
    { label: "Defense", value: prospect.defense },
    { label: "Puck Handling", value: prospect.puckHandling },
  ];

  const getAttributeColor = (value: number) => {
    if (value >= 8) return "text-green-600";
    if (value >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Personal Details</h4>
          <div className="space-y-1 text-sm">
            <div>Age: {prospect.age}</div>
            <div>Height: {prospect.height}</div>
            <div>Weight: {prospect.weight}</div>
            <div>Country: {prospect.country}</div>
            <div>League: {prospect.league}</div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Ratings</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Overall:</span>
              <span className="font-bold">{prospect.overall}/10</span>
            </div>
            <div className="flex justify-between">
              <span>Potential:</span>
              <span className="font-bold text-blue-600">{prospect.potential}/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes */}
      <div>
        <h4 className="font-semibold mb-4">Scouting Attributes</h4>
        <div className="grid grid-cols-2 gap-4">
          {attributes.map((attr) => (
            <div key={attr.label} className="flex justify-between items-center">
              <span className="text-sm">{attr.label}:</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      attr.value >= 8 ? 'bg-green-500' : 
                      attr.value >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${attr.value * 10}%` }}
                  />
                </div>
                <span className={`text-sm font-bold ${getAttributeColor(attr.value)}`}>
                  {attr.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Draft Action */}
      {draftSettings?.isActive && currentTeam && (
        <div className="border-t pt-4">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <div className="text-center">
              <div className="font-semibold text-blue-900 dark:text-blue-100">
                Draft {prospect.name}?
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-300">
                {currentTeam.city} {currentTeam.name} - Round {draftSettings.currentRound}, Pick {draftSettings.currentPick}
              </div>
            </div>
          </div>
          <Button 
            onClick={() => onDraftPick(prospect.id, currentTeam.id)}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Making Pick..." : "Draft Player"}
          </Button>
        </div>
      )}
    </div>
  );
}