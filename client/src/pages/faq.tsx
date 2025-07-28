import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, HelpCircle, ChevronDown, Users, Trophy, Settings, GamepadIcon } from "lucide-react";

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqCategories = [
    {
      category: "Getting Started",
      icon: Users,
      color: "text-blue-600",
      questions: [
        {
          id: "start-1",
          question: "How do I join the MVHL?",
          answer: "To join MVHL, you need to create an account and be assigned to a team during the draft process. New players are typically recruited during our annual draft events or through team management requests."
        },
        {
          id: "start-2", 
          question: "What are the different user roles?",
          answer: "MVHL has three main roles: Players (team members who participate in games), Management (team owners/GMs who handle trades and roster decisions), and Admins (league officials who oversee operations and enforce rules)."
        },
        {
          id: "start-3",
          question: "How do I access my dashboard?",
          answer: "After logging in, you'll be directed to your role-specific dashboard. Players see their stats and team info, Management has access to trading tools and roster management, and Admins can control league-wide settings."
        },
        {
          id: "start-4",
          question: "Can I change teams during the season?",
          answer: "Team changes typically happen through the trading system. Players cannot directly change teams but can be traded by management. Free agents may be picked up during designated periods."
        }
      ]
    },
    {
      category: "Gameplay & Rules",
      icon: GamepadIcon,
      color: "text-green-600",
      questions: [
        {
          id: "game-1",
          question: "How long is a typical MVHL season?",
          answer: "The regular season runs from October through April, with each team playing 82 games. This is followed by playoffs in April and May, culminating in the championship series."
        },
        {
          id: "game-2",
          question: "What happens if I miss games?",
          answer: "Regular attendance is expected. Missed games may be simulated by AI or result in penalties depending on circumstances. Contact your team management if you have scheduling conflicts."
        },
        {
          id: "game-3",
          question: "How are player statistics calculated?",
          answer: "Statistics are automatically tracked during games and include goals, assists, plus/minus, penalty minutes, and advanced metrics. Goalie stats include saves, goals against, and save percentage."
        },
        {
          id: "game-4",
          question: "Can players be injured during games?",
          answer: "Yes, the league includes an injury system where players may be temporarily unavailable. Injuries are simulated based on game events and typically last 1-5 games depending on severity."
        }
      ]
    },
    {
      category: "Trading & Draft",
      icon: Trophy,
      color: "text-yellow-600", 
      questions: [
        {
          id: "trade-1",
          question: "When is the trade deadline?",
          answer: "The trade deadline is March 1st at 3:00 PM EST. After this date, no trades are allowed until the off-season. Emergency recalls may still be possible in exceptional circumstances."
        },
        {
          id: "trade-2",
          question: "How does the draft system work?",
          answer: "The annual draft features 5 rounds with picks determined by reverse standings order. Teams can trade draft picks, and there's a lottery system for the bottom 3 teams to determine the top picks."
        },
        {
          id: "trade-3",
          question: "What can be traded?",
          answer: "Teams can trade players, draft picks (up to 2 years future), and in some cases salary cap space. All trades must be approved by league management and meet roster composition rules."
        },
        {
          id: "trade-4",
          question: "Are there salary cap restrictions?",
          answer: "Yes, teams operate under a salary cap system. Player salaries are determined by performance and market value. Teams must stay under the cap while maintaining minimum roster requirements."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: Settings,
      color: "text-purple-600",
      questions: [
        {
          id: "tech-1",
          question: "I'm having trouble logging in",
          answer: "Ensure you're using the correct credentials. If you forgot your password, use the reset option. For persistent issues, contact administrators through the support system."
        },
        {
          id: "tech-2",
          question: "Why aren't my stats updating?",
          answer: "Statistics are usually updated within 24 hours of games. If stats appear incorrect after this period, report the issue to league management with specific game details."
        },
        {
          id: "tech-3",
          question: "Can I access MVHL on mobile devices?",
          answer: "Yes, MVHL Hub is designed to be fully responsive and works on all modern mobile devices and tablets. All features are accessible through your mobile browser."
        },
        {
          id: "tech-4",
          question: "How do I report bugs or technical issues?",
          answer: "Report technical issues through the support section or contact administrators directly. Include details about what you were doing when the issue occurred and any error messages."
        }
      ]
    }
  ];

  const allQuestions = faqCategories.flatMap(cat => 
    cat.questions.map(q => ({ ...q, category: cat.category, categoryColor: cat.color }))
  );

  const filteredQuestions = searchTerm 
    ? allQuestions.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allQuestions;

  const topQuestions = [
    "How do I join the MVHL?",
    "What are the different user roles?", 
    "When is the trade deadline?",
    "How long is a typical MVHL season?"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <HelpCircle className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about MVHL gameplay, rules, and platform features. 
          Can't find what you're looking for? Contact our support team.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Links */}
      {!searchTerm && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Questions</CardTitle>
            <CardDescription>
              Most frequently asked questions by our community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2">
              {topQuestions.map((question, index) => (
                <button
                  key={index}
                  className="text-left p-3 hover:bg-muted rounded-lg transition-colors text-sm"
                  onClick={() => {
                    const q = allQuestions.find(q => q.question === question);
                    if (q) toggleItem(q.id);
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Content */}
      {searchTerm ? (
        /* Search Results */
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Search Results ({filteredQuestions.length})
          </h2>
          {filteredQuestions.length > 0 ? (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <Collapsible
                  key={question.id}
                  open={openItems.includes(question.id)}
                  onOpenChange={() => toggleItem(question.id)}
                >
                  <Card>
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="text-left hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{question.question}</CardTitle>
                            <Badge variant="outline" className={question.categoryColor}>
                              {question.category}
                            </Badge>
                          </div>
                          <ChevronDown className={`h-5 w-5 transition-transform ${
                            openItems.includes(question.id) ? 'rotate-180' : ''
                          }`} />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent>
                        <p className="text-muted-foreground">{question.answer}</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  Try different keywords or browse categories below.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Category View */
        <div className="space-y-6">
          {faqCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className={`h-6 w-6 ${category.color}`} />
                    <span>{category.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.questions.map((question) => (
                    <Collapsible
                      key={question.id}
                      open={openItems.includes(question.id)}
                      onOpenChange={() => toggleItem(question.id)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors text-left">
                          <span className="font-medium">{question.question}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${
                            openItems.includes(question.id) ? 'rotate-180' : ''
                          }`} />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-3 pb-3">
                          <p className="text-sm text-muted-foreground">{question.answer}</p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-blue-900">Still Need Help?</h3>
            <p className="text-blue-800">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Contact Support
              </button>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Join Community
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}