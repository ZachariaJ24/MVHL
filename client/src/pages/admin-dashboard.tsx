import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Settings, Users, GamepadIcon, Crown, Shield, Trash2, Edit, Plus, AlertTriangle, 
  Camera, Newspaper, BarChart3, UserCog, Calendar, BarChart2, ImageIcon, 
  Play, Pause, SkipForward, StopCircle, Gavel 
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useDraftWebSocket } from "@/hooks/use-draft-websocket";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schemas for form validation
const teamUpdateSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  city: z.string().min(1, "City is required"),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters").max(3, "Abbreviation must be at most 3 characters"),
  division: z.string().min(1, "Division is required"),
});

const userManagementSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  roles: z.array(z.string()).min(1, "Please select at least one role"),
  teamId: z.string().optional(),
});

const scheduleSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  days: z.array(z.string()).min(1, "Select at least one day"),
  timeSlots: z.array(z.string()).min(1, "Add at least one time slot"),
});

const gameStatsSchema = z.object({
  gameId: z.string().min(1, "Please select a game"),
  homeScore: z.number().min(0),
  awayScore: z.number().min(0),
  notes: z.string().optional(),
});

const newsGeneratorSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  category: z.enum(['draft', 'trades', 'standings', 'players', 'analysis', 'league-news']),
  featured: z.boolean().default(false),
});

