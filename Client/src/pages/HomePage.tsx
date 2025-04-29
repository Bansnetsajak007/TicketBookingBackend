
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import EventCard from '@/components/events/EventCard';
import { getFeaturedEvents, getUpcomingEvents } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const [featuredEvents] = useState(getFeaturedEvents());
  const [upcomingEvents] = useState(getUpcomingEvents());
  const { isAuthenticated } = useAuth();

  // Helper function to format price to NPR
  const formatNepaliPrice = (price: number) => {
    return `रु ${price.toLocaleString('en-NP')}`;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-black">
          <img
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            alt="Event atmosphere"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>
        <div className="relative h-full container-custom flex flex-col justify-center">
          <div className="max-w-2xl animate-fade-in animate-slide-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
              Experience Events in Black & White
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Discover and book tickets for the most exclusive events, all through our sleek, minimalist platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/events">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Events
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Join TicketNoir
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Events</h2>
              <p className="text-muted-foreground mt-1">Highlighted experiences curated for you</p>
            </div>
            <Link to="/events" className="flex items-center gap-1 text-sm hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                price={formatNepaliPrice(event.price)}
                imageUrl={event.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-black">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
              <p className="text-white/70 mt-1">Don't miss out on what's next</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                price={formatNepaliPrice(event.price)}
                imageUrl={event.imageUrl}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/events">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-accent">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Host Your Own Event?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join our platform as an organizer and reach thousands of potential attendees for your next event.
          </p>
          <Link to="/register">
            <Button size="lg">Become an Organizer</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
