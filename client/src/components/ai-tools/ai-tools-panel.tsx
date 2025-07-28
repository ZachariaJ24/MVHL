import { useState } from "react";
import { Brain, Users, Trophy, Newspaper, Target, BarChart3, Camera, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ToolForms from "./tool-forms";
import GeneratedContent from "./generated-content";

const tools = [
  {
    id: "draft-commentary",
    title: "Draft Commentary",
    description: "Generate professional draft pick analysis and commentary",
    icon: Users,
    color: "text-amber-500",
  },
  {
    id: "hall-of-fame",
    title: "Hall of Fame Retrospective",
    description: "Create career retrospectives for legendary players",
    icon: Trophy,
    color: "text-amber-500",
  },
  {
    id: "news-recap",
    title: "News Recap",
    description: "Weekly news recaps for teams, players, or leagues",
    icon: Newspaper,
    color: "text-amber-500",
  },
  {
    id: "scouting-report",
    title: "Scouting Report",
    description: "Detailed player analysis and scouting insights",
    icon: Target,
    color: "text-amber-500",
  },
  {
    id: "player-stats",
    title: "Stats Lookup",
    description: "Comprehensive player statistics and analysis",
    icon: BarChart3,
    color: "text-amber-500",
  },
  {
    id: "player-headshot",
    title: "Player Headshot",
    description: "Generate professional player headshots",
    icon: Camera,
    color: "text-amber-500",
  },
];

export default function AIToolsPanel() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setGeneratedContent(null);
  };

  const handleContentGenerated = (content: any) => {
    setGeneratedContent(content);
  };

  const handleClose = () => {
    setSelectedTool(null);
    setGeneratedContent(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            AI-Powered Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleToolSelect(tool.id)}
                >
                  <div className="flex items-center mb-3">
                    <IconComponent className={`h-5 w-5 mr-2 ${tool.color}`} />
                    <h3 className="font-medium text-gray-900">{tool.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  <div className="flex items-center text-sm text-primary">
                    <span>Generate Analysis</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedTool && (
        <ToolForms
          selectedTool={selectedTool}
          onClose={handleClose}
          onContentGenerated={handleContentGenerated}
        />
      )}

      {generatedContent && (
        <GeneratedContent content={generatedContent} />
      )}
    </div>
  );
}
