import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Search, TrendingUp, User, MessageSquare, Plus, Sparkles, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NewsArticle, NewsGenerationInput } from "@shared/schema";

export function News() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerationDialogOpen, setIsGenerationDialogOpen] = useState(false);
  const [generationForm, setGenerationForm] = useState<NewsGenerationInput>({
    topic: "",
    category: "league-news",
    featured: false,
  });
  const { toast } = useToast();

  // Fetch news articles from API
  const { data: articles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  // Generate news article mutation
  const generateArticle = useMutation({
    mutationFn: async (input: NewsGenerationInput) => {
      return await apiRequest("/api/news/generate", "POST", input);
    },
    onSuccess: () => {
      toast({
        title: "Article Generated",
        description: "AI news article has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setIsGenerationDialogOpen(false);
      setGenerationForm({ topic: "", category: "league-news", featured: false });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate news article",
        variant: "destructive",
      });
    },
  });

  // Generate breaking news mutation
  const generateBreakingNews = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/news/generate-breaking", "POST", {});
    },
    onSuccess: () => {
      toast({
        title: "Breaking News Generated",
        description: "AI breaking news article has been created!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed", 
        description: error.message || "Failed to generate breaking news",
        variant: "destructive",
      });
    },
  });

  // Separate featured/breaking news from regular news
  const breakingNews = articles.filter(article => article.featured);
  const regularNews = articles.filter(article => !article.featured);

  const filteredNews = regularNews.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const NewsCard = ({ article, featured = false }: { article: NewsArticle, featured?: boolean }) => (
    <Card className={`hover:shadow-lg transition-shadow ${featured ? 'border-blue-500 bg-blue-50' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant={featured ? "default" : "secondary"}>
                {article.category}
              </Badge>
              {featured && <Badge variant="destructive">Breaking</Badge>}
            </div>
            <CardTitle className={`${featured ? 'text-xl' : 'text-lg'} leading-tight`}>
              {article.title}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-sm">
          {article.excerpt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>AI Reporter</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{getTimeSince(article.publishedAt?.toString() || article.createdAt.toString())}</span>
            </div>
            <span>{article.readTime}</span>
          </div>
          <Button variant="outline" size="sm">
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">MVHL News Center</h1>
        <p className="text-muted-foreground">
          Latest news, analysis, and updates from around the league
        </p>
        
        {/* AI Generation Controls */}
        <div className="flex justify-center space-x-4">
          <Dialog open={isGenerationDialogOpen} onOpenChange={setIsGenerationDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Generate Article
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <span>Generate AI News Article</span>
                </DialogTitle>
                <DialogDescription>
                  Create a new AI-generated news article for the MVHL
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Article Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., 'Recent trade activity analysis'"
                    value={generationForm.topic}
                    onChange={(e) => setGenerationForm(prev => ({ ...prev, topic: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={generationForm.category}
                    onValueChange={(value) => setGenerationForm(prev => ({ ...prev, category: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="trades">Trades</SelectItem>
                      <SelectItem value="standings">Standings</SelectItem>
                      <SelectItem value="players">Players</SelectItem>
                      <SelectItem value="analysis">Analysis</SelectItem>
                      <SelectItem value="league-news">League News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={generationForm.featured}
                    onCheckedChange={(checked) => setGenerationForm(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Feature as breaking news</Label>
                </div>
                <Button
                  onClick={() => generateArticle.mutate(generationForm)}
                  disabled={!generationForm.topic || generateArticle.isPending}
                  className="w-full"
                >
                  {generateArticle.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Article
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={() => generateBreakingNews.mutate()}
            disabled={generateBreakingNews.isPending}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            {generateBreakingNews.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Breaking News
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="latest" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="latest">Latest News</TabsTrigger>
          <TabsTrigger value="breaking">Breaking</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="latest" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Featured/Breaking News */}
              {breakingNews.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 text-red-500" />
                    <span>Breaking News</span>
                  </h2>
                  <div className="grid gap-6">
                    {breakingNews.map((article) => (
                      <NewsCard key={article.id} article={article} featured={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent News */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Recent News</h2>
                {filteredNews.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredNews.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No News Articles</h3>
                      <p className="text-muted-foreground mb-4">
                        No news articles found. Generate some AI content to get started!
                      </p>
                      <Button onClick={() => setIsGenerationDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Generate First Article
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="breaking" className="space-y-6">
          <div className="grid gap-6">
            {breakingNews.map((article) => (
              <NewsCard key={article.id} article={article} featured={true} />
            ))}
          </div>
          {breakingNews.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Breaking News</h3>
                <p className="text-muted-foreground">
                  Check back later for the latest breaking news and updates.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {articles.filter(article => article.category === "analysis").map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {articles.filter(article => article.category === "players").map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-blue-900">Stay Updated</h3>
            <p className="text-blue-800">
              Get the latest MVHL news delivered directly to your inbox
            </p>
            <div className="flex max-w-md mx-auto space-x-2">
              <Input placeholder="Enter your email" className="bg-white" />
              <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
            </div>
            <p className="text-xs text-blue-700">
              Unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}