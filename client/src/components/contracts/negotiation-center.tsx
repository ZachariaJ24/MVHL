import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  DollarSign, 
  FileText, 
  Clock, 
  TrendingUp, 
  User, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Handshake
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContractNegotiation {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  currentSalary: number;
  requestedSalary: number;
  proposedSalary: number;
  contractLength: number;
  status: 'pending' | 'approved' | 'rejected' | 'counter-offer' | 'expired';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface NegotiationCenterProps {
  teamId?: string;
  showAllTeams?: boolean;
}

export function NegotiationCenter({ teamId, showAllTeams = false }: NegotiationCenterProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedNegotiation, setSelectedNegotiation] = useState<ContractNegotiation | null>(null);

  const { data: negotiations, isLoading } = useQuery({
    queryKey: ["/api/contract-negotiations", teamId],
    queryFn: () => teamId 
      ? apiRequest("GET", `/api/contract-negotiations?teamId=${teamId}`)
      : apiRequest("GET", "/api/contract-negotiations")
  });

  const { data: players } = useQuery({
    queryKey: ["/api/players", teamId],
    queryFn: () => teamId 
      ? apiRequest("GET", `/api/players?teamId=${teamId}`)
      : apiRequest("GET", "/api/players")
  });

  const createNegotiationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/contract-negotiations", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contract-negotiations"] });
      toast({
        title: "Negotiation Started",
        description: "Contract negotiation has been initiated successfully",
      });
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to start contract negotiation",
        variant: "destructive",
      });
    },
  });

  const updateNegotiationMutation = useMutation({
    mutationFn: (data: { id: string; updates: any }) =>
      apiRequest("PUT", `/api/contract-negotiations/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contract-negotiations"] });
      toast({
        title: "Negotiation Updated",
        description: "Contract negotiation has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update contract negotiation",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'counter-offer':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'expired':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'counter-offer':
        return <AlertTriangle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'expired':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const activeNegotiations = (negotiations || []).filter((n: ContractNegotiation) => 
    ['pending', 'counter-offer'].includes(n.status)
  );

  const completedNegotiations = (negotiations || []).filter((n: ContractNegotiation) => 
    ['approved', 'rejected', 'expired'].includes(n.status)
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading contract negotiations...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="h-6 w-6" />
                Contract Negotiation Center
              </CardTitle>
              <CardDescription>
                Manage player contract negotiations and salary discussions
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <FileContract className="h-4 w-4 mr-2" />
                  Start Negotiation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Start Contract Negotiation</DialogTitle>
                  <DialogDescription>
                    Initiate a new contract negotiation with a player
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="player">Player</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select player" />
                        </SelectTrigger>
                        <SelectContent>
                          {(players || []).map((player: any) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} - {player.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-salary">Current Salary</Label>
                      <Input 
                        id="current-salary" 
                        type="number" 
                        placeholder="0" 
                        className="text-right"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="requested-salary">Requested Salary</Label>
                      <Input 
                        id="requested-salary" 
                        type="number" 
                        placeholder="0" 
                        className="text-right"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contract-length">Contract Length (Years)</Label>
                      <Input 
                        id="contract-length" 
                        type="number" 
                        placeholder="1" 
                        className="text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Negotiation Deadline</Label>
                    <Input 
                      id="deadline" 
                      type="date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Additional notes about the negotiation..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      // Create negotiation logic
                      toast({
                        title: "Coming Soon",
                        description: "Contract negotiation creation is being implemented",
                      });
                    }}>
                      Start Negotiation
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
              <div className="text-2xl font-bold text-blue-400">{activeNegotiations.length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {completedNegotiations.filter(n => n.status === 'approved').length}
              </div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {completedNegotiations.filter(n => n.status === 'rejected').length}
              </div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {activeNegotiations.filter(n => n.status === 'counter-offer').length}
              </div>
              <div className="text-sm text-muted-foreground">Counter Offers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Negotiations List */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Negotiations</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="templates">Contract Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeNegotiations.length > 0 ? (
            <div className="grid gap-4">
              {activeNegotiations.map((negotiation: ContractNegotiation) => (
                <Card key={negotiation.id} className="hover:border-green-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {negotiation.playerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{negotiation.playerName}</div>
                          <div className="text-sm text-muted-foreground">{negotiation.teamName}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(negotiation.priority)}>
                          {negotiation.priority.toUpperCase()}
                        </Badge>
                        <Badge className={`${getStatusColor(negotiation.status)} flex items-center gap-1`}>
                          {getStatusIcon(negotiation.status)}
                          {negotiation.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <div className="text-sm text-muted-foreground">Current Salary</div>
                        <div className="text-lg font-bold">{formatSalary(negotiation.currentSalary)}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <div className="text-sm text-muted-foreground">Requested Salary</div>
                        <div className="text-lg font-bold text-red-400">{formatSalary(negotiation.requestedSalary)}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/5">
                        <div className="text-sm text-muted-foreground">Team Offer</div>
                        <div className="text-lg font-bold text-green-400">{formatSalary(negotiation.proposedSalary)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {getDaysUntilDeadline(negotiation.deadline)} days remaining
                        </div>
                        <div className="flex items-center gap-1">
                          <FileContract className="h-4 w-4" />
                          {negotiation.contractLength} year contract
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Make Counter Offer
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Accept Terms
                        </Button>
                      </div>
                    </div>

                    {negotiation.notes && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          <strong>Notes:</strong> {negotiation.notes}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Handshake className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Negotiations</h3>
                <p className="text-muted-foreground mb-4">
                  Start a new contract negotiation to begin
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <FileContract className="h-4 w-4 mr-2" />
                  Start First Negotiation
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedNegotiations.length > 0 ? (
            <div className="grid gap-4">
              {completedNegotiations.map((negotiation: ContractNegotiation) => (
                <Card key={negotiation.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {negotiation.playerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{negotiation.playerName}</div>
                          <div className="text-sm text-muted-foreground">{negotiation.teamName}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <div className="font-medium">{formatSalary(negotiation.proposedSalary)}</div>
                          <div className="text-muted-foreground">{negotiation.contractLength} years</div>
                        </div>
                        <Badge className={`${getStatusColor(negotiation.status)} flex items-center gap-1`}>
                          {getStatusIcon(negotiation.status)}
                          {negotiation.status.replace('-', ' ').toUpperCase()}
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
                <FileContract className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Completed Negotiations</h3>
                <p className="text-muted-foreground">
                  Completed contract negotiations will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <FileContract className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Contract Templates</h3>
              <p className="text-muted-foreground">
                Pre-defined contract templates and salary guidelines will be available here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}