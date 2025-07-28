import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  draftCommentaryInputSchema,
  newsRecapInputSchema,
  scoutingReportInputSchema,
  playerStatsInputSchema,
  playerHeadshotInputSchema,
  type DraftCommentaryInput,
  type NewsRecapInput,
  type ScoutingReportInput,
  type PlayerStatsInput,
  type PlayerHeadshotInput,
} from "@shared/schema";

interface ToolFormsProps {
  selectedTool: string;
  onClose: () => void;
  onContentGenerated: (content: any) => void;
}

const toolTitles = {
  "draft-commentary": "Draft Commentary Generator",
  "news-recap": "News Recap Generator",
  "scouting-report": "Scouting Report Generator",
  "player-stats": "Player Stats Lookup",
  "player-headshot": "Player Headshot Generator",
};

export default function ToolForms({ selectedTool, onClose, onContentGenerated }: ToolFormsProps) {
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", `/api/ai/${selectedTool}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      onContentGenerated(data);
      toast({
        title: "Content Generated",
        description: "Your AI-powered content has been generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const renderForm = () => {
    switch (selectedTool) {
      case "draft-commentary":
        return <DraftCommentaryForm onSubmit={generateMutation.mutate} isLoading={generateMutation.isPending} />;
      case "news-recap":
        return <NewsRecapForm onSubmit={generateMutation.mutate} isLoading={generateMutation.isPending} />;
      case "scouting-report":
        return <ScoutingReportForm onSubmit={generateMutation.mutate} isLoading={generateMutation.isPending} />;
      case "player-stats":
        return <PlayerStatsForm onSubmit={generateMutation.mutate} isLoading={generateMutation.isPending} />;
      case "player-headshot":
        return <PlayerHeadshotForm onSubmit={generateMutation.mutate} isLoading={generateMutation.isPending} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{toolTitles[selectedTool as keyof typeof toolTitles]}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {renderForm()}
      </CardContent>
    </Card>
  );
}

function DraftCommentaryForm({ onSubmit, isLoading }: { onSubmit: (data: DraftCommentaryInput) => void; isLoading: boolean }) {
  const form = useForm<DraftCommentaryInput>({
    resolver: zodResolver(draftCommentaryInputSchema),
    defaultValues: {
      player_name: "",
      pick_number: 1,
      team_name: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="player_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter player name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pick_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pick Number</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter pick number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="team_name"
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          <Sparkles className="h-4 w-4 mr-2" />
          {isLoading ? "Generating..." : "Generate Commentary"}
        </Button>
      </form>
    </Form>
  );
}



function NewsRecapForm({ onSubmit, isLoading }: { onSubmit: (data: NewsRecapInput) => void; isLoading: boolean }) {
  const form = useForm<NewsRecapInput>({
    resolver: zodResolver(newsRecapInputSchema),
    defaultValues: {
      entityType: "team",
      entityName: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="entityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entity Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="league">League</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="entityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entity Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          <Sparkles className="h-4 w-4 mr-2" />
          {isLoading ? "Generating..." : "Generate Recap"}
        </Button>
      </form>
    </Form>
  );
}

function ScoutingReportForm({ onSubmit, isLoading }: { onSubmit: (data: ScoutingReportInput) => void; isLoading: boolean }) {
  const form = useForm<ScoutingReportInput>({
    resolver: zodResolver(scoutingReportInputSchema),
    defaultValues: {
      playerName: "",
      position: "",
      stats: {
        gamesPlayed: 0,
        goals: 0,
        assists: 0,
        points: 0,
        plusMinus: 0,
        penaltyMinutes: 0,
        hits: 0,
        blocks: 0,
        sog: 0,
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="playerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter player name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Enter position (C, LW, RW, LD, RD, G)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="stats.gamesPlayed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Games Played</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stats.goals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goals</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stats.assists"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assists</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          <Sparkles className="h-4 w-4 mr-2" />
          {isLoading ? "Generating..." : "Generate Report"}
        </Button>
      </form>
    </Form>
  );
}

function PlayerStatsForm({ onSubmit, isLoading }: { onSubmit: (data: PlayerStatsInput) => void; isLoading: boolean }) {
  const form = useForm<PlayerStatsInput>({
    resolver: zodResolver(playerStatsInputSchema),
    defaultValues: {
      gamertag: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="gamertag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gamertag</FormLabel>
              <FormControl>
                <Input placeholder="Enter player gamertag" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          <Sparkles className="h-4 w-4 mr-2" />
          {isLoading ? "Looking up..." : "Lookup Stats"}
        </Button>
      </form>
    </Form>
  );
}

function PlayerHeadshotForm({ onSubmit, isLoading }: { onSubmit: (data: PlayerHeadshotInput) => void; isLoading: boolean }) {
  const form = useForm<PlayerHeadshotInput>({
    resolver: zodResolver(playerHeadshotInputSchema),
    defaultValues: {
      player_name: "",
      team_name: "",
      position: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="player_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter player name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="team_name"
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
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Enter position" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          <Sparkles className="h-4 w-4 mr-2" />
          {isLoading ? "Generating..." : "Generate Headshot"}
        </Button>
      </form>
    </Form>
  );
}
