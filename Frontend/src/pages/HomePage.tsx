
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import CategoryCard from '@/components/CategoryCard';
import ReviewCard from '@/components/ReviewCard';
import SectionHeader from '@/components/SectionHeader';
import CallToAction from '@/components/CallToAction';
import { getAllEvents } from '@/services/eventService';
import { getAllCategories } from '@/services/categoryService';
import { reviews } from '@/data/reviews';
import { Skeleton } from '@/components/ui/skeleton';

const HomePage = () => {
  // Fetch real events from API
  const { 
    data: events = [], 
    isLoading: eventsLoading 
  } = useQuery({
    queryKey: ['events'],
    queryFn: getAllEvents
  });
  
  // Fetch real categories from API
  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });

  // Get only first 3 events for the homepage
  const featuredEvents = events.slice(0, 3);
  const featuredCategories = categories.slice(0, 2);

  return (
    <div>
      <Hero />
      
      <div className="px-6 md:px-12 lg:px-24 py-12">
        <SectionHeader title="Featured Events" showMoreLink="/events" />
        
        {eventsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md mt-4" />
              </div>
            ))}
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">No events available at the moment.</p>
        )}
      </div>
      
      <div className="px-6 md:px-12 lg:px-24 py-12 bg-gray-50 dark:bg-gray-900">
        <SectionHeader title="Event Categories" showMoreLink="/categories" />
        
        {categoriesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array(2).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : featuredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredCategories.map(category => (
              <Link key={category.id} to={`/categories/${category.id}/events`} className="block hover:opacity-95 transition-opacity">
                <CategoryCard category={category} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">No categories available at the moment.</p>
        )}
      </div>
      
      <div className="px-6 md:px-12 lg:px-24 py-12 dark:bg-gray-800">
        <SectionHeader title="Reviews" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
      
      <CallToAction />
    </div>
  );
};

export default HomePage;
