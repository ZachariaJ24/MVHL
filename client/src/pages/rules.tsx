import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Book, Users, Trophy, Gavel, Shield } from "lucide-react";

export function Rules() {
  const leagueRules = [
    {
      section: "Team Composition",
      rules: [
        "Each team must maintain a roster of exactly 5 players",
        "Teams must have at least 1 goaltender and 2 defensemen",
        "Maximum of 3 forwards per team active roster",
        "All players must be assigned jersey numbers (1-99, no duplicates)"
      ]
    },
    {
      section: "Season Structure",
      rules: [
        "Regular season consists of 82 games per team",
        "Teams play each opponent at least twice per season",
        "Season runs from October through April",
        "Playoffs follow standard NHL format with 16 teams"
      ]
    },
    {
      section: "Game Rules",
      rules: [
        "Games consist of three 20-minute periods",
        "Overtime is 3-on-3 for 5 minutes, followed by shootout",
        "Teams receive 2 points for wins, 1 point for overtime/shootout losses",
        "All games must be completed within 48 hours of scheduling"
      ]
    },
    {
      section: "Trading Rules",
      rules: [
        "Trade deadline is March 1st at 3 PM EST",
        "All trades must be approved by league management",
        "No salary cap circumvention allowed",
        "Maximum of 3 players per trade transaction"
      ]
    }
  ];

  const draftRules = [
    {
      title: "Draft Order",
      description: "Determined by reverse standings order, with lottery system for bottom 3 teams"
    },
    {
      title: "Draft Rounds",
      description: "5 rounds total, with each team receiving one pick per round"
    },
    {
      title: "Pick Trading",
      description: "Future draft picks may be traded up to 2 years in advance"
    },
    {
      title: "Time Limits",
      description: "5 minutes per pick in rounds 1-2, 3 minutes for rounds 3-5"
    }
  ];

  const conductRules = [
    {
      violation: "Unsportsmanlike Conduct",
      penalty: "Warning → Game suspension → Season suspension",
      description: "Includes harassment, excessive arguing, or disrespectful behavior"
    },
    {
      violation: "Game Abandonment",
      penalty: "Automatic forfeit + 1 game suspension",
      description: "Leaving games early without valid reason"
    },
    {
      violation: "Rule Circumvention",
      penalty: "Trade reversal + draft pick penalty",
      description: "Attempting to bypass salary cap or roster rules"
    },
    {
      violation: "Account Sharing",
      penalty: "Season ban + roster reset",
      description: "Multiple people using the same player account"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Book className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold">MVHL Official Rules</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Complete rulebook and regulations governing the Major Virtual Hockey League. 
          All participants must read and agree to these rules.
        </p>
      </div>

      <Tabs defaultValue="league" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="league">League Rules</TabsTrigger>
          <TabsTrigger value="draft">Draft Rules</TabsTrigger>
          <TabsTrigger value="conduct">Code of Conduct</TabsTrigger>
          <TabsTrigger value="penalties">Penalties</TabsTrigger>
        </TabsList>

        <TabsContent value="league" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span>General League Rules</span>
              </CardTitle>
              <CardDescription>
                Core regulations that govern all aspects of MVHL gameplay
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6">
            {leagueRules.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{section.section}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start space-x-2">
                        <Badge variant="outline" className="mt-0.5 text-xs">
                          {ruleIndex + 1}
                        </Badge>
                        <span className="text-sm">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-500" />
                <span>Draft Regulations</span>
              </CardTitle>
              <CardDescription>
                Rules governing the annual player draft and prospect selection
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {draftRules.map((rule, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{rule.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Draft Day Protocol</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    All teams must have a representative present for the entire draft. 
                    Failure to make picks within the time limit will result in automatic best available player selection.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conduct" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-green-500" />
                <span>Code of Conduct</span>
              </CardTitle>
              <CardDescription>
                Expected behavior and community standards for all MVHL participants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Respect and Sportsmanship</h4>
                  <p className="text-sm text-green-800">
                    Treat all players, management, and officials with respect. Good sportsmanship 
                    is expected at all times, whether winning or losing.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Fair Play</h4>
                  <p className="text-sm text-blue-800">
                    All participants must play fairly and within the rules. Exploitation of 
                    game mechanics or unfair advantages will result in penalties.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">Communication Standards</h4>
                  <p className="text-sm text-orange-800">
                    Use appropriate language in all league communications. Harassment, hate speech, 
                    or discriminatory language will not be tolerated.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Commitment</h4>
                  <p className="text-sm text-purple-800">
                    Honor your commitments to your team and the league. Regular participation 
                    and punctuality are essential for league success.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="penalties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gavel className="h-6 w-6 text-red-500" />
                <span>Penalty System</span>
              </CardTitle>
              <CardDescription>
                Disciplinary actions for rule violations and unsportsmanlike conduct
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {conductRules.map((rule, index) => (
              <Card key={index} className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-red-900">{rule.violation}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Badge variant="destructive" className="mb-2">Penalty Structure</Badge>
                      <p className="text-sm font-medium">{rule.penalty}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Appeals Process</h4>
                  <p className="text-sm text-red-800 mt-1">
                    Players may appeal penalties within 48 hours by contacting league management. 
                    All appeals will be reviewed by a panel of neutral administrators.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}