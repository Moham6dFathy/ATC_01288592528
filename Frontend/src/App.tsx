
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isAdmin } from "@/services/authService";
import { ThemeProvider } from "@/hooks/useTheme";

import MainLayout from "@/layout/MainLayout";
import HomePage from "@/pages/HomePage";
import EventsPage from "@/pages/EventsPage";
import CategoriesPage from "@/pages/CategoriesPage";
import CategoryEventsPage from "@/pages/CategoryEventsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import EventDetailPage from "@/pages/EventDetailPage";
import BookingSuccessPage from "@/pages/BookingSuccessPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";

// Admin Route guard component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  return isAdmin() ? <>{children}</> : <Navigate to="/" replace />;
};

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="events/:slug" element={<EventDetailPage />} />
                <Route path="booking-success/:id" element={<BookingSuccessPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categories/:id/events" element={<CategoryEventsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="admin" element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                } />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
