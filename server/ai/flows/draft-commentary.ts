import { ai } from "../genkit";
import type { DraftCommentaryInput } from "@shared/schema";

export async function generateDraftCommentary(input: DraftCommentaryInput) {
  const prompt = `You are a draft analyst for a major sports network.

Provide a multi-paragraph analysis of the following draft pick:

Pick Number: ${input.pick_number}
Player Name: ${input.player_name}
Team: ${input.team_name}

Discuss the player's strengths, how they fit with the team, and the overall value of the pick.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return {
    commentary: response.text || "Unable to generate commentary at this time."
  };
}
