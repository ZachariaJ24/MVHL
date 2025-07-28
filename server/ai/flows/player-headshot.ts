import { ai } from "../genkit";
import { Modality } from "@google/genai";
import type { PlayerHeadshotInput } from "@shared/schema";

export async function generatePlayerHeadshot(input: PlayerHeadshotInput) {
  const prompt = `photorealistic headshot of a hockey player named ${input.player_name}, ${input.position} for the ${input.team_name}, looking at the camera`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('No image generated');
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error('No content in response');
    }

    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return {
          headshot_data_uri: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
        };
      }
    }

    throw new Error('No image data found');
  } catch (error) {
    console.error('Failed to generate headshot:', error);
    return {
      headshot_data_uri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwQzExMC40NTcgMTAwIDExOSA5MS40NTY2IDExOSA4MEM4MSA2OC41NDMzIDExOSA1OC41NDMzIDEwMCA0OEM5MC41NDMzIDQ4IDg1IDU4LjU0MzMgODEgODBDODEgOTEuNDU2NiA4OS41NDMzIDEwMCAxMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K"
    };
  }
}
