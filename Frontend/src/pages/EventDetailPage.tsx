
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Calendar, Check, MapPin, DollarSign, Tag, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getEventById } from '@/services/eventService';
import { createBooking, cancelBooking, getUserBookings } from '@/services/bookingService';
import { isAuthenticated, getUser } from '@/services/authService';
import { format, parseISO } from 'date-fns';

const EventDetailPage = () => {
  // Use params to get slug or id
  const { slug } = useParams<{slug: string}>();
  const navigate = useNavigate();
  const [isBooked, setIsBooked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const user = getUser();
  
  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => slug ? getEventById(slug) : Promise.reject('No event ID or slug provided'),
    enabled: !!slug,
  });
  
  // Check if user already booked this event
  useEffect(() => {
    const checkBookingStatus = async () => {
      if (!isAuthenticated() || !user || !event) return;
      
      try {
        const userBookings = await getUserBookings(user.id);
        const existingBooking = userBookings.find(booking => 
          booking.event?.id === event.id || booking.eventId === event.id
        );
        
        if (existingBooking) {
          setIsBooked(true);
          setBookingId(existingBooking.id);
        }
      } catch (error) {
        console.error("Error checking booking status:", error);
      }
    };
    
    checkBookingStatus();
  }, [event, user]);
  
  // Format date to be more readable
  const formatEventDate = (dateString: string) => {
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return dateString; // Return the original string if parsing fails
    }
  };
  
  const handleBooking = async () => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      toast.error("Authentication required", { 
        description: "Please login to book this event",
        action: {
          label: "Login",
          onClick: () => navigate('/login')
        }
      });
      return;
    }
    
    try {
      if (!event) return;
      
      setIsBooking(true);
      
      const booking = await createBooking(event.id);
      
      setIsBooked(true);
      setBookingId(booking.id);
      toast.success("Booking confirmed!", {
        description: `You've successfully booked ${event.name}`
      });
      
      // Redirect to congratulations page
      navigate(`/booking-success/${event.id}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Booking failed", { description: error.message });
      }
      console.error("Booking failed:", error);
    } finally {
      setIsBooking(false);
    }
  };
  
  const handleCancelBooking = async () => {
    if (!bookingId) return;
    
    try {
      setIsCancelling(true);
      
      await cancelBooking(bookingId);
      
      setIsBooked(false);
      setBookingId(null);
      toast.success("Booking cancelled", {
        description: "Your booking has been successfully cancelled"
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Cancellation failed", { description: error.message });
      }
      console.error("Cancel booking failed:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="px-6 md:px-12 lg:px-24 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="w-full h-64 md:h-96 rounded-lg mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              
              <Card className="mb-8">
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (isError || !event) {
    return (
      <div className="px-6 md:px-12 lg:px-24 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Event not found</h1>
          <p className="text-red-500 mb-8">The event you are looking for does not exist or could not be loaded.</p>
          <Button onClick={() => navigate('/events')}>Back to Events</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-6 md:px-12 lg:px-24 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <img 
            src={event.image} 
            alt={event.name} 
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4 dark:text-white">{event.name}</h1>
            
            {event.categoryId && (
              <Link to={`/categories/${event.categoryId}/events`} className="inline-block">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Tag className="h-5 w-5" />
                  <span>{event.categoryName || event.categoryId}</span>
                </div>
              </Link>
            )}
            
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
              <Calendar className="h-5 w-5" />
              <span>{formatEventDate(event.date)}</span>
            </div>
            
            {event.venue && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-6">
                <MapPin className="h-5 w-5" />
                <span>{event.venue}</span>
              </div>
            )}
            
            <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">About this event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  {event.description || "This is a detailed description of the event. In a real application, this would contain all the information about the event, including the venue, speakers, schedule, and other details."}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Price</CardTitle>
                <CardDescription className="dark:text-gray-300">Book your spot now</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-4">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <p className="text-2xl font-bold dark:text-white">{event.price}</p>
                </div>
                
                {isBooked ? (
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                      disabled={true}
                    >
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" /> Booked
                      </span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/10"
                      onClick={handleCancelBooking}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        'Cancelling...'
                      ) : (
                        <span className="flex items-center gap-2">
                          <X className="h-4 w-4" /> Cancel Booking
                        </span>
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={handleBooking}
                    disabled={isBooking}
                  >
                    {isBooking ? 'Processing...' : 'Book Now'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
