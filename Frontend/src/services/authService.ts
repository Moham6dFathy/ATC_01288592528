
import { toast } from "@/components/ui/sonner";
import { API_URL } from "@/config/api";
import { User } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();

    // Store token and expiration time in localStorage
    const expiresAt = Date.now() + 29 * 60 * 1000; // 29 minutes from now

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token_expires_at", expiresAt.toString());

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Login failed", { description: error.message });
    }
    throw error;
  }
};

// Register user
export const register = async (userData: RegisterData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Registration failed", { description: error.message });
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  const expiresAt = parseInt(localStorage.getItem("token_expires_at") || "0", 10);

  if (!token || Date.now() > expiresAt) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expires_at");
    return false;
  }

  return true;
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  return JSON.parse(userStr);
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'admin';
};

// Handle unauthorized responses - can be used in API request wrappers
export const handleUnauthorized = (navigate: any) => {
  logout();
  toast.error("Session expired", { 
    description: "Please login again to continue" 
  });
  navigate('/login');
};
