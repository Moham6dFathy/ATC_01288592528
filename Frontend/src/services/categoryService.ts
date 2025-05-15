
import { Category, Event } from "@/types";
import { toast } from "@/components/ui/sonner";
import { API_URL } from "@/config/api";

// Helper function to get token
const getToken = () => localStorage.getItem("token");

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/category`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error fetching categories", { description: error.message });
    }
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}/category/${id}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error fetching category", { description: error.message });
    }
    throw error;
  }
};

// Create a new category
export const createCategory = async (categoryData: FormData): Promise<Category> => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }
    
    const response = await fetch(`${API_URL}/category`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: categoryData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create category");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error creating category", { description: error.message });
    }
    throw error;
  }
};

// Update a category
export const updateCategory = async (id: string, categoryData: FormData): Promise<Category> => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }
    
    const response = await fetch(`${API_URL}/category/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: categoryData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update category");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error updating category", { description: error.message });
    }
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }
    
    const response = await fetch(`${API_URL}/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete category");
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error deleting category", { description: error.message });
    }
    throw error;
  }
};

// Delete all categories
export const deleteAllCategories = async (): Promise<void> => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }
    
    const response = await fetch(`${API_URL}/category`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete all categories");
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error deleting all categories", { description: error.message });
    }
    throw error;
  }
};

// Get events by category ID
export const getEventsByCategory = async (categoryId: string): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_URL}/category/${categoryId}/events`);
    
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

// Search categories
export const searchCategories = async (query: string): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/category?search=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error("Failed to search categories");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error searching categories", { description: error.message });
    }
    throw error;
  }
};
