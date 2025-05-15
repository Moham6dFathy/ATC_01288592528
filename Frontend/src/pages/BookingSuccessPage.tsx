
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getEventById } from '@/services/eventService';
import { Skeleton } from '@/components/ui/skeleton';

const BookingSuccessPage = () => {
  const { id } = useParams();
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => id ? getEventById(id) : Promise.reject('No event ID provided'),
    enabled: !!id,
  });
  
  if (isLoading) {
    return (
      <div className="px-6 md:px-12 lg:px-24 py-24 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <Skeleton className="h-24 w-24 rounded-full mx-auto mb-6" />
          <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-4 w-full mx-auto mb-8" />
          <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-10 w-1/2 mx-auto" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-6 md:px-12 lg:px-24 py-24 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
        
        <p className="text-gray-600 mb-8">
          {event ? 
            `Thank you for booking ${event.name}. We look forward to seeing you at ${event.date}.` :
            'Your booking has been confirmed. Thank you!'
          }
        </p>
        
        <div className="space-y-4">
          <Button asChild>
            <Link to="/profile">View My Bookings</Link>
          </Button>
          
          <div>
            <Button variant="outline" asChild>
              <Link to="/events">Browse More Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
