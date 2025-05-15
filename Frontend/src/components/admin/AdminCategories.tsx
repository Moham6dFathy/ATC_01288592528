
import React, { useState } from 'react';
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
import { Edit, Trash, Plus, Search } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  searchCategories
} from '@/services/categoryService';
import { Skeleton } from '@/components/ui/skeleton';
import { Category } from '@/types';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Query categories
  const { 
    data: categories = [], 
    isLoading,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['adminCategories', searchQuery, isSearching],
    queryFn: () => isSearching ? searchCategories(searchQuery) : getAllCategories()
  });
  
  // Calculate pagination
  const indexOfLastCategory = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstCategory = indexOfLastCategory - ITEMS_PER_PAGE;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Category Added", {
        description: `${formData.name} has been added successfully`,
      });
    }
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: FormData }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      resetForm();
      toast.success("Category Updated", {
        description: `${formData.name} has been updated successfully`,
      });
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      toast.success("Category Deleted", {
        description: `Category has been deleted successfully`,
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: imageUrl
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: ''
    });
    setSelectedFile(null);
  };

  const handleAddCategory = () => {
    // Create FormData object for file upload
    const categoryFormData = new FormData();
    categoryFormData.append('name', formData.name);
    categoryFormData.append('description', formData.description);
    
    if (selectedFile) {
      categoryFormData.append('image', selectedFile);
    } else if (formData.image) {
      categoryFormData.append('imageUrl', formData.image);
    }
    
    createCategoryMutation.mutate(categoryFormData);
  };

  const handleEditCategory = () => {
    if (!editingCategory) return;
    
    // Create FormData object for file upload
    const categoryFormData = new FormData();
    categoryFormData.append('name', formData.name);
    categoryFormData.append('description', formData.description);
    
    if (selectedFile) {
      categoryFormData.append('image', selectedFile);
    } else if (formData.image) {
      categoryFormData.append('imageUrl', formData.image);
    }
    
    updateCategoryMutation.mutate({ 
      id: editingCategory.id, 
      data: categoryFormData 
    });
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(!!searchQuery.trim());
    setCurrentPage(1);
    refetchCategories();
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setCurrentPage(1);
    refetchCategories();
  };
  
  // Handle page change
  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Manage Categories</h2>
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-10 w-full md:w-1/2 rounded-md" />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(4).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Manage Categories</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label>Image Upload</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-400">or</span>
                  <Input
                    id="imageUrl"
                    name="image"
                    placeholder="Image URL"
                    value={selectedFile ? '' : formData.image}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="h-40 object-cover rounded-md" 
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddCategory} 
                disabled={createCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending ? 'Adding...' : 'Add Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search form */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input 
              type="text"
              placeholder="Search categories..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
          {isSearching && (
            <Button variant="outline" onClick={clearSearch}>Clear</Button>
          )}
        </form>
      </div>

      {/* Results count */}
      {isSearching && (
        <div className="mb-4">
          <p>
            {categories.length === 0 
              ? 'No categories found for your search'
              : `Found ${categories.length} category${categories.length !== 1 ? 'ies' : 'y'} matching "${searchQuery}"`}
          </p>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-gray-500">No categories found. Add your first category!</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCategories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEditingCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={deleteCategoryMutation.isPending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange('prev')}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                <PaginationItem className="flex items-center">
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange('next')}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Image</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    id="edit-image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
                <span className="text-sm text-gray-400">or</span>
                <Input
                  id="edit-imageUrl"
                  name="image"
                  placeholder="Image URL"
                  value={selectedFile ? '' : formData.image}
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="h-40 object-cover rounded-md" 
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleEditCategory}
              disabled={updateCategoryMutation.isPending}
            >
              {updateCategoryMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
