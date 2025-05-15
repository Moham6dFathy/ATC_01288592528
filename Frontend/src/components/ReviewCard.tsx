
import { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm dark:shadow-gray-900 animate-fade-in">
      <p className="text-lg font-medium italic mb-4 dark:text-gray-200">"{review.text}"</p>
      <div className="flex items-center mt-4">
        <img 
          src={review.avatar} 
          alt={review.name} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <p className="text-sm font-medium dark:text-gray-200">{review.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{review.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
