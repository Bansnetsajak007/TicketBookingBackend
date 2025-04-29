
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Ticket, User, AlertTriangle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getEventById, Event } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));
        if (id) {
          const eventData = getEventById(id);
          if (eventData) {
            setEvent(eventData);
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleTicketsIncrease = () => {
    // Don't allow selecting more than available
    if (event && ticketQuantity < (event.capacity - event.soldTickets)) {
      setTicketQuantity(prev => prev + 1);
    } else {
      toast.warning('Maximum available tickets selected');
    }
  };

  const handleTicketsDecrease = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(prev => prev - 1);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.warning('Please log in to purchase tickets');
      navigate('/login');
      return;
    }
    
    // Navigate to checkout page
    navigate(`/checkout/${id}?quantity=${ticketQuantity}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading event details...</div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/events')}>Browse Events</Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate number of available tickets
  const availableTickets = event.capacity - event.soldTickets;
  const isLowAvailability = availableTickets < (event.capacity * 0.1); // Less than 10% tickets remain

  return (
    <Layout>
      <div className="page-container">
        {/* Event Header */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-8">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-6">
            <Badge variant="outline" className="bg-black/60 text-white mb-2">
              {event.type}
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-white/90">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-white/90">
                <Clock className="h-4 w-4 mr-1" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-white/90">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="text-muted-foreground mb-6">{event.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="text-foreground font-medium">Venue</p>
                    <p>{event.venue}, {event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="text-foreground font-medium">Date & Time</p>
                    <p>{event.date}, {event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ticket className="h-5 w-5" />
                  <div>
                    <p className="text-foreground font-medium">Price</p>
                    <p>${event.price.toFixed(2)} per ticket</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-5 w-5" />
                  <div>
                    <p className="text-foreground font-medium">Capacity</p>
                    <p>{event.capacity} attendees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Purchase */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Get Tickets</h2>
              
              {availableTickets > 0 ? (
                <>
                  <div className="mb-4">
                    <p className="text-muted-foreground mb-1">Price per ticket</p>
                    <p className="text-2xl font-bold">${event.price.toFixed(2)}</p>
                  </div>
                  
                  {isLowAvailability && (
                    <div className="bg-muted/50 border border-border p-2 rounded mb-4 text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span>Only {availableTickets} tickets left!</span>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Quantity
                    </label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleTicketsDecrease}
                        disabled={ticketQuantity <= 1}
                      >
                        -
                      </Button>
                      <span className="mx-4 w-8 text-center">{ticketQuantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleTicketsIncrease}
                        disabled={ticketQuantity >= availableTickets}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-4 border-t border-border pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${(event.price * ticketQuantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>${(event.price * ticketQuantity * 0.10).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border">
                      <span>Total</span>
                      <span>${(event.price * ticketQuantity * 1.10).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </>
              ) : (
                <div className="text-center p-4">
                  <Badge variant="destructive" className="mb-2">Sold Out</Badge>
                  <p className="text-muted-foreground mb-4">
                    All tickets for this event have been sold.
                  </p>
                  <Button variant="outline" onClick={() => navigate('/events')}>
                    Find Other Events
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailPage;
