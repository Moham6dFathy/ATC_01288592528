
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <div className="bg-primary/5 py-16 px-6 md:px-12 lg:px-24 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Ready to experience amazing events?
      </h2>
      <p className="text-gray-600 mb-6 max-w-lg mx-auto">
        Join thousands of people booking tickets to the best events in your area.
        No more waiting in lines or missing out on your favorite events.
      </p>
      <Button asChild className="bg-black text-white hover:bg-gray-800">
        <Link to="/events">Book Now</Link>
      </Button>
    </div>
  );
};

export default CallToAction;
