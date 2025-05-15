
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface EventSearchProps {
  searchQuery: string;
  isSearching: boolean;
  onSearchChange: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onClearSearch: () => void;
  resultsCount?: number;
}

const EventSearch: React.FC<EventSearchProps> = ({
  searchQuery,
  isSearching,
  onSearchChange,
  onSearch,
  onClearSearch,
  resultsCount
}) => {
  return (
    <>
      <div className="mb-6">
        <form onSubmit={onSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input 
              type="text"
              placeholder="Search events..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
          {isSearching && (
            <Button variant="outline" onClick={onClearSearch}>Clear</Button>
          )}
        </form>
      </div>

      {/* Results count */}
      {isSearching && resultsCount !== undefined && (
        <div className="mb-4">
          <p>
            {resultsCount === 0 
              ? 'No events found for your search'
              : `Found ${resultsCount} event${resultsCount !== 1 ? 's' : ''} matching "${searchQuery}"`}
          </p>
        </div>
      )}
    </>
  );
};

export default EventSearch;
