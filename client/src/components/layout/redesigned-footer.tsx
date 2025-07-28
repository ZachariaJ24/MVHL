import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Award, 
  Calendar, 
  Newspaper, 
  UserPlus, 
  Star, 
  Gavel,
  MessageSquare,
  ExternalLink,
  LogIn,
  UserCog,
  Building2,
  Settings,
  FileText,
  HelpCircle,
  Shield,
  Mail
} from "lucide-react";

const LEAGUE_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/standings", label: "Standings", icon: BarChart3 },
  { href: "/stats", label: "Stats", icon: TrendingUp },
  { href: "/matches", label: "Matches", icon: Calendar },
];

const COMMUNITY_LINKS = [
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/awards", label: "Awards", icon: Award },
  { href: "/free-agency", label: "Free Agency", icon: UserPlus },
  { href: "/all-star-vote", label: "All-Star Vote", icon: Star },
  { href: "/draft-central", label: "Draft Central", icon: Gavel },
];

const RESOURCE_LINKS = [
  { href: "/rules", label: "Rules", icon: FileText },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/privacy", label: "Privacy Policy", icon: Shield },
  { href: "/disclaimer", label: "Disclaimer", icon: FileText },
  { href: "/support", label: "Contact Us", icon: Mail },
];

const PANEL_LINKS = [
  { href: "/admin-dashboard", label: "Admin Panel", icon: Settings },
  { href: "/management-dashboard", label: "Team Management", icon: Building2 },
  { href: "/player-dashboard", label: "Player Panel", icon: UserCog },
];

export function RedesignedFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* League Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">League</h4>
            <div className="space-y-2">
              {LEAGUE_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" size="sm" className="h-auto justify-start p-2 text-muted-foreground hover:text-foreground">
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Community Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Community</h4>
            <div className="space-y-2">
              {COMMUNITY_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" size="sm" className="h-auto justify-start p-2 text-muted-foreground hover:text-foreground">
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Resources</h4>
            <div className="space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" size="sm" className="h-auto justify-start p-2 text-muted-foreground hover:text-foreground">
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Panels Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Panels</h4>
            <div className="space-y-2">
              <div className="space-y-1">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-auto justify-start p-2 text-muted-foreground hover:text-foreground">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="ghost" size="sm" className="h-auto justify-start p-2 text-muted-foreground hover:text-foreground">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </div>
              <Separator className="my-2" />
              {PANEL_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" size="sm" className="h-auto justify-start p-2 text-muted-foreground hover:text-foreground">
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <span className="text-sm font-bold text-white">M</span>
            </div>
            <div className="text-sm font-medium">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MVHL HUB
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© 2025 MVHL Hub. All rights reserved.</span>
            <Button variant="ghost" size="sm" className="h-auto p-1">
              <MessageSquare className="mr-1 h-3 w-3" />
              Discord
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}