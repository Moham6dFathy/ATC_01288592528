
import { Booking } from "@/types";
import { API_URL } from "@/config/api";
import { toast } from "@/components/ui/sonner";

// Helper function to get token
const getToken = () => localStorage.getItem("token");

// Create a booking for an event
export const createBooking = async (eventId: string): Promise<Booking> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    // Get user ID from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData.id;

    if (!userId) {
      throw new Error("User ID not found");
    }

    const response = await fetch(`${API_URL}/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: userId,
        event: eventId
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to book event");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Booking failed", { description: error.message });
    }
    throw error;
  }
};

// Get bookings for a user
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_URL}/booking/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch bookings");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error fetching bookings", { description: error.message });
    }
    throw error;
  }
};

// Get all bookings (admin only)
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_URL}/booking`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch bookings");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error fetching bookings", { description: error.message });
    }
    throw error;
  }
};

// Get bookings for a user with event details
export const getUserBookingsWithEvents = async (userId: string): Promise<Booking[]> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_URL}/events/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch bookings");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error fetching bookings", { description: error.message });
    }
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_URL}/booking/${bookingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to cancel booking");
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error cancelling booking", { description: error.message });
    }
    throw error;
  }
};
