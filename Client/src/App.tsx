
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import EventsListingPage from "@/pages/EventsListingPage";
import EventDetailPage from "@/pages/EventDetailPage";
import CheckoutPage from "@/pages/CheckoutPage";
import DashboardPage from "@/pages/organizer/DashboardPage";
import CreateEventPage from "@/pages/organizer/CreateEventPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events" element={<EventsListingPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            
            {/* Protected Routes (require any authenticated user) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout/:eventId" element={<CheckoutPage />} />
            </Route>
            
            {/* Organizer Routes (require organizer role) */}
            <Route element={<ProtectedRoute requiredRole="organizer" />}>
              <Route path="/organizer/dashboard" element={<DashboardPage />} />
              <Route path="/organizer/create" element={<CreateEventPage />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
