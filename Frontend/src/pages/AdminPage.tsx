
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminEvents from '@/components/admin/AdminEvents';
import AdminCategories from '@/components/admin/AdminCategories';
import AdminUsers from '@/components/admin/AdminUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Check } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import { API_URL } from '@/config/api';
import { getAllBookings } from '@/services/bookingService';
import { getAllEvents } from '@/services/eventService';
import { getAllCategories } from '@/services/categoryService';

interface Booking {
  id: string;
  userId: string;
  eventId: string;
  event?: {
    name: string;
    date: string;
  };
  user?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface Stats {
  totalEvents: number;
  totalUsers: number;
  totalBookings: number;
}

const AdminPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalUsers: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Fetch bookings
        const bookingsData = await getAllBookings();
        setBookings(bookingsData);
        
        // Fetch events 
        const eventsData = await getAllEvents();
        
        // Fetch categories
        const categoriesData = await getAllCategories();
        
        // Fetch users count - Using a direct API call for users
        const usersResponse = await fetch(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => ({ ok: false }));
        
        // Update stats based on available data
        let usersCount = 0;
        
        if (usersResponse instanceof Response && usersResponse.ok) {
          const usersData = await usersResponse.json();
          usersCount = Array.isArray(usersData) ? usersData.length : 0;
        }
        
        setStats({
          totalEvents: eventsData.length || 0,
          totalUsers: usersCount,
          totalBookings: bookingsData.length || 0,
        });
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Error fetching data", { description: error.message });
        }
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-6 md:px-12 lg:px-24 py-12 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Active events in the system
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Registered users on platform
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Total Bookings</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Completed bookings to date
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="dark:text-white">
        <TabsList className="mb-8">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="rounded-md border dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:border-gray-700">
                        <TableHead className="dark:text-gray-300">Event</TableHead>
                        <TableHead className="dark:text-gray-300">User</TableHead>
                        <TableHead className="dark:text-gray-300">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 dark:text-gray-400">
                            No bookings found
                          </TableCell>
                        </TableRow>
                      ) : (
                        bookings.map((booking) => (
                          <TableRow key={booking.id} className="dark:border-gray-700">
                            <TableCell className="font-medium dark:text-white">
                              {booking.event ? booking.event.name : booking.eventId}
                            </TableCell>
                            <TableCell className="dark:text-gray-300">
                              {booking.user ? booking.user.name : booking.userId}
                            </TableCell>
                            <TableCell className="dark:text-gray-300">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <AdminEvents />
        </TabsContent>
        
        <TabsContent value="categories">
          <AdminCategories />
        </TabsContent>
        
        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
