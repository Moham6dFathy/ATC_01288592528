
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Event } from '@/types';
import { Check, Calendar, MapPin, DollarSign, X, BookmarkCheck } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, isAuthenticated } from '@/services/authService';
import { format, parseISO } from 'date-fns';
import { createBooking, cancelBooking, getUserBookings } from '@/services/bookingService';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  bookingId?: string;
  isBooked?: boolean;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  bookingId, 
  isBooked: initialIsBooked = false, 
  className 
}) => {
  const [isBooked, setIsBooked] = useState(initialIsBooked);
  const [isBooking, setIsBooking] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  // const [bookingId, setBookingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = getUser()


  useEffect(() => {
      const checkBookingStatus = async () => {
        if (!isAuthenticated() || !user || !event) return;
        
        try {
          const userBookings = await getUserBookings(user.id);
          const existingBooking = userBookings.find(booking => 
            booking.event.id === event.id 
          );
          if (existingBooking) {
            setIsBooked(true);
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
      setIsBooking(true);
      
      await createBooking(event.id);
      
      setIsBooked(true);
      toast.success("Event Booked", {
        description: `You've successfully booked ${event.name}`,
      });
      
      // Redirect to booking success page
      navigate(`/booking-success/${event.id}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Booking Failed", { 
          description: error.message 
        });
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

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow-sm transition-all hover:shadow-md animate-fade-in relative",
      isBooked && "border-2 border-purple-200 dark:border-purple-800/50",
      className
    )}>
      {isBooked && (
        <Badge className="absolute top-2 right-2 bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-100 font-medium border-purple-200 dark:border-purple-700">
          <BookmarkCheck className="h-3.5 w-3.5 mr-1" /> Booked
        </Badge>
      )}
      
      <Link to={`/events/${event.slug || event.id}`}>
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/events/${event.slug || event.id}`}>
          <h3 className="font-medium hover:text-blue-600 transition-colors dark:text-gray-200 dark:hover:text-blue-400">{event.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          <p className="text-lg font-bold dark:text-gray-200">{event.price}</p>
        </div>
        
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-1">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{formatEventDate(event.date)}</span>
        </div>
        
        {event.venue && (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{event.venue}</span>
          </div>
        )}
        
        {isBooked ? (
          <div className="space-y-2 mt-4">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
              disabled={true}
            >
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" /> Booked
              </span>
            </Button>
            
            {bookingId && (
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
                    <X className="h-4 w-4" /> Cancel
                  </span>
                )}
              </Button>
            )}
          </div>
        ) : (
          <Button 
            className={`w-full mt-4 ${
              isBooking
                ? 'bg-gray-600 dark:bg-gray-700 cursor-wait'
                : 'bg-black hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700'
            }`}
            onClick={handleBooking}
            disabled={isBooking || isBooked}
          >
            {isBooking ? 'Booking...' : 'Book Now'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
