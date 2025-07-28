import { ai } from "../genkit";
import type { PlayerHeadshotInput } from "@shared/schema";

export async function generatePlayerHeadshot(input: PlayerHeadshotInput) {
  const prompt = `photorealistic headshot of a hockey player named ${input.player_name}, ${input.position} for the ${input.team_name}, looking at the camera, professional sports photography style`;

  try {
    const response = await ai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return {
      headshot_data_uri: response.data?.[0]?.url || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwQzExMC40NTcgMTAwIDExOSA5MS40NTY2IDExOSA4MEM4MSA2OC41NDMzIDExOSA1OC41NDMzIDEwMCA0OEM5MC41NDMzIDQ4IDg1IDU4LjU0MzMgODEgODBDODEgOTEuNDU2NiA4OS41NDMzIDEwMCAxMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K"
    };
  } catch (error) {
    console.error('Failed to generate headshot:', error);
    return {
      headshot_data_uri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwQzExMC40NTcgMTAwIDExOSA5MS40NTY2IDExOSA4MEM4MSA2OC41NDMzIDExOSA1OC41NDMzIDEwMCA0OEM5MC41NDMzIDQ4IDg1IDU4LjU0MzMgODEgODBDODEgOTEuNDU2NiA4OS41NDMzIDEwMCAxMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K"
    };
  }
}
