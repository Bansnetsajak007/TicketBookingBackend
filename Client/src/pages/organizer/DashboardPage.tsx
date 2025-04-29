
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Clock, Ticket, XCircle, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEventsByOrganizer, Event } from '@/services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate some metrics for the dashboard
  const totalEvents = events.length;
  const totalTickets = events.reduce((sum, event) => sum + event.capacity, 0);
  const soldTickets = events.reduce((sum, event) => sum + event.soldTickets, 0);
  const ticketSalesRevenue = events.reduce((sum, event) => sum + (event.price * event.soldTickets), 0);
  
  const salesByEvent = events.map(event => ({
    name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
    revenue: Number((event.price * event.soldTickets).toFixed(2))
  }));
  
  const ticketSalesTrend = [
    { name: 'Jan', sales: 420 },
    { name: 'Feb', sales: 380 },
    { name: 'Mar', sales: 500 },
    { name: 'Apr', sales: 580 },
    { name: 'May', sales: 620 },
    { name: 'Jun', sales: 700 },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        if (user?.id) {
          const userEvents = getEventsByOrganizer(user.id);
          setEvents(userEvents);
        }
      } catch (error) {
        console.error('Error fetching organizer events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id]);

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your events and monitor ticket sales
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/organizer/create">
              <Button>Create New Event</Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all venues</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalTickets}</div>
              <p className="text-xs text-muted-foreground mt-1">Tickets available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tickets Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{soldTickets}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalTickets > 0 
                  ? `${Math.round((soldTickets / totalTickets) * 100)}% of capacity`
                  : 'No tickets available'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${ticketSalesRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">From ticket sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Event</CardTitle>
              <CardDescription>Sales breakdown for each event</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={salesByEvent} 
                  margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    stroke="#888888"
                  />
                  <YAxis stroke="#888888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => [`$${value}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#ffffff" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ticket Sales Trend</CardTitle>
              <CardDescription>Monthly ticket sales performance</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={ticketSalesTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#ffffff" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
            <CardDescription>
              Manage and monitor your events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-10 text-center">
                <div className="animate-pulse text-muted-foreground">Loading events...</div>
              </div>
            ) : events.length > 0 ? (
              <Table>
                <TableCaption>A list of your events.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Ticket Sales</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => {
                    // Calculate percentage of tickets sold
                    const soldPercentage = Math.round((event.soldTickets / event.capacity) * 100);
                    // Calculate if the event is in the future based on the date
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    const isUpcoming = eventDate > today;
                    
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden">
                              <img 
                                src={event.imageUrl} 
                                alt={event.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span>{event.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground mt-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Ticket className="h-4 w-4" />
                              <span>{event.soldTickets}/{event.capacity}</span>
                            </div>
                            <div className="mt-1 h-2 w-24 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${soldPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={isUpcoming ? "outline" : "secondary"}>
                            {isUpcoming ? "Upcoming" : "Past"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/event/${event.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center">
                <XCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Events Found</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't created any events yet.
                </p>
                <Link to="/organizer/create">
                  <Button>Create Your First Event</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