export function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [generatedNews, setGeneratedNews] = useState<string>("");
  const [draftTimer, setDraftTimer] = useState<number>(0);
  const [timeSlots, setTimeSlots] = useState<string[]>(["19:00", "20:00", "21:00"]);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize forms at component level
  const userForm = useForm<z.infer<typeof userManagementSchema>>({
    resolver: zodResolver(userManagementSchema),
    defaultValues: { userId: "", roles: [], teamId: "none" }
  });

  const teamForm = useForm<z.infer<typeof teamUpdateSchema>>({
    resolver: zodResolver(teamUpdateSchema),
    defaultValues: { name: "", city: "", abbreviation: "", division: "" }
  });

  const scheduleForm = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { startDate: "", endDate: "", days: [], timeSlots: [] }
  });

  const gameStatsForm = useForm<z.infer<typeof gameStatsSchema>>({
    resolver: zodResolver(gameStatsSchema),
    defaultValues: { gameId: "", homeScore: 0, awayScore: 0, notes: "" }
  });

  const newsForm = useForm<z.infer<typeof newsGeneratorSchema>>({
    resolver: zodResolver(newsGeneratorSchema),
    defaultValues: { topic: "", category: "league-news" as const, featured: false }
  });
  
  // Connect to WebSocket for real-time draft updates
  useDraftWebSocket();

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: players } = useQuery({
    queryKey: ["/api/players"],
  });

  const { data: games } = useQuery({
    queryKey: ["/api/games"],
  });

  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: activity } = useQuery({
    queryKey: ["/api/activity"],
  });

  const { data: draftSettings } = useQuery({
    queryKey: ["/api/draft/settings"],
  });

  const { data: usersData } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => apiRequest(`/api/admin/users/${userId}`, "DELETE"),
    onSuccess: () => {
      toast({ title: "User deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const changeUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => 
      apiRequest(`/api/admin/users/${userId}/role`, "PUT", { role }),
    onSuccess: () => {
      toast({ title: "User role updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const userManagementMutation = useMutation({
    mutationFn: (data: z.infer<typeof userManagementSchema>) => 
      apiRequest(`/api/admin/users/${data.userId}`, "PUT", { 
        roles: data.roles, 
        teamId: data.teamId === "none" ? null : data.teamId 
      }),
    onSuccess: () => {
      toast({ title: "User updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      userForm.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update user", 
        description: error?.message || "An error occurred",
        variant: "destructive" 
      });
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ teamId, teamData }: { teamId: string; teamData: any }) => 
      apiRequest(`/api/teams/${teamId}`, "PUT", teamData),
    onSuccess: () => {
      toast({ title: "Team updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      teamForm.reset();
      setEditingTeam(null);
    },
    onError: () => {
      toast({ title: "Failed to update team", variant: "destructive" });
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: (teamData: z.infer<typeof teamUpdateSchema>) => 
      apiRequest(`/api/teams`, "POST", teamData),
    onSuccess: () => {
      toast({ title: "Team created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      teamForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to create team", variant: "destructive" });
    },
  });

  // Draft timer effect
  useEffect(() => {
    if ((draftSettings as any)?.isActive && draftTimer > 0) {
      const interval = setInterval(() => {
        setDraftTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [(draftSettings as any)?.isActive, draftTimer]);

  // News generation mutation
  const generateNewsMutation = useMutation({
    mutationFn: (data: z.infer<typeof newsGeneratorSchema>) => 
      apiRequest("/api/news/generate", "POST", data),
    onSuccess: (data: any) => {
      setGeneratedNews(data.content || "News recap generated successfully!");
      toast({ title: "News recap generated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to generate news recap", variant: "destructive" });
    },
  });



  // Schedule generation mutation
  const scheduleGenerationMutation = useMutation({
    mutationFn: (data: z.infer<typeof scheduleSchema>) =>
      apiRequest("/api/schedule/generate", "POST", data),
    onSuccess: () => {
      toast({ title: "Schedule generated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
    },
    onError: () => {
      toast({ title: "Failed to generate schedule", variant: "destructive" });
    },
  });

  // Game stats mutation
  const gameStatsMutation = useMutation({
    mutationFn: (data: z.infer<typeof gameStatsSchema>) =>
      apiRequest(`/api/games/${data.gameId}/stats`, "PUT", data),
    onSuccess: () => {
      toast({ title: "Game stats updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
    },
    onError: () => {
      toast({ title: "Failed to update game stats", variant: "destructive" });
    },
  });

  const ImageUploadRow = ({ label, description, onFileSelect }: { 
    label: string; 
    description: string; 
    onFileSelect: (file: File) => void; 
  }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <Label className="font-medium">{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex space-x-2">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById(`file-${label.replace(/\s+/g, '-').toLowerCase()}`)?.click()}
        >
          Choose File
        </Button>
        <Button>Save</Button>
      </div>
    </div>
  );

  const TeamEditForm = ({ team, onClose }: { team: any; onClose: () => void }) => {
    const form = useForm({
      resolver: zodResolver(teamUpdateSchema),
      defaultValues: {
        name: team.name,
        city: team.city,
        abbreviation: team.abbreviation,
        division: team.division,
      },
    });

    const onSubmit = (data: z.infer<typeof teamUpdateSchema>) => {
      updateTeamMutation.mutate({ teamId: team.id, teamData: data });
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="abbreviation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abbreviation</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="division"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Division</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-2">
            <Button type="submit" disabled={updateTeamMutation.isPending} className="flex-1">
              {updateTeamMutation.isPending ? "Updating..." : "Update Team"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  const changeUserRole = (userId: string, role: string) => {
    changeUserRoleMutation.mutate({ userId, role });
  };

  const addPlayerMutation = useMutation({
    mutationFn: (playerData: any) => apiRequest("/api/players", "POST", playerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      setIsAddPlayerOpen(false);
      toast({
        title: "Player added successfully",
        description: "The new player has been added to the team roster.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add player",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const draftActionMutation = useMutation({
    mutationFn: (actionData: { action: string; settings?: any }) => 
      apiRequest("/api/draft/action", "POST", { ...actionData, userId: user?.id }),
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

  const toggleDraft = () => {
    const action = (draftSettings as any)?.isActive ? 'pause' : 'start';
    draftActionMutation.mutate({ action });
  };

  const advanceDraftPick = () => {
    draftActionMutation.mutate({ action: 'advance' });
  };

  const resetDraft = () => {
    draftActionMutation.mutate({ action: 'reset' });
  };

  const freeAgents = (players as any[])?.filter((p: any) => !p.teamId) || [];
  const activeGames = (games as any[])?.filter((g: any) => g.status === "live") || [];
  const pendingTrades = (trades as any[])?.filter((t: any) => t.status === "pending") || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <Shield className="h-8 w-8 mr-3 text-blue-600" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">League management and administrative controls</p>
      </div>

      {user?.role !== "admin" && (
        <Card className="border-destructive">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground">You need admin privileges to access this page</p>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role === "admin" && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(teams as any[])?.length || 0}</div>
                <p className="text-xs text-muted-foreground">League teams</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Free Agents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{freeAgents.length}</div>
                <p className="text-xs text-muted-foreground">Unassigned players</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Live Games</CardTitle>
                <GamepadIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeGames.length}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Trades</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTrades.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="user_management" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="user_management">
                <Users className="h-4 w-4 mr-2" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="team_management">
                <Shield className="h-4 w-4 mr-2" />
                Team Management
              </TabsTrigger>
              <TabsTrigger value="schedule_management">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="game_stats">
                <BarChart2 className="h-4 w-4 mr-2" />
                Game Stats
              </TabsTrigger>
              <TabsTrigger value="image_management">
                <ImageIcon className="h-4 w-4 mr-2" />
                Images
              </TabsTrigger>
              <TabsTrigger value="news_generator">
                <Newspaper className="h-4 w-4 mr-2" />
                News Generator
              </TabsTrigger>
              <TabsTrigger value="draft_management">
                <Gavel className="h-4 w-4 mr-2" />
                Draft Control
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: User Management */}
            <TabsContent value="user_management" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user roles and team assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...userForm}>
                    <form onSubmit={userForm.handleSubmit((data) => userManagementMutation.mutate(data))} className="space-y-4">
                          <FormField
                            control={userForm.control}
                            name="userId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Select User</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose a user" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {(usersData as any[])?.filter(user => user.id && user.id.trim() !== '').map((user) => (
                                      <SelectItem key={user.id} value={user.id}>
                                        {user.email || user.username || `User ${user.id.slice(0, 8)}`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userForm.control}
                            name="roles"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assign Roles</FormLabel>
                                <div className="grid grid-cols-2 gap-4">
                                  {["player", "agm", "gm", "owner", "admin"].map((role) => (
                                    <FormItem key={role} className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(role)}
                                          onCheckedChange={(checked) => {
                                            const currentRoles = field.value || [];
                                            if (checked) {
                                              field.onChange([...currentRoles, role]);
                                            } else {
                                              field.onChange(currentRoles.filter((v: string) => v !== role));
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal capitalize">{role}</FormLabel>
                                    </FormItem>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userForm.control}
                            name="teamId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assign Team (Optional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose a team" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="none">No Team Assignment</SelectItem>
                                    {(teams as any[])?.filter(team => team.id && team.id.trim() !== '').map((team) => (
                                      <SelectItem key={team.id} value={team.id}>
                                        {team.city} {team.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                      <Button 
                        type="submit" 
                        disabled={userManagementMutation.isPending}
                      >
                        {userManagementMutation.isPending ? "Saving..." : "Save User"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Team Management */}
            <TabsContent value="team_management" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>Create or edit teams</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...teamForm}>
                    <form onSubmit={teamForm.handleSubmit((data) => {
                      if (editingTeam) {
                        updateTeamMutation.mutate({ teamId: editingTeam.id, teamData: data });
                      } else {
                        createTeamMutation.mutate(data);
                      }
                    })} className="space-y-4">
                      <div>
                        <Label>Select Team</Label>
                        <Select onValueChange={(value) => {
                          if (value === "new") {
                            setEditingTeam(null);
                            teamForm.reset();
                          } else {
                            const team = (teams as any[])?.find(t => t.id === value);
                            if (team) {
                              setEditingTeam(team);
                              teamForm.setValue("name", team.name || "");
                              teamForm.setValue("city", team.city || "");
                              teamForm.setValue("abbreviation", team.abbreviation || "");
                              teamForm.setValue("division", team.division || "");
                            }
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="-- Create New Team --" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">-- Create New Team --</SelectItem>
                            {(teams as any[])?.filter(team => team.id && team.id.trim() !== '').map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.city} {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                        
                      <FormField
                        control={teamForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={teamForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter team name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={teamForm.control}
                        name="abbreviation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Abbreviation</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter team abbreviation (e.g. BOS)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={teamForm.control}
                        name="division"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Division</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select division" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Atlantic">Atlantic</SelectItem>
                                <SelectItem value="Metropolitan">Metropolitan</SelectItem>
                                <SelectItem value="Central">Central</SelectItem>
                                <SelectItem value="Pacific">Pacific</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex space-x-2">
                        <Button type="submit" disabled={updateTeamMutation.isPending || createTeamMutation.isPending}>
                          {(updateTeamMutation.isPending || createTeamMutation.isPending) 
                            ? "Saving..." 
                            : editingTeam ? "Update Team" : "Create Team"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => {
                          setEditingTeam(null);
                          teamForm.reset();
                        }}>
                          Clear
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Schedule Management */}
            <TabsContent value="schedule_management" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mass Generate Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mass Generate Schedule</CardTitle>
                    <CardDescription>Generate multiple games at once</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...scheduleForm}>
                      <form onSubmit={scheduleForm.handleSubmit((data) => {
                        scheduleGenerationMutation.mutate(data);
                      })} className="space-y-4">
                        
                        <FormField
                          control={scheduleForm.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={scheduleForm.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div>
                          <Label>Days of Week</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                              <div key={day} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={day} 
                                  onCheckedChange={(checked) => {
                                    const currentDays = scheduleForm.getValues("days") || [];
                                    if (checked) {
                                      scheduleForm.setValue("days", [...currentDays, day]);
                                    } else {
                                      scheduleForm.setValue("days", currentDays.filter(d => d !== day));
                                    }
                                  }}
                                />
                                <Label htmlFor={day} className="text-sm">{day}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Time Slots</Label>
                          {timeSlots.map((time, index) => (
                            <Input 
                              key={index} 
                              type="time" 
                              defaultValue={time} 
                              className="mt-2"
                              onChange={(e) => {
                                const currentSlots = scheduleForm.getValues("timeSlots") || [];
                                const newSlots = [...currentSlots];
                                newSlots[index] = e.target.value;
                                scheduleForm.setValue("timeSlots", newSlots);
                              }}
                            />
                          ))}
                        </div>
                        
                        <Button type="submit" disabled={scheduleGenerationMutation.isPending}>
                          {scheduleGenerationMutation.isPending ? "Generating..." : "Generate Schedule"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Create Playoff Series Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Create Playoff Series</CardTitle>
                    <CardDescription>Set up playoff matchups</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Team 1</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose team 1" />
                        </SelectTrigger>
                        <SelectContent>
                          {(teams as any[])?.filter(team => team.id && team.id.trim() !== '').map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.city} {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Team 2</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose team 2" />
                        </SelectTrigger>
                        <SelectContent>
                          {(teams as any[])?.filter(team => team.id && team.id.trim() !== '').map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.city} {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Series Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Series Start Time</Label>
                      <Input type="time" />
                    </div>
                    <Button onClick={() => toast({ title: "Playoff series created!" })}>
                      Create Playoff Series
                    </Button>
                  </CardContent>
                </Card>

                {/* Single Game Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Create Single Game</CardTitle>
                    <CardDescription>Schedule an individual game</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Home Team</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose home team" />
                        </SelectTrigger>
                        <SelectContent>
                          {(teams as any[])?.filter(team => team.id && team.id.trim() !== '').map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.city} {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Away Team</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose away team" />
                        </SelectTrigger>
                        <SelectContent>
                          {(teams as any[])?.filter(team => team.id && team.id.trim() !== '').map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.city} {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Game Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Game Time</Label>
                      <Input type="time" />
                    </div>
                    <Button onClick={() => toast({ title: "Game created successfully!" })}>
                      Create Game
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 4: Game Stats Management */}
            <TabsContent value="game_stats" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Game Stats Management</CardTitle>
                  <CardDescription>Edit stats for completed games</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...gameStatsForm}>
                    <form onSubmit={gameStatsForm.handleSubmit((data) => {
                      gameStatsMutation.mutate(data);
                    })} className="space-y-4">
                      
                      <FormField
                        control={gameStatsForm.control}
                        name="gameId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Completed Game</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a completed game" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(games as any[])?.filter(g => g.status === "completed" && g.id && g.id.trim() !== '').map((game) => (
                                  <SelectItem key={game.id} value={game.id}>
                                    Game {game.id.slice(0, 8)} - {game.homeScore || 0} vs {game.awayScore || 0}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={gameStatsForm.control}
                          name="homeScore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Home Score</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  placeholder="0" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={gameStatsForm.control}
                          name="awayScore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Away Score</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  placeholder="0" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={gameStatsForm.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Game Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter game summary or notes..." 
                                rows={4} 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={gameStatsMutation.isPending}>
                        {gameStatsMutation.isPending ? "Saving..." : "Save Game Stats"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 5: Image Management */}
            <TabsContent value="image_management" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Image Management</CardTitle>
                  <CardDescription>Update key site images</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploadRow
                    label="Home Page Hero"
                    description="Main banner image for the homepage"
                    onFileSelect={(file) => toast({ title: `Selected ${file.name}` })}
                  />
                  
                  <div className="space-y-2">
                    <Label>Team Logos</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose team for logo upload" />
                      </SelectTrigger>
                      <SelectContent>
                        {(teams as any[])?.filter(team => team.id && team.id.trim() !== '').map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.city} {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ImageUploadRow
                      label="Team Logo"
                      description="Upload logo for selected team"
                      onFileSelect={(file) => toast({ title: `Selected ${file.name}` })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Player Headshots</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose player for headshot upload" />
                      </SelectTrigger>
                      <SelectContent>
                        {(players as any[])?.filter(player => player.id && player.id.trim() !== '').slice(0, 10).map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ImageUploadRow
                      label="Player Headshot"
                      description="Upload headshot for selected player"
                      onFileSelect={(file) => toast({ title: `Selected ${file.name}` })}
                    />
                  </div>
                  
                  <ImageUploadRow
                    label="Site Logo"
                    description="Main site logo"
                    onFileSelect={(file) => toast({ title: `Selected ${file.name}` })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 6: News Generator */}
            <TabsContent value="news_generator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>News Generator</CardTitle>
                  <CardDescription>Generate AI-powered news recaps</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...newsForm}>
                    <form onSubmit={newsForm.handleSubmit((data) => {
                      generateNewsMutation.mutate(data);
                    })} className="space-y-4">
                      
                      <FormField
                        control={newsForm.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>News Topic</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter the news topic..." 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={newsForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="trades">Trades</SelectItem>
                                <SelectItem value="standings">Standings</SelectItem>
                                <SelectItem value="players">Players</SelectItem>
                                <SelectItem value="analysis">Analysis</SelectItem>
                                <SelectItem value="league-news">League News</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={newsForm.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Article</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={generateNewsMutation.isPending}>
                        {generateNewsMutation.isPending ? "Generating..." : "Generate Recap"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Generated Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg min-h-32">
                    {generatedNews || "AI-generated daily news recap will appear here."}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 7: Draft Management */}
            <TabsContent value="draft_management" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Control</CardTitle>
                  <CardDescription>Manage the live draft process</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Draft Status Display */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">Draft Status: {(draftSettings as any)?.isActive ? "In Progress" : "Not Started"}</h3>
                          <p className="text-muted-foreground">
                            Current Pick: {(draftSettings as any)?.currentPick || 1} | Round: {(draftSettings as any)?.currentRound || 1}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">BOS</span>
                            </div>
                            <span className="font-medium">Boston Bruins On the Clock</span>
                          </div>
                          
                          <div className="text-2xl font-bold">
                            {Math.floor(draftTimer / 60).toString().padStart(2, '0')}:
                            {(draftTimer % 60).toString().padStart(2, '0')}
                          </div>
                          
                          <Progress value={((300 - draftTimer) / 300) * 100} className="w-64 mx-auto" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Control Buttons */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => {
                        setDraftTimer(300);
                        toast({ title: "Draft started!" });
                      }}
                      disabled={(draftSettings as any)?.isActive}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Draft
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => toast({ title: (draftSettings as any)?.isActive ? "Draft paused" : "Draft resumed" })}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      {(draftSettings as any)?.isActive ? "Pause" : "Resume"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => toast({ title: "Advanced to next pick" })}
                      disabled={!(draftSettings as any)?.isActive}
                    >
                      <SkipForward className="h-4 w-4 mr-2" />
                      Next Pick
                    </Button>
                    
                    <Button
                      variant="destructive"
                      onClick={() => toast({ title: "Draft ended" })}
                      disabled={(draftSettings as any)?.status === "finished"}
                    >
                      <StopCircle className="h-4 w-4 mr-2" />
                      End Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>



          </Tabs>
        </>
      )}
    </div>
  );
}
