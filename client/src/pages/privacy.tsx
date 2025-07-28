import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Lock, Eye, AlertTriangle, Users, Database } from "lucide-react";

export function Privacy() {
  const lastUpdated = "January 27, 2024";

  const dataTypes = [
    {
      type: "Account Information",
      description: "Username, email address, password (encrypted), and account preferences",
      purpose: "Account creation, authentication, and platform communication",
      retention: "Active accounts + 1 year after deletion"
    },
    {
      type: "Game Statistics", 
      description: "Player performance data, game results, team assignments, and achievements",
      purpose: "League operation, standings calculation, and performance tracking",
      retention: "Permanent for historical records"
    },
    {
      type: "Usage Data",
      description: "Login times, page views, feature usage, and platform interactions",
      purpose: "Platform improvement, security monitoring, and user experience optimization",
      retention: "2 years from collection"
    },
    {
      type: "Communication Data",
      description: "Messages between users, support requests, and forum posts",
      purpose: "Platform functionality, support provision, and community moderation",
      retention: "3 years or until account deletion"
    }
  ];

  const rights = [
    {
      right: "Access",
      description: "Request a copy of all personal data we hold about you",
      action: "Contact support with verification"
    },
    {
      right: "Correction",
      description: "Request correction of inaccurate or incomplete personal data",
      action: "Update through account settings or contact support"
    },
    {
      right: "Deletion",
      description: "Request deletion of your personal data (with some exceptions)",
      action: "Account deletion option in settings"
    },
    {
      right: "Portability",
      description: "Receive your data in a structured, machine-readable format",
      action: "Data export feature in account settings"
    },
    {
      right: "Objection",
      description: "Object to processing of your personal data for specific purposes",
      action: "Privacy settings or contact support"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your privacy is important to us. This policy explains how MVHL Hub collects, 
          uses, and protects your personal information.
        </p>
        <Badge variant="outline" className="text-sm">
          Last Updated: {lastUpdated}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data We Collect</TabsTrigger>
          <TabsTrigger value="rights">Your Rights</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-6 w-6 text-blue-500" />
                <span>Privacy Overview</span>
              </CardTitle>
              <CardDescription>
                Our commitment to protecting your privacy and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">What We Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Collect only necessary data for platform operation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Use encryption to protect sensitive information</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Provide transparency about data usage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Give you control over your personal data</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">What We Don't Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Sell your personal data to third parties</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Share data without your consent</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Use data for purposes beyond platform operation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Store data longer than necessary</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Important Note</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    MVHL Hub is a gaming platform focused on virtual hockey league management. 
                    We collect and process data necessary for league operations, player statistics, 
                    and platform functionality. Your participation is voluntary, and you can 
                    request data deletion at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-6 w-6 text-green-500" />
                <span>Data Collection & Usage</span>
              </CardTitle>
              <CardDescription>
                Types of data we collect and how we use them
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {dataTypes.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{item.type}</h3>
                      <Badge variant="outline">
                        Retention: {item.retention}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2 text-muted-foreground">What We Collect</h4>
                        <p>{item.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-muted-foreground">Why We Need It</h4>
                        <p>{item.purpose}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-green-900 mb-2">Data Minimization</h4>
              <p className="text-sm text-green-800">
                We follow the principle of data minimization, collecting only the information 
                necessary to provide our services effectively. We regularly review our data 
                collection practices to ensure they remain minimal and purposeful.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-500" />
                <span>Your Privacy Rights</span>
              </CardTitle>
              <CardDescription>
                Control over your personal data and how to exercise your rights
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {rights.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">Right to {item.right}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">How to Exercise This Right</h4>
                    <p className="text-sm">{item.action}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-purple-900 mb-2">Response Timeline</h4>
              <p className="text-sm text-purple-800 mb-3">
                We will respond to your privacy rights requests within 30 days. For complex 
                requests, we may extend this period by an additional 60 days with notification.
              </p>
              <div className="text-sm text-purple-800">
                <strong>Contact for Privacy Requests:</strong> privacy@mvhlhub.com
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-6 w-6 text-red-500" />
                <span>Security Measures</span>
              </CardTitle>
              <CardDescription>
                How we protect your data and maintain platform security
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Safeguards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>End-to-end encryption for sensitive data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Secure HTTPS connections for all traffic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Regular security audits and updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Password hashing with industry standards</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operational Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Limited access controls for staff</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Regular staff security training</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Incident response procedures</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure data backup and recovery</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Security Breach Policy</h4>
                  <p className="text-sm text-red-800 mt-1">
                    In the unlikely event of a security breach affecting personal data, 
                    we will notify affected users within 72 hours and take immediate 
                    steps to secure the platform and minimize impact.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Security Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you discover a security vulnerability, please report it responsibly:
              </p>
              <div className="space-y-2 text-sm">
                <div><strong>Email:</strong> security@mvhlhub.com</div>
                <div><strong>Response Time:</strong> Within 24 hours</div>
                <div><strong>Disclosure:</strong> Coordinated disclosure process</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact Section */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Questions About Privacy?</h3>
            <p className="text-muted-foreground">
              Contact our privacy team for any questions about this policy or your data rights.
            </p>
            <div className="text-sm space-y-1">
              <div><strong>Privacy Officer:</strong> privacy@mvhlhub.com</div>
              <div><strong>General Support:</strong> support@mvhlhub.com</div>
              <div><strong>Response Time:</strong> 1-3 business days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}