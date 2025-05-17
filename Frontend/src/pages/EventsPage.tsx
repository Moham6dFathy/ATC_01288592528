
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import EventCard from '@/components/EventCard';
import { getAllEvents } from '@/services/eventService';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { getUserBookings } from '@/services/bookingService';
import { getUser, isAuthenticated } from '@/services/authService';
import { Booking } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookmarkCheck, Check } from 'lucide-react';
import { Button } from 'react-day-picker';

const EVENTS_PER_PAGE = 9;

const EventsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const user = getUser();

  // Fetch all events
  const { 
    data: events = [], 
    isLoading, 
    isError
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      return await getAllEvents();
    },
  });
  
  
  // Fetch user's bookings if authenticated
  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!isAuthenticated()) return;
      
      try {
        // Get user ID from localStorage
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData.id;
        
        if (userId) {
          const bookings = await getUserBookings(userId);
          setUserBookings(bookings);
        }
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    };
    
    fetchUserBookings();
  }, []);
      
  // Calculate total pages
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  
  // Get current events
  const indexOfLastEvent = currentPage * EVENTS_PER_PAGE;
  const indexOfFirstEvent = indexOfLastEvent - EVENTS_PER_PAGE;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  
  // Get booked events
  const bookedEvents = events.filter(event => 
    userBookings.some(booking => {
      booking.eventId === event.id
    })
    
  );
  
  // Check if event is booked
  const isEventBooked = (eventId: string) => {
    return userBookings.some(booking => booking.eventId === eventId);
  };
  
  // Get booking ID if event is booked
  const getBookingId = (eventId: string) => {
    const booking = userBookings.find(booking => booking.eventId === eventId);
    return booking ? booking.id : undefined;
  };
  
  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top
    window.scrollTo(0, 0);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="px-6 md:px-12 lg:px-24 py-12">
        <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">Events</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="px-6 md:px-12 lg:px-24 py-12">
        <h1 className="text-3xl font-bold mb-12 dark:text-gray-100">Events</h1>
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load events. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-6 md:px-12 lg:px-24 py-12">
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">Events</h1>
      
      {isAuthenticated() && bookedEvents.length > 0 && (
        <Card className="mb-10 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 dark:border-purple-800/50 overflow-hidden">
          <CardHeader className="pb-3 pt-6">
            <CardTitle className="flex items-center text-purple-800 dark:text-purple-300">
              <BookmarkCheck className="mr-2 h-5 w-5" /> Your Booked Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookedEvents.map(event => (
                <EventCard 
                  key={`booked-${event.id}`}
                  event={event}
                  isBooked={true}
                  bookingId={getBookingId(event.id)}
                  className="shadow-md border-purple-200 dark:border-purple-800/50"
                />
              ))}
              
            </div>
          </CardContent>
        </Card>
      )}
      
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No events found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                isBooked={isEventBooked(event.id)}
                bookingId={getBookingId(event.id)}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={page === currentPage} 
                      onClick={() => handlePageChange(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default EventsPage;
