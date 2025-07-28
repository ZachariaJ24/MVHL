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

  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const response = await ai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return {
    scoutingReport: response.choices[0]?.message?.content || "Unable to generate scouting report at this time."
  };
}
