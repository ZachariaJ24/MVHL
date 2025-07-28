import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Users, 
  Calendar, 
  TrendingUp, 
  Crown, 
  Award,
  BarChart3,
  Activity,
  Clock,
  Star,
  ArrowRight,
  Gift,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Newspaper
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function Home() {
  const [animatedStats, setAnimatedStats] = useState({ teams: 0, players: 0, games: 0, trades: 0 });

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: games } = useQuery({
    queryKey: ["/api/games/recent"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: activity } = useQuery({
    queryKey: ["/api/activity/recent"],
  });

  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
  });

  const { data: news } = useQuery({
    queryKey: ["/api/news"],
  });

  // Animate statistics on scroll
  useEffect(() => {
    if (stats) {
      const timer = setTimeout(() => {
        setAnimatedStats({
          teams: parseInt(stats.totalTeams) || 32,
          players: parseInt(stats.totalPlayers) || 640,
          games: parseInt(stats.totalGames) || 120,
          trades: (trades as any[])?.length || 15
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stats, trades]);

  const recentTrades = (trades as any[])?.slice(0, 3) || [];
  const upcomingMatches = (games as any[])?.slice(0, 3) || [];
  const topStandings = (teams as any[])?.sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 8) || [];
  const latestNews = (news as any[])?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 px-4 py-2">
                🚨 Breaking: Player Trades Active! Weekly Scores Updated!
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">MVHL</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Experience the most competitive NHL 25 gaming environment with professional-grade statistics tracking, free token rewards, and authentic hockey league management.
              </p>
            </div>

            {/* Animated Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-400">{animatedStats.teams}</div>
                <div className="text-blue-200 font-medium">Teams</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-400">{animatedStats.players}</div>
                <div className="text-blue-200 font-medium">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-400">{animatedStats.games}</div>
                <div className="text-blue-200 font-medium">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-orange-400">{animatedStats.trades}</div>
                <div className="text-blue-200 font-medium">Active Trades</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3">
                <Star className="mr-2 h-5 w-5" />
                Register for Season 1
              </Button>
              <Button size="lg" variant="outline" className="border-blue-300 text-blue-100 hover:bg-blue-100 hover:text-blue-900 px-8 py-3">
                <MessageSquare className="mr-2 h-5 w-5" />
                Join Discord Community
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About MVHL Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">About MVHL</h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              The Major Virtual Hockey League represents the pinnacle of competitive NHL 25 gaming, combining authentic hockey management with cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Crown className="mr-2 h-6 w-6 text-yellow-500" />
                  Premier NHL 25 League
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Experience the most realistic and competitive hockey simulation available. Our league features complete 32-team structure, authentic player statistics, and professional-grade management systems that mirror real NHL operations.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="mr-2 h-6 w-6 text-blue-500" />
                  Professional Community
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Join a dedicated community of serious hockey gamers and strategists. Our platform supports team management, player development, contract negotiations, and real-time draft experiences with professional commentary.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 bg-slate-900/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Advanced League Features</h2>
            <p className="text-lg text-slate-300">Professional-grade tools for the ultimate hockey management experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">24/7 Stat Tracking</h3>
              <p className="text-slate-400">Real-time statistics tracking with advanced analytics and performance metrics for every player and team.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">100% Free to Play</h3>
              <p className="text-slate-400">No entry fees, no pay-to-win mechanics - just pure competitive hockey gaming with real rewards!</p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Real Prize Rewards</h3>
              <p className="text-slate-400">Compete for genuine rewards and recognition in our comprehensive tournament and seasonal award system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Trades */}
      <section className="py-16 bg-slate-900/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Recent Player Trades</h2>
              <p className="text-slate-400">Live transaction feed from our professional trade system</p>
            </div>
            <Link href="/management-dashboard">
              <Button variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentTrades.length > 0 ? recentTrades.map((trade: any, index: number) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-white">Ottawa Senators</div>
                        <div className="text-xs text-slate-400">Traded</div>
                        <div className="text-sm text-blue-400">Xswickedpx</div>
                        <div className="text-xs text-slate-400">RD/RD - $1.50M</div>
                      </div>
                      <div className="text-2xl text-slate-500">⇄</div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-white">Baltimore Bandits</div>
                        <div className="text-xs text-slate-400">Traded</div>
                        <div className="text-sm text-green-400">Jayyroww</div>
                        <div className="text-xs text-slate-400">LD/LW - $0.75M</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">1 day ago</div>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                        Completed
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Activity className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Example Trade Activity</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-white">Ottawa Senators</div>
                          <div className="text-xs text-slate-400">Traded</div>
                          <div className="text-sm text-blue-400">Xswickedpx</div>
                          <div className="text-xs text-slate-400">RD/RD - $1.50M</div>
                        </div>
                        <div className="text-2xl text-slate-500">⇄</div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-white">Baltimore Bandits</div>
                          <div className="text-xs text-slate-400">Traded</div>
                          <div className="text-sm text-green-400">Jayyroww</div>
                          <div className="text-xs text-slate-400">LD/LW - $0.75M</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">1 day ago</div>
                        <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* League Standings & Recent Matches Toggle */}
      <section className="py-16 bg-slate-800/30">
        <div className="container">
          <Tabs defaultValue="standings" className="w-full">
            <div className="flex items-center justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="standings">League Standings</TabsTrigger>
                <TabsTrigger value="results">Recent Results</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="standings">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-center">Current League Leaders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left text-slate-300 pb-2">Rank</th>
                          <th className="text-left text-slate-300 pb-2">Team</th>
                          <th className="text-center text-slate-300 pb-2">GP</th>
                          <th className="text-center text-slate-300 pb-2">W</th>
                          <th className="text-center text-slate-300 pb-2">L</th>
                          <th className="text-center text-slate-300 pb-2">OTL</th>
                          <th className="text-center text-slate-300 pb-2">PTS</th>
                          <th className="text-center text-slate-300 pb-2">L10</th>
                          <th className="text-center text-slate-300 pb-2">STRK</th>
                          <th className="text-center text-slate-300 pb-2">GF</th>
                          <th className="text-center text-slate-300 pb-2">GA</th>
                          <th className="text-center text-slate-300 pb-2">DIFF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topStandings.length > 0 ? topStandings.map((team: any, index: number) => (
                          <tr key={index} className="border-b border-slate-800 hover:bg-slate-700/20">
                            <td className="py-2 text-white font-bold">{index + 1}</td>
                            <td className="py-2">
                              <div className="text-white font-medium">{team.city} {team.name}</div>
                              <div className="text-xs text-slate-400">{team.abbreviation}</div>
                            </td>
                            <td className="py-2 text-center text-slate-300">{team.gamesPlayed || 0}</td>
                            <td className="py-2 text-center text-green-400">{team.wins || 0}</td>
                            <td className="py-2 text-center text-red-400">{team.losses || 0}</td>
                            <td className="py-2 text-center text-yellow-400">{team.otLosses || 0}</td>
                            <td className="py-2 text-center text-white font-bold">{team.points || 0}</td>
                            <td className="py-2 text-center text-slate-300">5-5-0</td>
                            <td className="py-2 text-center text-slate-300">W2</td>
                            <td className="py-2 text-center text-slate-300">{team.goalsFor || 0}</td>
                            <td className="py-2 text-center text-slate-300">{team.goalsAgainst || 0}</td>
                            <td className="py-2 text-center text-slate-300">
                              {((team.goalsFor || 0) - (team.goalsAgainst || 0)) > 0 ? '+' : ''}{(team.goalsFor || 0) - (team.goalsAgainst || 0)}
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={12} className="text-center py-8">
                              <BarChart3 className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                              <p className="text-slate-400">Standings will be updated after games are played</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-center">Recent Match Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="text-center p-4 rounded-lg bg-slate-700/30">
                        <div className="font-medium text-white text-lg">Team A vs Team B</div>
                        <div className="text-3xl font-bold text-blue-400 my-2">3 - 2</div>
                        <div className="text-sm text-slate-400">Final - OT</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="container text-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Join the Premier MVHL League
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Experience the most competitive NHL 25 gaming environment with professional-grade statistics tracking, free token rewards, and authentic hockey league management.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-400">100%</div>
                <div className="text-blue-200">Free to Play</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400">24/7</div>
                <div className="text-blue-200">Stat Tracking</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-400">Real</div>
                <div className="text-blue-200">Prize Rewards</div>
              </div>
            </div>

            <div className="space-y-4">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg">
                <Star className="mr-2 h-6 w-6" />
                Register for Season 1
              </Button>
              <div className="text-blue-200">
                No entry fees, no pay-to-win mechanics - just pure competitive hockey gaming with real rewards!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-slate-900">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Latest MVHL News</h2>
              <p className="text-slate-400">Stay updated with league announcements and highlights</p>
            </div>
            <Link href="/news">
              <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                View All News <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.length > 0 ? latestNews.map((article: any, index: number) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-t-lg"></div>
                <CardHeader>
                  <Badge className="w-fit" variant="outline">
                    {article.category || "League News"}
                  </Badge>
                  <CardTitle className="text-white">{article.title || "Latest League Update"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    {article.excerpt || "Stay informed with the latest developments from around the MVHL, including trades, signings, and match results."}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-slate-500">
                      {article.readTime || "2 min read"}
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      Read More <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-3 text-center py-12">
                <Newspaper className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Sample News Articles</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { title: "Draft Recap: Top Prospects Selected", category: "Draft", readTime: "3 min read" },
                    { title: "Weekly Trade Analysis", category: "Trades", readTime: "2 min read" },
                    { title: "Playoff Race Heats Up", category: "Standings", readTime: "4 min read" }
                  ].map((sample, idx) => (
                    <Card key={idx} className="bg-slate-800/50 border-slate-700">
                      <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-t-lg"></div>
                      <CardHeader>
                        <Badge className="w-fit" variant="outline">{sample.category}</Badge>
                        <CardTitle className="text-white">{sample.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-400">Latest developments and analysis from around the MVHL.</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-slate-500">{sample.readTime}</div>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                            Read More <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}