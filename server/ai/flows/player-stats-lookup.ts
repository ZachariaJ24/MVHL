import { ai } from "../genkit";
import type { PlayerStatsInput } from "@shared/schema";

export async function lookupPlayerStats(input: PlayerStatsInput) {
  const prompt = `You are an API that generates plausible hockey video game stats for a player based on their gamertag.
Generate a comprehensive set of stats for a player with the gamertag: ${input.gamertag}.
Provide both skater and goalie stats, even if a player is primarily one or the other.
Ensure the stats are realistic for a skilled player.

Respond in JSON format with the following structure:
{
  "skaterStats": {
    "gamesPlayed": number,
    "goals": number,
    "assists": number,
    "points": number,
    "plusMinus": number,
    "penaltyMinutes": number,
    "hits": number,
    "blocks": number,
    "sog": number
  },
  "goalieStats": {
    "gamesPlayed": number,
    "wins": number,
    "losses": number,
    "otLosses": number,
    "gaa": number,
    "svPct": number
  }
}`;

  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const response = await ai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  try {
    const stats = JSON.parse(response.choices[0]?.message?.content || '{}');
    return stats;
  } catch (error) {
    return {
      skaterStats: {
        gamesPlayed: 0,
        goals: 0,
        assists: 0,
        points: 0,
        plusMinus: 0,
        penaltyMinutes: 0,
        hits: 0,
        blocks: 0,
        sog: 0
      },
      goalieStats: {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        otLosses: 0,
        gaa: 0,
        svPct: 0
      }
    };
  }
}
