
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Plus } from 'lucide-react';
import { getAllEvents, createEvent, updateEvent, deleteEvent, searchEvents } from '@/services/eventService';
import { getAllCategories } from '@/services/categoryService';
import { Event } from '@/types';

// Import the new components
import EventsTable from './EventsTable';
import EventForm from './EventForm';
// import EventSearch from './EventSearch';
import EventsPagination from './EventsPagination';
import { useEventForm } from '@/hooks/useEventForm';

const ITEMS_PER_PAGE = 10;

const AdminEvents = () => {
  const queryClient = useQueryClient();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use the custom hook for form state
  const {
    formData,
    selectedDate,
    selectedFile,
    handleInputChange,
    handleFileChange,
    handleDateSelect,
    handleCategoryChange,
    resetForm,
    setFormData
  } = useEventForm();

  // Query events
  const { 
    data: events = [], 
    isLoading: eventsLoading,
    refetch: refetchEvents
  } = useQuery({
    queryKey: ['adminEvents', searchQuery, isSearching],
    queryFn: () => isSearching ? searchEvents(searchQuery) : getAllEvents()
  });
  
  // Query categories
  const {
    data: categories = [],
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });

  // Calculate pagination
  const indexOfLastEvent = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstEvent = indexOfLastEvent - ITEMS_PER_PAGE;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Event Added", {
        description: `${formData.name} has been added successfully`,
      });
    }
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: FormData }) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      setIsEditDialogOpen(false);
      setEditingEvent(null);
      resetForm();
      toast.success("Event Updated", {
        description: `${formData.name} has been updated successfully`,
      });
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      toast.success("Event Deleted", {
        description: `Event has been deleted successfully`,
      });
    }
  });

  const handleAddEvent = () => {
    // Create FormData object for file upload
    const eventFormData = new FormData();

    //Change type of Date
    const date = new Date(formData.date);
    const isoDate = date.toISOString();

    eventFormData.append('name', formData.name);
    // Convert price to string if it's a number
    eventFormData.append('price', String(formData.price));
    eventFormData.append('date', isoDate);
    
    if (formData.venue) {
      eventFormData.append('venue', formData.venue);
    }
    
    if (formData.categoryId) {
      eventFormData.append('category', formData.categoryId);
    }
    
    if (formData.description) {
      eventFormData.append('description', formData.description);
    }
    
    if (selectedFile) {
      eventFormData.append('image', selectedFile);
    } else if (formData.image) {
      eventFormData.append('image', formData.image);
    }
    
    createEventMutation.mutate(eventFormData);
  };

  const handleEditEvent = () => {
    if (!editingEvent) return;
    
    // Create FormData object for file upload
    const eventFormData = new FormData();
    eventFormData.append('name', formData.name);
    // Convert price to string if it's a number
    eventFormData.append('price', formData.price);
    // Convert date if needed
    if (formData.date) {
      try {
        const date = new Date(formData.date);
        eventFormData.append('date', date.toISOString());
      } catch (e) {
        // If the date can't be converted, use the original string
        eventFormData.append('date', String(formData.date));
      }
    }
    
    if (formData.venue) {
      eventFormData.append('venue', formData.venue);
    }
    
    if (formData.categoryId) {
      // Fix: Convert categoryId to string explicitly
      eventFormData.append('category', String(formData.categoryId));
    }
    
    if (formData.description) {
      eventFormData.append('description', String(formData.description));
    }
    
    if (selectedFile) {
      eventFormData.append('image', selectedFile);
    } else if (formData.image) {
      eventFormData.append('image', String(formData.image));
    }
    
    updateEventMutation.mutate({ 
      id: editingEvent.id, 
      data: eventFormData 
    });
  };

  const startEditingEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      price: String(event.price),
      date: event.date,
      image: event.image,
      venue: event.venue || '',
      categoryId: event.categoryId || '',
      description: event.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    deleteEventMutation.mutate(id);
  };
  
  // Handle search
  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSearching(!!searchQuery.trim());
  //   setCurrentPage(1);
  //   refetchEvents();
  // };
  
  // // Clear search
  // const clearSearch = () => {
  //   setSearchQuery('');
  //   setIsSearching(false);
  //   setCurrentPage(1);
  //   refetchEvents();
  // };
  
  // Handle page change
  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Manage Events</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <EventForm
              formData={formData}
              categories={categories}
              selectedDate={selectedDate}
              selectedFile={selectedFile}
              isSubmitting={createEventMutation.isPending}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
              onDateSelect={handleDateSelect}
              onCategoryChange={handleCategoryChange}
              onSubmit={handleAddEvent}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search component
      <EventSearch
        searchQuery={searchQuery}
        isSearching={isSearching}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
        resultsCount={events.length}
      /> */}

      {/* Table component */}
      <div className="mb-4">
        <EventsTable
          events={currentEvents}
          categories={categories}
          isLoading={eventsLoading || categoriesLoading}
          onEditEvent={startEditingEvent}
          onDeleteEvent={handleDeleteEvent}
          isDeleting={deleteEventMutation.isPending}
        />
      </div>
      
      {/* Pagination component */}
      <EventsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <EventForm
            formData={formData}
            categories={categories}
            selectedDate={selectedDate}
            selectedFile={selectedFile}
            isSubmitting={updateEventMutation.isPending}
            isEdit={true}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onDateSelect={handleDateSelect}
            onCategoryChange={handleCategoryChange}
            onSubmit={handleEditEvent}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;
