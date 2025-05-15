
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { getAllCategories } from '@/services/categoryService';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 6;

const CategoriesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  // Calculate pagination values
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo(0, 0);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="px-6 md:px-12 lg:px-24 py-12">
        <h1 className="text-3xl font-bold mb-12">Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
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
        <h1 className="text-3xl font-bold mb-12">Categories</h1>
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load categories. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-6 md:px-12 lg:px-24 py-12">
      <h1 className="text-3xl font-bold mb-12">Categories</h1>
      
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {paginatedCategories.map(category => (
              <Link to={`/categories/${category.id}/events`} key={category.id}>
                <CategoryCard category={category} />
              </Link>
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

export default CategoriesPage;
