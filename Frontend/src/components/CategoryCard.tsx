
import { Link } from 'react-router-dom';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fade-in">
      <img 
        src={category.image} 
        alt={category.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-medium dark:text-white">{category.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{category.description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
