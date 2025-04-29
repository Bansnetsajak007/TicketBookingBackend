import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import EventCard from '@/components/events/EventCard';
import EventsFilter, { FilterOptions } from '@/components/events/EventsFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { getAllEvents, Event } from '@/services/mockData';

const EventsListingPage = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  // Helper function to format price to NPR
  const formatNepaliPrice = (price: number) => {
    return `रु ${price.toLocaleString('en-NP')}`;
  };

  // Get all events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const events = getAllEvents();
        setAllEvents(events);
        setFilteredEvents(events);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters: FilterOptions) => {
    let results = [...allEvents];
    
    // Filter by type
    if (filters.type !== 'All Types') {
      results = results.filter(event => event.type === filters.type);
    }
    
    // Filter by location
    if (filters.location !== 'All Locations') {
      results = results.filter(event => event.location === filters.location);
    }
    
    // Filter by price range
    results = results.filter(
      event => event.price >= filters.priceRange[0] && event.price <= filters.priceRange[1]
    );
    
    // Filter by date if selected
    if (filters.date) {
      const filterDate = new Date(filters.date).toISOString().split('T')[0];
      results = results.filter(event => event.date === filterDate);
    }
    
    // Apply search query if exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredEvents(results);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      // If search is cleared, just apply current filters
      handleFilterChange({
        type: 'All Types',
        priceRange: [0, 1000] as [number, number],
        location: 'All Locations',
        date: undefined,
      });
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = allEvents.filter(
      event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
    );
    
    setFilteredEvents(results);
    setCurrentPage(1); // Reset to first page on search
  };

  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Layout>
      <section className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Events</h1>
          <p className="text-muted-foreground">Discover and book your next unforgettable experience</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events, locations, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </form>

        {/* Filter Component */}
        <EventsFilter onFilterChange={handleFilterChange} />

        {/* Events Grid */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading events...</div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentEvents.map((event) => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {pageNumbers.map(number => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      onClick={() => setCurrentPage(number)}
                      className="w-10 h-10 p-0"
                    >
                      {number}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-card rounded-md border border-border p-10 text-center">
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any events matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                handleFilterChange({
                  type: 'All Types',
                  priceRange: [0, 1000] as [number, number],
                  location: 'All Locations',
                  date: undefined,
                });
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default EventsListingPage;
