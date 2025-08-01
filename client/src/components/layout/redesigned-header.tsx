import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Menu,
  LogIn,
  UserCog,
  Building2,
  Settings,
  ChevronDown,
  User
} from "lucide-react";

const MAIN_NAVIGATION = [
  { href: "/", label: "Home", icon: Home },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/standings", label: "Standings", icon: BarChart3 },
  { href: "/stats", label: "Stats", icon: TrendingUp },
  { href: "/awards", label: "Awards", icon: Award },
  { href: "/matches", label: "Matches", icon: Calendar },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/free-agency", label: "Free Agency", icon: UserPlus },
  { href: "/all-star-vote", label: "All-Star Vote", icon: Star },
  { href: "/draft-central", label: "Draft Central", icon: Gavel },
];

export function RedesignedHeader() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActivePage = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <span className="text-xl font-bold text-white">M</span>
          </div>
          <div className="hidden font-bold sm:inline-block">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MVHL HUB
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {MAIN_NAVIGATION.map((item) => {
            const isActive = isActivePage(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center space-x-2 ${
                    isActive ? "bg-blue-600 text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Authentication Dropdown */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Account</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sign In As</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => {
                    const auth = JSON.parse(localStorage.getItem('mvhl_user') || 'null');
                    if (!auth || auth.role !== 'admin') {
                      localStorage.setItem('mvhl_user', JSON.stringify({
                        id: 'admin-001',
                        email: 'admin@mvhl.com',
                        username: 'League Administrator',
                        role: 'admin',
                        teamId: null,
                        playerId: null,
                        createdAt: new Date(),
                      }));
                    }
                    window.location.href = '/admin-dashboard';
                  }}
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => {
                    const auth = JSON.parse(localStorage.getItem('mvhl_user') || 'null');
                    if (!auth || auth.role !== 'management') {
                      localStorage.setItem('mvhl_user', JSON.stringify({
                        id: 'mgmt-001',
                        email: 'gm@mvhl.com',
                        username: 'General Manager',
                        role: 'management',
                        teamId: 'd084d36c-b2da-44a7-8a67-eed5ec453082',
                        playerId: null,
                        createdAt: new Date(),
                      }));
                    }
                    window.location.href = '/management-dashboard';
                  }}
                >
                  <Building2 className="h-4 w-4" />
                  <span>Team Manager</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => {
                    const auth = JSON.parse(localStorage.getItem('mvhl_user') || 'null');
                    if (!auth || auth.role !== 'player') {
                      localStorage.setItem('mvhl_user', JSON.stringify({
                        id: 'player-001',
                        email: 'player@mvhl.com',
                        username: 'Connor McDavid',
                        role: 'player',
                        teamId: 'd084d36c-b2da-44a7-8a67-eed5ec453082',
                        playerId: 'player-001',
                        createdAt: new Date(),
                      }));
                    }
                    window.location.href = '/player-dashboard';
                  }}
                >
                  <UserCog className="h-4 w-4" />
                  <span>Player</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>





          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Navigation</h3>
                  {MAIN_NAVIGATION.map((item) => {
                    const isActive = isActivePage(item.href);
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start space-x-2 ${
                            isActive ? "bg-blue-600 text-white" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <h3 className="text-lg font-semibold">Sign In As</h3>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start space-x-2" 
                    onClick={() => {
                      localStorage.setItem('mvhl_user', JSON.stringify({
                        id: 'admin-001',
                        email: 'admin@mvhl.com',
                        username: 'League Administrator',
                        role: 'admin',
                        teamId: null,
                        playerId: null,
                        createdAt: new Date(),
                      }));
                      window.location.href = '/admin-dashboard';
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start space-x-2" 
                    onClick={() => {
                      localStorage.setItem('mvhl_user', JSON.stringify({
                        id: 'mgmt-001',
                        email: 'gm@mvhl.com',
                        username: 'General Manager',
                        role: 'management',
                        teamId: 'd084d36c-b2da-44a7-8a67-eed5ec453082',
                        playerId: null,
                        createdAt: new Date(),
                      }));
                      window.location.href = '/management-dashboard';
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Team Manager</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start space-x-2" 
                    onClick={() => {
                      localStorage.setItem('mvhl_user', JSON.stringify({
                        id: 'player-001',
                        email: 'player@mvhl.com',
                        username: 'Connor McDavid',
                        role: 'player',
                        teamId: 'd084d36c-b2da-44a7-8a67-eed5ec453082',
                        playerId: 'player-001',
                        createdAt: new Date(),
                      }));
                      window.location.href = '/player-dashboard';
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <UserCog className="h-4 w-4" />
                    <span>Player</span>
                  </Button>
                </div>


              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}