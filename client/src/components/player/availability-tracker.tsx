import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Calendar,
  Search,
  Filter
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PlayerAvailability {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  status: 'available' | 'unavailable' | 'limited' | 'questionable';
  reason?: string;
  notes?: string;
  estimatedReturn?: string;
  lastUpdated: string;
  position: string;
}

interface AvailabilityTrackerProps {
  teamId?: string;
  showAllTeams?: boolean;
}

export function AvailabilityTracker({ teamId, showAllTeams = false }: AvailabilityTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    status: string;
    notes: string;
    estimatedReturn: string;
  }>({
    status: "",
    notes: "",
    estimatedReturn: ""
  });

  const { data: availability, isLoading } = useQuery({
    queryKey: ["/api/player-availability", teamId],
    queryFn: async () => {
      const response = await apiRequest("GET", teamId 
        ? `/api/player-availability?teamId=${teamId}`
        : "/api/player-availability");
      return await response.json();
    }
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: async (data: { playerId: string; status: string; reason?: string; estimatedReturn?: string }) => {
      const response = await apiRequest("PUT", `/api/player-availability/${data.playerId}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/player-availability"] });
      toast({
        title: "Availability Updated",
        description: "Player availability status has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update player availability",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'unavailable':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'limited':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'questionable':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'unavailable':
        return <XCircle className="h-4 w-4" />;
      case 'limited':
        return <AlertTriangle className="h-4 w-4" />;
      case 'questionable':
        return <Clock className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const filteredAvailability = Array.isArray(availability) ? availability.filter((item: PlayerAvailability) => {
    const matchesSearch = item.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.teamName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesPosition = positionFilter === "all" || item.position === positionFilter;
    
    return matchesSearch && matchesStatus && matchesPosition;
  }) : [];

  const getStatusSummary = () => {
    if (!availability) return { available: 0, unavailable: 0, limited: 0, questionable: 0 };
    
    return Array.isArray(availability) ? availability.reduce((acc: any, item: PlayerAvailability) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, { available: 0, unavailable: 0, limited: 0, questionable: 0 }) : { available: 0, unavailable: 0, limited: 0, questionable: 0 };
  };

  const statusSummary = getStatusSummary();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading player availability...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Player Availability Tracker
          </CardTitle>
          <CardDescription>
            Monitor player availability status for lineup planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{statusSummary.available}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{statusSummary.limited}</div>
              <div className="text-sm text-muted-foreground">Limited</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{statusSummary.questionable}</div>
              <div className="text-sm text-muted-foreground">Questionable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{statusSummary.unavailable}</div>
              <div className="text-sm text-muted-foreground">Unavailable</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search players or teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="questionable">Questionable</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="C">Center (C)</SelectItem>
                <SelectItem value="LW">Left Wing (LW)</SelectItem>
                <SelectItem value="RW">Right Wing (RW)</SelectItem>
                <SelectItem value="LD">Left Defense (LD)</SelectItem>
                <SelectItem value="RD">Right Defense (RD)</SelectItem>
                <SelectItem value="G">Goalie (G)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Availability List */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Status</TabsTrigger>
          <TabsTrigger value="history">Recent Updates</TabsTrigger>
          <TabsTrigger value="schedule">Upcoming Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {filteredAvailability.length > 0 ? (
            <div className="grid gap-4">
              {filteredAvailability.map((item: PlayerAvailability) => (
                <Card key={item.id} className="hover:border-blue-500/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {item.playerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{item.playerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.teamName} • {item.position}
                          </div>
                          {item.reason && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {item.reason}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {item.estimatedReturn && (
                          <div className="text-right">
                            <div className="text-sm font-medium">Expected Return</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {item.estimatedReturn}
                            </div>
                          </div>
                        )}
                        
                        <Badge className={`${getStatusColor(item.status)} flex items-center gap-1`}>
                          {getStatusIcon(item.status)}
                          {item.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div>Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</div>
                        <Dialog onOpenChange={(open) => {
                          if (open) {
                            setFormData({
                              status: item.status,
                              notes: item.notes || "",
                              estimatedReturn: item.estimatedReturn || ""
                            });
                            setEditingPlayer(item.playerId);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Update Status
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Player Availability</DialogTitle>
                              <DialogDescription>
                                Update availability status for {item.playerName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="status">Status</Label>
                                <Select 
                                  defaultValue={item.status}
                                  onValueChange={(value) => setFormData({...formData, status: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="limited">Limited</SelectItem>
                                    <SelectItem value="questionable">Questionable</SelectItem>
                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea 
                                  placeholder="Add notes about the status update..."
                                  defaultValue={item.notes}
                                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="estimatedReturn">Estimated Return Date</Label>
                                <Input 
                                  type="date"
                                  defaultValue={item.estimatedReturn}
                                  onChange={(e) => setFormData({...formData, estimatedReturn: e.target.value})}
                                />
                              </div>
                              <Button 
                                className="w-full"
                                onClick={() => {
                                  updateAvailabilityMutation.mutate({
                                    playerId: item.playerId,
                                    status: formData.status || item.status,
                                    reason: formData.notes || item.notes,
                                    estimatedReturn: formData.estimatedReturn || item.estimatedReturn
                                  });
                                  setEditingPlayer(null);
                                  setFormData({ status: "", notes: "", estimatedReturn: "" });
                                }}
                                disabled={updateAvailabilityMutation.isPending}
                              >
                                {updateAvailabilityMutation.isPending ? "Updating..." : "Update Status"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Players Found</h3>
                <p className="text-muted-foreground">
                  No players match your current filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Recent Updates</h3>
              <p className="text-muted-foreground">
                Recent availability changes will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upcoming Returns</h3>
              <p className="text-muted-foreground">
                Players expected to return from injury will be listed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}