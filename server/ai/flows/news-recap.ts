import { ai } from "../genkit";
import type { NewsRecapInput } from "@shared/schema";

export async function generateNewsRecap(input: NewsRecapInput) {
  const prompt = `You are an expert sports news writer. Generate a weekly news recap based on the following information:

Game Results: ${input.gameResults}
Key Players: ${input.keyPlayers}

Write a compelling and informative recap of the past week's events, including key developments, performances, trades, injuries, and other notable news.`;

  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const response = await ai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return {
    recap: response.choices[0]?.message?.content || "Unable to generate news recap at this time."
  };
}
