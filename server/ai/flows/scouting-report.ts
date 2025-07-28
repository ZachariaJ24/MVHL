import { ai } from "../genkit";
import type { ScoutingReportInput } from "@shared/schema";

export async function generateScoutingReport(input: ScoutingReportInput) {
  const prompt = `You are an expert hockey scout. Generate a scouting report for the following player:

Player Name: ${input.playerName}
Position: ${input.position}

Statistics:
- Games Played: ${input.stats.gamesPlayed}
- Goals: ${input.stats.goals}
- Assists: ${input.stats.assists}
- Points: ${input.stats.points}
- Plus/Minus: ${input.stats.plusMinus}
- Penalty Minutes: ${input.stats.penaltyMinutes}
- Hits: ${input.stats.hits}
- Blocks: ${input.stats.blocks}
- Shots on Goal: ${input.stats.sog}

Write a concise scouting report (approximately 3-4 paragraphs) highlighting the player's strengths and weaknesses based on the provided statistics.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return {
    scoutingReport: response.text || "Unable to generate scouting report at this time."
  };
}
