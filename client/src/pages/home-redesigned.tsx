import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, Calendar, TrendingUp, Star, Users, Play, 
  ChevronLeft, ChevronRight, Eye, MessageSquare, Share2,
  ArrowRight, Target, Award, Crown, Zap, BarChart3
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export function HomeRedesigned() {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const { data: teams } = useQuery({ queryKey: ["/api/teams"] });
  const { data: games } = useQuery({ queryKey: ["/api/games"] });
  const { data: recentGames } = useQuery({ queryKey: ["/api/games/recent"] });
  const { data: stats } = useQuery({ queryKey: ["/api/stats"] });

  // Mock recent match results with realistic data
  const recentMatches = [
    {
      id: "1",
      homeTeam: "Colorado Avalanche",
      awayTeam: "Vegas Golden Knights",
      homeScore: 4,
      awayScore: 1,
      gameDate: new Date("2024-01-29T21:00:00"),
      status: "completed",
      highlights: ["McDavid 2G 1A", "MacKinnon Hat Trick", "Makar 3A"],
      venue: "Ball Arena",
      attendance: 18086
    },
    {
      id: "2", 
      homeTeam: "Tampa Bay Lightning",
      awayTeam: "Florida Panthers",
      homeScore: 3,
      awayScore: 2,
      gameDate: new Date("2024-01-29T19:30:00"),
      status: "completed",
      highlights: ["Kucherov GWG", "Vasilevskiy 31 saves", "OT Winner"],
      venue: "Amalie Arena",
      attendance: 19092
    },
    {
      id: "3",
      homeTeam: "Boston Bruins", 
      awayTeam: "Toronto Maple Leafs",
      homeScore: 5,
      awayScore: 2,
      gameDate: new Date("2024-01-28T19:00:00"),
      status: "completed",
      highlights: ["Pastrnak 2G", "Marchand 3A", "Swayman Shutout"],
      venue: "TD Garden",
      attendance: 17565
    }
  ];

  // Mock league standings (points-based, no divisions)
  const leagueStandings = [
    { rank: 1, team: "Colorado Avalanche", city: "Colorado", wins: 26, losses: 6, otLosses: 2, points: 54, streak: "W5" },
    { rank: 2, team: "Florida Panthers", city: "Florida", wins: 25, losses: 7, otLosses: 2, points: 52, streak: "W3" },
    { rank: 3, team: "Boston Bruins", city: "Boston", wins: 24, losses: 8, otLosses: 2, points: 50, streak: "W4" },
    { rank: 4, team: "Minnesota Wild", city: "Minnesota", wins: 23, losses: 8, otLosses: 3, points: 49, streak: "L1" },
    { rank: 5, team: "Vegas Golden Knights", city: "Vegas", wins: 23, losses: 9, otLosses: 2, points: 48, streak: "W2" },
    { rank: 6, team: "Toronto Maple Leafs", city: "Toronto", wins: 22, losses: 9, otLosses: 3, points: 47, streak: "L2" },
    { rank: 7, team: "Edmonton Oilers", city: "Edmonton", wins: 22, losses: 10, otLosses: 2, points: 46, streak: "W1" },
    { rank: 8, team: "Tampa Bay Lightning", city: "Tampa Bay", wins: 21, losses: 10, otLosses: 3, points: 45, streak: "W2" }
  ];

  // Mock latest news
  const latestNews = [
    {
      id: "1",
      title: "MVHL Season 1 Draft Results: Record-Breaking Selections",
      summary: "The inaugural MVHL draft saw unprecedented talent acquisition with 160 players selected.",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop",
      publishedAt: new Date("2024-01-28"),
      author: "MVHL Staff",
      views: 2847,
      comments: 45
    },
    {
      id: "2",
      title: "Trade Deadline Approaches: Top 10 Players on the Move",
      summary: "Several star players generating significant interest across multiple teams.",
      imageUrl: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=600&h=300&fit=crop",
      publishedAt: new Date("2024-01-27"),
      author: "Mike Chen",
      views: 3156,
      comments: 67
    },
    {
      id: "3",
      title: "All-Star Weekend 2024: Event Schedule and Voting Results",
      summary: "The much-anticipated All-Star weekend promises exciting competitions.",
      imageUrl: "https://images.unsplash.com/photo-1578928088499-e22e0b84e70b?w=600&h=300&fit=crop",
      publishedAt: new Date("2024-01-26"),
      author: "MVHL Staff",
      views: 2341,
      comments: 41
    }
  ];

  const nextMatch = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % recentMatches.length);
  };

  const prevMatch = () => {
    setCurrentMatchIndex((prev) => (prev - 1 + recentMatches.length) % recentMatches.length);
  };

  const nextNews = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % latestNews.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + latestNews.length) % latestNews.length);
  };

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextMatch();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="container mx-auto px-6 py-16 relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Welcome to the <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">MVHL</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                The Premier Virtual Hockey League - Where Skills Meet Competition
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{stats?.totalTeams || 32}</div>
                <div className="text-sm text-gray-300">Teams</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{stats?.totalPlayers || 480}</div>
                <div className="text-sm text-gray-300">Players</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{stats?.totalGames || 15}</div>
                <div className="text-sm text-gray-300">Games</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-300">Active</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/draft-central">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                  <Play className="h-5 w-5 mr-2" />
                  Join Draft Central
                </Button>
              </Link>
              <Link href="/standings-bracket">
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3">
                  <Trophy className="h-5 w-5 mr-2" />
                  View Standings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 space-y-16">
        {/* Recent Match Results Carousel */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Trophy className="h-8 w-8 mr-3 text-yellow-400" />
              Recent Match Results
            </h2>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={prevMatch}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={nextMatch}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/30 overflow-hidden">
            <CardContent className="p-8">
              {recentMatches[currentMatchIndex] && (
                <div className="space-y-6">
                  {/* Game Score */}
                  <div className="text-center space-y-4">
                    <div className="text-sm text-gray-400">{formatDate(recentMatches[currentMatchIndex].gameDate)} • {recentMatches[currentMatchIndex].venue}</div>
                    
                    <div className="flex items-center justify-center space-x-8">
                      {/* Away Team */}
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                          <span className="text-white font-bold text-sm">
                            {recentMatches[currentMatchIndex].awayTeam.substring(0, 3).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-white font-semibold">{recentMatches[currentMatchIndex].awayTeam}</div>
                        <div className="text-4xl font-bold text-white mt-2">{recentMatches[currentMatchIndex].awayScore}</div>
                      </div>

                      {/* VS */}
                      <div className="text-gray-400 text-xl font-bold">VS</div>

                      {/* Home Team */}
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                          <span className="text-white font-bold text-sm">
                            {recentMatches[currentMatchIndex].homeTeam.substring(0, 3).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-white font-semibold">{recentMatches[currentMatchIndex].homeTeam}</div>
                        <div className="text-4xl font-bold text-white mt-2">{recentMatches[currentMatchIndex].homeScore}</div>
                      </div>
                    </div>

                    <Badge className="bg-green-600 text-white">Final</Badge>
                  </div>

                  {/* Game Highlights */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-400" />
                      Game Highlights
                    </h4>
                    <div className="grid md:grid-cols-3 gap-2">
                      {recentMatches[currentMatchIndex].highlights.map((highlight, index) => (
                        <div key={index} className="text-sm text-gray-300 bg-gray-800/50 rounded px-3 py-2">
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Highlights
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Full Stats
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {recentMatches.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMatchIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentMatchIndex ? 'bg-blue-500 w-6' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </section>

        {/* League Standings */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <TrendingUp className="h-8 w-8 mr-3 text-green-400" />
              League Standings
            </h2>
            <Link href="/standings-bracket">
              <Button variant="outline">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <Card className="bg-gray-800/50 border-gray-600/30">
            <CardContent className="p-6">
              <div className="space-y-3">
                {leagueStandings.slice(0, 8).map((team) => (
                  <div key={team.rank} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Badge variant={team.rank <= 3 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                        {team.rank}
                      </Badge>
                      <div>
                        <div className="font-semibold text-white">{team.team}</div>
                        <div className="text-sm text-gray-400">{team.wins}-{team.losses}-{team.otLosses}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">{team.points}</div>
                        <div className="text-xs text-gray-400">PTS</div>
                      </div>
                      <Badge variant={team.streak.startsWith('W') ? "default" : "destructive"} className="text-xs">
                        {team.streak}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Latest MVHL News */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-blue-400" />
              Latest MVHL News
            </h2>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={prevNews}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={nextNews}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Link href="/news-section">
                <Button variant="outline">
                  View All <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.map((article, index) => (
              <Card key={article.id} className={`overflow-hidden transition-all hover:scale-105 ${
                index === currentNewsIndex ? 'ring-2 ring-blue-500' : ''
              } bg-gray-800/50 border-gray-600/30`}>
                <div className="relative">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/50 rounded px-2 py-1">
                    <span className="text-white text-xs">{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-bold text-white leading-tight">{article.title}</h3>
                    <p className="text-gray-300 text-sm">{article.summary}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>By {article.author}</span>
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
                    
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call-to-Action Footer */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl"></div>
          <Card className="relative bg-transparent border-blue-500/30 overflow-hidden">
            <CardContent className="p-12">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold text-white">
                    Join the Premier MVHL League
                  </h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Experience the ultimate virtual hockey competition with professional-grade features and community
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-white">100% Free to Play</h3>
                      <p className="text-sm text-gray-400">No hidden costs or fees</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-white">24/7 Stat Tracking</h3>
                      <p className="text-sm text-gray-400">Real-time performance analytics</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-white">Real Prize Rewards</h3>
                      <p className="text-sm text-gray-400">Win actual prizes and recognition</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-white">Discord Community</h3>
                      <p className="text-sm text-gray-400">Connect with fellow players</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link href="/draft-central">
                    <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-lg">
                      Register for Season 1
                    </Button>
                  </Link>
                  <div className="flex justify-center space-x-6 text-sm text-gray-400">
                    <span>✓ Instant registration</span>
                    <span>✓ Full league access</span>
                    <span>✓ Community support</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}