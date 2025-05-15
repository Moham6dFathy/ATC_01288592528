
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EventCard from '@/components/EventCard';
import { User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUser, isAuthenticated } from '@/services/authService';
import { getUserBookings } from '@/services/bookingService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 6;

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Check if user is authenticated
  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch user's booked events with event details
  const { 
    data: bookings = [], 
    isLoading: isLoadingBookings 
  } = useQuery({
    queryKey: ['userBookingsWithEvents', user?.id],
    queryFn: () => user ? getUserBookings(user.id) : Promise.resolve([]),
    enabled: !!user
  });
  
  // Handle pagination
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = bookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  // If not authenticated, redirect to login
  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="px-6 md:px-12 lg:px-24 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Name</h3>
                  <p>{user.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Email</h3>
                  <p>{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booked Events</CardTitle>
              <CardDescription>Events you have booked</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingBookings ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array(2).fill(0).map((_, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <Skeleton className="h-48 w-full rounded-md" />
                      <Skeleton className="h-6 w-3/4 rounded-md" />
                      <Skeleton className="h-6 w-1/2 rounded-md" />
                      <Skeleton className="h-10 w-full rounded-md mt-4" />
                    </div>
                  ))}
                </div>
              ) : paginatedBookings.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paginatedBookings.map(booking => {
                      if (booking.event) {
                        return (
                          <EventCard 
                            key={booking.id} 
                            event={booking.event}
                            bookingId={booking.id} 
                            isBooked={true}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange('prev')}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          <PaginationItem className="flex items-center">
                            <span>
                              Page {currentPage} of {totalPages}
                            </span>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange('next')}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't booked any events yet.</p>
                  <Button asChild>
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
