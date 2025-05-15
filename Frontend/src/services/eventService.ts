import { Event } from "@/types";
import { toast } from "@/components/ui/sonner";
import { API_URL } from "@/config/api";

// Helper function to get token
const getToken = () => localStorage.getItem("token");

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_URL}/events`);

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error fetching events", { description: error.message });
    }
    throw error;
  }
};

// Get single event by ID or slug
export const getEventById = async (idOrSlug: string): Promise<Event> => {
  try {
    const response = await fetch(`${API_URL}/events/${idOrSlug}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error fetching event", { description: error.message });
    }
    throw error;
  }
};

// Create a new event
export const createEvent = async (eventData: FormData): Promise<Event> => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }
    
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: eventData, // Use FormData to handle file uploads
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create event");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error creating event", { description: error.message });
    }
    throw error;
  }
};

// Update an event
export const updateEvent = async (id: string, eventData: FormData): Promise<Event> => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }
    
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: eventData, // Use FormData to handle file uploads
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update event");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error updating event", { description: error.message });
    }
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }
    
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete event");
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error deleting event", { description: error.message });
    }
    throw error;
  }
};

// Delete all events
export const deleteAllEvents = async (): Promise<void> => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }
    
    const response = await fetch(`${API_URL}/events`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete all events");
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error deleting all events", { description: error.message });
    }
    throw error;
  }
};

// Get events by category ID
export const getEventsByCategory = async (categoryId: string): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_URL}/category/${categoryId}/events?category:${categoryId}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch events for this category");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error fetching category events", { description: error.message });
    }
    throw error;
  }
};

// Search events 
export const searchEvents = async (query: string): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_URL}/events?search=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error("Failed to search events");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error searching events", { description: error.message });
    }
    throw error;
  }
};
