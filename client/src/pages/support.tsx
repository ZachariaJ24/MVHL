import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageSquare, Clock, CheckCircle, AlertCircle, Mail, Phone, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Support() {
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
    email: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support ticket submitted",
      description: "We'll get back to you within 24 hours."
    });
    setTicketForm({
      subject: "",
      category: "",
      priority: "",
      description: "",
      email: ""
    });
  };

  const supportStats = [
    { label: "Average Response Time", value: "2 hours", icon: Clock },
    { label: "Tickets Resolved", value: "98%", icon: CheckCircle },
    { label: "Customer Satisfaction", value: "4.9/5", icon: HelpCircle }
  ];

  const commonIssues = [
    {
      issue: "Can't log in to my account",
      solution: "Reset your password using the 'Forgot Password' link on the login page",
      category: "Account"
    },
    {
      issue: "Player statistics not updating",
      solution: "Stats update within 24 hours after games. Contact support if delayed longer",
      category: "Gameplay"
    },
    {
      issue: "Trade proposal not working",
      solution: "Ensure all trade rules are met and both teams have roster space",
      category: "Trading"
    },
    {
      issue: "Missing game notifications",
      solution: "Check notification settings in your account preferences",
      category: "Settings"
    }
  ];

  const contactMethods = [
    {
      method: "Email Support",
      description: "Best for detailed issues and non-urgent requests",
      contact: "support@mvhlhub.com",
      responseTime: "Within 24 hours",
      icon: Mail
    },
    {
      method: "Live Chat",
      description: "Quick help for immediate questions during business hours",
      contact: "Available 9 AM - 5 PM EST",
      responseTime: "Usually under 5 minutes",
      icon: MessageSquare
    },
    {
      method: "Emergency Support",
      description: "Critical issues affecting league operations",
      contact: "emergency@mvhlhub.com",
      responseTime: "Within 1 hour",
      icon: AlertCircle
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <HelpCircle className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold">Support Center</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get help with your MVHL Hub experience. Our support team is here to assist 
          with any questions or issues you may have.
        </p>
      </div>

      {/* Support Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {supportStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="help" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="help">Get Help</TabsTrigger>
          <TabsTrigger value="ticket">Submit Ticket</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
              <CardDescription>
                Quick solutions to frequently encountered problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonIssues.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{item.issue}</h4>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.solution}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-blue-900">Still Need Help?</h3>
                <p className="text-blue-800 text-sm">
                  Can't find a solution to your problem? Our support team is ready to help.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Submit Support Ticket
                  </Button>
                  <Button variant="outline">
                    Browse FAQ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ticket" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit Support Ticket</CardTitle>
              <CardDescription>
                Describe your issue in detail and we'll get back to you quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={ticketForm.category}
                      onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="gameplay">Gameplay Problems</SelectItem>
                        <SelectItem value="trading">Trading System</SelectItem>
                        <SelectItem value="technical">Technical Issues</SelectItem>
                        <SelectItem value="billing">Billing Questions</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of the issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={ticketForm.priority}
                      onValueChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General question</SelectItem>
                        <SelectItem value="medium">Medium - Non-urgent issue</SelectItem>
                        <SelectItem value="high">High - Urgent problem</SelectItem>
                        <SelectItem value="critical">Critical - System down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about your issue, including any error messages and steps to reproduce the problem."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Support Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.method}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <span>{method.method}</span>
                    </CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="font-medium text-sm">Contact</div>
                      <div className="text-sm text-muted-foreground">{method.contact}</div>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Response Time</div>
                      <div className="text-sm text-muted-foreground">{method.responseTime}</div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Office Hours & Support Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Business Hours</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 5:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 2:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Emergency Support</h4>
                  <div className="space-y-2 text-sm">
                    <div>Available 24/7 for critical issues</div>
                    <div>Response within 1 hour</div>
                    <div>Use emergency contact for:</div>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>System outages</li>
                      <li>Security incidents</li>
                      <li>Data loss issues</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span>System Status</span>
              </CardTitle>
              <CardDescription>
                Current operational status of all MVHL Hub services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { service: "Web Application", status: "operational", uptime: "99.9%" },
                  { service: "Database", status: "operational", uptime: "99.8%" },
                  { service: "Game Engine", status: "operational", uptime: "99.7%" },
                  { service: "Trading System", status: "operational", uptime: "99.9%" },
                  { service: "Statistics API", status: "operational", uptime: "99.6%" },
                  { service: "User Authentication", status: "operational", uptime: "99.9%" }
                ].map((service) => (
                  <div key={service.service} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === "operational" ? "bg-green-500" : 
                        service.status === "degraded" ? "bg-yellow-500" : "bg-red-500"
                      }`}></div>
                      <span className="font-medium">{service.service}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={service.status === "operational" ? "default" : "destructive"}>
                        {service.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{service.uptime} uptime</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">All Systems Operational</h4>
                  <p className="text-sm text-green-800 mt-1">
                    All MVHL Hub services are running normally. Last updated: 5 minutes ago
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