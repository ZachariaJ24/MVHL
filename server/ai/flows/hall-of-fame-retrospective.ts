import { ai } from "../genkit";
import type { HallOfFameInput } from "@shared/schema";

export async function generateHallOfFameRetrospective(input: HallOfFameInput) {
  const prompt = `You are a sports journalist specializing in hockey, and are writing a career retrospective for a Hall of Fame player.

Write a multi-paragraph career retrospective for the following player:

Player Name: ${input.playerName}

Focus on their career achievements, impact on the sport, memorable moments, and lasting legacy.`;

  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const response = await ai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return {
    retrospective: response.choices[0]?.message?.content || "Unable to generate retrospective at this time."
  };
}
