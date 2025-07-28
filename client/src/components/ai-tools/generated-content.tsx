import { Copy, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GeneratedContentProps {
  content: any;
}

export default function GeneratedContent({ content }: GeneratedContentProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    const textContent = getTextContent(content);
    if (textContent) {
      navigator.clipboard.writeText(textContent);
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard.",
      });
    }
  };

  const handleDownload = () => {
    const textContent = getTextContent(content);
    if (textContent) {
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-content.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Download started",
        description: "Content is being downloaded as a text file.",
      });
    }
  };

  const getTextContent = (content: any): string => {
    if (content.commentary) return content.commentary;
    if (content.retrospective) return content.retrospective;
    if (content.recap) return content.recap;
    if (content.scoutingReport) return content.scoutingReport;
    if (content.skaterStats || content.goalieStats) {
      return JSON.stringify(content, null, 2);
    }
    return JSON.stringify(content, null, 2);
  };

  const renderContent = () => {
    if (content.headshot_data_uri) {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <img 
              src={content.headshot_data_uri} 
              alt="Generated player headshot" 
              className="mx-auto rounded-lg max-w-xs"
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            AI-generated player headshot
          </p>
        </div>
      );
    }

    if (content.skaterStats || content.goalieStats) {
      return (
        <div className="space-y-4">
          {content.skaterStats && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Skater Statistics</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Games Played: {content.skaterStats.gamesPlayed}</div>
                <div>Goals: {content.skaterStats.goals}</div>
                <div>Assists: {content.skaterStats.assists}</div>
                <div>Points: {content.skaterStats.points}</div>
                <div>Plus/Minus: {content.skaterStats.plusMinus}</div>
                <div>PIM: {content.skaterStats.penaltyMinutes}</div>
                <div>Hits: {content.skaterStats.hits}</div>
                <div>Blocks: {content.skaterStats.blocks}</div>
                <div>SOG: {content.skaterStats.sog}</div>
              </div>
            </div>
          )}
          {content.goalieStats && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Goalie Statistics</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Games Played: {content.goalieStats.gamesPlayed}</div>
                <div>Wins: {content.goalieStats.wins}</div>
                <div>Losses: {content.goalieStats.losses}</div>
                <div>OT Losses: {content.goalieStats.otLosses}</div>
                <div>GAA: {content.goalieStats.gaa?.toFixed(2)}</div>
                <div>Save %: {content.goalieStats.svPct?.toFixed(3)}</div>
              </div>
            </div>
          )}
        </div>
      );
    }

    const textContent = getTextContent(content);
    return (
      <div className="text-gray-700 whitespace-pre-wrap">
        {textContent}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Generated Content</CardTitle>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy to clipboard">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} title="Download">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
}
