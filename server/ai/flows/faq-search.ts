import { ai } from "../genkit";

const FAQ_CONTENT = `
Frequently Asked Questions - Sports Analytics AI Platform

Q: How do I generate draft commentary?
A: Use the Draft Commentary tool by entering the player name, pick number, and team name. Our AI will analyze the selection and provide professional commentary.

Q: Can I create retrospectives for any player?
A: Yes, use the Hall of Fame Retrospective tool to generate career summaries for any player, whether they're Hall of Fame members or not.

Q: What types of entities can I generate news recaps for?
A: You can generate news recaps for leagues, teams, or individual players. Simply select the entity type and enter the name.

Q: How accurate are the scouting reports?
A: Our scouting reports are generated based on the statistics you provide and use advanced AI analysis to identify strengths and weaknesses.

Q: Can I generate player headshots?
A: Yes, our AI can generate realistic player headshots based on the player name, team, and position you provide.

Q: How do I look up player statistics?
A: Use the Stats Lookup tool with a player's gamertag to get comprehensive hockey statistics including both skater and goalie stats.

Q: Is there a limit to how much content I can generate?
A: There are no hard limits, but we recommend generating content responsibly and reviewing all AI-generated material.

Q: Can I save or export generated content?
A: Yes, all generated content can be copied or downloaded for your use.

Q: How recent is the data used for analysis?
A: Our AI uses training data up to its knowledge cutoff and generates analysis based on patterns and hockey expertise.

Q: Can I customize the analysis style?
A: Currently, our tools use professional sports analysis styles optimized for accuracy and readability.
`;

export async function searchFAQ(query: string) {
  const prompt = `You are an AI assistant that helps users find answers to their questions in the FAQ section of a sports analytics website.
You will be provided with the content of the FAQ and a search query from the user. Your task is to find the most relevant answer in the FAQ content and return it to the user.
If the answer is not found in the FAQ content, return a message saying that the answer is not found.

FAQ Content:
${FAQ_CONTENT}

Search Query:
${query}

Answer:`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return {
    answer: response.text || "I couldn't find an answer to your question in the FAQ."
  };
}
