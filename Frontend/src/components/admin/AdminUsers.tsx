import React, { useState, useEffect } from 'react';

import {
  Table, TableHeader, TableBody, TableRow,
  TableHead, TableCell
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash, Plus } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { API_URL } from '@/config/api';

// Assumes a getToken() function exists to retrieve the auth token
const getToken = () => localStorage.getItem("token");

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({ name: '', email: '', role: 'User' });

  const API_BASE = `${API_URL}/users`;

  // Helper to build headers
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_BASE, {
          headers: authHeaders()
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Add failed');
      }
      const newUser: User = await res.json();
      setUsers(prev => [...prev, newUser]);
      setFormData({ name: '', email: '', role: 'User' });
      setIsAddDialogOpen(false);
      toast.success('User Added', { description: `${newUser.name} has been added` });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const startEditingUser = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setIsEditDialogOpen(true);
  };

  const handleEditUser = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`${API_BASE}/${editingUser.id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Update failed');
      }
      const updated: User = await res.json();
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
      setEditingUser(null);
      setIsEditDialogOpen(false);
      toast.success('User Updated', { description: `${updated.name} has been updated` });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Delete failed');
      }
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User Deleted');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Manage Users</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4"/> Add New User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <select id="role" name="role" value={formData.role} onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <DialogFooter><Button onClick={handleAddUser}>Add User</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => startEditingUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <select id="edit-role" name="role" value={formData.role} onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter><Button onClick={handleEditUser}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
