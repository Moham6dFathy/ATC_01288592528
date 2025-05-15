
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout, isAdmin } from '@/services/authService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Check authentication status
    const authStatus = isAuthenticated();
    setIsLoggedIn(authStatus);
    
    // Check if user is admin
    setUserIsAdmin(isAdmin());
  }, [location.pathname]);
  
  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserIsAdmin(false);
    queryClient.invalidateQueries();
    toast.success("Logged out successfully");
  };

  return (
    <nav className="flex justify-between items-center py-4 px-6 md:px-12 lg:px-24 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <Link to="/" className="font-bold text-lg dark:text-white">Event Booking</Link>
      
      <div className="hidden md:flex space-x-8">
        <Link 
          to="/" 
          className={`transition-colors ${isActive('/') ? 'text-primary font-medium dark:text-blue-400' : 'hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-50'}`}
        >
          Home
        </Link>
        <Link 
          to="/events" 
          className={`transition-colors ${isActive('/events') ? 'text-primary font-medium dark:text-blue-400' : 'hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-50'}`}
        >
          Events
        </Link>
        <Link 
          to="/categories" 
          className={`transition-colors ${isActive('/categories') ? 'text-primary font-medium dark:text-blue-400' : 'hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-50'}`}
        >
          Categories
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {isLoggedIn && (
          <Link 
            to="/profile" 
            className={`transition-colors ${isActive('/profile') ? 'text-primary dark:text-blue-400' : 'hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-50'}`}
          >
            <User className="h-5 w-5" />
          </Link>
        )}
        
        {userIsAdmin && (
          <Link 
            to="/admin" 
            className={`transition-colors ${isActive('/admin') ? 'text-primary font-medium dark:text-blue-400' : 'hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-50'}`}
          >
            Admin
          </Link>
        )}
        
        <div className="flex space-x-2">
          {isLoggedIn ? (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
