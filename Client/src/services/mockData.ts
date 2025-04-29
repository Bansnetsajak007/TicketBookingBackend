
export interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  price: number;
  capacity: number;
  soldTickets: number;
  imageUrl: string;
  organizerId: string;
  featured: boolean;
}

export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Tech Innovation Summit",
    description: "Join the premier tech innovation event of the year featuring keynotes from industry leaders, workshops on cutting-edge technologies, and networking opportunities with pioneers in the field.",
    type: "Conference",
    date: "2025-05-15",
    time: "09:00 AM - 06:00 PM",
    location: "San Francisco",
    venue: "Moscone Center",
    price: 299.99,
    capacity: 2000,
    soldTickets: 1245,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    organizerId: "2",
    featured: true
  },
  {
    id: "2",
    title: "Night of Jazz",
    description: "Experience an unforgettable evening of smooth jazz with world-renowned musicians. This intimate concert will feature both classic standards and innovative new compositions.",
    type: "Concert",
    date: "2025-06-10",
    time: "08:00 PM - 11:00 PM",
    location: "New York",
    venue: "Blue Note Jazz Club",
    price: 85.00,
    capacity: 200,
    soldTickets: 168,
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    organizerId: "2",
    featured: true
  },
  {
    id: "3",
    title: "Summer Music Festival",
    description: "Three days of non-stop music across five stages featuring the hottest acts in indie, rock, electronic, and hip-hop. Food vendors, art installations, and camping options available.",
    type: "Festival",
    date: "2025-07-24",
    time: "All Day",
    location: "Austin",
    venue: "Zilker Park",
    price: 199.00,
    capacity: 15000,
    soldTickets: 8743,
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    organizerId: "2",
    featured: true
  },
  {
    id: "4",
    title: "Web Design Workshop",
    description: "A hands-on workshop for designers and developers looking to enhance their web design skills. Learn the latest trends, tools, and techniques from industry experts.",
    type: "Workshop",
    date: "2025-04-30",
    time: "10:00 AM - 04:00 PM",
    location: "Chicago",
    venue: "Design Hub",
    price: 149.99,
    capacity: 50,
    soldTickets: 38,
    imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    organizerId: "2",
    featured: false
  },
  {
    id: "5",
    title: "Modern Art Exhibition",
    description: "This curated exhibition showcases groundbreaking works from contemporary artists pushing the boundaries of modern art. Experience thought-provoking installations, paintings, and mixed media works.",
    type: "Exhibition",
    date: "2025-05-05",
    time: "10:00 AM - 08:00 PM",
    location: "Miami",
    venue: "Contemporary Arts Center",
    price: 25.00,
    capacity: 500,
    soldTickets: 320,
    imageUrl: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    organizerId: "2",
    featured: false
  },
  {
    id: "6",
    title: "Championship Basketball Finals",
    description: "Witness the ultimate showdown as the season's top teams battle for the championship title in this high-stakes basketball final that promises heart-stopping action.",
    type: "Sport",
    date: "2025-06-15",
    time: "07:00 PM",
    location: "Los Angeles",
    venue: "Staples Center",
    price: 150.00,
    capacity: 20000,
    soldTickets: 18750,
    imageUrl: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    organizerId: "2",
    featured: false
  },
  {
    id: "7",
    title: "Hamlet: Modern Adaptation",
    description: "A bold, contemporary reimagining of Shakespeare's classic tragedy, set in the corporate world with striking minimalist staging and an award-winning cast.",
    type: "Theater",
    date: "2025-05-22",
    time: "07:30 PM",
    location: "Boston",
    venue: "Arlington Theater",
    price: 75.00,
    capacity: 350,
    soldTickets: 275,
    imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    organizerId: "2",
    featured: false
  },
  {
    id: "8",
    title: "Startup Networking Mixer",
    description: "Connect with founders, investors, and industry experts in this casual networking event designed to foster meaningful connections in the startup ecosystem.",
    type: "Conference",
    date: "2025-04-25",
    time: "06:30 PM - 09:30 PM",
    location: "Seattle",
    venue: "Innovation Hub",
    price: 35.00,
    capacity: 150,
    soldTickets: 98,
    imageUrl: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    organizerId: "2",
    featured: false
  },
  {
    id: "9",
    title: "Wine Tasting Gala",
    description: "Sample a curated selection of premium wines from around the world, paired with gourmet appetizers and live classical music in an elegant setting.",
    type: "Exhibition",
    date: "2025-07-08",
    time: "07:00 PM - 10:00 PM",
    location: "Denver",
    venue: "Grand Vineyard Hotel",
    price: 120.00,
    capacity: 100,
    soldTickets: 85,
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    organizerId: "2",
    featured: false
  },
  {
    id: "10",
    title: "Electronic Dance Festival",
    description: "Experience the ultimate electronic music celebration with world-class DJs, spectacular light shows, and immersive stage designs. Dance until dawn in this unforgettable festival.",
    type: "Festival",
    date: "2025-08-12",
    time: "08:00 PM - 06:00 AM",
    location: "Miami",
    venue: "Beachfront Arena",
    price: 89.99,
    capacity: 5000,
    soldTickets: 3500,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    organizerId: "2",
    featured: false
  }
];

export const getEventById = (id: string): Event | undefined => {
  return MOCK_EVENTS.find(event => event.id === id);
};

export const getEventsByOrganizer = (organizerId: string): Event[] => {
  return MOCK_EVENTS.filter(event => event.organizerId === organizerId);
};

export const getFeaturedEvents = (): Event[] => {
  return MOCK_EVENTS.filter(event => event.featured);
};

export const getUpcomingEvents = (): Event[] => {
  // In a real app, would filter by date
  return MOCK_EVENTS.slice(0, 6);
};

export const getAllEvents = (): Event[] => {
  return MOCK_EVENTS;
};
