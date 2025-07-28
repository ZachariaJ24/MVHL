import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, TrendingUp, Trophy, DollarSign, Calendar, MessageSquare, Target, Handshake, FileText, Crown, Search, Send, Check, X, User, Camera } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const tradeOfferSchema = z.object({
  offeredPlayer: z.string().min(1, "Please select a player to offer"),
  requestedPlayer: z.string().min(1, "Please select a player to request"),
  notes: z.string().optional(),
});

const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(500, "Message too long"),
});

const chelLookupSchema = z.object({
  gamertag: z.string().min(1, "Gamertag is required"),
  platform: z.enum(['PlayStation', 'Xbox', 'PC']).default('PlayStation'),
});

export function ManagementDashboard() {
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chelLookupResult, setChelLookupResult] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: players } = useQuery({
    queryKey: ["/api/players"],
  });

  const { data: draftSettings } = useQuery({
    queryKey: ["/api/draft/settings"],
  });

  const { data: draftProspects } = useQuery({
    queryKey: ["/api/draft/prospects/available"],
  });

  // Get user's team (for demo, use first team - in production this would be based on user's team assignment)
  const userTeam = (teams as any[])?.[0] || {
    id: "team-1",
    city: "Toronto", 
    name: "Maple Leafs",
    abbreviation: "TOR",
    wins: 28,
    losses: 15,
    otLosses: 3,
    points: 59,
    conference: "Eastern",
    division: "Northeast",
    stadium: "Scotiabank Arena",
  };

  // Filter players for user's team
  const teamPlayers = (players as any[])?.filter((player: any) => player.teamId === userTeam.id) || [];

  const mockTeam = {
    ...userTeam,
    budget: 85000000,
    salaryCapUsed: 78500000,
  };

  const { data: teamChatMessages } = useQuery({
    queryKey: ["/api/team/chat", mockTeam.id],
  });

  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
  });

  const tradeForm = useForm({
    resolver: zodResolver(tradeOfferSchema),
    defaultValues: {
      offeredPlayer: "",
      requestedPlayer: "",
      notes: "",
    },
  });

  const createTradeMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/trades", "POST", data),
    onSuccess: () => {
      toast({ title: "Trade offer submitted successfully" });
      tradeForm.reset();
    },
  });

  const respondToTradeMutation = useMutation({
    mutationFn: ({ tradeId, action }: { tradeId: string; action: "accept" | "reject" }) => 
      apiRequest(`/api/trades/${tradeId}/${action}`, "POST"),
    onSuccess: (_, variables) => {
      toast({ 
        title: `Trade ${variables.action}ed successfully`,
        description: `The trade offer has been ${variables.action}ed.`
      });
    },
  });

  const sendChatMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/team/chat", "POST", data),
    onSuccess: () => {
      setChatMessage("");
      toast({ title: "Message sent successfully" });
    },
  });

  const chelLookupMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/chel/lookup", "POST", data),
    onSuccess: (data) => {
      setChelLookupResult(data);
      toast({ title: "Player stats retrieved successfully" });
    },
  });

  const draftPickMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/draft/pick", "POST", data),
    onSuccess: () => {
      toast({ title: "Player drafted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Draft failed", 
        description: error.message || "Failed to make draft pick",
        variant: "destructive"
      });
    },
  });

  // Use real team players instead of mock data
  const teamRoster = teamPlayers || [];
  const mockTrades = [
    {
      id: "trade-1",
      fromTeam: "Boston Bruins",
      toTeam: mockTeam.city + " " + mockTeam.name,
      offeredPlayer: "Jake Smith",
      requestedPlayer: "Mike Johnson",
      status: "pending",
      createdAt: new Date(Date.now() - 86400000),
      notes: "Looking to add offensive depth",
    },
    {
      id: "trade-2", 
      fromTeam: mockTeam.city + " " + mockTeam.name,
      toTeam: "Montreal Canadiens",
      offeredPlayer: "Alex Wilson",
      requestedPlayer: "Pierre Dubois",
      status: "pending",
      createdAt: new Date(Date.now() - 172800000),
      notes: "Need defensive help",
    },
  ];

  const onSubmitTrade = (data: any) => {
    const tradeData = {
      ...data,
      fromTeamId: mockTeam.id,
      status: "pending",
    };
    createTradeMutation.mutate(tradeData);
  };

  const salaryCapUsage = ((mockTeam.salaryCapUsed / mockTeam.budget) * 100).toFixed(1);
  const capSpace = mockTeam.budget - mockTeam.salaryCapUsed;

  if (!user || user.role !== "management") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Management Dashboard</h1>
          <p className="text-muted-foreground">Please log in as management to access this dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <Building2 className="h-8 w-8 mr-3 text-blue-600" />
          Management Dashboard
        </h1>
        <p className="text-muted-foreground">Team operations and strategic management</p>
      </div>

      {/* Team Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{mockTeam.abbreviation}</span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{mockTeam.city} {mockTeam.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                <Badge variant="outline">{mockTeam.conference} Conference</Badge>
                <Badge>{mockTeam.division} Division</Badge>
                <Badge variant="secondary">{mockTeam.wins}-{mockTeam.losses}-{mockTeam.otLosses}</Badge>
                <Badge variant="default">{mockTeam.points} PTS</Badge>
              </div>
              <p className="text-muted-foreground mt-2">{mockTeam.stadium}</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold">${(capSpace / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-muted-foreground">Cap Space Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Record</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTeam.wins}-{mockTeam.losses}-{mockTeam.otLosses}</div>
            <p className="text-xs text-muted-foreground">{mockTeam.points} points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roster Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamRoster.length}</div>
            <p className="text-xs text-muted-foreground">Active players</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salary Cap</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salaryCapUsage}%</div>
            <p className="text-xs text-muted-foreground">${(mockTeam.salaryCapUsed / 1000000).toFixed(1)}M used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTrades.length}</div>
            <p className="text-xs text-muted-foreground">Pending offers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roster" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="lineups">Lineups</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="roster" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Roster</CardTitle>
              <CardDescription>Manage your active roster and player assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>GP</TableHead>
                    <TableHead>P</TableHead>
                    <TableHead>+/-</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamRoster.map((player: any) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.number || "-"}</TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{player.position}</Badge>
                      </TableCell>
                      <TableCell>{player.gamesPlayed}</TableCell>
                      <TableCell className="font-semibold">{player.points}</TableCell>
                      <TableCell>{player.plusMinus > 0 ? '+' : ''}{player.plusMinus}</TableCell>
                      <TableCell>
                        <Badge variant={
                          player.availability === "available" ? "default" :
                          player.availability === "maybe" ? "secondary" : "destructive"
                        }>
                          {player.availability}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lineups" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Player Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Player Availability
                </CardTitle>
                <CardDescription>
                  Set player availability for upcoming games
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {teamRoster.map((player: any) => (
                    <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            {player.position}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-muted-foreground">#{player.number || "-"}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={Math.random() > 0.8 ? "outline" : "default"}
                          className={Math.random() > 0.8 ? "text-red-600 hover:text-red-700" : "bg-green-600 hover:bg-green-700"}
                        >
                          {Math.random() > 0.8 ? (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              Unavailable
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Available
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lineup Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Starting Lineup
                </CardTitle>
                <CardDescription>
                  Set your starting lineup for the next game
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Forward Lines */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">FORWARDS</h4>
                    
                    {/* Center */}
                    <div className="flex items-center justify-between p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">C</Badge>
                        <span className="text-sm font-medium">Center</span>
                      </div>
                      <Select>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select center" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamRoster.filter((p: any) => p.position === 'C').map((player: any) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} (#{player.number || "-"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Left Wing */}
                    <div className="flex items-center justify-between p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">LW</Badge>
                        <span className="text-sm font-medium">Left Wing</span>
                      </div>
                      <Select>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select left wing" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamRoster.filter((p: any) => p.position === 'LW').map((player: any) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} (#{player.number || "-"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Right Wing */}
                    <div className="flex items-center justify-between p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20">RW</Badge>
                        <span className="text-sm font-medium">Right Wing</span>
                      </div>
                      <Select>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select right wing" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamRoster.filter((p: any) => p.position === 'RW').map((player: any) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} (#{player.number || "-"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Defense Lines */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">DEFENSE</h4>
                    
                    {/* Left Defense */}
                    <div className="flex items-center justify-between p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20">LD</Badge>
                        <span className="text-sm font-medium">Left Defense</span>
                      </div>
                      <Select>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select left defense" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamRoster.filter((p: any) => p.position === 'LD' || p.position === 'D').map((player: any) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} (#{player.number || "-"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Right Defense */}
                    <div className="flex items-center justify-between p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20">RD</Badge>
                        <span className="text-sm font-medium">Right Defense</span>
                      </div>
                      <Select>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select right defense" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamRoster.filter((p: any) => p.position === 'RD' || p.position === 'D').map((player: any) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} (#{player.number || "-"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Goalie */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">GOALTENDER</h4>
                    
                    <div className="flex items-center justify-between p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20">G</Badge>
                        <span className="text-sm font-medium">Goaltender</span>
                      </div>
                      <Select>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select goaltender" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamRoster.filter((p: any) => p.position === 'G').map((player: any) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} (#{player.number || "-"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button className="flex-1">
                      Save Lineup
                    </Button>
                    <Button variant="outline">
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Draft Status & Available Prospects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span>Draft Status</span>
                  {(draftSettings as any)?.isActive && <Badge variant="default" className="bg-green-500">LIVE</Badge>}
                </CardTitle>
                <CardDescription>Available prospects and draft information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Current Pick:</span>
                  <span className="font-semibold">Round {(draftSettings as any)?.currentRound || 1}, Pick {(draftSettings as any)?.currentPick || 1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Available Prospects:</span>
                  <span className="font-semibold">{(draftProspects as any)?.length || 0}</span>
                </div>
                
                <div className="max-h-40 overflow-y-auto">
                  <h4 className="text-sm font-medium mb-2">Top Available Prospects:</h4>
                  {(draftProspects as any)?.slice(0, 5)?.map((prospect: any) => (
                    <div key={prospect.id} className="flex justify-between items-center py-1 text-sm">
                      <span>{prospect.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">{prospect.position}</Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => draftPickMutation.mutate({ 
                            prospectId: prospect.id, 
                            teamId: mockTeam.id 
                          })}
                          disabled={!(draftSettings as any)?.isActive || draftPickMutation.isPending}
                        >
                          Draft
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span>Team Chat</span>
                </CardTitle>
                <CardDescription>Communicate with your team during the draft</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-md p-3 space-y-2">
                  {(teamChatMessages as any)?.length ? (teamChatMessages as any).map((msg: any) => (
                    <div key={msg.id} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{msg.username || 'Team Member'}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-1">{msg.message}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">No messages yet</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && chatMessage.trim()) {
                        sendChatMutation.mutate({
                          teamId: mockTeam.id,
                          userId: user?.id,
                          message: chatMessage.trim(),
                        });
                      }
                    }}
                  />
                  <Button 
                    size="sm"
                    onClick={() => {
                      if (chatMessage.trim()) {
                        sendChatMutation.mutate({
                          teamId: mockTeam.id,
                          userId: user?.id,
                          message: chatMessage.trim(),
                        });
                      }
                    }}
                    disabled={!chatMessage.trim() || sendChatMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CHEL Stats Lookup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-green-500" />
                <span>CHEL Player Lookup</span>
              </CardTitle>
              <CardDescription>Look up player stats by gamer tag</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter gamertag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const gamertag = (e.target as HTMLInputElement).value.trim();
                      if (gamertag) {
                        chelLookupMutation.mutate({ gamertag, platform: 'PlayStation' });
                      }
                    }
                  }}
                />
                <Select defaultValue="PlayStation">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PlayStation">PlayStation</SelectItem>
                    <SelectItem value="Xbox">Xbox</SelectItem>
                    <SelectItem value="PC">PC</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Enter gamertag..."]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      chelLookupMutation.mutate({ 
                        gamertag: input.value.trim(), 
                        platform: 'PlayStation' 
                      });
                    }
                  }}
                  disabled={chelLookupMutation.isPending}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Lookup
                </Button>
              </div>

              {chelLookupResult && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                  <h4 className="font-semibold mb-3">{chelLookupResult.gamertag} Stats</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Games Played:</span>
                      <div className="font-semibold">{chelLookupResult.gamesPlayed || 0}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Goals:</span>
                      <div className="font-semibold">{chelLookupResult.goals || 0}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Assists:</span>
                      <div className="font-semibold">{chelLookupResult.assists || 0}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Points:</span>
                      <div className="font-semibold">{chelLookupResult.points || 0}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Wins:</span>
                      <div className="font-semibold">{chelLookupResult.wins || 0}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Losses:</span>
                      <div className="font-semibold">{chelLookupResult.losses || 0}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hits:</span>
                      <div className="font-semibold">{chelLookupResult.hits || 0}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Position:</span>
                      <div className="font-semibold">{chelLookupResult.position || 'N/A'}</div>
                    </div>
                  </div>
                  {chelLookupResult.clubName && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-muted-foreground">Club:</span>
                      <div className="font-semibold">{chelLookupResult.clubName}</div>
                    </div>
                  )}
                </div>
              )}

              {chelLookupMutation.isError && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  Player not found or error retrieving stats. Please check the gamertag and try again.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Trade Offer</CardTitle>
                <CardDescription>Propose a trade with another team</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...tradeForm}>
                  <form onSubmit={tradeForm.handleSubmit(onSubmitTrade)} className="space-y-4">
                    <FormField
                      control={tradeForm.control}
                      name="offeredPlayer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Player to Offer</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select player to offer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teamRoster.map((player: any) => (
                                <SelectItem key={player.id} value={player.id}>
                                  {player.name} ({player.position})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={tradeForm.control}
                      name="requestedPlayer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Player to Request</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter target player name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={tradeForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trade Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional details about the trade..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={createTradeMutation.isPending}>
                      {createTradeMutation.isPending ? "Submitting..." : "Submit Trade Offer"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trade Offers</CardTitle>
                <CardDescription>Review incoming and outgoing trade proposals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTrades.map((trade) => (
                    <div key={trade.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {trade.fromTeam} ↔ {trade.toTeam}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {trade.offeredPlayer} for {trade.requestedPlayer}
                          </p>
                          {trade.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{trade.notes}</p>
                          )}
                        </div>
                        <Badge variant="secondary">{trade.status}</Badge>
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => respondToTradeMutation.mutate({ tradeId: trade.id, action: "accept" })}
                          disabled={respondToTradeMutation.isPending}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => respondToTradeMutation.mutate({ tradeId: trade.id, action: "reject" })}
                          disabled={respondToTradeMutation.isPending}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <CardTitle>Team Finances</CardTitle>
              <CardDescription>Salary cap and budget management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-3xl font-bold">${(mockTeam.budget / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-muted-foreground">Salary Cap</div>
                </div>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-3xl font-bold">${(mockTeam.salaryCapUsed / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-muted-foreground">Used ({salaryCapUsage}%)</div>
                </div>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-3xl font-bold">${(capSpace / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-4">Salary Breakdown</h4>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Detailed salary breakdown will be available in future updates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Team Schedule</CardTitle>
              <CardDescription>Upcoming games and season calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Team schedule integration will be available soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Team Reports</CardTitle>
              <CardDescription>Performance analytics and scouting reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  AI-powered team analytics and scouting reports coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}