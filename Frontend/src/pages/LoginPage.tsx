
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LogIn } from 'lucide-react';
import { login, isAuthenticated } from '@/services/authService';
import { useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries();
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      
      navigate('/');
    } catch (error) {
      // Error is handled in the service
      console.error(error);
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 md:px-12 lg:px-24 py-12">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-black dark:bg-gray-700 p-2">
            <LogIn className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">Login</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="dark:border-gray-500"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="dark:text-gray-200">Remember me</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                Forgot Password?
              </Link>
            </div>
            
            <Button type="submit" className="w-full dark:bg-blue-600 dark:hover:bg-blue-700">Sign In</Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline dark:text-blue-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
