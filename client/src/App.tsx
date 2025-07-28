import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RedesignedHeader } from "./components/layout/redesigned-header";
import { RedesignedFooter } from "./components/layout/redesigned-footer";
import { Home } from "./pages/home";
import { Teams } from "./pages/teams";
import { Standings } from "./pages/standings";
import { Stats } from "./pages/stats";
import { Awards } from "./pages/awards";
import { Matches } from "./pages/matches";
import { Playoffs } from "./pages/playoffs";
import { DraftCentral } from "./pages/draft-central";
import { AdminDashboard } from "./pages/admin-dashboard";
import { PlayerDashboard } from "./pages/player-dashboard";
import { ManagementDashboard } from "./pages/management-dashboard";
import { HomeRedesigned } from "./pages/home-redesigned";
import { StandingsBracket } from "./pages/standings-bracket";
import { NewsSection } from "./pages/news-section";
import { MatchesSchedule } from "./pages/matches-schedule";
import { AwardsVoting } from "./pages/awards-voting";
import { SalaryBreakdown } from "./pages/salary-breakdown";
import { TradesEnhanced } from "./pages/trades-enhanced";
import { About } from "./pages/about";
import { Rules } from "./pages/rules";
import { News } from "./pages/news";
import { Events } from "./pages/events";
import { FAQ } from "./pages/faq";
import { Privacy } from "./pages/privacy";
import { ImageUploadCenter } from "./pages/image-upload-center";
import { Support } from "./pages/support";
import { FreeAgency } from "./pages/free-agency";
import { AllStarVote } from "./pages/all-star-vote";
import { PlayerAvailability } from "./pages/player-availability";
import { ContractNegotiations } from "./pages/contract-negotiations";
import { Waivers } from "./pages/waivers";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRedesigned} />
      <Route path="/home-original" component={Home} />
      <Route path="/teams" component={Teams} />
      <Route path="/standings" component={Standings} />
      <Route path="/standings-bracket" component={StandingsBracket} />
      <Route path="/stats" component={Stats} />
      <Route path="/awards" component={Awards} />
      <Route path="/awards-voting" component={AwardsVoting} />
      <Route path="/matches" component={Matches} />
      <Route path="/matches-schedule" component={MatchesSchedule} />
      <Route path="/playoffs" component={Playoffs} />
      <Route path="/draft-central" component={DraftCentral} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/player-dashboard" component={PlayerDashboard} />
      <Route path="/management-dashboard" component={ManagementDashboard} />
      <Route path="/trades-enhanced" component={TradesEnhanced} />
      <Route path="/salary-breakdown" component={SalaryBreakdown} />
      <Route path="/news-section" component={NewsSection} />
      <Route path="/free-agency" component={FreeAgency} />
      <Route path="/all-star-vote" component={AllStarVote} />
      <Route path="/about" component={About} />
      <Route path="/rules" component={Rules} />
      <Route path="/news" component={News} />
      <Route path="/events" component={Events} />
      <Route path="/faq" component={FAQ} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/support" component={Support} />
      <Route path="/images" component={ImageUploadCenter} />
      <Route path="/player-availability" component={PlayerAvailability} />
      <Route path="/contract-negotiations" component={ContractNegotiations} />
      <Route path="/waivers" component={Waivers} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <RedesignedHeader />
            <main className="min-h-[calc(100vh-200px)]">
              <Router />
            </main>
            <RedesignedFooter />
          </div>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
