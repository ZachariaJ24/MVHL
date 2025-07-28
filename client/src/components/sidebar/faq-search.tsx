import { useState } from "react";
import { HelpCircle, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function FaqSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/ai/faq-search", { query });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data.answer);
    },
    onError: () => {
      setResult("Sorry, I couldn't search the FAQ at this time.");
    },
  });

  const handleSearch = () => {
    if (query.trim()) {
      searchMutation.mutate(query);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="h-5 w-5 mr-2 text-primary" />
          AI FAQ Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Ask any question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="text-sm"
          />
          <Button 
            onClick={handleSearch} 
            disabled={searchMutation.isPending || !query.trim()}
            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
            variant="secondary"
          >
            <Search className="h-4 w-4 mr-2" />
            {searchMutation.isPending ? "Searching..." : "Search FAQ"}
          </Button>
        </div>
        {result && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
