
import { useState } from 'react';
import { format } from 'date-fns';
import { Event } from '@/types';

interface EventFormData {
  name: string;
  price: string;
  date: string;
  image: string;
  venue: string;
  categoryId: string;
  description: string;
}

const initialFormState: EventFormData = {
  name: '',
  price: '',
  date: '',
  image: '',
  venue: '',
  categoryId: '',
  description: ''
};

export const useEventForm = (initialEvent?: Event) => {
  const [formData, setFormData] = useState<EventFormData>(
    initialEvent 
      ? {
          name: initialEvent.name,
          price: initialEvent.price,
          date: initialEvent.date,
          image: initialEvent.image,
          venue: initialEvent.venue || '',
          categoryId: initialEvent.categoryId || '',
          description: initialEvent.description || ''
        }
      : initialFormState
  );
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialEvent?.date ? new Date(initialEvent.date) : undefined
  );
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData({
        ...formData,
        date: format(date, 'EEE, dd MMM, yyyy')
      });
    }
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      categoryId: value
    });
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedDate(undefined);
    setSelectedFile(null);
  };

  return {
    formData,
    selectedDate,
    selectedFile,
    handleInputChange,
    handleFileChange,
    handleDateSelect,
    handleCategoryChange,
    resetForm,
    setFormData
  };
};
