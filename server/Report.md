Event Ticket Booking Application - Backend Documentation
This document provides a comprehensive overview of the backend for the Event Ticket Booking Application, built using Node.js, Express, and MySQL with raw SQL queries (no ORM/ODM). The application supports two user roles: Normal Users (who purchase tickets) and Organizers (who create and manage events). The backend is fully functional and ready for integration with a React frontend.
The report is structured to help a frontend developer understand the API endpoints, database schema, authentication flow, and how to integrate with the backend. It includes example API calls, response formats, and React-specific guidance for building the frontend.
Table of Contents
Project Overview (#project-overview)

Features Implemented (#features-implemented)

Technology Stack (#technology-stack)

Database Schema (#database-schema)

API Endpoints (#api-endpoints)
Authentication (#authentication)

Event Management (#event-management)

Event Listings (#event-listings)

Ticket Purchase (#ticket-purchase)

Frontend Integration Guide (React) (#frontend-integration-guide-react)
Setting Up the Frontend (#setting-up-the-frontend)

Authentication Flow (#authentication-flow)

Displaying Events (#displaying-events)

Event Management for Organizers (#event-management-for-organizers)

Ticket Purchase Flow (#ticket-purchase-flow)

Error Handling (#error-handling)

Testing the Backend (#testing-the-backend)

Security Considerations (#security-considerations)

Next Steps (#next-steps)

Project Overview
The Event Ticket Booking Application allows users to browse, filter, and purchase tickets for events created by organizers. Organizers can create, update, and delete events, while Normal Users can view events and buy tickets. The backend handles authentication, role-based access, event management, and ticket purchasing, with all data stored in a MySQL database.
The application is designed to be secure, scalable, and easy to integrate with a frontend. It uses JWT-based authentication for secure access and raw SQL queries for database operations, as per the requirement to avoid ORMs/ODMs.
Features Implemented
Authentication & Roles:
JWT-based signup and login for two roles: Normal Users and Organizers.

Middleware to authorize users based on their role (e.g., only Organizers can create events).

Event Management:
Organizers can create, update, delete, and retrieve their events.

Events include fields: title, type, event_date, location, price, availability.

Event Listings:
Public API to fetch events with filtering by type, date, location, and price range.

Supports dynamic filtering for a flexible user experience.

Ticket Purchase Flow:
Normal Users can select a quantity of tickets and purchase them.

Updates event availability securely using MySQL transactions to prevent overselling.

Note: Payment integration (eSewa/Khalti) was planned but excluded from this version as per the latest request.
Technology Stack
Backend: Node.js, Express

Database: MySQL (managed via phpMyAdmin/XAMPP)

Authentication: JSON Web Tokens (JWT), bcrypt for password hashing

Dependencies:
express: Web framework

mysql2: MySQL client

jsonwebtoken: JWT handling

bcryptjs: Password hashing

dotenv: Environment variables

Environment: Configured via .env file

Database Schema
The database (ticket_booking) consists of three tables: users, events, and tickets. Below is the schema with descriptions.
1. users Table
Stores user information for Normal Users and Organizers.
sql

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('normal', 'organizer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

id: Unique user ID.

email: User’s email (unique).

password: Hashed password (using bcrypt).

role: Either normal or organizer.

created_at: Timestamp of user creation.

2. events Table
Stores event details created by Organizers.
sql

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    event_date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    availability INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
);

id: Unique event ID.

organizer_id: ID of the Organizer who created the event.

title: Event name (e.g., "Rock Concert").

type: Event category (e.g., "Concert", "Conference").

event_date: Date and time of the event.

location: Venue or city (e.g., "City Arena").

price: Ticket price.

availability: Number of available tickets.

created_at: Timestamp of event creation.

3. tickets Table
Stores ticket purchases by Normal Users.
sql

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'failed') DEFAULT 'confirmed',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

id: Unique ticket ID.

user_id: ID of the Normal User who purchased the ticket.

event_id: ID of the event.

purchased_at: Timestamp of purchase.

status: Ticket status (set to confirmed for now, as payment is excluded).

API Endpoints
The backend exposes RESTful APIs under the base URL http://localhost:3000/api. All endpoints are documented with request formats, authentication requirements, and example responses.
Authentication
1. Signup
Endpoint: POST /api/auth/signup

Description: Creates a new user (Normal User or Organizer).

Authentication: None (public).

Request Body:
json

{
    "email": "string",
    "password": "string",
    "role": "normal | organizer"
}

Response (201):
json

{
    "token": "<jwt_token>",
    "message": "User created"
}

Errors:
400: Invalid input or email already exists.

500: Database error.

2. Login
Endpoint: POST /api/auth/login

Description: Authenticates a user and returns a JWT token.

Authentication: None (public).

Request Body:
json

{
    "email": "string",
    "password": "string"
}

Response (200):
json

{
    "token": "<jwt_token>",
    "message": "Login successful"
}

Errors:
401: Invalid credentials.

500: Database error.

Event Management
3. Create Event
Endpoint: POST /api/events/create

Description: Creates a new event (Organizers only).

Authentication: JWT token (Organizer role).

Headers: Authorization: Bearer <jwt_token>

Request Body:
json

{
    "title": "string",
    "type": "string",
    "event_date": "YYYY-MM-DD HH:mm:ss",
    "location": "string",
    "price": number,
    "availability": integer
}

Response (201):
json

{
    "message": "Event created",
    "eventId": integer
}

Errors:
400: Invalid input (e.g., missing fields, invalid date).

403: Access denied (non-Organizer).

500: Database error.

4. Update Event
Endpoint: PUT /api/events/:eventId

Description: Updates an existing event (Organizers only, must own the event).

Authentication: JWT token (Organizer role).

Headers: Authorization: Bearer <jwt_token>

Request Body:
json

{
    "title": "string",
    "type": "string",
    "event_date": "YYYY-MM-DD HH:mm:ss",
    "location": "string",
    "price": number,
    "availability": integer
}

Response (200):
json

{
    "message": "Event updated"
}

Errors:
400: Invalid input.

403: Access denied.

404: Event not found or unauthorized.

500: Database error.

5. Delete Event
Endpoint: DELETE /api/events/:eventId

Description: Deletes an event and associated tickets (Organizers only, must own the event).

Authentication: JWT token (Organizer role).

Headers: Authorization: Bearer <jwt_token>

Response (200):
json

{
    "message": "Event deleted"
}

Errors:
403: Access denied.

404: Event not found or unauthorized.

500: Database error.

6. Get Organizer’s Events
Endpoint: GET /api/events/my-events

Description: Retrieves all events created by the authenticated Organizer.

Authentication: JWT token (Organizer role).

Headers: Authorization: Bearer <jwt_token>

Response (200):
json

[
    {
        "id": integer,
        "title": "string",
        "type": "string",
        "event_date": "string (ISO 8601)",
        "location": "string",
        "price": number,
        "availability": integer,
        "created_at": "string (ISO 8601)"
    },
    ...
]

Errors:
403: Access denied.

500: Database error.

Event Listings
7. Get All Events with Filtering
Endpoint: GET /api/events

Description: Retrieves all events with optional filters (public, no authentication required).

Query Parameters:
type: Event type (e.g., "Concert").

date: Event date (e.g., "2025-05-01").

location: Partial match for location (e.g., "Arena").

minPrice: Minimum price (e.g., 20).

maxPrice: Maximum price (e.g., 100).

Example: GET /api/events?type=Concert&minPrice=20&maxPrice=60

Response (200):
json

[
    {
        "id": integer,
        "title": "string",
        "type": "string",
        "event_date": "string (ISO 8601)",
        "location": "string",
        "price": number,
        "availability": integer,
        "created_at": "string (ISO 8601)"
    },
    ...
]

Errors:
500: Database error.

Ticket Purchase
8. Purchase Tickets
Endpoint: POST /api/events/purchase/:eventId

Description: Allows Normal Users to purchase a specified quantity of tickets for an event.

Authentication: JWT token (Normal User role).

Headers: Authorization: Bearer <jwt_token>

Request Body:
json

{
    "quantity": integer
}

Response (201):
json

{
    "message": "Tickets purchased successfully",
    "ticketCount": integer,
    "totalCost": number,
    "eventId": integer
}

Errors:
400: Invalid quantity or insufficient availability.

403: Access denied (non-Normal User).

404: Event not found.

500: Database error.

Frontend Integration Guide (React)
This section provides detailed guidance for a React frontend developer to integrate with the backend API. The instructions assume the developer is familiar with React, axios for HTTP requests, and basic state management (e.g., React Context or Redux).
Setting Up the Frontend
Create a React App:
bash

npx create-react-app ticket-booking-frontend
cd ticket-booking-frontend
npm install axios react-router-dom

axios: For making API requests.

react-router-dom: For client-side routing.

Project Structure:

ticket-booking-frontend/
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── EventList.js
│   │   ├── EventForm.js
│   │   ├── TicketPurchase.js
│   ├── context/
│   │   ├── AuthContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── OrganizerDashboard.js
│   │   ├── UserDashboard.js
│   ├── App.js
│   ├── index.js

Environment Variables:
Create a .env file in the React project root:
env

REACT_APP_API_URL=http://localhost:3000/api

Access in code: process.env.REACT_APP_API_URL.

Authentication Flow
Create an Auth Context:
Use React Context to manage user authentication state (JWT token and role).
src/context/AuthContext.js:
javascript

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      // Decode token to get user info (e.g., role)
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: payload.id, role: payload.role });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const signup = async (email, password, role) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        email,
        password,
        role,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

Wrap App with AuthProvider:
src/index.js:
javascript

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);

Login Component:
src/components/Login.js:
javascript

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

Signup Component:
src/components/Signup.js:
javascript

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('normal');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="normal">Normal User</option>
          <option value="organizer">Organizer</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;

Routing:
src/App.js:
javascript

import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import TicketPurchase from './components/TicketPurchase';
import Home from './pages/Home';
import OrganizerDashboard from './pages/OrganizerDashboard';
import UserDashboard from './pages/UserDashboard';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<EventList />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === 'organizer' ? (
                <OrganizerDashboard />
              ) : (
                <UserDashboard />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/events/create"
          element={
            user && user.role === 'organizer' ? (
              <EventForm />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/events/purchase/:eventId"
          element={
            user && user.role === 'normal' ? (
              <TicketPurchase />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

Displaying Events
Event List Component:
Fetch and display events with filtering options.
src/components/EventList.js:
javascript

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    date: '',
    location: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchEvents = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/events?${query}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Events</h2>
      <div>
        <input
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          placeholder="Event Type (e.g., Concert)"
        />
        <input
          name="date"
          type="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <input
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Location (e.g., Arena)"
        />
        <input
          name="minPrice"
          type="number"
          value={filters.minPrice}
          onChange={handleFilterChange}
          placeholder="Min Price"
        />
        <input
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          placeholder="Max Price"
        />
      </div>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <p>Type: {event.type}</p>
            <p>Date: {new Date(event.event_date).toLocaleString()}</p>
            <p>Location: {event.location}</p>
            <p>Price: ${event.price}</p>
            <p>Available Tickets: {event.availability}</p>
            <a href={`/events/purchase/${event.id}`}>Buy Tickets</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;

Home Page:
Display the event list and navigation.
src/pages/Home.js:
javascript

import React from 'react';
import EventList from '../components/EventList';

const Home = () => {
  return (
    <div>
      <h1>Event Ticket Booking</h1>
      <EventList />
    </div>
  );
};

export default Home;

Event Management for Organizers
Event Form Component:
Allow Organizers to create or update events.
src/components/EventForm.js:
javascript

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EventForm = () => {
  const { eventId } = useParams(); // For editing
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    event_date: '',
    location: '',
    price: '',
    availability: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventId) {
      // Fetch event for editing
      axios
        .get(`${process.env.REACT_APP_API_URL}/events/my-events`)
        .then((response) => {
          const event = response.data.find((e) => e.id === parseInt(eventId));
          if (event) {
            setFormData({
              title: event.title,
              type: event.type,
              event_date: new Date(event.event_date).toISOString().slice(0, 16),
              location: event.location,
              price: event.price,
              availability: event.availability,
            });
          }
        })
        .catch((err) => setError('Error fetching event'));
    }
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (eventId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/events/${eventId}`, formData);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/events/create`, formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>{eventId ? 'Update Event' : 'Create Event'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Type (e.g., Concert)"
          required
        />
        <input
          name="event_date"
          type="datetime-local"
          value={formData.event_date}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          name="availability"
          type="number"
          value={formData.availability}
          onChange={handleChange}
          placeholder="Availability"
          required
        />
        <button type="submit">{eventId ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default EventForm;

Organizer Dashboard:
Display and manage events.
src/pages/OrganizerDashboard.js:
javascript

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/events/my-events`)
      .then((response) => setEvents(response.data))
      .catch((err) => console.error('Error fetching events:', err));
  }, []);

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/events/${eventId}`);
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  return (
    <div>
      <h1>Organizer Dashboard</h1>
      <Link to="/events/create">Create New Event</Link>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <p>Price: ${event.price}</p>
            <p>Available: {event.availability}</p>
            <Link to={`/events/edit/${event.id}`}>Edit</Link>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrganizerDashboard;

Ticket Purchase Flow
Ticket Purchase Component:
Allow Normal Users to purchase tickets.
src/components/TicketPurchase.js:
javascript

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TicketPurchase = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/events`)
      .then((response) => {
        const foundEvent = response.data.find((e) => e.id === parseInt(eventId));
        setEvent(foundEvent);
      })
      .catch((err) => setError('Error fetching event'));
  }, [eventId]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/events/purchase/${eventId}`,
        { quantity }
      );
      alert(
        `Purchased ${response.data.ticketCount} tickets for $${response.data.totalCost}`
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h2>Purchase Tickets for {event.title}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Price: ${event.price}</p>
      <p>Available Tickets: {event.availability}</p>
      <form onSubmit={handlePurchase}>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
          max={event.availability}
          required
        />
        <button type="submit">Purchase</button>
      </form>
    </div>
  );
};

export default TicketPurchase;

User Dashboard:
Display purchased tickets (optional, requires additional endpoint).
src/pages/UserDashboard.js:
javascript

import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  return (
    <div>
      <h1>User Dashboard</h1>
      <Link to="/events">Browse Events</Link>
      {/* Add purchased tickets list when endpoint is implemented */}
    </div>
  );
};

export default UserDashboard;

Error Handling
Global Error Handling:
Use try/catch in API calls to handle errors.

Display errors to users (e.g., invalid credentials, insufficient tickets).

Axios Interceptors:
Handle 401 (Unauthorized) errors globally (e.g., token expiry).
javascript

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

User Feedback:
Show loading spinners during API calls.

Display success/error messages using alerts or a UI library like Material-UI.

Testing the Backend
The backend has been tested using Postman with the following scenarios:
User Creation:
Created 3 Normal Users (user1@example.com, user2@example.com, user3@example.com) and 2 Organizers (organizer1@example.com, organizer2@example.com).

Event Creation:
Organizers created events (e.g., "Rock Concert", "Jazz Night", "Tech Conference").

Event Filtering:
Tested filtering by type, date, location, and price range.

Ticket Purchase:
Normal Users purchased tickets, verified availability updates, and checked ticket records.

Edge Cases:
Invalid inputs, unauthorized access, insufficient availability.

Testing Instructions:
Use Postman to send requests to http://localhost:3000/api.

Example Postman collection (simplified):
json

{
  "name": "Ticket Booking App",
  "requests": [
    {
      "method": "POST",
      "url": "{{baseUrl}}/auth/signup",
      "body": {
        "email": "user1@example.com",
        "password": "password123",
        "role": "normal"
      }
    },
    {
      "method": "POST",
      "url": "{{baseUrl}}/events/create",
      "headers": { "Authorization": "Bearer {{token}}" },
      "body": {
        "title": "Rock Concert",
        "type": "Concert",
        "event_date": "2025-05-01 18:00:00",
        "location": "City Arena",
        "price": 50.00,
        "availability": 100
      }
    }
  ]
}

Base URL: http://localhost:3000/api

Token: Set after login/signup.

Security Considerations
Authentication:
JWT tokens are used for authentication, stored in localStorage on the frontend.

Tokens expire after 1 hour; implement refresh tokens for production.

Authorization:
Role-based middleware (restrictTo) ensures only Normal Users can purchase tickets and only Organizers can manage events.

SQL Injection:
Parameterized queries (?) prevent SQL injection.

Password Security:
Passwords are hashed using bcryptjs.

Input Validation:
Basic validation is implemented; consider adding express-validator for production.

HTTPS:
Use HTTPS in production to secure API requests.

Next Steps
Additional Features:
View Purchased Tickets: Add a GET /api/tickets/my-tickets endpoint to list a user’s tickets.
javascript

router.get('/my-tickets', authenticate, restrictTo('normal'), (req, res) => {
  db.query(
    'SELECT t.id, e.title, e.event_date, e.location, e.price FROM tickets t JOIN events e ON t.event_id = e.id WHERE t.user_id = ?',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(results);
    }
  );
});

Ticket Cancellation: Allow users to cancel tickets and restore availability.

Event Search: Add a search parameter to /api/events for title-based search.

Payment Integration:
If needed later, integrate eSewa/Khalti for payment processing.

Requires a /api/payments/initiate/:eventId endpoint and callback routes.

Frontend Enhancements:
Use a UI library (e.g., Material-UI, Ant Design) for a polished look.

Add pagination to the event list.

Implement a shopping cart for multiple ticket purchases.

Deployment:
Deploy the backend to Heroku, AWS, or Render.

Deploy the frontend to Netlify or Vercel.

Use a production MySQL database (e.g., AWS RDS).

Testing:
Write unit tests for the backend using Jest.

Test concurrent ticket purchases with tools like k6.

Conclusion
The Event Ticket Booking Application backend is fully functional, with APIs for authentication, event management, event listings, and ticket purchasing. The provided React integration guide includes code snippets and best practices to help the frontend developer build a seamless user experience. The backend is secure, well-documented, and tested, making it ready for frontend integration and future enhancements.

