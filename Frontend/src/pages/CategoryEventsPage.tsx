
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EventCard from '@/components/EventCard';
import { getEventsByCategory, getCategoryById } from '@/services/categoryService';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const EVENTS_PER_PAGE = 6;

const CategoryEventsPage = () => {
  const { id } = useParams<{id: string}>();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch category details
  const { 
    data: category, 
    isLoading: categoryLoading 
  } = useQuery({
    queryKey: ['category', id],
    queryFn: () => id ? getCategoryById(id) : Promise.reject('No category ID provided'),
    enabled: !!id,
  });
  
  // Fetch events for the category
  const { 
    data: events = [], 
    isLoading: eventsLoading,
    isError 
  } = useQuery({
    queryKey: ['categoryEvents', id],
    queryFn: () => id ? getEventsByCategory(id) : Promise.reject('No category ID provided'),
    enabled: !!id,
  });
  
  // Calculate pagination data
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const paginatedEvents = events.slice(startIndex, startIndex + EVENTS_PER_PAGE);
  
  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top
    window.scrollTo(0, 0);
  };

  // Loading state
  if (categoryLoading || eventsLoading) {
    return (
      <div className="px-6 md:px-12 lg:px-24 py-12">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-6 w-96 mb-12" />
        
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
        <h1 className="text-3xl font-bold mb-12">Category not found</h1>
        <div className="text-center py-12">
          <p className="text-red-500 mb-6">Failed to load category or events. Please try again later.</p>
          <Button asChild>
            <Link to="/categories">Back to Categories</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-6 md:px-12 lg:px-24 py-12">
      <h1 className="text-3xl font-bold mb-2 dark:text-gray-100">{category?.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">{category?.description}</p>
      
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/categories">← Back to Categories</Link>
        </Button>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No events found in this category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          {/* Pagination */}
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

export default CategoryEventsPage;
