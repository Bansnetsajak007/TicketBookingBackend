
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== '/' 
          ? 'bg-background/95 backdrop-blur border-b border-border' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          TICKETNOIR
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            HOME
          </Link>
          <Link
            to="/events"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname.startsWith('/event') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            EVENTS
          </Link>
          
          {/* Conditional navigation based on role */}
          {isAuthenticated && user?.role === 'organizer' && (
            <Link
              to="/organizer/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname.startsWith('/organizer') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              DASHBOARD
            </Link>
          )}
          
          {/* User dropdown or login/register buttons */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.role === 'organizer' ? 'Organizer' : 'User'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.role === 'organizer' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/organizer/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/organizer/create">Create Event</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={logout} className="text-destructive flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="container-custom py-4 flex flex-col gap-4">
            <Link
              to="/"
              className={`text-base py-2 transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`text-base py-2 transition-colors hover:text-primary ${
                location.pathname.startsWith('/event') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Events
            </Link>
            
            {/* Conditional navigation based on role */}
            {isAuthenticated && user?.role === 'organizer' && (
              <>
                <Link
                  to="/organizer/dashboard"
                  className={`text-base py-2 transition-colors hover:text-primary ${
                    location.pathname.startsWith('/organizer') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/organizer/create"
                  className={`text-base py-2 transition-colors hover:text-primary ${
                    location.pathname === '/organizer/create' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Create Event
                </Link>
              </>
            )}
            
            {/* Login/register buttons or user info */}
            {isAuthenticated ? (
              <div className="border-t border-border pt-4 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.role}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 border-t border-border pt-4 mt-2">
                <Link to="/login" className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
