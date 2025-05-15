export interface Event {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  date: string;
  venue?: string;
  price: string | number;
  image: string;
  categoryId?: string;
  categoryName?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Review {
  id: string;
  name: string;
  description: string;
  text: string;
  avatar: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
  event?: Event;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}
