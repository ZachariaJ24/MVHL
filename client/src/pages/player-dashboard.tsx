import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Trophy, Calendar, TrendingUp, Edit, Camera, MessageSquare, Target, Send, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ChatMessage } from "@/components/ui/chat-message";

const availabilitySchema = z.object({
  availability: z.enum(["available", "maybe", "unavailable"]),
  bio: z.string().min(1, "Bio is required"),
});

const headshotSchema = z.object({
  prompt: z.string().min(1, "Description is required"),
});

const messageSchema = z.object({
  message: z.string().min(1, "Message is required"),
  type: z.enum(["discussion", "announcement", "urgent"]).default("discussion"),
});

export function PlayerDashboard() {
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeMessageTab, setActiveMessageTab] = useState("team");
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock player data since we don't have real auth yet
  const mockPlayer = {
    id: "player-1",
    name: "Alex Rodriguez",
    number: 91,
    position: "C",
    teamId: "team-1",
    availability: "available" as const,
    bio: "Veteran center with 5 years experience in competitive hockey",
    gamesPlayed: 45,
    goals: 18,
    assists: 24,
    points: 42,
    plusMinus: 8,
    penaltyMinutes: 12,
    hits: 89,
    blocks: 23,
    sog: 156,
  };

  const mockTeam = {
    id: "team-1",
    city: "Boston",
    name: "Bruins",
    abbreviation: "BOS",
  };

  const availabilityForm = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      availability: mockPlayer.availability,
      bio: mockPlayer.bio,
    },
  });

  const headshotForm = useForm({
    resolver: zodResolver(headshotSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const messageForm = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
      type: "discussion" as const,
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", `/api/players/${mockPlayer.id}`, data),
    onSuccess: () => {
      toast({ title: "Profile updated successfully" });
      setEditingProfile(false);
    },
  });

  const generateHeadshotMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/ai/player-headshot", data),
    onSuccess: () => {
      toast({ title: "Headshot generated successfully" });
    },
  });

  const onUpdateAvailability = (data: any) => {
    updatePlayerMutation.mutate(data);
  };

  const onGenerateHeadshot = (data: any) => {
    const payload = {
      playerName: mockPlayer.name,
      description: data.prompt,
    };
    generateHeadshotMutation.mutate(payload);
  };

  const getSeasonStats = () => {
    const gamesPlayed = mockPlayer.gamesPlayed;
    const pointsPerGame = gamesPlayed > 0 ? (mockPlayer.points / gamesPlayed).toFixed(2) : "0.00";
    const shooting = mockPlayer.sog > 0 ? ((mockPlayer.goals / mockPlayer.sog) * 100).toFixed(1) : "0.0";
    
    return {
      gamesPlayed,
      pointsPerGame,
      shootingPct: shooting,
    };
  };

  const seasonStats = getSeasonStats();

  if (!user || user.role !== "player") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Player Dashboard</h1>
          <p className="text-muted-foreground">Please log in as a player to access this dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <User className="h-8 w-8 mr-3 text-blue-600" />
          Player Dashboard
        </h1>
        <p className="text-muted-foreground">Manage your profile and track your performance</p>
      </div>

      {/* Player Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {mockPlayer.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{mockPlayer.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                <Badge variant="outline">#{mockPlayer.number}</Badge>
                <Badge>{mockPlayer.position}</Badge>
                <Badge variant="secondary">{mockTeam.city} {mockTeam.name}</Badge>
                <Badge variant={
                  mockPlayer.availability === "available" ? "default" :
                  mockPlayer.availability === "maybe" ? "secondary" : "destructive"
                }>
                  {mockPlayer.availability}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2">{mockPlayer.bio}</p>
            </div>

            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Generate Headshot
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate AI Headshot</DialogTitle>
                    <DialogDescription>
                      Describe how you want your professional headshot to look
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...headshotForm}>
                    <form onSubmit={headshotForm.handleSubmit(onGenerateHeadshot)} className="space-y-4">
                      <FormField
                        control={headshotForm.control}
                        name="prompt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="e.g., Professional hockey player headshot, confident expression, team jersey..."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={generateHeadshotMutation.isPending}>
                        {generateHeadshotMutation.isPending ? "Generating..." : "Generate Headshot"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingProfile(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Season Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPlayer.points}</div>
            <p className="text-xs text-muted-foreground">
              {mockPlayer.goals}G, {mockPlayer.assists}A
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">League Rank</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#15</div>
            <p className="text-xs text-muted-foreground">
              of 640 players
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Games Played</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seasonStats.gamesPlayed}</div>
            <p className="text-xs text-muted-foreground">
              {seasonStats.pointsPerGame} PPG
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plus/Minus</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPlayer.plusMinus > 0 ? '+' : ''}{mockPlayer.plusMinus}
            </div>
            <p className="text-xs text-muted-foreground">
              {seasonStats.shootingPct}% shooting
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Player Information</CardTitle>
              <CardDescription>Manage your availability and profile details</CardDescription>
            </CardHeader>
            <CardContent>
              {editingProfile ? (
                <Form {...availabilityForm}>
                  <form onSubmit={availabilityForm.handleSubmit(onUpdateAvailability)} className="space-y-4">
                    <FormField
                      control={availabilityForm.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="maybe">Maybe</SelectItem>
                              <SelectItem value="unavailable">Unavailable</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={availabilityForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tell us about yourself..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={updatePlayerMutation.isPending}>
                        {updatePlayerMutation.isPending ? "Updating..." : "Update Profile"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setEditingProfile(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Position</label>
                      <p className="text-sm text-muted-foreground">{mockPlayer.position}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Jersey Number</label>
                      <p className="text-sm text-muted-foreground">#{mockPlayer.number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Team</label>
                      <p className="text-sm text-muted-foreground">
                        {mockTeam.city} {mockTeam.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Availability</label>
                      <p className="text-sm text-muted-foreground capitalize">{mockPlayer.availability}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <p className="text-sm text-muted-foreground">{mockPlayer.bio}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Season Statistics</CardTitle>
              <CardDescription>Your performance this season</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mockPlayer.gamesPlayed}</div>
                  <div className="text-sm text-muted-foreground">Games Played</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mockPlayer.goals}</div>
                  <div className="text-sm text-muted-foreground">Goals</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mockPlayer.assists}</div>
                  <div className="text-sm text-muted-foreground">Assists</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mockPlayer.points}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mockPlayer.plusMinus > 0 ? '+' : ''}{mockPlayer.plusMinus}</div>
                  <div className="text-sm text-muted-foreground">+/-</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mockPlayer.penaltyMinutes}</div>
                  <div className="text-sm text-muted-foreground">PIM</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mockPlayer.hits}</div>
                  <div className="text-sm text-muted-foreground">Hits</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mockPlayer.sog}</div>
                  <div className="text-sm text-muted-foreground">SOG</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Games</CardTitle>
              <CardDescription>Your team's schedule and recent results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Next Game */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">Next Game</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">vs Toronto Maple Leafs</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Tonight, 7:00 PM ET</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Home</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">TD Garden</div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Games */}
                <div className="space-y-2">
                  <h4 className="font-medium">This Week</h4>
                  {[
                    { opponent: "@ Montreal Canadiens", date: "Jan 30", time: "7:30 PM", status: "upcoming" },
                    { opponent: "vs New York Rangers", date: "Feb 2", time: "7:00 PM", status: "upcoming" },
                    { opponent: "@ Buffalo Sabres", date: "Feb 5", time: "7:00 PM", status: "upcoming" },
                  ].map((game, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{game.opponent}</div>
                        <div className="text-sm text-muted-foreground">{game.date} • {game.time}</div>
                      </div>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                  ))}
                </div>

                {/* Recent Results */}
                <div className="space-y-2">
                  <h4 className="font-medium">Recent Results</h4>
                  {[
                    { opponent: "vs Pittsburgh Penguins", date: "Jan 25", result: "W 4-2", status: "win" },
                    { opponent: "@ Detroit Red Wings", date: "Jan 22", result: "L 2-3", status: "loss" },
                    { opponent: "vs Ottawa Senators", date: "Jan 20", result: "W 5-1", status: "win" },
                  ].map((game, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{game.opponent}</div>
                        <div className="text-sm text-muted-foreground">{game.date}</div>
                      </div>
                      <Badge variant={game.status === "win" ? "default" : "destructive"}>
                        {game.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Game Availability</CardTitle>
              <CardDescription>Set your availability for upcoming games</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Next Game Availability */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">Next Game</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">vs Toronto Maple Leafs • Tonight, 7:00 PM</p>
                    </div>
                    <Select defaultValue="available">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="maybe">Maybe</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Upcoming Games Availability */}
                <div className="space-y-3">
                  <h4 className="font-medium">Upcoming Games</h4>
                  {[
                    { opponent: "@ Montreal Canadiens", date: "Jan 30", time: "7:30 PM", availability: "available" },
                    { opponent: "vs New York Rangers", date: "Feb 2", time: "7:00 PM", availability: "maybe" },
                    { opponent: "@ Buffalo Sabres", date: "Feb 5", time: "7:00 PM", availability: "unavailable" },
                    { opponent: "vs Tampa Bay Lightning", date: "Feb 8", time: "7:00 PM", availability: null },
                    { opponent: "@ Florida Panthers", date: "Feb 10", time: "7:30 PM", availability: null },
                  ].map((game, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{game.opponent}</div>
                        <div className="text-sm text-muted-foreground">{game.date} • {game.time}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {game.availability && (
                          <div className="flex items-center space-x-1 mr-2">
                            {game.availability === "available" && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {game.availability === "maybe" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                            {game.availability === "unavailable" && <XCircle className="h-4 w-4 text-red-500" />}
                            <span className="text-sm capitalize text-muted-foreground">{game.availability}</span>
                          </div>
                        )}
                        <Select defaultValue={game.availability || "not-set"}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="maybe">Maybe</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                            <SelectItem value="not-set">Not Set</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        Update Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Player Availability</DialogTitle>
                        <DialogDescription>
                          Set your availability status and update your bio
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...availabilityForm}>
                        <form onSubmit={availabilityForm.handleSubmit(onUpdateAvailability)} className="space-y-4">
                          <FormField
                            control={availabilityForm.control}
                            name="availability"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Availability Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="maybe">Maybe</SelectItem>
                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={availabilityForm.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Player Bio</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Update your player bio..."
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full" disabled={updatePlayerMutation.isPending}>
                            {updatePlayerMutation.isPending ? "Updating..." : "Update Status"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <div className="space-y-6">
            {/* Message Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span>Send Message</span>
                </CardTitle>
                <CardDescription>Send a message to your team</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...messageForm}>
                  <form onSubmit={messageForm.handleSubmit((data) => {
                    toast({ title: "Message sent successfully" });
                    messageForm.reset();
                  })} className="space-y-4">
                    <FormField
                      control={messageForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="discussion">Discussion</SelectItem>
                              <SelectItem value="announcement">Announcement</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={messageForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Type your message to the team..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Team Messages</CardTitle>
                <CardDescription>Recent conversations with your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Messages List */}
                  {[
                    {
                      id: 1,
                      sender: "Coach Johnson",
                      type: "announcement",
                      message: "Practice moved to 6 PM tomorrow due to rink maintenance. Please arrive 15 minutes early for equipment check.",
                      timestamp: "2 hours ago",
                      isRead: false
                    },
                    {
                      id: 2,
                      sender: "Captain Mike",
                      type: "discussion",
                      message: "Great game tonight everyone! Let's keep this momentum going into the next match. Defense was solid and offense was clicking.",
                      timestamp: "5 hours ago",
                      isRead: true
                    },
                    {
                      id: 3,
                      sender: "Manager Steve",
                      type: "urgent",
                      message: "Emergency team meeting at 3 PM today in the conference room. All players must attend.",
                      timestamp: "1 day ago",
                      isRead: true
                    },
                    {
                      id: 4,
                      sender: "Assistant Coach Wilson",
                      type: "discussion",
                      message: "Film session scheduled for Thursday at 4 PM. We'll be reviewing power play formations and defensive zone coverage.",
                      timestamp: "2 days ago",
                      isRead: true
                    },
                    {
                      id: 5,
                      sender: "Trainer Sarah",
                      type: "announcement",
                      message: "Reminder: All players need to complete their fitness assessments by Friday. Please schedule with me if you haven't already.",
                      timestamp: "3 days ago",
                      isRead: true
                    }
                  ].map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-4 rounded-lg border ${
                        !message.isRead ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{message.sender}</span>
                          <Badge 
                            variant={
                              message.type === "urgent" ? "destructive" :
                              message.type === "announcement" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {message.type}
                          </Badge>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{message.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>
                
                {/* Load More */}
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    Load More Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}