import { ai } from "../genkit";
import type { NewsRecapInput } from "@shared/schema";

export async function generateNewsRecap(input: NewsRecapInput) {
  const prompt = `You are an expert sports news writer. Generate a weekly news recap for the following entity:

Entity Type: ${input.entityType}
Entity Name: ${input.entityName}

Write a compelling and informative recap of the past week's events, including key developments, performances, trades, injuries, and other notable news.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return {
    recap: response.text || "Unable to generate news recap at this time."
  };
}
