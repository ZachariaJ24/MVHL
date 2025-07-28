import { ai } from "../genkit";
import type { DraftCommentaryInput } from "@shared/schema";

export async function generateDraftCommentary(input: DraftCommentaryInput) {
  const prompt = `You are a draft analyst for a major sports network.

Provide a multi-paragraph analysis of the following draft pick:

Pick Number: ${input.pickNumber}
Player Name: ${input.prospect}
Team: ${input.team}
Position: ${input.position}

Discuss the player's strengths, how they fit with the team, and the overall value of the pick.`;

  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const response = await ai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return {
    commentary: response.choices[0]?.message?.content || "Unable to generate commentary at this time."
  };
}
