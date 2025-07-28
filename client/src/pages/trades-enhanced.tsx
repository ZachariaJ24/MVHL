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
import { Handshake, ArrowLeftRight, CheckCircle, XCircle, Clock, Users, TrendingUp } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const tradeOfferSchema = z.object({
  fromTeamId: z.string().min(1, "From team is required"),
  toTeamId: z.string().min(1, "To team is required"),
  offeredPlayer: z.string().min(1, "Please select a player to offer"),
  requestedPlayer: z.string().min(1, "Please select a player to request"),
  notes: z.string().optional(),
});

export function TradesEnhanced() {
  const [selectedTab, setSelectedTab] = useState("create");
  const { toast } = useToast();

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: players } = useQuery({
    queryKey: ["/api/players"],
  });

  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
  });

  const tradeForm = useForm<z.infer<typeof tradeOfferSchema>>({
    resolver: zodResolver(tradeOfferSchema),
  });

  const createTradeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof tradeOfferSchema>) => {
      return apiRequest("/api/trades", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Trade Offer Created",
        description: "Your trade offer has been sent successfully.",
      });
      tradeForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create trade offer.",
        variant: "destructive",
      });
    },
  });

  const respondToTradeMutation = useMutation({
    mutationFn: async ({ tradeId, action }: { tradeId: string; action: "accept" | "reject" }) => {
      return apiRequest(`/api/trades/${tradeId}`, "PATCH", { status: action === "accept" ? "accepted" : "rejected" });
    },
    onSuccess: (_, { action }) => {
      toast({
        title: action === "accept" ? "Trade Accepted" : "Trade Rejected",
        description: `Trade offer has been ${action}ed.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
    },
  });

  const onSubmitTrade = (data: z.infer<typeof tradeOfferSchema>) => {
    createTradeMutation.mutate(data);
  };

  const mockTeam = {
    id: "mock-team-1",
    name: "Boston Bruins",
    city: "Boston",
    abbreviation: "BOS",
  };

  const teamRoster = [
    { id: "p1", name: "Brad Marchand", position: "LW", points: 45, salary: 6125000 },
    { id: "p2", name: "David Pastrnak", position: "RW", points: 52, salary: 11250000 },
    { id: "p3", name: "Patrice Bergeron", position: "C", points: 38, salary: 5000000 },
    { id: "p4", name: "Charlie McAvoy", position: "D", points: 28, salary: 9500000 },
    { id: "p5", name: "Jeremy Swayman", position: "G", points: 0, salary: 3400000 },
  ];

  const incomingTrades = (trades as any)?.filter((t: any) => t.toTeamId === mockTeam.id && t.status === "pending") || [];
  const outgoingTrades = (trades as any)?.filter((t: any) => t.fromTeamId === mockTeam.id && t.status === "pending") || [];
  const completedTrades = (trades as any)?.filter((t: any) => (t.fromTeamId === mockTeam.id || t.toTeamId === mockTeam.id) && t.status !== "pending") || [];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trade Center</h1>
        <p className="text-muted-foreground">Manage trade offers and negotiations</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Offer</TabsTrigger>
          <TabsTrigger value="incoming">
            Incoming ({incomingTrades.length})
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            Outgoing ({outgoingTrades.length})
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Handshake className="h-5 w-5" />
                <span>Create Trade Offer</span>
              </CardTitle>
              <CardDescription>
                Propose a trade with another team using player dropdowns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...tradeForm}>
                <form onSubmit={tradeForm.handleSubmit(onSubmitTrade)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Your Team Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Your Team</h3>
                      
                      <FormField
                        control={tradeForm.control}
                        name="fromTeamId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From Team</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={mockTeam.id}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your team" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={mockTeam.id}>{mockTeam.name}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                                {teamRoster.map((player) => (
                                  <SelectItem key={player.id} value={player.id}>
                                    <div className="flex items-center justify-between w-full">
                                      <span>{player.name}</span>
                                      <div className="flex items-center space-x-2 ml-4">
                                        <Badge variant="outline" className="text-xs">{player.position}</Badge>
                                        <span className="text-xs text-muted-foreground">
                                          ${(player.salary / 1000000).toFixed(1)}M
                                        </span>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Target Team Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Target Team</h3>
                      
                      <FormField
                        control={tradeForm.control}
                        name="toTeamId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>To Team</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select target team" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(teams as any)?.filter((t: any) => t.id !== mockTeam.id).map((team: any) => (
                                  <SelectItem key={team.id} value={team.id}>
                                    {team.name}
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
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select player to request" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(players as any)?.filter((p: any) => p.teamId !== mockTeam.id).map((player: any) => (
                                  <SelectItem key={player.id} value={player.id}>
                                    <div className="flex items-center justify-between w-full">
                                      <span>{player.name}</span>
                                      <div className="flex items-center space-x-2 ml-4">
                                        <Badge variant="outline" className="text-xs">{player.position}</Badge>
                                        <span className="text-xs text-muted-foreground">
                                          {player.points}pts
                                        </span>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={tradeForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trade Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add any additional comments or conditions..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={createTradeMutation.isPending}>
                    {createTradeMutation.isPending ? "Creating..." : "Send Trade Offer"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowLeftRight className="h-5 w-5" />
                <span>Incoming Trade Offers</span>
              </CardTitle>
              <CardDescription>
                Review and respond to trade offers from other teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incomingTrades.length > 0 ? (
                <div className="space-y-4">
                  {incomingTrades.map((trade: any) => (
                    <div key={trade.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">From: {trade.fromTeam || "Unknown Team"}</Badge>
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Offering:</span> {trade.offeredPlayerName || "Unknown Player"}
                            <span className="mx-2">→</span>
                            <span className="font-medium">For:</span> {trade.requestedPlayerName || "Unknown Player"}
                          </div>
                          {trade.notes && (
                            <p className="text-sm text-muted-foreground">{trade.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => respondToTradeMutation.mutate({ tradeId: trade.id, action: "accept" })}
                            disabled={respondToTradeMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => respondToTradeMutation.mutate({ tradeId: trade.id, action: "reject" })}
                            disabled={respondToTradeMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Handshake className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No incoming trade offers</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Outgoing Trade Offers</span>
              </CardTitle>
              <CardDescription>
                Track your sent trade offers and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {outgoingTrades.length > 0 ? (
                <div className="space-y-4">
                  {outgoingTrades.map((trade: any) => (
                    <div key={trade.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">To: {trade.toTeam || "Unknown Team"}</Badge>
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Offering:</span> {trade.offeredPlayerName || "Unknown Player"}
                            <span className="mx-2">→</span>
                            <span className="font-medium">For:</span> {trade.requestedPlayerName || "Unknown Player"}
                          </div>
                          {trade.notes && (
                            <p className="text-sm text-muted-foreground">{trade.notes}</p>
                          )}
                        </div>
                        <Button size="sm" variant="outline">
                          Cancel Offer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No outgoing trade offers</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>Completed and rejected trade offers</CardDescription>
            </CardHeader>
            <CardContent>
              {completedTrades.length > 0 ? (
                <div className="space-y-4">
                  {completedTrades.map((trade: any) => (
                    <div key={trade.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={trade.status === "accepted" ? "default" : "destructive"}>
                              {trade.status === "accepted" ? "Completed" : "Rejected"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(trade.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Teams:</span> {trade.fromTeam} ↔ {trade.toTeam}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Players:</span> {trade.offeredPlayerName} ↔ {trade.requestedPlayerName}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No trade history</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}