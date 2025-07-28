import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, Calendar, User, Search, Filter, Eye, MessageSquare, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export function NewsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: news } = useQuery({
    queryKey: ["/api/news"],
  });

  // Mock news articles with images
  const mockNews = [
    {
      id: "1",
      title: "MVHL Season 1 Draft Results: Record-Breaking Selections",
      summary: "The inaugural MVHL draft saw unprecedented talent acquisition with 160 players selected across 5 rounds, setting new standards for virtual hockey leagues.",
      content: "Full draft analysis and team breakdowns...",
      author: "MVHL Staff",
      publishedAt: new Date("2024-01-28"),
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
      category: "Draft",
      views: 2847,
      comments: 45,
      featured: true
    },
    {
      id: "2", 
      title: "Colorado Avalanche Dominate Opening Week with Perfect 4-0 Record",
      summary: "The Avalanche showcased exceptional teamwork and strategy in their opening games, establishing themselves as early championship contenders.",
      content: "Game-by-game analysis of their dominant performance...",
      author: "Sarah Johnson",
      publishedAt: new Date("2024-01-27"),
      imageUrl: "https://images.unsplash.com/photo-1515703407324-5f753afd8e3e?w=800&h=400&fit=crop",
      category: "Game Recap",
      views: 1923,
      comments: 32,
      featured: true
    },
    {
      id: "3",
      title: "Trade Deadline Approaches: Top 10 Players on the Move",
      summary: "With the trade deadline just weeks away, several star players are generating significant interest across multiple teams.",
      content: "Analysis of potential trades and market values...",
      author: "Mike Chen",
      publishedAt: new Date("2024-01-26"),
      imageUrl: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800&h=400&fit=crop",
      category: "Trades",
      views: 3156,
      comments: 67,
      featured: false
    },
    {
      id: "4",
      title: "MVHL Player Spotlight: Rising Star Connor McDavid",
      summary: "An in-depth look at the Edmonton Oilers captain's incredible stats and leadership both on and off the virtual ice.",
      content: "Exclusive interview and performance analysis...",
      author: "Alex Rodriguez",
      publishedAt: new Date("2024-01-25"),
      imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop",
      category: "Player Spotlight",
      views: 1745,
      comments: 28,
      featured: false
    },
    {
      id: "5",
      title: "All-Star Weekend 2024: Event Schedule and Voting Results",
      summary: "The much-anticipated All-Star weekend promises exciting competitions and showcases of the league's top talent.",
      content: "Complete event breakdown and player selections...",
      author: "MVHL Staff",
      publishedAt: new Date("2024-01-24"),
      imageUrl: "https://images.unsplash.com/photo-1578928088499-e22e0b84e70b?w=800&h=400&fit=crop",
      category: "Events",
      views: 2341,
      comments: 41,
      featured: false
    },
    {
      id: "6",
      title: "Referee Technology Update: Enhanced Fair Play Systems",
      summary: "New AI-powered referee systems ensure consistent and fair gameplay across all MVHL matches.",
      content: "Technical details and implementation timeline...",
      author: "Tech Team",
      publishedAt: new Date("2024-01-23"),
      imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop",
      category: "Technology",
      views: 892,
      comments: 15,
      featured: false
    }
  ];

  const allNews = news ? [...(news as any), ...mockNews] : mockNews;

  const categories = ["all", "Draft", "Game Recap", "Trades", "Player Spotlight", "Events", "Technology"];

  const filteredNews = allNews.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = filteredNews.filter(article => article.featured);
  const regularNews = filteredNews.filter(article => !article.featured);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const NewsCard = ({ article, featured = false }: { article: any; featured?: boolean }) => (
    <Card className={`overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 ${
      featured ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/30' : 'bg-gray-800/50 border-gray-600/30'
    }`}>
      <div className="relative">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        {featured && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-black">
            Featured
          </Badge>
        )}
        <Badge 
          variant="secondary" 
          className="absolute top-3 right-3 bg-black/50 text-white border-none"
        >
          {article.category}
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className={`font-bold leading-tight ${featured ? 'text-xl text-white' : 'text-lg text-white'}`}>
            {article.title}
          </h3>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {article.summary}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{article.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-3 w-3" />
                <span>{article.comments}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3">
            <Link href={`/news/${article.id}`}>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Read More
              </Button>
            </Link>
            <Button size="sm" variant="outline">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Latest MVHL News</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest developments, player moves, and exciting moments from the MVHL
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Tabs defaultValue="latest" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="space-y-8">
            {/* Featured Articles */}
            {featuredNews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Newspaper className="h-6 w-6 mr-2 text-yellow-400" />
                  Featured Stories
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredNews.map(article => (
                    <NewsCard key={article.id} article={article} featured={true} />
                  ))}
                </div>
              </section>
            )}

            {/* Regular Articles */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Recent News</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularNews.map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="featured" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {featuredNews.map(article => (
                <NewsCard key={article.id} article={article} featured={true} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-8">
            {categories.filter(cat => cat !== "all").map(category => {
              const categoryNews = filteredNews.filter(article => article.category === category);
              if (categoryNews.length === 0) return null;
              
              return (
                <section key={category}>
                  <h2 className="text-2xl font-bold text-white mb-6">{category}</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryNews.map(article => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Newsletter Signup */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Stay In The Loop</h3>
              <p className="text-gray-300 mb-6">
                Subscribe to our newsletter for the latest MVHL updates delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Enter your email address"
                  className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}