
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

interface EventFormProps {
  formData: {
    name: string;
    price: string;
    date: string;
    image: string;
    venue: string;
    categoryId: string;
    description: string;
  };
  categories: Category[];
  selectedDate: Date | undefined;
  selectedFile: File | null;
  isSubmitting: boolean;
  isEdit?: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateSelect: (date: Date | undefined) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  formData,
  categories,
  selectedDate,
  selectedFile,
  isSubmitting,
  isEdit = false,
  onInputChange,
  onFileChange,
  onDateSelect,
  onCategoryChange,
  onSubmit,
}) => {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              value={formData.price}
              onChange={onInputChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={onInputChange}
              placeholder="Event location"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Event Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.date ? formData.date : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={onDateSelect}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select 
              defaultValue={formData.categoryId} 
              onValueChange={onCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
          />
        </div>
        
        <div className="grid gap-2">
          <Label>Image</Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="cursor-pointer"
              />
            </div>
            <span className="text-sm text-gray-400">or</span>
            <Input
              id="imageUrl"
              name="image"
              placeholder="Image URL"
              value={selectedFile ? '' : formData.image}
              onChange={onInputChange}
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
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (isEdit ? 'Saving...' : 'Adding...') 
            : (isEdit ? 'Save Changes' : 'Add Event')
          }
        </Button>
      </DialogFooter>
    </>
  );
};

export default EventForm;
