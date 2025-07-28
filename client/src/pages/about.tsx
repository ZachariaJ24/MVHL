import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Target, Zap, Globe, Shield } from "lucide-react";

export function About() {
  const features = [
    {
      icon: Trophy,
      title: "Complete League Management",
      description: "Full 32-team hockey league with comprehensive player statistics, standings, and season tracking."
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Specialized dashboards for players, team management, and league administrators with appropriate permissions."
    },
    {
      icon: Target,
      title: "Advanced Analytics",
      description: "AI-powered scouting reports, performance analysis, and predictive insights for strategic decision making."
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Live game scores, instant trade notifications, and dynamic standings that update as the season progresses."
    },
    {
      icon: Globe,
      title: "Draft Central",
      description: "Interactive draft system with AI commentary, prospect rankings, and live draft simulation capabilities."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security with user authentication, data protection, and reliable PostgreSQL backend."
    }
  ];

  const stats = [
    { label: "Teams", value: "32", description: "Professional hockey teams" },
    { label: "Players", value: "160+", description: "Active league players" },
    { label: "Games", value: "1,000+", description: "Season games tracked" },
    { label: "Features", value: "50+", description: "Management tools" }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Trophy className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold">About MVHL Hub</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          The Major Virtual Hockey League (MVHL) Hub is the comprehensive digital platform 
          that powers one of the most advanced virtual hockey leagues in the world.
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">Our Mission</h2>
            <p className="text-lg text-blue-800 max-w-4xl mx-auto">
              To create the most immersive and realistic virtual hockey experience by combining 
              cutting-edge technology, comprehensive statistics, and passionate community management. 
              We bridge the gap between virtual gaming and professional sports management.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <span className="text-lg">{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Platform Statistics</CardTitle>
          <CardDescription className="text-center">
            Current numbers that showcase the scale of our league
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="font-semibold">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Technology & Innovation</CardTitle>
          <CardDescription>
            Built with modern technologies for reliability and performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">Frontend</Badge>
              <p className="text-sm font-medium">React + TypeScript</p>
              <p className="text-xs text-muted-foreground">Modern, responsive interface</p>
            </div>
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">Backend</Badge>
              <p className="text-sm font-medium">Node.js + Express</p>
              <p className="text-xs text-muted-foreground">Scalable API architecture</p>
            </div>
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">Database</Badge>
              <p className="text-sm font-medium">PostgreSQL</p>
              <p className="text-xs text-muted-foreground">Reliable data persistence</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-center text-sm text-muted-foreground">
              Enhanced with AI-powered analytics using Google Gemini for intelligent insights and automated content generation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Community Focus */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-900">Community First</h2>
            <p className="text-green-800 max-w-3xl mx-auto">
              MVHL Hub is more than just software - it's a thriving community of hockey enthusiasts, 
              strategic thinkers, and competitive players who share a passion for the sport. 
              Every feature is designed with user experience and community engagement at its core.
            </p>
            <div className="flex justify-center space-x-4 pt-4">
              <Badge className="bg-green-600 text-white">Active Community</Badge>
              <Badge className="bg-green-600 text-white">Regular Updates</Badge>
              <Badge className="bg-green-600 text-white">User Feedback Driven</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}