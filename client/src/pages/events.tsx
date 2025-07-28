import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Trophy, Star, Gift } from "lucide-react";

export function Events() {
  const upcomingEvents = [
    {
      id: "1",
      title: "MVHL All-Star Weekend",
      description: "Annual showcase featuring the league's top talent in skills competitions and exhibition games",
      date: "2024-02-10",
      endDate: "2024-02-11",
      time: "19:00",
      location: "Central Arena",
      category: "All-Star",
      status: "open",
      participants: 48,
      maxParticipants: 50,
      featured: true
    },
    {
      id: "2",
      title: "Trade Deadline Special Event",
      description: "Live coverage and analysis of all trades as the deadline approaches",
      date: "2024-03-01",
      time: "15:00",
      location: "Virtual Event",
      category: "Special",
      status: "open",
      participants: 156,
      maxParticipants: 200
    },
    {
      id: "3",
      title: "Rookie Development Camp",
      description: "Training session for first-year players with veteran mentors and coaching staff",
      date: "2024-02-15",
      time: "10:00",
      location: "Training Facility",
      category: "Training",
      status: "invite-only",
      participants: 12,
      maxParticipants: 15
    },
    {
      id: "4",
      title: "Season Awards Ceremony",
      description: "Recognition of outstanding achievements including MVP, Rookie of the Year, and team awards",
      date: "2024-04-20",
      time: "20:00",
      location: "Grand Ballroom",
      category: "Ceremony",
      status: "open",
      participants: 89,
      maxParticipants: 150
    }
  ];

  const pastEvents = [
    {
      id: "5",
      title: "MVHL Draft 2024",
      description: "Annual player draft where teams selected their future stars",
      date: "2023-06-15",
      location: "Draft Arena",
      category: "Draft",
      participants: 32,
      highlights: "Record 5 trades during first round"
    },
    {
      id: "6",
      title: "Championship Finals",
      description: "Best-of-seven series determining the MVHL champion",
      date: "2023-04-30",
      location: "Championship Arena",
      category: "Playoffs", 
      participants: 2,
      highlights: "Series went to Game 7 overtime"
    },
    {
      id: "7",
      title: "Winter Classic",
      description: "Special outdoor game celebrating hockey tradition",
      date: "2024-01-01",
      location: "Outdoor Stadium",
      category: "Special",
      participants: 2,
      highlights: "Record attendance of 15,000 viewers"
    }
  ];

  const getTimeUntilEvent = (dateString: string, timeString: string) => {
    const eventDate = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    const diffInMs = eventDate.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return "Past event";
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Tomorrow";
    return `In ${diffInDays} days`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const EventCard = ({ event, isPast = false }: { event: any, isPast?: boolean }) => (
    <Card className={`hover:shadow-lg transition-shadow ${event.featured ? 'border-yellow-500 bg-yellow-50' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant={
                event.category === "All-Star" ? "default" :
                event.category === "Special" ? "destructive" :
                event.category === "Training" ? "secondary" :
                event.category === "Ceremony" ? "outline" :
                event.category === "Draft" ? "default" : "secondary"
              }>
                {event.category}
              </Badge>
              {event.featured && <Badge className="bg-yellow-600 text-white">Featured</Badge>}
              {event.status === "invite-only" && <Badge variant="outline">Invite Only</Badge>}
            </div>
            <CardTitle className="text-xl leading-tight">
              {event.title}
            </CardTitle>
          </div>
          {!isPast && (
            <div className="text-right text-sm text-muted-foreground">
              {getTimeUntilEvent(event.date, event.time)}
            </div>
          )}
        </div>
        <CardDescription className="text-sm">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(event.date)}</span>
            </div>
            {event.time && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{event.time}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {event.participants} 
                {event.maxParticipants && ` / ${event.maxParticipants}`} 
                participants
              </span>
            </div>
          </div>

          {isPast && event.highlights && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Event Highlights</span>
              </div>
              <p className="text-sm text-muted-foreground">{event.highlights}</p>
            </div>
          )}

          {!isPast && (
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-muted-foreground">
                {event.status === "open" ? (
                  <span className="text-green-600">Registration Open</span>
                ) : event.status === "invite-only" ? (
                  <span className="text-orange-600">Invitation Required</span>
                ) : (
                  <span className="text-red-600">Registration Closed</span>
                )}
              </div>
              <Button 
                variant={event.status === "open" ? "default" : "outline"}
                size="sm"
                disabled={event.status !== "open"}
              >
                {event.status === "open" ? "Register" : 
                 event.status === "invite-only" ? "View Details" : "View Event"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Calendar className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold">MVHL Events</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover upcoming events, tournaments, and special occasions in the MVHL community. 
          Join us for unforgettable hockey experiences.
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="calendar">Event Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {upcomingEvents.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
                <p className="text-muted-foreground">
                  Check back soon for new events and special occasions!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} isPast={true} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-500" />
                <span>Event Calendar</span>
              </CardTitle>
              <CardDescription>
                Full calendar view of all MVHL events and important dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="p-6 border rounded-lg text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Calendar View Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Interactive calendar with full event scheduling will be available in the next update.
                  </p>
                </div>
                
                {/* Quick upcoming events list */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Quick View - Next 30 Days</h4>
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(event.date)} at {event.time}
                        </div>
                      </div>
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Event Categories</span>
          </CardTitle>
          <CardDescription>
            Different types of events you can participate in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">All-Star Events</h4>
              <p className="text-sm text-muted-foreground">Showcasing top talent</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold">Training</h4>
              <p className="text-sm text-muted-foreground">Skill development</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold">Tournaments</h4>
              <p className="text-sm text-muted-foreground">Competitive play</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Gift className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold">Special Events</h4>
              <p className="text-sm text-muted-foreground">Unique occasions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}