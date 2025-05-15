
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SectionHeaderProps {
  title: string;
  showMoreLink?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, showMoreLink }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {showMoreLink && (
        <Button variant="outline" size="sm" asChild>
          <Link to={showMoreLink}>Show More</Link>
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;
