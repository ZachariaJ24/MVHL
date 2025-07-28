import { ai } from "../genkit";
import type { HallOfFameInput } from "@shared/schema";

export async function generateHallOfFameRetrospective(input: HallOfFameInput) {
  const prompt = `You are a sports journalist specializing in hockey, and are writing a career retrospective for a Hall of Fame player.

Write a multi-paragraph career retrospective for the following player:

Player Name: ${input.playerName}

Focus on their career achievements, impact on the sport, memorable moments, and lasting legacy.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return {
    retrospective: response.text || "Unable to generate retrospective at this time."
  };
}
