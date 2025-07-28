import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  User,
  Calendar,
  FileText,
  Target
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface WaiverClaim {
  id: string;
  playerId: string;
  playerName: string;
  playerPosition: string;
  droppingTeamId: string;
  droppingTeamName: string;
  claimingTeamId?: string;
  claimingTeamName?: string;
  waiverPriority: number;
  status: 'active' | 'awarded' | 'expired' | 'cancelled';
  submittedAt: string;
  processDate: string;
  reason: string;
}

interface WaiversSystemProps {
  teamId?: string;
  showAllTeams?: boolean;
}

export function WaiversSystem({ teamId, showAllTeams = false }: WaiversSystemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [selectedWaiver, setSelectedWaiver] = useState<WaiverClaim | null>(null);

  const { data: waiverClaims, isLoading } = useQuery({
    queryKey: ["/api/waivers", teamId],
    queryFn: () => teamId 
      ? apiRequest("GET", `/api/waivers?teamId=${teamId}`)
      : apiRequest("GET", "/api/waivers")
  });

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: availablePlayers } = useQuery({
    queryKey: ["/api/players/available-for-waivers"],
  });

  const submitWaiverClaimMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/waivers/claim", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waivers"] });
      toast({
        title: "Waiver Claim Submitted",
        description: "Your waiver claim has been submitted successfully",
      });
      setIsClaimDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to submit waiver claim",
        variant: "destructive",
      });
    },
  });

  const cancelWaiverClaimMutation = useMutation({
    mutationFn: (claimId: string) => apiRequest("DELETE", `/api/waivers/${claimId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waivers"] });
      toast({
        title: "Claim Cancelled",
        description: "Waiver claim has been cancelled successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel waiver claim",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'awarded':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'expired':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'awarded':
        return <CheckCircle className="h-4 w-4" />;
      case 'expired':
        return <XCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTimeUntilProcess = (processDate: string) => {
    const now = new Date();
    const process = new Date(processDate);
    const diffMs = process.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours <= 0) return "Processing now";
    if (diffHours < 24) return `${diffHours} hours`;
    return `${Math.ceil(diffHours / 24)} days`;
  };

  const activeWaivers = Array.isArray(waiverClaims) ? waiverClaims.filter((claim: WaiverClaim) => claim.status === 'active') : [];
  const processedWaivers = Array.isArray(waiverClaims) ? waiverClaims.filter((claim: WaiverClaim) => 
    ['awarded', 'expired', 'cancelled'].includes(claim.status)
  ) : [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading waivers system...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Waivers System
              </CardTitle>
              <CardDescription>
                Claim players placed on waivers by other teams
              </CardDescription>
            </div>
            <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Target className="h-4 w-4 mr-2" />
                  Submit Claim
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Submit Waiver Claim</DialogTitle>
                  <DialogDescription>
                    Place a claim on a player currently on waivers
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="player">Available Players on Waivers</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select player to claim" />
                      </SelectTrigger>
                      <SelectContent>
                        {(availablePlayers || []).map((player: any) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name} - {player.position} (from {player.teamName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Claim Reason</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Why are you claiming this player?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="injury-replacement">Injury Replacement</SelectItem>
                        <SelectItem value="depth-signing">Depth Signing</SelectItem>
                        <SelectItem value="roster-improvement">Roster Improvement</SelectItem>
                        <SelectItem value="position-need">Position Need</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-400 mb-2">Waiver Priority Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Teams are ordered by waiver priority (worst record gets priority)</p>
                      <p>• Claims are processed at 2:00 PM EST daily</p>
                      <p>• If multiple teams claim the same player, highest priority wins</p>
                      <p>• Successfully claiming a player moves you to the back of the priority order</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsClaimDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Waiver claim submission is being implemented",
                      });
                    }}>
                      Submit Claim
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{activeWaivers.length}</div>
              <div className="text-sm text-muted-foreground">Active Claims</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {processedWaivers.filter(w => w.status === 'awarded').length}
              </div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-400">
                {processedWaivers.filter(w => w.status === 'expired').length}
              </div>
              <div className="text-sm text-muted-foreground">Expired</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {(availablePlayers || []).length}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Waivers Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Claims</TabsTrigger>
          <TabsTrigger value="available">Available Players</TabsTrigger>
          <TabsTrigger value="history">Claim History</TabsTrigger>
          <TabsTrigger value="priority">Waiver Priority</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeWaivers.length > 0 ? (
            <div className="grid gap-4">
              {activeWaivers.map((claim: WaiverClaim) => (
                <Card key={claim.id} className="hover:border-orange-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          {claim.playerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{claim.playerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {claim.playerPosition} • Dropped by {claim.droppingTeamName}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                          Priority #{claim.waiverPriority}
                        </Badge>
                        <Badge className={`${getStatusColor(claim.status)} flex items-center gap-1`}>
                          {getStatusIcon(claim.status)}
                          {claim.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <div className="text-sm text-muted-foreground">Submitted</div>
                        <div className="font-medium">{new Date(claim.submittedAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <div className="text-sm text-muted-foreground">Processing In</div>
                        <div className="font-medium text-orange-400">{getTimeUntilProcess(claim.processDate)}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <div className="text-sm text-muted-foreground">Reason</div>
                        <div className="font-medium">{claim.reason}</div>
                      </div>
                    </div>

                    {claim.claimingTeamName && (
                      <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                        <span className="text-muted-foreground">Claimed by:</span>
                        <span className="font-semibold text-orange-400">{claim.claimingTeamName}</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to cancel this waiver claim?")) {
                            cancelWaiverClaimMutation.mutate(claim.id);
                          }
                        }}
                      >
                        Cancel Claim
                      </Button>
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Claims</h3>
                <p className="text-muted-foreground mb-4">
                  You have no active waiver claims at this time
                </p>
                <Button onClick={() => setIsClaimDialogOpen(true)}>
                  <Target className="h-4 w-4 mr-2" />
                  Submit New Claim
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Available Players</h3>
              <p className="text-muted-foreground">
                Players currently available on waivers will be listed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {processedWaivers.length > 0 ? (
            <div className="grid gap-4">
              {processedWaivers.slice(0, 10).map((claim: WaiverClaim) => (
                <Card key={claim.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {claim.playerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{claim.playerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {claim.playerPosition} • {new Date(claim.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {claim.claimingTeamName && (
                          <div className="text-right text-sm">
                            <div className="font-medium">{claim.claimingTeamName}</div>
                            <div className="text-muted-foreground">Awarded to</div>
                          </div>
                        )}
                        <Badge className={`${getStatusColor(claim.status)} flex items-center gap-1`}>
                          {getStatusIcon(claim.status)}
                          {claim.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Claim History</h3>
                <p className="text-muted-foreground">
                  Your waiver claim history will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="priority" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Waiver Priority Order</CardTitle>
              <CardDescription>
                Teams are ordered by worst record (highest priority) to best record (lowest priority)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.isArray(teams) ? teams.slice(0, 10).map((team: any, index: number) => (
                  <div key={team.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        #{index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{team.city} {team.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {team.wins || 0}-{team.losses || 0}-{team.otLosses || 0} • {team.points || 0} PTS
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {index === 0 ? "Highest Priority" : index < 5 ? "High Priority" : "Lower Priority"}
                    </div>
                  </div>
                )) : []}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}