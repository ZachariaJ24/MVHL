import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});

interface NewsGenerationResult {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  tags: string[];
}

export async function generateNewsArticle(topic: string, category: string): Promise<NewsGenerationResult> {
  try {
    const systemPrompt = `You are a professional hockey sports journalist writing for the MVHL (Major Virtual Hockey League). 
Create a comprehensive news article based on the provided topic. The article should be:
- Professional and engaging
- Hockey-focused with authentic sports terminology
- Include realistic details and statistics
- Written in a journalistic style
- Appropriate for the ${category} category

Respond with JSON in this exact format:
{
  "title": "compelling headline",
  "excerpt": "brief 1-2 sentence summary",
  "content": "full article content (300-500 words)",
  "readTime": "X min read",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const prompt = `Write a hockey news article about: ${topic}

Category: ${category}
League: MVHL (Major Virtual Hockey League)

Include relevant hockey statistics, team information, and player details that would be realistic for a professional hockey league.`;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const rawJson = response.choices[0]?.message?.content;
    if (rawJson) {
      const result: NewsGenerationResult = JSON.parse(rawJson);
      return {
        ...result,
        category
      };
    } else {
      throw new Error("Empty response from AI model");
    }
  } catch (error) {
    console.error("News generation error:", error);
    throw new Error(`Failed to generate news article: ${error}`);
  }
}

export async function generateBreakingNews(teams: any[], recentGames: any[]): Promise<NewsGenerationResult> {
  try {
    const topTeams = teams.slice(0, 5).map(t => `${t.city} ${t.name} (${t.points} pts)`).join(", ");
    
    const prompt = `Generate breaking news for MVHL based on current league standings and recent activity.

Top teams: ${topTeams}
Recent games: ${recentGames.length} games played recently

Create compelling breaking news about playoff races, standout performances, or significant league developments.`;

    return await generateNewsArticle(prompt, "breaking");
  } catch (error) {
    throw new Error(`Failed to generate breaking news: ${error}`);
  }
}

export async function generateTradeAnalysis(tradeData: any): Promise<NewsGenerationResult> {
  const prompt = `Analyze this recent MVHL trade and provide expert commentary on its impact:

${JSON.stringify(tradeData, null, 2)}

Include analysis of team needs, player values, and playoff implications.`;

  return await generateNewsArticle(prompt, "trades");
}

export async function generateStandingsUpdate(standings: any[]): Promise<NewsGenerationResult> {
  const prompt = `Create a standings update article for MVHL covering current playoff race and divisional battles.

Current standings data: ${JSON.stringify(standings, null, 2)}

Focus on tight races, playoff positioning, and teams fighting for spots.`;

  return await generateNewsArticle(prompt, "standings");
}